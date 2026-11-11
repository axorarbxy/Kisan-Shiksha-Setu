"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { roleHome } from "@/config/nav";
import { useMe } from "@/features/auth/hooks";

export function HomeRouteLink({ label }: { label: string }) {
  const pathname = usePathname();
  const isWorkspacePath = ["/mentor", "/school", "/admin", "/settings"].some(
    (root) => pathname === root || pathname.startsWith(`${root}/`),
  );
  const me = useMe({ enabled: isWorkspacePath });
  const href = me.data ? roleHome[me.data.role] : "/";

  return (
    <Button asChild>
      <Link href={href}>{label}</Link>
    </Button>
  );
}
