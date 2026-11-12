import type { Metadata } from "next";
import { SchoolMentorsView } from "@/features/dashboards/components/school-pages";

export const metadata: Metadata = { title: "Mentors" };

export default function SchoolMentorsPage() {
  return <SchoolMentorsView />;
}
