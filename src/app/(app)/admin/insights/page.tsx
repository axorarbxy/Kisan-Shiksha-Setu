import type { Metadata } from "next";
import { RoutePlaceholder } from "@/components/shared/route-placeholder";

export const metadata: Metadata = { title: "Insights" };

export default function AdminInsightsPage() {
  return (
    <RoutePlaceholder
      title="Insights"
      description="Review pilot progress and program outcomes."
    />
  );
}
