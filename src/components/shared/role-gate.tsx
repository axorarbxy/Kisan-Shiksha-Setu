"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import type { Role } from "@/config/nav";
import { useRoleStore } from "@/stores/role-store";

export function RoleGate({
  allow,
  children,
  fallback = null,
}: {
  allow: Role[];
  children: ReactNode;
  fallback?: ReactNode;
}) {
  const pathname = usePathname();
  const selectedRole = useRoleStore((state) => state.selectedRole);
  const pathRole = pathname.split("/")[1];
  const role: Role =
    pathRole === "mentor" || pathRole === "school" || pathRole === "admin"
      ? pathRole
      : selectedRole;

  return allow.includes(role) ? children : fallback;
}
