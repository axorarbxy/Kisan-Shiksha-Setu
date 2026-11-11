import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { PageHeader } from "@/components/shared/page-header";
import { ObservationCacheDemo } from "@/features/experiments/observation-cache-demo";

export const metadata: Metadata = { title: "Data layer demo" };

export default function DataLayerDemoPage() {
  if (process.env.NODE_ENV !== "development") {
    notFound();
  }

  return (
    <main className="mx-auto w-full max-w-6xl space-y-8 px-6 py-16">
      <PageHeader
        title="Data layer demo"
        description="Inspect mock API query states and optimistic observation updates."
      />
      <ObservationCacheDemo />
    </main>
  );
}
