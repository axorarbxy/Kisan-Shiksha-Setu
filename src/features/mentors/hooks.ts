"use client";

import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { request } from "@/lib/api/client";
import { mentorPageSchema, mentorProfileSchema } from "@/lib/api/schemas";
import type { MentorProfile } from "@/lib/api/schemas";
import { qk } from "@/lib/query/keys";
import {
  fetchPage,
  nextCursor,
  notifyMutationError,
  type ListFilters,
} from "@/features/query-utils";
import { toast } from "sonner";
import { appStrings } from "@/content/strings";

export function useMentors(filters: ListFilters = {}) {
  return useInfiniteQuery({
    queryKey: qk.mentors.list(filters),
    initialPageParam: undefined as string | undefined,
    queryFn: ({ pageParam, signal }) =>
      fetchPage("/mentors", filters, pageParam, signal, mentorPageSchema),
    getNextPageParam: nextCursor,
  });
}

export function useMentor(id: string) {
  return useQuery({
    queryKey: qk.mentors.detail(id),
    queryFn: ({ signal }) =>
      request(`/mentors/${encodeURIComponent(id)}`, {
        schema: mentorProfileSchema,
        signal,
      }),
    enabled: Boolean(id),
  });
}

export function useUpdateMentor() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      changes,
    }: {
      id: string;
      changes: Partial<Omit<MentorProfile, "userId">>;
    }) =>
      request(`/mentors/${encodeURIComponent(id)}`, {
        method: "PATCH",
        body: changes,
        schema: mentorProfileSchema,
      }),
    onSuccess: (mentor) => {
      toast.success(appStrings.mentor.mentorProfileUpdated);
      queryClient.setQueryData(qk.mentors.detail(mentor.userId), mentor);
      void queryClient.invalidateQueries({ queryKey: qk.mentors.all });
    },
    onError: notifyMutationError,
  });
}
