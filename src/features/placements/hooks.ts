"use client";

import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { request } from "@/lib/api/client";
import { placementPageSchema, placementSchema } from "@/lib/api/schemas";
import type { Placement } from "@/lib/api/schemas";
import { qk } from "@/lib/query/keys";
import {
  fetchPage,
  nextCursor,
  notifyMutationError,
  type ListFilters,
} from "@/features/query-utils";
import { toast } from "sonner";
import { appStrings } from "@/content/strings";

export function usePlacements(filters: ListFilters = {}) {
  return useInfiniteQuery({
    queryKey: qk.placements.list(filters),
    initialPageParam: undefined as string | undefined,
    queryFn: ({ pageParam, signal }) =>
      fetchPage("/placements", filters, pageParam, signal, placementPageSchema),
    getNextPageParam: nextCursor,
  });
}

export function useCreatePlacement() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: Omit<Placement, "id">) =>
      request("/placements", {
        method: "POST",
        body: input,
        schema: placementSchema,
      }),
    onSuccess: () => {
      toast.success(appStrings.mentor.placementSaved);
      void queryClient.invalidateQueries({ queryKey: ["placements"] });
    },
    onError: notifyMutationError,
  });
}

export function useUpdatePlacement() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      changes,
    }: {
      id: string;
      changes: Partial<Omit<Placement, "id">>;
    }) =>
      request(`/placements/${encodeURIComponent(id)}`, {
        method: "PATCH",
        body: changes,
        schema: placementSchema,
      }),
    onSuccess: () => {
      toast.success(appStrings.mentor.placementUpdated);
      void queryClient.invalidateQueries({ queryKey: ["placements"] });
    },
    onError: notifyMutationError,
  });
}
