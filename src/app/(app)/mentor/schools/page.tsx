import type { Metadata } from "next";
import { RoutePlaceholder } from "@/components/shared/route-placeholder";

export const metadata: Metadata = { title: "Matched schools" };

export default function MentorSchoolsPage() {
  return (
    <RoutePlaceholder
      title="Matched schools"
      description="See the schools matched with your interests and experience."
    />
  );
}
