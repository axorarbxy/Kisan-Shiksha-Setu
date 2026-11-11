"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { roleHome } from "@/config/nav";
import type { Role } from "@/config/nav";
import { useRoleStore } from "@/stores/role-store";

function isRole(value: string | undefined): value is Role {
  return value === "mentor" || value === "school" || value === "admin";
}

export function HomeRouteLink({ label }: { label: string }) {
  const pathname = usePathname();
  const selectedRole = useRoleStore((state) => state.selectedRole);
  const pathRole = pathname.split("/")[1];
  const href = isRole(pathRole) ? roleHome[pathRole] : roleHome[selectedRole];

  return (
    <Button asChild>
      <Link href={href}>{label}</Link>
    </Button>
  );
}
