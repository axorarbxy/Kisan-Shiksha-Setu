import type { Metadata } from "next";
import { ExperimentDetailView } from "@/features/dashboards/components/experiment-pages";

export const instant = false;

type ExperimentPageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({
  params,
}: ExperimentPageProps): Promise<Metadata> {
  const { id } = await params;
  return { title: `Experiment ${id}` };
}

export default async function SchoolExperimentPage({
  params,
}: ExperimentPageProps) {
  const { id } = await params;
  return <ExperimentDetailView id={id} role="school" />;
}
