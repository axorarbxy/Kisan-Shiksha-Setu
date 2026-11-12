import type { Metadata } from "next";
import { SchoolDashboardView } from "@/features/dashboards/components/school-pages";

export const metadata: Metadata = { title: "School dashboard" };

export default function SchoolDashboardPage() {
  return <SchoolDashboardView />;
}
