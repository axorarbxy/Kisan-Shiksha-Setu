"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface DraftObservation {
  localId: string;
  experimentId: string;
  date: string;
  metric: string;
  value: string;
  unit?: string;
  notes?: string;
  photoDataUrl?: string;
  createdAt: number;
  syncStatus: "draft" | "queued" | "failed";
}

interface DraftState {
  drafts: Record<string, DraftObservation>;
  inFlightIds: Record<string, true>;
  upsertDraft: (draft: DraftObservation) => void;
  markInFlight: (localId: string) => void;
  removeDraft: (localId: string) => void;
  markQueued: (localId: string) => void;
  markFailed: (localId: string) => void;
}

type PersistedDraftState = Pick<DraftState, "drafts">;
const MAX_PHOTO_DATA_URL_LENGTH = 200_000;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isDraftObservation(value: unknown): value is DraftObservation {
  if (!isRecord(value)) {
    return false;
  }
  return (
    typeof value.localId === "string" &&
    typeof value.experimentId === "string" &&
    typeof value.date === "string" &&
    typeof value.metric === "string" &&
    typeof value.value === "string" &&
    typeof value.createdAt === "number" &&
    (value.syncStatus === "draft" ||
      value.syncStatus === "queued" ||
      value.syncStatus === "failed") &&
    (value.unit === undefined || typeof value.unit === "string") &&
    (value.notes === undefined || typeof value.notes === "string") &&
    (value.photoDataUrl === undefined ||
      (typeof value.photoDataUrl === "string" &&
        value.photoDataUrl.length <= MAX_PHOTO_DATA_URL_LENGTH))
  );
}

export function migrateDraftState(
  persistedState: unknown,
  _version: number,
): PersistedDraftState {
  if (!isRecord(persistedState) || !isRecord(persistedState.drafts)) {
    return { drafts: {} };
  }
  const drafts: Record<string, DraftObservation> = {};
  for (const [localId, draft] of Object.entries(persistedState.drafts)) {
    let candidate = draft;
    if (
      isRecord(draft) &&
      typeof draft.photoDataUrl === "string" &&
      draft.photoDataUrl.length > MAX_PHOTO_DATA_URL_LENGTH
    ) {
      const sanitizedDraft = { ...draft };
      delete sanitizedDraft.photoDataUrl;
      candidate = sanitizedDraft;
    }
    if (isDraftObservation(candidate) && candidate.localId === localId) {
      drafts[localId] = candidate;
    }
  }
  return { drafts };
}

export const useObservationDraftStore = create<DraftState>()(
  persist(
    (set) => ({
      drafts: {},
      inFlightIds: {},
      upsertDraft: (draft) => {
        if (
          draft.photoDataUrl &&
          draft.photoDataUrl.length > MAX_PHOTO_DATA_URL_LENGTH
        ) {
          throw new Error(
            "Observation photos must be compressed before saving them offline.",
          );
        }
        set((state) => ({
          drafts: { ...state.drafts, [draft.localId]: draft },
        }));
      },
      removeDraft: (localId) =>
        set((state) => {
          const drafts = { ...state.drafts };
          const inFlightIds = { ...state.inFlightIds };
          delete drafts[localId];
          delete inFlightIds[localId];
          return { drafts, inFlightIds };
        }),
      markInFlight: (localId) =>
        set((state) => ({
          inFlightIds: { ...state.inFlightIds, [localId]: true },
        })),
      markQueued: (localId) =>
        set((state) => {
          const draft = state.drafts[localId];
          if (!draft) return state;
          const inFlightIds = { ...state.inFlightIds };
          delete inFlightIds[localId];
          return {
            drafts: {
              ...state.drafts,
              [localId]: { ...draft, syncStatus: "queued" },
            },
            inFlightIds,
          };
        }),
      markFailed: (localId) =>
        set((state) => {
          const draft = state.drafts[localId];
          if (!draft) return state;
          const inFlightIds = { ...state.inFlightIds };
          delete inFlightIds[localId];
          return {
            drafts: {
              ...state.drafts,
              [localId]: { ...draft, syncStatus: "failed" },
            },
            inFlightIds,
          };
        }),
    }),
    {
      name: "kss.observation-drafts",
      version: 1,
      skipHydration: true,
      partialize: (state): PersistedDraftState => ({ drafts: state.drafts }),
      migrate: migrateDraftState,
    },
  ),
);
