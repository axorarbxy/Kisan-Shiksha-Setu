"use client";

import { useCallback, useEffect, useRef } from "react";
import { useObservationDraftStore } from "@/stores/observation-draft-store";
import { useCreateObservation } from "@/features/experiments/hooks";

export function useSyncDrafts() {
  const drafts = useObservationDraftStore((state) => state.drafts);
  const inFlightIds = useObservationDraftStore((state) => state.inFlightIds);
  const markQueued = useObservationDraftStore((state) => state.markQueued);
  const markFailed = useObservationDraftStore((state) => state.markFailed);
  const createObservation = useCreateObservation();
  const syncing = useRef(new Set<string>());

  const syncQueuedDrafts = useCallback(async () => {
    if (!navigator.onLine) {
      return;
    }

    const queuedDrafts = Object.values(drafts).filter(
      (draft) =>
        draft.syncStatus === "queued" && !inFlightIds[draft.localId],
    );
    for (const draft of queuedDrafts) {
      if (syncing.current.has(draft.localId)) {
        continue;
      }
      const value = Number(draft.value);
      if (!Number.isFinite(value)) {
        markFailed(draft.localId);
        continue;
      }

      syncing.current.add(draft.localId);
      try {
        await createObservation.mutateAsync({
          experimentId: draft.experimentId,
          observation: {
            date: draft.date,
            metric: draft.metric,
            value,
            ...(draft.unit ? { unit: draft.unit } : {}),
            ...(draft.notes ? { notes: draft.notes } : {}),
            ...(draft.photoDataUrl
              ? { photoDataUrl: draft.photoDataUrl }
              : {}),
          },
          draftId: draft.localId,
        });
      } catch {
        // The mutation marks the draft queued or failed and reports online errors.
      } finally {
        syncing.current.delete(draft.localId);
      }
    }
  }, [createObservation, drafts, inFlightIds, markFailed]);

  useEffect(() => {
    for (const draft of Object.values(drafts)) {
      if (draft.syncStatus === "draft" && !inFlightIds[draft.localId]) {
        markQueued(draft.localId);
      }
    }
  }, [drafts, inFlightIds, markQueued]);

  useEffect(() => {
    const handleOnline = () => {
      void syncQueuedDrafts();
    };
    window.addEventListener("online", handleOnline);
    if (navigator.onLine) {
      void syncQueuedDrafts();
    }
    return () => window.removeEventListener("online", handleOnline);
  }, [syncQueuedDrafts]);
}
