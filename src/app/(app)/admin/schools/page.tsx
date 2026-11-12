import type { Metadata } from "next";
import { AdminSchoolsView } from "@/features/dashboards/components/admin-pages";

export const metadata: Metadata = { title: "Schools" };

export default function AdminSchoolsPage() {
  return <AdminSchoolsView />;
}
