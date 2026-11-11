"use client";

import dynamic from "next/dynamic";
import type { ReactNode } from "react";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";
import { QueryProvider } from "@/lib/query/query-provider";
import { PersistedStoreHydration } from "@/components/shared/persisted-store-hydration";
import { DraftSync } from "@/features/experiments/draft-sync";

const MswProvider = dynamic(
  () =>
    import("@/components/shared/msw-provider").then(
      (module) => module.MswProvider,
    ),
  { ssr: false },
);

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <TooltipProvider>
      <MswProvider />
      <PersistedStoreHydration />
      <QueryProvider>
        {children}
        <DraftSync />
        <Toaster position="bottom-right" />
      </QueryProvider>
    </TooltipProvider>
  );
}
