import type { Metadata } from "next";
import { RoutePlaceholder } from "@/components/shared/route-placeholder";

export const metadata: Metadata = { title: "Survey" };

export default function SurveyPage() {
  return (
    <RoutePlaceholder
      title="Survey"
      description="Share your perspective to help shape the Kisan Shiksha Setu pilot."
    />
  );
}
