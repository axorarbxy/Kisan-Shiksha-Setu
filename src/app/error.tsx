"use client";

import { useEffect } from "react";
import { HomeRouteLink } from "@/components/shared/home-route-link";
import { Button } from "@/components/ui/button";
import { AppProviders } from "@/app/providers";

export default function ErrorPage({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  useEffect(() => {
    console.error("Route rendering failed:", error);
  }, [error]);

  return (
    <AppProviders>
      <main className="mx-auto flex min-h-[60vh] w-full max-w-6xl flex-col items-start justify-center gap-5 px-6 py-16">
        <h1 className="font-display text-forest-800 text-4xl">
          Something went wrong
        </h1>
        <p className="text-muted-foreground">
          The page could not be loaded. Please try again.
        </p>
        <div className="flex gap-3">
          <Button onClick={retry}>Try again</Button>
          <HomeRouteLink label="Go home" />
        </div>
      </main>
    </AppProviders>
  );
}
