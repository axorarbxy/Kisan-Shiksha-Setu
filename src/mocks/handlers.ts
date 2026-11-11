import { delay, http, HttpResponse } from "msw";
import type { DefaultBodyType, RequestHandler } from "msw";
import {
  experimentSchema,
  insightSchema,
  loginInputSchema,
  matchSchema,
  mentorProfileSchema,
  observationInputSchema,
  observationSchema,
  placementSchema,
  schoolSchema,
  successResponseSchema,
  userSchema,
} from "@/lib/api/schemas";
import { registerSchema } from "@/features/auth/schemas";
import type {
  Experiment,
  Observation,
  Placement,
  User,
} from "@/lib/api/schemas";
import {
  experiments,
  insights,
  matches,
  mentors,
  observations,
  placements,
  schools,
  users,
} from "@/mocks/data";

const apiBaseUrl = (
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000"
).replace(/\/+$/, "");

function apiPath(path: string) {
  return `${apiBaseUrl}${path}`;
}

function errorResponse(
  status: number,
  code: string,
  message: string,
  fieldErrors?: Record<string, string[]>,
) {
  return HttpResponse.json(
    { code, message, ...(fieldErrors ? { fieldErrors } : {}) },
    { status },
  );
}

function validationError(error: {
  issues: { path: PropertyKey[]; message: string }[];
}) {
  const fieldErrors: Record<string, string[]> = {};
  for (const issue of error.issues) {
    const field = issue.path.map(String).join(".") || "form";
    fieldErrors[field] ??= [];
    fieldErrors[field].push(issue.message);
  }
  return errorResponse(
    422,
    "VALIDATION_ERROR",
    "Please check the submitted fields.",
    fieldErrors,
  );
}

async function beforeResponse(
  request: Request,
  listEndpoint = false,
): Promise<HttpResponse<DefaultBodyType> | undefined> {
  await delay(200 + Math.floor(Math.random() * 401));
  const scenario = new URL(request.url).searchParams.get("scenario");
  if (scenario === "unauthorized") {
    return errorResponse(401, "UNAUTHENTICATED", "Please log in to continue.");
  }
  if (scenario === "unprocessable") {
    return errorResponse(
      422,
      "VALIDATION_ERROR",
      "The request was not valid.",
      {
        email: ["This email address is already in use."],
      },
    );
  }
  if (scenario === "server-error") {
    return errorResponse(
      500,
      "MOCK_SERVER_ERROR",
      "The mock server encountered an error.",
    );
  }
  if (scenario === "empty" && listEndpoint) {
    return undefined;
  }
  return undefined;
}

function pageResponse<T extends object>(request: Request, source: T[]) {
  const url = new URL(request.url);
  const filterEntries = [...url.searchParams.entries()].filter(
    ([key]) => !["cursor", "limit", "scenario", "mine"].includes(key),
  );
  const filtered = source.filter((item) =>
    filterEntries.every(
      ([key, value]) => String(Reflect.get(item, key) ?? "") === value,
    ),
  );
  const empty = url.searchParams.get("scenario") === "empty";
  const items = empty ? [] : filtered;
  const cursor = Math.max(
    0,
    Number.parseInt(url.searchParams.get("cursor") ?? "0", 10) || 0,
  );
  const limit = Math.min(
    50,
    Math.max(1, Number.parseInt(url.searchParams.get("limit") ?? "5", 10) || 5),
  );
  const pageItems = items.slice(cursor, cursor + limit);
  const next =
    cursor + limit < items.length ? String(cursor + limit) : undefined;
  return HttpResponse.json({
    items: pageItems,
    ...(next ? { nextCursor: next } : {}),
    total: empty ? 0 : filtered.length,
  });
}

function findItem<T extends { id: string }>(items: T[], id: string) {
  return items.find((item) => item.id === id);
}

function findMentorByUserId(userId: string) {
  return mentors.find((mentor) => mentor.userId === userId);
}

