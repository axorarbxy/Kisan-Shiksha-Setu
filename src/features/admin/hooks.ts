"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { userPageSchema } from "@/lib/api/schemas";
import { qk } from "@/lib/query/keys";
import {
  fetchPage,
  nextCursor,
  type ListFilters,
} from "@/features/query-utils";

export function useAdminStudents(filters: ListFilters = {}) {
  return useInfiniteQuery({
    queryKey: qk.adminStudents(filters),
    initialPageParam: undefined as string | undefined,
    queryFn: ({ pageParam, signal }) =>
      fetchPage("/admin/students", filters, pageParam, signal, userPageSchema),
    getNextPageParam: nextCursor,
  });
}
