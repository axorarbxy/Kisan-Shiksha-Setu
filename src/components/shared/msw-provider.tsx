"use client";

import { useEffect, useState } from "react";
import {
  markMockWorkerFailed,
  markMockWorkerReady,
} from "@/lib/api/mock-readiness";

let workerStartPromise: Promise<void> | undefined;

export function MswProvider() {
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (process.env.NEXT_PUBLIC_API_MOCKING !== "enabled") {
      return;
    }

    let isActive = true;
    workerStartPromise ??= import("@/mocks/browser")
      .then(({ worker }) => worker.start({ onUnhandledFrame: "bypass" }))
      .then(() => undefined);

    void workerStartPromise.then(
      () => {
        if (isActive) {
          markMockWorkerReady();
        }
      },
      (cause: unknown) => {
        if (isActive) {
          const workerError =
            cause instanceof Error
              ? cause
              : new Error("Failed to start the MSW service worker.");
          markMockWorkerFailed(workerError);
          setError(workerError);
        }
      },
    );

    return () => {
      isActive = false;
    };
  }, []);

  if (error) {
    throw error;
  }

  return null;
}