function replaceMentor(
  userId: string,
  changes: Partial<(typeof mentors)[number]>,
) {
  const index = mentors.findIndex((mentor) => mentor.userId === userId);
  const current = mentors[index];
  if (!current) {
    return undefined;
  }
  const updated = mentorProfileSchema.parse({ ...current, ...changes });
  mentors[index] = updated;
  return updated;
}

function replaceItem<T extends { id: string }>(
  items: T[],
  id: string,
  update: (item: T) => T,
) {
  const index = items.findIndex((item) => item.id === id);
  if (index < 0) {
    return undefined;
  }
  const current = items[index];
  if (!current) {
    return undefined;
  }
  const updated = update(current);
  items[index] = updated;
  return updated;
}

async function readJson(request: Request): Promise<unknown> {
  try {
    return await request.json();
  } catch {
    return undefined;
  }
}

function createId(prefix: string, items: { id: string }[]) {
  return `${prefix}-${items.length + 1}-${Date.now()}`;
}

const mockOnboardingProfiles = new Map<string, Record<string, unknown>>();

function getMockSessionUser(request: Request) {
  const sessionCookie = request.headers
    .get("cookie")
    ?.split(";")
    .map((cookie) => cookie.trim())
    .find((cookie) => cookie.startsWith("kss_session="));
  const userId = sessionCookie?.slice("kss_session=".length);
  return users.find((user) => user.id === userId);
}

