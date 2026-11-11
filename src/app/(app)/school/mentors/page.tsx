import type { Metadata } from "next";
import { RoutePlaceholder } from "@/components/shared/route-placeholder";

export const metadata: Metadata = { title: "Mentors" };

export default function SchoolMentorsPage() {
  return (
    <RoutePlaceholder
      title="Mentors"
      description="Meet the mentors supporting your school."
    />
  );
}
