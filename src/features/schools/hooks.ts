"use client";

import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { request } from "@/lib/api/client";
import { schoolPageSchema, schoolSchema } from "@/lib/api/schemas";
import { qk } from "@/lib/query/keys";
import {
  fetchPage,
  nextCursor,
  type ListFilters,
} from "@/features/query-utils";

export function useSchools(filters: ListFilters = {}) {
  return useInfiniteQuery({
    queryKey: qk.schools.list(filters),
    initialPageParam: undefined as string | undefined,
    queryFn: ({ pageParam, signal }) =>
      fetchPage("/schools", filters, pageParam, signal, schoolPageSchema),
    getNextPageParam: nextCursor,
  });
}

export function useSchool(id: string) {
  return useQuery({
    queryKey: qk.schools.detail(id),
    queryFn: ({ signal }) =>
      request(`/schools/${encodeURIComponent(id)}`, {
        schema: schoolSchema,
        signal,
      }),
    enabled: Boolean(id),
  });
}
