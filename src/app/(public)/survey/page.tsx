import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, ClipboardCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { surveyPageCopy } from "@/content/public-pages";

export const metadata: Metadata = {
  alternates: { canonical: "/survey" },
  title: "Validation survey",
  description:
    "Share your perspective in the Kisan Shiksha Setu validation survey and follow pilot learning as it develops.",
  openGraph: {
    title: "Kisan Shiksha Setu validation survey",
    description:
      "Help shape the questions and priorities for the KSS pilot.",
  },
};

export default function SurveyPage() {
  const surveyUrl = process.env.NEXT_PUBLIC_SURVEY_URL;
  return (
    <main className="bg-sand-50 px-4 py-14 sm:px-6 sm:py-20">
      <div className="mx-auto max-w-6xl">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-forest-700">
          {surveyPageCopy.eyebrow}
        </p>
        <h1 className="font-display mt-4 max-w-3xl text-5xl leading-tight text-forest-900 sm:text-6xl">
          {surveyPageCopy.title}
        </h1>
        <p className="mt-5 max-w-2xl text-lg leading-8 text-muted-foreground">
          {surveyPageCopy.intro}
        </p>

        <section
          aria-labelledby="survey-form-title"
          className="mt-10 rounded-3xl border border-sand-200 bg-white p-5 sm:p-8"
        >
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-4">
              <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-forest-100 text-forest-700">
                <ClipboardCheck aria-hidden="true" className="size-6" />
              </span>
              <div>
                <h2
                  className="text-xl font-semibold text-forest-900"
                  id="survey-form-title"
                >
                  {surveyPageCopy.formTitle}
                </h2>
                <p className="mt-1 max-w-xl text-sm leading-6 text-muted-foreground">
                  {surveyPageCopy.formDescription}
                </p>
              </div>
            </div>
            {surveyUrl && (
              <Button
                asChild
                className="w-full sm:w-auto"
                variant="outline"
              >
                <a href={surveyUrl} rel="noreferrer" target="_blank">
                  {surveyPageCopy.openSurvey} <ArrowUpRight aria-hidden="true" />
                </a>
              </Button>
            )}
          </div>
          {surveyUrl ? (
            <iframe
              className="mt-7 min-h-[680px] w-full rounded-2xl border border-sand-200 bg-sand-50"
              loading="lazy"
              referrerPolicy="strict-origin-when-cross-origin"
              src={surveyUrl}
              title="Kisan Shiksha Setu validation survey"
            />
          ) : (
            <div className="mt-7 grid min-h-64 place-items-center rounded-2xl border border-dashed border-sand-400 bg-sand-50 p-6 text-center">
              <p className="max-w-md text-sm leading-6 text-muted-foreground">
                {surveyPageCopy.configurationNotice}{" "}
                <code className="rounded bg-sand-200 px-1.5 py-0.5 text-forest-800">
                  NEXT_PUBLIC_SURVEY_URL
                </code>{" "}
                {surveyPageCopy.configurationSuffix}
              </p>
            </div>
          )}
        </section>

        <section
          aria-labelledby="survey-results-title"
          className="mt-7 rounded-3xl border border-sand-200 bg-white p-5 sm:p-8"
        >
          <h2
            className="text-xl font-semibold text-forest-900"
            id="survey-results-title"
          >
            {surveyPageCopy.resultsTitle}
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
            {surveyPageCopy.resultsDescription}
          </p>
          <div
            aria-label="Live results chart will appear here"
            className="mt-6 grid min-h-64 place-items-center rounded-2xl border border-dashed border-sand-400 bg-sand-50 p-6 text-center"
            role="status"
          >
            <p className="text-sm font-medium text-forest-700">
              {surveyPageCopy.resultsPlaceholder}
            </p>
          </div>
        </section>

        <p className="mt-8 text-sm text-muted-foreground">
          {surveyPageCopy.evidencePrompt}{" "}
          <Link
            className="font-medium text-forest-700 underline underline-offset-4"
            href="/evidence"
          >
            {surveyPageCopy.evidenceLink}
          </Link>
          .
        </p>
      </div>
    </main>
  );
}
