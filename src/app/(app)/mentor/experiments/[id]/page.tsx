import type { Metadata } from "next";
import { RoutePlaceholder } from "@/components/shared/route-placeholder";

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

export default async function MentorExperimentPage({
  params,
}: ExperimentPageProps) {
  const { id } = await params;
  return (
    <RoutePlaceholder
      title={`Experiment ${id}`}
      description="View experiment details, progress, and observations."
    />
  );
}
