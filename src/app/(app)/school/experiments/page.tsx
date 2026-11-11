import type { Metadata } from "next";
import { RoutePlaceholder } from "@/components/shared/route-placeholder";

export const metadata: Metadata = { title: "Experiments" };

export default function SchoolExperimentsPage() {
  return (
    <RoutePlaceholder
      title="Experiments"
      description="Coordinate hands-on agriculture experiments at your school."
    />
  );
}
