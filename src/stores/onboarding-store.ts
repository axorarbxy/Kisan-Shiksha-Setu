"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type OnboardingData = Record<string, unknown>;

interface OnboardingState {
  step: number;
  data: OnboardingData;
  next: () => void;
  back: () => void;
  updateData: (data: OnboardingData) => void;
  reset: () => void;
}

type PersistedOnboardingState = Pick<OnboardingState, "step" | "data">;

export function migrateOnboardingState(
  persistedState: unknown,
  _version: number,
): PersistedOnboardingState {
  if (typeof persistedState !== "object" || persistedState === null) {
    return { step: 0, data: {} };
  }
  const state = persistedState as Record<string, unknown>;
  return {
    step:
      typeof state.step === "number" && Number.isInteger(state.step)
        ? Math.max(0, state.step)
        : 0,
    data:
      typeof state.data === "object" && state.data !== null
        ? (state.data as OnboardingData)
        : {},
  };
}

const initialState: PersistedOnboardingState = { step: 0, data: {} };

export const useOnboardingStore = create<OnboardingState>()(
  persist(
    (set) => ({
      ...initialState,
      next: () => set((state) => ({ step: state.step + 1 })),
      back: () => set((state) => ({ step: Math.max(0, state.step - 1) })),
      updateData: (data) =>
        set((state) => ({ data: { ...state.data, ...data } })),
      reset: () => set(initialState),
    }),
    {
      name: "kss.onboarding",
      version: 1,
      skipHydration: true,
      partialize: (state): PersistedOnboardingState => ({
        step: state.step,
        data: state.data,
      }),
      migrate: migrateOnboardingState,
    },
  ),
);
