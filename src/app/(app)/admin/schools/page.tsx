import type { Metadata } from "next";
import { RoutePlaceholder } from "@/components/shared/route-placeholder";

export const metadata: Metadata = { title: "Schools" };

export default function AdminSchoolsPage() {
  return (
    <RoutePlaceholder
      title="Schools"
      description="Manage participating rural schools."
    />
  );
}
