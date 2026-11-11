import type { Metadata } from "next";
import { RoutePlaceholder } from "@/components/shared/route-placeholder";

export const metadata: Metadata = { title: "Evidence" };

export default function EvidencePage() {
  return (
    <RoutePlaceholder
      title="Evidence"
      description="Explore the research and evidence informing the Kisan Shiksha Setu approach."
    />
  );
}
