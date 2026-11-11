"use client";

import { useSyncDrafts } from "@/features/experiments/use-sync-drafts";

export function DraftSync() {
  useSyncDrafts();
  return null;
}
