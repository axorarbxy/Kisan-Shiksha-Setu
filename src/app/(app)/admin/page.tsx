import type { Metadata } from "next";
import { RoutePlaceholder } from "@/components/shared/route-placeholder";

export const metadata: Metadata = { title: "Admin dashboard" };

export default function AdminDashboardPage() {
  return (
    <RoutePlaceholder
      title="Admin dashboard"
      description="Coordinate the KSS pilot across students and schools."
    />
  );
}
