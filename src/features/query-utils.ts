import { toast } from "sonner";
import type { z } from "zod";
import { ApiError } from "@/lib/api/client";
import { request, withQuery } from "@/lib/api/client";
import type { Page } from "@/lib/api/schemas";
import { appStrings } from "@/content/strings";

export type ListFilters = Record<string, string | number | undefined>;

export async function fetchPage<T>(
  path: string,
  filters: ListFilters,
  cursor: string | undefined,
  signal: AbortSignal,
  schema: z.ZodType<Page<T>>,
): Promise<Page<T>> {
  return request(withQuery(path, { ...filters, cursor }), {
    schema,
    signal,
  });
}

export function notifyMutationError(error: Error) {
  toast.error(error.message || appStrings.common.requestFailed);
}

export function mutationFieldErrors(error: unknown) {
  return error instanceof ApiError ? error.fieldErrors : undefined;
}

export function nextCursor<T>(page: Page<T>) {
  return page.nextCursor;
}
