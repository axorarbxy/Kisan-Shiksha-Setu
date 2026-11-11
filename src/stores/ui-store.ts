"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

interface UiState {
  sidebarCollapsed: boolean;
  mobileNavOpen: boolean;
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  setMobileNav: (open: boolean) => void;
}

type PersistedUiState = Pick<UiState, "sidebarCollapsed">;

export function migrateUiState(
  persistedState: unknown,
  _version: number,
): PersistedUiState {
  if (
    typeof persistedState === "object" &&
    persistedState !== null &&
    "sidebarCollapsed" in persistedState &&
    typeof persistedState.sidebarCollapsed === "boolean"
  ) {
    return { sidebarCollapsed: persistedState.sidebarCollapsed };
  }
  return { sidebarCollapsed: false };
}

export const useUiStore = create<UiState>()(
  persist(
    (set) => ({
      sidebarCollapsed: false,
      mobileNavOpen: false,
      toggleSidebar: () =>
        set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
      setSidebarCollapsed: (sidebarCollapsed) => set({ sidebarCollapsed }),
      setMobileNav: (mobileNavOpen) => set({ mobileNavOpen }),
    }),
    {
      name: "kss.ui",
      version: 1,
      skipHydration: true,
      partialize: (state): PersistedUiState => ({
        sidebarCollapsed: state.sidebarCollapsed,
      }),
      migrate: migrateUiState,
    },
  ),
);
