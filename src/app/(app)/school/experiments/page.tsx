import type { Metadata } from "next";
import { ExperimentListView } from "@/features/dashboards/components/experiment-pages";

export const metadata: Metadata = { title: "Experiments" };

export default function SchoolExperimentsPage() {
  return <ExperimentListView role="school" />;
}
