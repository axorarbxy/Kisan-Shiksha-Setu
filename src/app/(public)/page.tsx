import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import {
  ArrowDownRight,
  ArrowRight,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  evidenceCards,
  homeCopy,
  howSteps,
  problemGroups,
  roleCards,
  whyNearPeer,
} from "@/content/public-pages";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
  title: "Where fieldwork becomes a classroom",
  description:
    "Kisan Shiksha Setu connects agriculture students and rural classrooms through mentoring and hands-on farm experiments.",
  openGraph: {
    title: "Kisan Shiksha Setu — Where fieldwork becomes a classroom",
    description:
      "Agriculture students teach rural classrooms through practical community farm experiments.",
    type: "website",
  },
};

function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="mb-9 max-w-2xl space-y-3">
      <p className="text-sm font-semibold uppercase tracking-[0.16em] text-forest-700">
        {eyebrow}
      </p>
      <h2 className="text-3xl font-semibold tracking-tight text-forest-900 sm:text-4xl">
        {title}
      </h2>
      {description && (
        <p className="text-base leading-7 text-muted-foreground">
          {description}
        </p>
      )}
    </div>
  );
}

export default function HomePage() {
  return (
    <main>
      <section className="bg-sand-50">
        <div className="mx-auto grid max-w-6xl items-center gap-8 px-4 py-12 sm:px-6 sm:py-16 md:grid-cols-[1.05fr_0.95fr] md:gap-10 md:py-20">
          <div className="space-y-6">
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-forest-700">
              {homeCopy.hero.eyebrow}
            </p>
            <h1 className="font-display max-w-xl text-5xl leading-[1.06] text-forest-900 sm:text-6xl md:text-7xl">
              {homeCopy.hero.headline}
            </h1>
            <p className="max-w-xl text-lg leading-8 text-forest-800">
              {homeCopy.hero.description}
            </p>
            <div className="flex flex-col gap-3 pt-1 sm:flex-row">
              <Button asChild className="w-full sm:w-auto" size="lg" variant="accent">
                <Link href="/register?role=mentor">
                  {homeCopy.hero.primaryAction} <ArrowRight aria-hidden="true" />
                </Link>
              </Button>
              <Button asChild className="w-full sm:w-auto" size="lg" variant="outline">
                <Link href="/how-it-works">
                  {homeCopy.hero.secondaryAction} <ArrowDownRight aria-hidden="true" />
                </Link>
              </Button>
            </div>
          </div>
          <div className="relative mx-auto w-full max-w-[540px]">
            <Image
              alt={homeCopy.hero.illustrationAlt}
              className="h-auto w-full rounded-[2rem] shadow-sm"
              height={620}
              priority
              src="/fieldwork-classroom.svg"
              unoptimized
              width={720}
            />
            <p className="absolute right-4 bottom-4 rounded-full border border-white/70 bg-sand-50/95 px-4 py-2 text-xs font-medium text-forest-800 shadow-sm">
              {homeCopy.hero.illustrationCaption}
            </p>
          </div>
        </div>
      </section>

      <section className="bg-white px-4 py-16 sm:px-6 sm:py-20">
        <div className="mx-auto max-w-6xl">
          <SectionHeading
            eyebrow={homeCopy.problem.eyebrow}
            title={homeCopy.problem.title}
            description={homeCopy.problem.description}
          />
          <div className="grid gap-5 md:grid-cols-2">
            {problemGroups.map((group) => (
              <article
                className="scroll-reveal rounded-3xl border border-sand-200 bg-sand-50 p-6 sm:p-8"
                key={group.eyebrow}
              >
                <p className="text-sm font-semibold text-forest-700">
                  {group.eyebrow}
                </p>
                <h3 className="mt-3 text-2xl font-semibold tracking-tight text-forest-900">
                  {group.title}
                </h3>
                <ul className="mt-6 space-y-4">
                  {group.points.map((point) => (
                    <li className="flex gap-3 text-sm leading-6 text-forest-800" key={point}>
                      <span className="mt-2 size-2 shrink-0 rounded-full bg-forest-500" />
                      {point}
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
          <p className="mt-5 text-xs leading-5 text-muted-foreground">
            {homeCopy.problem.evidenceLead}{" "}
            <Link className="underline underline-offset-4 hover:text-forest-700" href="/evidence">
              {homeCopy.problem.evidenceLink}
            </Link>
            {homeCopy.problem.evidenceTail}
          </p>
        </div>
      </section>

      <section className="bg-sand-100 px-4 py-16 sm:px-6 sm:py-20">
        <div className="mx-auto max-w-6xl">
          <SectionHeading
            description={homeCopy.steps.description}
            eyebrow={homeCopy.steps.eyebrow}
            title={homeCopy.steps.title}
          />
          <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {howSteps.map((step) => (
              <li className="scroll-reveal rounded-2xl border border-sand-300 bg-sand-50 p-5 sm:p-6" key={step.number}>
                <span className="font-display text-5xl leading-none text-forest-700">
                  {step.number}
                </span>
                <h3 className="mt-5 text-xl font-semibold text-forest-900">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {step.description}
                </p>
              </li>
            ))}
          </ol>
          <Button asChild className="mt-6" variant="outline">
            <Link href="/how-it-works">
              {homeCopy.steps.link} <ChevronRight aria-hidden="true" />
            </Link>
          </Button>
        </div>
      </section>

      <section className="bg-sand-50 px-4 py-16 sm:px-6 sm:py-20">
        <div className="mx-auto max-w-6xl">
          <SectionHeading
            eyebrow={homeCopy.why.eyebrow}
            title={homeCopy.why.title}
          />
          <div className="grid gap-4 md:grid-cols-3">
            {whyNearPeer.map(({ icon: Icon, ...item }) => (
              <article className="scroll-reveal rounded-2xl border border-sand-200 bg-white p-6" key={item.title}>
                <span className="grid size-11 place-items-center rounded-xl bg-forest-100 text-forest-700">
                  <Icon aria-hidden="true" className="size-5" />
                </span>
                <h3 className="mt-5 text-lg font-semibold text-forest-900">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {item.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white px-4 py-16 sm:px-6 sm:py-20">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <SectionHeading
              eyebrow={homeCopy.evidence.eyebrow}
              title={homeCopy.evidence.title}
            />
            <Button asChild className="mb-9" variant="outline">
              <Link href="/evidence">{homeCopy.evidence.link}</Link>
            </Button>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {evidenceCards.map((card) => (
              <Link
                className="scroll-reveal group rounded-2xl border border-sand-200 bg-sand-50 p-5 transition-colors hover:border-forest-300 hover:bg-forest-50"
                href={card.href}
                key={card.title}
              >
                <span className="text-xs font-semibold uppercase tracking-[0.13em] text-forest-600">
                  {card.label}
                </span>
                <h3 className="mt-4 font-semibold text-forest-900">
                  {card.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {card.summary}
                </p>
                <span className="mt-5 inline-flex items-center gap-1 text-sm font-medium text-forest-700">
                  {card.linkLabel} <ArrowRight aria-hidden="true" className="size-4 transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-sand-100 px-4 py-16 sm:px-6 sm:py-20">
        <div className="mx-auto max-w-6xl">
          <SectionHeading
            eyebrow={homeCopy.roles.eyebrow}
            title={homeCopy.roles.title}
          />
          <div className="grid gap-4 md:grid-cols-3">
            {roleCards.map(({ icon: Icon, ...role }) => (
              <article className="scroll-reveal flex flex-col rounded-2xl border border-sand-300 bg-sand-50 p-6" key={role.role}>
                <Icon aria-hidden="true" className="size-6 text-forest-700" />
                <h3 className="mt-4 text-xl font-semibold text-forest-900">
                  {role.role}
                </h3>
                <p className="mt-2 flex-1 text-sm leading-6 text-muted-foreground">
                  {role.description}
                </p>
                <Button asChild className="mt-5 self-start" variant="outline">
                  <Link href={role.href}>
                    {role.action}
                  </Link>
                </Button>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-forest-900 px-4 py-14 text-sand-50 sm:px-6 sm:py-16">
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
          <div className="max-w-2xl space-y-2">
            <p className="text-sm font-medium uppercase tracking-[0.16em] text-forest-200">
              {homeCopy.finalCta.eyebrow}
            </p>
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              {homeCopy.finalCta.title}
            </h2>
            <p className="leading-7 text-sand-200">
              {homeCopy.finalCta.description}
            </p>
          </div>
          <Button asChild className="w-full sm:w-auto" size="lg" variant="accent">
            <Link href="/register?role=mentor">{homeCopy.finalCta.action}</Link>
          </Button>
        </div>
      </section>
    </main>
  );
}
