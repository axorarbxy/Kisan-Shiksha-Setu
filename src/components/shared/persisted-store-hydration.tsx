"use client";

import { useEffect } from "react";
import { useObservationDraftStore } from "@/stores/observation-draft-store";
import { useOnboardingStore } from "@/stores/onboarding-store";
import { useUiStore } from "@/stores/ui-store";

export function PersistedStoreHydration() {
  useEffect(() => {
    void useUiStore.persist.rehydrate();
    void useObservationDraftStore.persist.rehydrate();
    void useOnboardingStore.persist.rehydrate();
  }, []);

  return null;
}