export const handlers: RequestHandler[] = [
  http.post(apiPath("/auth/refresh"), async () => {
    await delay(200 + Math.floor(Math.random() * 401));
    return HttpResponse.json({ refreshed: false });
  }),
  http.post(apiPath("/auth/login"), async ({ request }) => {
    const failure = await beforeResponse(request);
    if (failure) return failure;
    const parsed = loginInputSchema.safeParse(await readJson(request));
    if (!parsed.success) return validationError(parsed.error);
    const user = users.find((item) => item.email === parsed.data.email);
    if (!user || parsed.data.password !== "password123") {
      return errorResponse(
        422,
        "INVALID_CREDENTIALS",
        "That email or password didn’t match.",
        {
          email: ["That email or password didn’t match."],
        },
      );
    }
    return HttpResponse.json(userSchema.parse(user));
  }),
  http.post(apiPath("/auth/register"), async ({ request }) => {
    const failure = await beforeResponse(request);
    if (failure) return failure;
    const parsed = registerSchema.safeParse(await readJson(request));
    if (!parsed.success) return validationError(parsed.error);
    if (users.some((user) => user.email === parsed.data.email)) {
      return errorResponse(
        422,
        "EMAIL_IN_USE",
        "This email address is already in use.",
        {
          email: ["This email address is already in use."],
        },
      );
    }
    const newUser: User = {
      id: createId("user", users),
      name: parsed.data.name,
      email: parsed.data.email,
      role: parsed.data.role,
    };
    users.push(newUser);
    return HttpResponse.json(userSchema.parse(newUser), { status: 201 });
  }),
  http.post(apiPath("/auth/logout"), async ({ request }) => {
    const failure = await beforeResponse(request);
    if (failure) return failure;
    return HttpResponse.json(successResponseSchema.parse({ success: true }));
  }),
  http.get(apiPath("/auth/me"), async ({ request }) => {
    const failure = await beforeResponse(request);
    if (failure) return failure;
    const user = getMockSessionUser(request);
    return user
      ? HttpResponse.json(userSchema.parse(user))
      : errorResponse(401, "UNAUTHENTICATED", "Please log in to continue.");
  }),
  http.patch(apiPath("/auth/profile"), async ({ request }) => {
    const failure = await beforeResponse(request);
    if (failure) return failure;
    const user = getMockSessionUser(request);
    if (!user) {
      return errorResponse(401, "UNAUTHENTICATED", "Please log in to continue.");
    }
    const body = await readJson(request);
    if (
      typeof body !== "object" ||
      body === null ||
      !("role" in body) ||
      body.role !== user.role ||
      !("data" in body) ||
      typeof body.data !== "object" ||
      body.data === null
    ) {
      return errorResponse(422, "VALIDATION_ERROR", "Please check your profile details.");
    }
    mockOnboardingProfiles.set(user.id, body.data as Record<string, unknown>);
    return HttpResponse.json(successResponseSchema.parse({ success: true }));
  }),

  http.get(apiPath("/mentors"), async ({ request }) => {
    const failure = await beforeResponse(request, true);
    if (failure) return failure;
    return pageResponse(request, mentors);
  }),
  http.get(apiPath("/mentors/:id"), async ({ request, params }) => {
    const failure = await beforeResponse(request);
    if (failure) return failure;
    const mentor = findMentorByUserId(String(params.id));
    return mentor
      ? HttpResponse.json(mentorProfileSchema.parse(mentor))
      : errorResponse(404, "NOT_FOUND", "Mentor not found.");
  }),
  http.patch(apiPath("/mentors/:id"), async ({ request, params }) => {
    const failure = await beforeResponse(request);
    if (failure) return failure;
    const changes = mentorProfileSchema
      .partial()
      .safeParse(await readJson(request));
    if (!changes.success) return validationError(changes.error);
    const updated = replaceMentor(String(params.id), changes.data);
    return updated
      ? HttpResponse.json(updated)
      : errorResponse(404, "NOT_FOUND", "Mentor not found.");
  }),

  http.get(apiPath("/schools"), async ({ request }) => {
    const failure = await beforeResponse(request, true);
    if (failure) return failure;
    return pageResponse(request, schools);
  }),
  http.get(apiPath("/schools/:id"), async ({ request, params }) => {
    const failure = await beforeResponse(request);
    if (failure) return failure;
    const school = findItem(schools, String(params.id));
    return school
      ? HttpResponse.json(schoolSchema.parse(school))
      : errorResponse(404, "NOT_FOUND", "School not found.");
  }),

  http.get(apiPath("/matches"), async ({ request }) => {
    const failure = await beforeResponse(request, true);
    if (failure) return failure;
    const url = new URL(request.url);
    const source =
      url.searchParams.get("mine") === "true"
        ? matches.filter((match) => match.mentorId === users[0]?.id)
        : matches;
    return pageResponse(request, source);
  }),
  http.post(apiPath("/matches"), async ({ request }) => {
    const failure = await beforeResponse(request);
    if (failure) return failure;
    const body = await readJson(request);
    const parsed = matchSchema.omit({ id: true }).safeParse(body);
    if (!parsed.success) return validationError(parsed.error);
    const match = matchSchema.parse({
      id: createId("match", matches),
      ...parsed.data,
    });
    matches.push(match);
    return HttpResponse.json(match, { status: 201 });
  }),
  http.patch(apiPath("/matches/:id"), async ({ request, params }) => {
    const failure = await beforeResponse(request);
    if (failure) return failure;
    const changes = matchSchema.partial().safeParse(await readJson(request));
    if (!changes.success) return validationError(changes.error);
    const updated = replaceItem(matches, String(params.id), (match) =>
      matchSchema.parse({ ...match, ...changes.data }),
    );
    return updated
      ? HttpResponse.json(updated)
      : errorResponse(404, "NOT_FOUND", "Match not found.");
  }),

  http.get(apiPath("/experiments"), async ({ request }) => {
    const failure = await beforeResponse(request, true);
    if (failure) return failure;
    return pageResponse(request, experiments);
  }),
  http.post(apiPath("/experiments"), async ({ request }) => {
    const failure = await beforeResponse(request);
    if (failure) return failure;
    const parsed = experimentSchema
      .omit({ id: true, createdAt: true })
      .safeParse(await readJson(request));
    if (!parsed.success) return validationError(parsed.error);
    const experiment: Experiment = experimentSchema.parse({
      id: createId("experiment", experiments),
      createdAt: new Date().toISOString(),
      ...parsed.data,
    });
    experiments.push(experiment);
    return HttpResponse.json(experiment, { status: 201 });
  }),
  http.get(apiPath("/experiments/:id"), async ({ request, params }) => {
    const failure = await beforeResponse(request);
    if (failure) return failure;
    const experiment = findItem(experiments, String(params.id));
    return experiment
      ? HttpResponse.json(experimentSchema.parse(experiment))
      : errorResponse(404, "NOT_FOUND", "Experiment not found.");
  }),
  http.patch(apiPath("/experiments/:id"), async ({ request, params }) => {
    const failure = await beforeResponse(request);
    if (failure) return failure;
    const changes = experimentSchema
      .partial()
      .safeParse(await readJson(request));
    if (!changes.success) return validationError(changes.error);
    const updated = replaceItem(experiments, String(params.id), (experiment) =>
      experimentSchema.parse({ ...experiment, ...changes.data }),
    );
    return updated
      ? HttpResponse.json(updated)
      : errorResponse(404, "NOT_FOUND", "Experiment not found.");
  }),
  http.get(
    apiPath("/experiments/:id/observations"),
    async ({ request, params }) => {
      const failure = await beforeResponse(request, true);
      if (failure) return failure;
      const source = observations.filter(
        (observation) => observation.experimentId === String(params.id),
      );
      return pageResponse(request, source);
    },
  ),
  http.post(
    apiPath("/experiments/:id/observations"),
    async ({ request, params }) => {
      const failure = await beforeResponse(request);
      if (failure) return failure;
      const parsed = observationInputSchema.safeParse(await readJson(request));
      if (!parsed.success) return validationError(parsed.error);
      const observation: Observation = observationSchema.parse({
        id: createId("observation", observations),
        experimentId: String(params.id),
        ...parsed.data,
      });
      observations.push(observation);
      return HttpResponse.json(observation, { status: 201 });
    },
  ),

  http.get(apiPath("/insights"), async ({ request }) => {
    const failure = await beforeResponse(request);
    if (failure) return failure;
    const url = new URL(request.url);
    const insight = insights.find(
      (item) =>
        item.scope === url.searchParams.get("scope") &&
        item.metric === url.searchParams.get("metric"),
    );
    return insight
      ? HttpResponse.json(insightSchema.parse(insight))
      : errorResponse(404, "NOT_FOUND", "Insight not found.");
  }),

  http.get(apiPath("/admin/students"), async ({ request }) => {
    const failure = await beforeResponse(request, true);
    if (failure) return failure;
    return pageResponse(
      request,
      users.filter((user) => user.role === "mentor"),
    );
  }),

  http.get(apiPath("/placements"), async ({ request }) => {
    const failure = await beforeResponse(request, true);
    if (failure) return failure;
    return pageResponse(request, placements);
  }),
  http.post(apiPath("/placements"), async ({ request }) => {
    const failure = await beforeResponse(request);
    if (failure) return failure;
    const parsed = placementSchema
      .omit({ id: true })
      .safeParse(await readJson(request));
    if (!parsed.success) return validationError(parsed.error);
    const placement: Placement = placementSchema.parse({
      id: createId("placement", placements),
      ...parsed.data,
    });
    placements.push(placement);
    return HttpResponse.json(placement, { status: 201 });
  }),
  http.patch(apiPath("/placements/:id"), async ({ request, params }) => {
    const failure = await beforeResponse(request);
    if (failure) return failure;
    const changes = placementSchema
      .partial()
      .safeParse(await readJson(request));
    if (!changes.success) return validationError(changes.error);
    const updated = replaceItem(placements, String(params.id), (placement) =>
      placementSchema.parse({ ...placement, ...changes.data }),
    );
    return updated
      ? HttpResponse.json(updated)
      : errorResponse(404, "NOT_FOUND", "Placement not found.");
  }),
];
