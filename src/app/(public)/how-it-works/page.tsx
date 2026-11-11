import type { Metadata } from "next";
import { RoutePlaceholder } from "@/components/shared/route-placeholder";

export const metadata: Metadata = { title: "How it works" };

export default function HowItWorksPage() {
  return (
    <RoutePlaceholder
      title="How it works"
      description="A clear path from agricultural learning to meaningful school-based practice."
    />
  );
}
