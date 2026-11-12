import type { Metadata } from "next";
import { AdminStudentsView } from "@/features/dashboards/components/admin-pages";

export const metadata: Metadata = { title: "RAWE students" };

export default function AdminStudentsPage() {
  return <AdminStudentsView />;
}
