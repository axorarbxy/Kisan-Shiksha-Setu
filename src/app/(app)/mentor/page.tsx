import type { Metadata } from "next";
import { MentorDashboardView } from "@/features/dashboards/components/mentor-pages";

export const metadata: Metadata = { title: "Mentor dashboard" };

export default function MentorDashboardPage() {
  return <MentorDashboardView />;
}
