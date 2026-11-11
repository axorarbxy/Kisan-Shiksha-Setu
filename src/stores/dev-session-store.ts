"use client";

import { create } from "zustand";
import type { Role } from "@/config/nav";

interface DevSessionState {
  role: Role;
  setRole: (role: Role) => void;
}

export const useDevSessionStore = create<DevSessionState>()((set) => ({
  role: "mentor",
  setRole: (role) => {
    if (process.env.NODE_ENV !== "production") {
      set({ role });
    }
  },
}));
