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
import { qk } from "@/lib/query/keys";
import {
  fetchPage,
  nextCursor,
  notifyMutationError,
  type ListFilters,
} from "@/features/query-utils";

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
      void queryClient.invalidateQueries({ queryKey: ["experiments"] });
    },
    onError: notifyMutationError,
  });
}

export function useUpdateExperiment() {
  const queryClient = useQueryClient();
  return useMutation({
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
    onSuccess: (experiment) => {
      queryClient.setQueryData(
        qk.experiments.detail(experiment.id),
        experiment,
      );
      void queryClient.invalidateQueries({ queryKey: ["experiments"] });
    },
    onError: notifyMutationError,
  });
}

type AddObservationVariables = {
  experimentId: string;
  observation: ObservationInput;
  mockScenario?: "server-error" | "unprocessable";
};

type ObservationContext = {
  previous?: InfiniteData<Page<Observation>, string | undefined>;
};

export function useAddObservation() {
  const queryClient = useQueryClient();
  return useMutation<
    Observation,
    Error,
    AddObservationVariables,
    ObservationContext
  >({
    mutationFn: ({ experimentId, observation, mockScenario }) =>
      request(`/experiments/${encodeURIComponent(experimentId)}/observations`, {
        method: "POST",
        body: observationInputSchema.parse(observation),
        schema: observationSchema,
        mockScenario,
      }),
    onMutate: async ({ experimentId, observation }) => {
      const queryKey = qk.experiments.observations(experimentId);
      await queryClient.cancelQueries({ queryKey });
      const previous =
        queryClient.getQueryData<
          InfiniteData<Page<Observation>, string | undefined>
        >(queryKey);
      const optimistic: Observation = {
        ...observation,
        experimentId,
        id: `optimistic-${Date.now()}`,
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
      return { previous };
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
      notifyMutationError(error);
    },
    onSuccess: (_observation, variables) => {
      void queryClient.invalidateQueries({
        queryKey: qk.experiments.observations(variables.experimentId),
      });
    },
  });
}
