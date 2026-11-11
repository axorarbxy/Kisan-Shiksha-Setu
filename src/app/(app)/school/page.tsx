import type { Metadata } from "next";
import { RoutePlaceholder } from "@/components/shared/route-placeholder";

export const metadata: Metadata = { title: "School dashboard" };

export default function SchoolDashboardPage() {
  return (
    <RoutePlaceholder
      title="School dashboard"
      description="Your school’s KSS coordination workspace."
    />
  );
}
