import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RoleJourneyTabs } from "@/components/public/role-journey-tabs";
import { howItWorksCopy, howSteps } from "@/content/public-pages";

export const metadata: Metadata = {
  alternates: { canonical: "/how-it-works" },
  title: "How it works",
  description:
    "See how Kisan Shiksha Setu connects agriculture student fieldwork with rural classroom experiments.",
  openGraph: {
    title: "How Kisan Shiksha Setu works",
    description:
      "A practical four-step path from local matching to shared classroom experiments.",
  },
};

export default function HowItWorksPage() {
  return (
    <main>
      <section className="bg-sand-50 px-4 py-14 sm:px-6 sm:py-20">
        <div className="mx-auto max-w-6xl">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-forest-700">
            {howItWorksCopy.eyebrow}
          </p>
          <h1 className="font-display mt-4 max-w-3xl text-5xl leading-tight text-forest-900 sm:text-6xl">
            {howItWorksCopy.title}
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-muted-foreground">
            {howItWorksCopy.intro}
          </p>
          <ol className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {howSteps.map((step) => (
              <li className="rounded-2xl border border-sand-300 bg-white p-5" key={step.number}>
                <span className="font-display text-4xl text-forest-700">
                  {step.number}
                </span>
                <h2 className="mt-4 text-xl font-semibold text-forest-900">
                  {step.title}
                </h2>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {step.description}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="px-4 py-14 sm:px-6 sm:py-20">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8 max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-forest-700">
              {howItWorksCopy.perspectiveEyebrow}
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-forest-900 sm:text-4xl">
              {howItWorksCopy.perspectiveTitle}
            </h2>
          </div>
          <RoleJourneyTabs />
        </div>
      </section>

      <section className="bg-forest-900 px-4 py-12 text-sand-50 sm:px-6">
        <div className="mx-auto flex max-w-6xl flex-col justify-between gap-5 sm:flex-row sm:items-center">
          <p className="max-w-2xl text-lg leading-8">
            {howItWorksCopy.cta}
          </p>
          <Button asChild size="lg" variant="accent">
            <Link href="/register?role=mentor">
              {howItWorksCopy.ctaAction} <ArrowRight aria-hidden="true" />
            </Link>
          </Button>
        </div>
      </section>
    </main>
  );
}
