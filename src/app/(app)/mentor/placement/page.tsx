import type { Metadata } from "next";
import { MentorPlacementView } from "@/features/dashboards/components/mentor-pages";

export const metadata: Metadata = { title: "Placement" };

export default function MentorPlacementPage() {
  return <MentorPlacementView />;
}
