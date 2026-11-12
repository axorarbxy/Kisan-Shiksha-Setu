import { z } from "zod";
import { waitForMockWorker } from "@/lib/api/mock-readiness";

export type ApiFieldErrors = Record<string, string[]>;

export class ApiError extends Error {
  readonly status: number;
  readonly code: string;
  readonly fieldErrors?: ApiFieldErrors;

  constructor({
    status,
    code,
    message,
    fieldErrors,
  }: {
    status: number;
    code: string;
    message: string;
    fieldErrors?: ApiFieldErrors;
  }) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
    this.fieldErrors = fieldErrors;
  }
}

const errorResponseSchema = z.object({
  code: z.string().optional(),
  message: z.string().optional(),
  fieldErrors: z.record(z.string(), z.array(z.string())).optional(),
});

const refreshResponseSchema = z.object({ refreshed: z.boolean() });

type RequestOptions<T extends z.ZodType> = {
  method?: "GET" | "POST" | "PATCH" | "DELETE";
  body?: unknown;
  schema: T;
  signal?: AbortSignal;
  mockScenario?: "unauthorized" | "unprocessable" | "server-error" | "empty";
  retryAfterRefresh?: boolean;
};

const apiBaseUrl = (process.env.NEXT_PUBLIC_API_URL ?? "").replace(/\/+$/, "");

function buildUrl(
  path: string,
  mockScenario?: RequestOptions<z.ZodType>["mockScenario"],
) {
  const url = new URL(
    `${apiBaseUrl}/${path.replace(/^\/+/, "")}`,
    typeof window === "undefined" ? "http://localhost" : window.location.origin,
  );
  if (process.env.NEXT_PUBLIC_API_MOCKING === "enabled" && mockScenario) {
    url.searchParams.set("scenario", mockScenario);
  }
  return url;
}

async function toApiError(response: Response): Promise<ApiError> {
  const payload: unknown = await response.json().catch(() => undefined);
  const parsed = errorResponseSchema.safeParse(payload);
  const error = parsed.success ? parsed.data : undefined;
  return new ApiError({
    status: response.status,
    code: error?.code ?? `HTTP_${response.status}`,
    message: error?.message ?? response.statusText ?? "The request failed.",
    fieldErrors: error?.fieldErrors,
  });
}

async function refreshSession(signal?: AbortSignal): Promise<boolean> {
  const response = await fetch(buildUrl("/auth/refresh"), {
    method: "POST",
    credentials: "include",
    signal,
  });
  if (!response.ok) {
    return false;
  }
  const result: unknown = await response.json().catch(() => undefined);
  const parsed = refreshResponseSchema.safeParse(result);
  if (!parsed.success) {
    throw new ApiError({
      status: 502,
      code: "INVALID_REFRESH_RESPONSE",
      message: "The session refresh response was invalid.",
    });
  }
  return parsed.data.refreshed;
}

export async function request<T extends z.ZodType>(
  path: string,
  {
    method = "GET",
    body,
    schema,
    signal,
    mockScenario,
    retryAfterRefresh = true,
  }: RequestOptions<T>,
): Promise<z.infer<T>> {
  const urlScenario =
    typeof window === "undefined"
      ? undefined
      : new URLSearchParams(window.location.search).get("scenario");
  const activeMockScenario =
    mockScenario ??
    (urlScenario === "unauthorized" ||
    urlScenario === "unprocessable" ||
    urlScenario === "server-error" ||
    urlScenario === "empty"
      ? urlScenario
      : undefined);
  await waitForMockWorker();
  const response = await fetch(buildUrl(path, activeMockScenario), {
    method,
    credentials: "include",
    headers:
      body === undefined ? undefined : { "Content-Type": "application/json" },
    body: body === undefined ? undefined : JSON.stringify(body),
    signal,
  });

  if (response.status === 401) {
    if (retryAfterRefresh && (await refreshSession(signal))) {
      return request(path, {
        method,
        body,
        schema,
        signal,
        mockScenario: activeMockScenario,
        retryAfterRefresh: false,
      });
    }

    if (
      typeof window !== "undefined" &&
      window.location.pathname !== "/login"
    ) {
      window.location.href = new URL(
        "/login",
        window.location.origin,
      ).toString();
    }
    throw await toApiError(response);
  }

  if (!response.ok) {
    throw await toApiError(response);
  }

  const payload: unknown = await response.json().catch(() => undefined);
  const parsed = schema.safeParse(payload);
  if (!parsed.success) {
    throw new ApiError({
      status: 502,
      code: "RESPONSE_VALIDATION_ERROR",
      message: `The response from ${path} did not match the API schema.`,
    });
  }
  return parsed.data;
}

export function withQuery(
  path: string,
  params: Record<string, string | number | undefined>,
) {
  const query = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined) {
      query.set(key, String(value));
    }
  }
  const search = query.toString();
  return search ? `${path}?${search}` : path;
}
