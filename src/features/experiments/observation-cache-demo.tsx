"use client";

import {
  useCreateObservation,
  useExperimentObservations,
} from "@/features/experiments/hooks";
import { Button } from "@/components/ui/button";
import { useObservationDraftStore } from "@/stores/observation-draft-store";

const experimentId = "experiment-1";

export function ObservationCacheDemo() {
  const observationsQuery = useExperimentObservations(experimentId);
  const addObservation = useCreateObservation();
  const drafts = useObservationDraftStore((state) => state.drafts);
  const observations =
    observationsQuery.data?.pages.flatMap((page) => page.items) ?? [];
  const experimentDrafts = Object.values(drafts).filter(
    (draft) => draft.experimentId === experimentId,
  );

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

  return (
    <section aria-label="Observation cache demonstration" className="space-y-4">
      {observationsQuery.isPending && <p role="status">Loading observations…</p>}
      {observationsQuery.isError && (
        <p role="alert">{observationsQuery.error.message}</p>
      )}
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
      {experimentDrafts.length > 0 && (
        <ul aria-label="Saved observation drafts" className="space-y-2">
          {experimentDrafts.map((draft) => (
            <li className="flex items-center gap-2" key={draft.localId}>
              Draft: {draft.metric} {draft.value} {draft.unit}
              {draft.syncStatus === "queued" && (
                <span className="text-muted-foreground text-xs">
                  Saved offline, will sync
                </span>
              )}
              {draft.syncStatus === "failed" && (
                <span className="text-destructive text-xs">
                  Sync failed; draft is saved
                </span>
              )}
            </li>
          ))}
        </ul>
      )}
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
