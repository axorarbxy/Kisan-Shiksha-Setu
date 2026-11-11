import type { Metadata } from "next";
import { evidencePageCopy, evidenceSummaries } from "@/content/public-pages";

export const metadata: Metadata = {
  alternates: { canonical: "/evidence" },
  title: "Evidence",
  description:
    "Research summaries informing Kisan Shiksha Setu’s near-peer mentoring and experiential learning approach.",
  openGraph: {
    title: "Evidence for the Kisan Shiksha Setu approach",
    description:
      "Four research summaries and how they inform the KSS pilot.",
  },
};

export default function EvidencePage() {
  return (
    <main className="bg-sand-50 px-4 py-14 sm:px-6 sm:py-20">
      <div className="mx-auto max-w-6xl">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-forest-700">
          {evidencePageCopy.eyebrow}
        </p>
        <h1 className="font-display mt-4 max-w-3xl text-5xl leading-tight text-forest-900 sm:text-6xl">
          {evidencePageCopy.title}
        </h1>
        <p className="mt-5 max-w-2xl text-lg leading-8 text-muted-foreground">
          {evidencePageCopy.intro}
        </p>

        <div className="mt-10 grid gap-5 lg:grid-cols-2">
          {evidenceSummaries.map((paper) => (
            <article
              className="scroll-reveal flex flex-col rounded-3xl border border-sand-200 bg-white p-6 sm:p-8"
              key={paper.title}
            >
              <p className="text-sm font-semibold uppercase tracking-[0.12em] text-forest-700">
                {paper.authors}
              </p>
              <h2 className="mt-3 text-xl font-semibold leading-7 text-forest-900">
                <cite className="not-italic">{paper.title}</cite>
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">
                {paper.citation}
                {paper.abstractBased && (
                  <span className="ml-2 inline-flex rounded-full bg-sand-100 px-2.5 py-1 text-xs font-medium text-forest-800">
                    {evidencePageCopy.abstractLabel}
                  </span>
                )}
              </p>
              <div className="mt-6 grid gap-4">
                <div>
                  <h3 className="text-sm font-semibold text-forest-900">
                    {evidencePageCopy.findingLabel}
                  </h3>
                  <p className="mt-1 text-sm leading-6 text-muted-foreground">
                    {paper.finding}
                  </p>
                </div>
                <div className="rounded-2xl bg-sand-50 p-4">
                  <h3 className="text-sm font-semibold text-forest-900">
                    {evidencePageCopy.relevanceLabel}
                  </h3>
                  <p className="mt-1 text-sm leading-6 text-muted-foreground">
                    {paper.relevance}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>
        <p className="mt-7 rounded-2xl border border-sand-300 bg-sand-100 p-4 text-sm leading-6 text-forest-800">
          {evidencePageCopy.summaryNote}
        </p>
      </div>
    </main>
  );
}
