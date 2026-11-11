"use client";

import { useEffect, useState } from "react";

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

    workerStartPromise.catch((cause: unknown) => {
      if (isActive) {
        setError(
          cause instanceof Error
            ? cause
            : new Error("Failed to start the MSW service worker."),
        );
      }
    });

    return () => {
      isActive = false;
    };
  }, []);

  if (error) {
    throw error;
  }

  return null;
}
