"use client";

import type { ReactNode } from "react";
import { AlertCircle } from "lucide-react";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { appStrings } from "@/content/strings";

export function QueryState({
  isPending,
  error,
  onRetry,
  isEmpty,
  hasData = false,
  emptyTitle = appStrings.common.emptyTitle,
  emptyDescription,
  emptyAction,
  children,
}: {
  isPending: boolean;
  error: Error | null;
  onRetry: () => void;
  isEmpty: boolean;
  hasData?: boolean;
  emptyTitle?: string;
  emptyDescription: string;
  emptyAction?: ReactNode;
  children: ReactNode;
}) {
  if (isPending && !hasData) {
    return (
      <div aria-label={appStrings.common.loading} className="space-y-4">
        <Skeleton className="h-28 w-full" />
        <Skeleton className="h-48 w-full" />
      </div>
    );
  }

  if (error && !hasData) {
    return (
      <div
        className="border-border flex flex-col items-start gap-3 rounded-xl border bg-white p-6"
        role="alert"
      >
        <AlertCircle aria-hidden="true" className="text-destructive size-5" />
        <div>
          <h2 className="font-semibold">{appStrings.common.errorTitle}</h2>
          <p className="text-muted-foreground mt-1 text-sm">
            {error.message || appStrings.common.errorDescription}
          </p>
        </div>
        <Button onClick={onRetry} variant="outline">
          {appStrings.common.retry}
        </Button>
      </div>
    );
  }

  if (isEmpty && !hasData) {
    return (
      <EmptyState
        action={emptyAction}
        description={emptyDescription}
        title={emptyTitle}
      />
    );
  }

  return (
    <div className="space-y-4">
      {error && hasData && (
        <div
          className="border-border flex flex-wrap items-center justify-between gap-3 rounded-xl border bg-white p-4 text-sm"
          role="status"
        >
          <span>{appStrings.common.errorDescription}</span>
          <Button onClick={onRetry} variant="outline">
            {appStrings.common.retry}
          </Button>
        </div>
      )}
      {children}
    </div>
  );
}
