import type { Metadata } from "next";
import { RoutePlaceholder } from "@/components/shared/route-placeholder";

export const metadata: Metadata = { title: "Placement" };

export default function MentorPlacementPage() {
  return (
    <RoutePlaceholder
      title="Placement"
      description="Track your placement journey and school engagement."
    />
  );
}
