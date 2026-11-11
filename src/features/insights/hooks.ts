"use client";

import { useQuery } from "@tanstack/react-query";
import { request, withQuery } from "@/lib/api/client";
import { insightSchema } from "@/lib/api/schemas";
import { qk } from "@/lib/query/keys";

export function useInsights(scope: string, metric: string) {
  return useQuery({
    queryKey: qk.insights(scope, metric),
    queryFn: ({ signal }) =>
      request(withQuery("/insights", { scope, metric }), {
        schema: insightSchema,
        signal,
      }),
    enabled: Boolean(scope && metric),
  });
}
