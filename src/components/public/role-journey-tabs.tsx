"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { journeyCopy, roleJourneys } from "@/content/public-pages";

export function RoleJourneyTabs() {
  return (
    <Tabs className="gap-8" defaultValue="mentor">
      <TabsList
        aria-label={journeyCopy.tabsLabel}
        className="grid h-auto w-full grid-cols-3 rounded-xl bg-sand-200 p-1"
      >
        {journeyCopy.tabs.map((role) => (
          <TabsTrigger
            className="min-h-11 whitespace-normal px-2 text-center data-[state=active]:bg-white data-[state=active]:text-forest-800"
            key={role.value}
            value={role.value}
          >
            {role.label}
          </TabsTrigger>
        ))}
      </TabsList>
      {journeyCopy.tabs.map(({ label, value }) => {
        const journey = roleJourneys[value];
        return (
          <TabsContent
            className="grid gap-8 md:grid-cols-[0.8fr_1.2fr]"
            key={value}
            value={value}
          >
            <div className="space-y-4">
              <p className="text-sm font-semibold uppercase tracking-[0.14em] text-forest-700">
                {label}
              </p>
              <h2 className="text-3xl font-semibold tracking-tight text-forest-900 sm:text-4xl">
                {journey.title}
              </h2>
              <p className="max-w-md leading-7 text-muted-foreground">
                {journey.intro}
              </p>
              <div className="rounded-2xl border border-sand-300 bg-sand-100 p-5">
                <p className="font-semibold text-forest-900">
                  {journeyCopy.rhythmTitle}
                </p>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {journeyCopy.rhythmDescription}
                </p>
              </div>
            </div>
            <ol className="space-y-3">
              {journey.steps.map((step, index) => (
                <li
                  className="flex gap-4 rounded-2xl border border-sand-200 bg-white p-5"
                  key={step}
                >
                  <span
                    aria-hidden="true"
                    className="font-display text-3xl leading-none text-forest-700"
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <p className="pt-1 leading-6 text-forest-800">{step}</p>
                </li>
              ))}
            </ol>
          </TabsContent>
        );
      })}
    </Tabs>
  );
}
