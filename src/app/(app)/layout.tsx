import type { Metadata } from "next";
import type { ReactNode } from "react";
import { AppShell } from "@/components/shared/app-shell";

export const metadata: Metadata = {
  robots: { index: false },
};

export default function AuthenticatedLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <AppShell>{children}</AppShell>;
}
