"use client";

import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import type { InfiniteData } from "@tanstack/react-query";
import { request } from "@/lib/api/client";
import {
  experimentPageSchema,
  experimentSchema,
  observationInputSchema,
  observationPageSchema,
  observationSchema,
} from "@/lib/api/schemas";
import type {
  Experiment,
  Observation,
  ObservationInput,
  Page,
} from "@/lib/api/schemas";
import { useObservationDraftStore } from "@/stores/observation-draft-store";
import { qk } from "@/lib/query/keys";
import {
  fetchPage,
  nextCursor,
  notifyMutationError,
  type ListFilters,
} from "@/features/query-utils";
import { toast } from "sonner";
import { appStrings } from "@/content/strings";

export function useExperiments(filters: ListFilters = {}) {
  return useInfiniteQuery({
    queryKey: qk.experiments.list(filters),
    initialPageParam: undefined as string | undefined,
    queryFn: ({ pageParam, signal }) =>
      fetchPage(
        "/experiments",
        filters,
        pageParam,
        signal,
        experimentPageSchema,
      ),
    getNextPageParam: nextCursor,
  });
}

export function useExperiment(id: string) {
  return useQuery({
    queryKey: qk.experiments.detail(id),
    queryFn: ({ signal }) =>
      request(`/experiments/${encodeURIComponent(id)}`, {
        schema: experimentSchema,
        signal,
      }),
    enabled: Boolean(id),
  });
}

export function useExperimentObservations(id: string) {
  return useInfiniteQuery({
    queryKey: qk.experiments.observations(id),
    initialPageParam: undefined as string | undefined,
    queryFn: ({ pageParam, signal }) =>
      fetchPage(
        `/experiments/${encodeURIComponent(id)}/observations`,
        {},
        pageParam,
        signal,
        observationPageSchema,
      ),
    getNextPageParam: nextCursor,
    enabled: Boolean(id),
  });
}

export function useCreateExperiment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: Omit<Experiment, "id" | "createdAt">) =>
      request("/experiments", {
        method: "POST",
        body: input,
        schema: experimentSchema,
      }),
    onSuccess: () => {
      toast.success(appStrings.mentor.experimentCreated);
      void queryClient.invalidateQueries({ queryKey: ["experiments"] });
    },
    onError: notifyMutationError,
  });
}

export function useUpdateExperiment() {
  const queryClient = useQueryClient();
  return useMutation<
    Experiment,
    Error,
    { id: string; changes: Partial<Omit<Experiment, "id">> },
    { previous?: Experiment }
  >({
    mutationFn: ({
      id,
      changes,
    }: {
      id: string;
      changes: Partial<Omit<Experiment, "id">>;
    }) =>
      request(`/experiments/${encodeURIComponent(id)}`, {
        method: "PATCH",
        body: changes,
        schema: experimentSchema,
      }),
    onMutate: async ({ id, changes }) => {
      const queryKey = qk.experiments.detail(id);
      await queryClient.cancelQueries({ queryKey });
      const previous = queryClient.getQueryData<Experiment>(queryKey);
      if (previous) {
        queryClient.setQueryData(queryKey, { ...previous, ...changes });
      }
      return { previous };
    },
    onError: (error, { id }, context) => {
      if (context?.previous) {
        queryClient.setQueryData(qk.experiments.detail(id), context.previous);
      }
      notifyMutationError(error);
    },
    onSuccess: (experiment) => {
      toast.success(appStrings.mentor.experimentUpdated);
      queryClient.setQueryData(
        qk.experiments.detail(experiment.id),
        experiment,
      );
      void queryClient.invalidateQueries({ queryKey: ["experiments"] });
    },
  });
}

type AddObservationVariables = {
  experimentId: string;
  observation: ObservationInput;
  mockScenario?: "server-error" | "unprocessable";
  draftId?: string;
};

type ObservationContext = {
  previous?: InfiniteData<Page<Observation>, string | undefined>;
  draftId: string;
};

export function useCreateObservation() {
  const queryClient = useQueryClient();
  const upsertDraft = useObservationDraftStore((state) => state.upsertDraft);
  const markInFlight = useObservationDraftStore((state) => state.markInFlight);
  const removeDraft = useObservationDraftStore((state) => state.removeDraft);
  const markQueued = useObservationDraftStore((state) => state.markQueued);
  const markFailed = useObservationDraftStore((state) => state.markFailed);
  return useMutation<
    Observation,
    Error,
    AddObservationVariables,
    ObservationContext
  >({
    mutationFn: ({ experimentId, observation, mockScenario }) => {
      if (typeof navigator !== "undefined" && !navigator.onLine) {
        throw new Error("You are offline; the observation is saved for sync.");
      }
      return request(
        `/experiments/${encodeURIComponent(experimentId)}/observations`,
        {
          method: "POST",
          body: observationInputSchema.parse(observation),
          schema: observationSchema,
          mockScenario,
        },
      );
    },
    onMutate: async ({ experimentId, observation, draftId }) => {
      const localId = draftId ?? crypto.randomUUID();
      if (!draftId) {
        upsertDraft({
          localId,
          experimentId,
          date: observation.date,
          metric: observation.metric,
          value: String(observation.value),
          ...(observation.unit ? { unit: observation.unit } : {}),
          ...(observation.notes ? { notes: observation.notes } : {}),
          ...(observation.photoDataUrl
            ? { photoDataUrl: observation.photoDataUrl }
            : {}),
          createdAt: Date.now(),
          syncStatus: "draft",
        });
      }
      markInFlight(localId);
      const queryKey = qk.experiments.observations(experimentId);
      await queryClient.cancelQueries({ queryKey });
      const previous =
        queryClient.getQueryData<
          InfiniteData<Page<Observation>, string | undefined>
        >(queryKey);
      const optimistic: Observation = {
        ...observation,
        experimentId,
        id: `optimistic-${localId}`,
      };
      if (previous) {
        queryClient.setQueryData<
          InfiniteData<Page<Observation>, string | undefined>
        >(queryKey, {
          ...previous,
          pages: previous.pages.map((page, index) =>
            index === 0
              ? {
                  ...page,
                  items: [optimistic, ...page.items],
                  total: page.total + 1,
                }
              : page,
          ),
        });
      } else {
        const firstPage: Page<Observation> = {
          items: [optimistic],
          total: 1,
        };
        queryClient.setQueryData<
          InfiniteData<Page<Observation>, string | undefined>
        >(queryKey, { pages: [firstPage], pageParams: [undefined] });
      }
      return { previous, draftId: localId };
    },
    onError: (error, variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData(
          qk.experiments.observations(variables.experimentId),
          context.previous,
        );
      } else {
        queryClient.removeQueries({
          queryKey: qk.experiments.observations(variables.experimentId),
        });
      }
      if (context) {
        if (typeof navigator !== "undefined" && !navigator.onLine) {
          markQueued(context.draftId);
        } else {
          markFailed(context.draftId);
        }
      }
      if (typeof navigator === "undefined" || navigator.onLine) {
        notifyMutationError(error);
      }
    },
    onSuccess: (_observation, variables, context) => {
      toast.success(appStrings.mentor.observationSaved);
      if (context) {
        removeDraft(context.draftId);
      }
      void queryClient.invalidateQueries({
        queryKey: qk.experiments.observations(variables.experimentId),
      });
    },
  });
}

export function useAddObservation() {
  return useCreateObservation();
}
