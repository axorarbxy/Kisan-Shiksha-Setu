import type { Metadata } from "next";
import { RoutePlaceholder } from "@/components/shared/route-placeholder";

export const metadata: Metadata = { title: "Mentor dashboard" };

export default function MentorDashboardPage() {
  return (
    <RoutePlaceholder
      title="Mentor dashboard"
      description="Your RAWE and Student READY workspace."
    />
  );
}
