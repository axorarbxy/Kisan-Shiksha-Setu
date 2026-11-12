import type { Metadata } from "next";
import { MentorSchoolsView } from "@/features/dashboards/components/mentor-pages";

export const metadata: Metadata = { title: "Matched schools" };

export default function MentorSchoolsPage() {
  return <MentorSchoolsView />;
}
