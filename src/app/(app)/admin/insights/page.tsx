import type { Metadata } from "next";
import { AdminInsightsView } from "@/features/dashboards/components/admin-pages";

export const metadata: Metadata = { title: "Insights" };

export default function AdminInsightsPage() {
  return <AdminInsightsView />;
}
