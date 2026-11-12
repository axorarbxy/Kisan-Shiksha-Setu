"use client";

import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { request } from "@/lib/api/client";
import { matchPageSchema, matchSchema } from "@/lib/api/schemas";
import type { Match } from "@/lib/api/schemas";
import { qk } from "@/lib/query/keys";
import {
  fetchPage,
  nextCursor,
  notifyMutationError,
  type ListFilters,
} from "@/features/query-utils";
import { toast } from "sonner";
import { appStrings } from "@/content/strings";

export function useMatches(filters: ListFilters = {}) {
  return useInfiniteQuery({
    queryKey: filters.mine ? qk.matches.mine : qk.matches.list(filters),
    initialPageParam: undefined as string | undefined,
    queryFn: ({ pageParam, signal }) =>
      fetchPage("/matches", filters, pageParam, signal, matchPageSchema),
    getNextPageParam: nextCursor,
  });
}

export function useCreateMatch() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: Omit<Match, "id">) =>
      request("/matches", {
        method: "POST",
        body: input,
        schema: matchSchema,
      }),
    onSuccess: () => {
      toast.success(appStrings.mentor.matchRequestSent);
      void queryClient.invalidateQueries({ queryKey: ["matches"] });
    },
    onError: notifyMutationError,
  });
}

export function useUpdateMatch() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, changes }: { id: string; changes: Partial<Match> }) =>
      request(`/matches/${encodeURIComponent(id)}`, {
        method: "PATCH",
        body: changes,
        schema: matchSchema,
      }),
    onSuccess: () => {
      toast.success(appStrings.mentor.matchUpdated);
      void queryClient.invalidateQueries({ queryKey: ["matches"] });
    },
    onError: notifyMutationError,
  });
}
