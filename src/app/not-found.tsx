import { HomeRouteLink } from "@/components/shared/home-route-link";
import { AppProviders } from "@/app/providers";

export default function NotFound() {
  return (
    <AppProviders>
      <main className="mx-auto flex min-h-[60vh] w-full max-w-6xl flex-col items-start justify-center gap-5 px-6 py-16">
        <h1 className="font-display text-forest-800 text-5xl">
          Page not found
        </h1>
        <p className="text-muted-foreground">
          We couldn&apos;t find the page you were looking for.
        </p>
        <HomeRouteLink label="Back to home" />
      </main>
    </AppProviders>
  );
}
