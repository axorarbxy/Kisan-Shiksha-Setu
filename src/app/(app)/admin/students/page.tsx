import type { Metadata } from "next";
import { RoutePlaceholder } from "@/components/shared/route-placeholder";

export const metadata: Metadata = { title: "RAWE students" };

export default function AdminStudentsPage() {
  return (
    <RoutePlaceholder
      title="RAWE students"
      description="Track student participation and placement progress."
    />
  );
}
