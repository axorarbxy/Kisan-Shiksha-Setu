import { PageHeader } from "@/components/shared/page-header";

export function RoutePlaceholder({
  title,
  description = "This space is ready for the next stage of Kisan Shiksha Setu.",
}: {
  title: string;
  description?: string;
}) {
  return (
    <div className="mx-auto w-full max-w-6xl space-y-8 px-6 py-12 md:py-16">
      <PageHeader title={title} description={description} />
    </div>
  );
}
