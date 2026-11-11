"use client";

import { useEffect, useState } from "react";

export function MswProvider() {
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (process.env.NEXT_PUBLIC_API_MOCKING !== "enabled") {
      return;
    }

    import("@/mocks/browser")
      .then(({ worker }) => worker.start({ onUnhandledFrame: "bypass" }))
      .catch((cause: unknown) => {
        setError(
          cause instanceof Error
            ? cause
            : new Error("Failed to start the MSW service worker."),
        );
      });
  }, []);

  if (error) {
    throw error;
  }

  return null;
}
