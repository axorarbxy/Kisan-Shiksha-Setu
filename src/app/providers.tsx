"use client";

import dynamic from "next/dynamic";
import type { ReactNode } from "react";
import { QueryProvider } from "@/lib/query/query-provider";

const MswProvider = dynamic(
  () =>
    import("@/components/shared/msw-provider").then(
      (module) => module.MswProvider,
    ),
  { ssr: false },
);

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <>
      <MswProvider />
      <QueryProvider>{children}</QueryProvider>
    </>
  );
}
