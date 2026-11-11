"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import type { Role } from "@/config/nav";
import { roleHome } from "@/config/nav";
import { useMe } from "@/features/auth/hooks";
import { Button } from "@/components/ui/button";

export function RoleGate({
  allow,
  children,
  fallback,
}: {
  allow: Role[];
  children: ReactNode;
  fallback?: ReactNode;
}) {
  const me = useMe();

  if (me.isPending) {
    return <p className="text-muted-foreground p-8 text-center" role="status">Loading your workspace…</p>;
  }
  if (me.isError || !me.data) {
    return (
      <section className="mx-auto max-w-xl space-y-4 p-8 text-center" role="alert">
        <h1 className="text-2xl font-semibold">Please log in to continue</h1>
        <Button asChild><Link href="/login">Log in</Link></Button>
      </section>
    );
  }
  if (!allow.includes(me.data.role)) {
    return (
      fallback ?? (
        <section className="mx-auto max-w-xl space-y-4 p-8 text-center" role="alert">
          <h1 className="text-2xl font-semibold">This workspace isn’t available to your account</h1>
          <p className="text-muted-foreground">
            You’re signed in as a {me.data.role}. Go to your workspace to continue.
          </p>
          <Button asChild><Link href={roleHome[me.data.role]}>Go to my workspace</Link></Button>
        </section>
      )
    );
  }
  return children;
}
