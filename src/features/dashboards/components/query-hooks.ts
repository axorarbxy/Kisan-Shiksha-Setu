"use client";

import { useQueries } from "@tanstack/react-query";
import { observationPageSchema } from "@/lib/api/schemas";
import { request, withQuery } from "@/lib/api/client";
import { qk } from "@/lib/query/keys";

export function useObservationTotals(experimentIds: readonly string[]) {
  const queries = useQueries({
    queries: experimentIds.map((id) => ({
      queryKey: qk.experiments.observationSummary(id),
      queryFn: ({ signal }) =>
        request(
          withQuery(`/experiments/${encodeURIComponent(id)}/observations`, {
            limit: 50,
          }),
          { schema: observationPageSchema, signal },
        ),
    })),
  });

  return {
    count: queries.reduce((total, query) => total + (query.data?.items.length ?? 0), 0),
    isPending: queries.some((query) => query.isPending),
    error: queries.find((query) => query.error)?.error as Error | undefined,
    refetch: () => Promise.all(queries.map((query) => query.refetch())),
  };
}
