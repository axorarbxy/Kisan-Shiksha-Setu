"use client";

import {
  useAddObservation,
  useExperimentObservations,
} from "@/features/experiments/hooks";
import { Button } from "@/components/ui/button";

const experimentId = "experiment-1";

export function ObservationCacheDemo() {
  const observationsQuery = useExperimentObservations(experimentId);
  const addObservation = useAddObservation();
  const observations =
    observationsQuery.data?.pages.flatMap((page) => page.items) ?? [];

  function add(value: number, mockScenario?: "server-error") {
    addObservation.mutate({
      experimentId,
      observation: {
        date: new Date().toISOString().slice(0, 10),
        metric: "plant height",
        value,
        unit: "cm",
      },
      mockScenario,
    });
  }

  if (observationsQuery.isPending) {
    return <p role="status">Loading observations…</p>;
  }
  if (observationsQuery.isError) {
    return <p role="alert">{observationsQuery.error.message}</p>;
  }

  return (
    <section aria-label="Observation cache demonstration" className="space-y-4">
      <p aria-live="polite" role="status">
        Observations: {observations.length}
      </p>
      <ul className="space-y-2">
        {observations.map((observation) => (
          <li key={observation.id}>
            {observation.metric}: {observation.value} {observation.unit}
          </li>
        ))}
      </ul>
      <div className="flex flex-wrap gap-3">
        <Button disabled={addObservation.isPending} onClick={() => add(42)}>
          Add observation
        </Button>
        <Button
          disabled={addObservation.isPending}
          onClick={() => add(99, "server-error")}
          variant="outline"
        >
          Force server error
        </Button>
      </div>
    </section>
  );
}
