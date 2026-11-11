import type { Metadata } from "next";
import { RoutePlaceholder } from "@/components/shared/route-placeholder";

export const metadata: Metadata = { title: "Experiments" };

export default function MentorExperimentsPage() {
  return (
    <RoutePlaceholder
      title="Experiments"
      description="Plan and follow classroom agriculture experiments."
    />
  );
}
