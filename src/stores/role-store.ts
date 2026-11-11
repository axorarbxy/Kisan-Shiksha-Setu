"use client";

import { create } from "zustand";
import type { Role } from "@/config/nav";

interface RoleState {
  selectedRole: Role;
  setSelectedRole: (role: Role) => void;
}

export const useRoleStore = create<RoleState>((set) => ({
  selectedRole: "mentor",
  setSelectedRole: (selectedRole) => set({ selectedRole }),
}));
