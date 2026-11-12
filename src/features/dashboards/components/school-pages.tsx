"use client";

import Link from "next/link";
import { CalendarDays, GraduationCap, Leaf, UserRound } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/shared/page-header";
import { QueryState } from "@/components/shared/query-state";
import { StatCard } from "@/components/shared/stat-card";
import { appStrings } from "@/content/strings";
import { useMe } from "@/features/auth/hooks";
import { flattenPages } from "@/features/dashboards/components/shared";
import { useObservationTotals } from "@/features/dashboards/components/query-hooks";
import { useExperiments } from "@/features/experiments/hooks";
import { useMatches } from "@/features/matches/hooks";
import { useMentors } from "@/features/mentors/hooks";
import { useSchools } from "@/features/schools/hooks";

export function SchoolDashboardView() {
  const me = useMe();
  const matchesQuery = useMatches({ mine: "true", limit: 50 });
  const experimentsQuery = useExperiments({ limit: 50 });
  const mentorsQuery = useMentors({ limit: 50 });
  const schoolsQuery = useSchools({ limit: 50 });
  const matches = flattenPages(matchesQuery.data?.pages);
  const matchIds = new Set(matches.map((match) => match.id));
  const experiments = flattenPages(experimentsQuery.data?.pages).filter((experiment) => matchIds.has(experiment.matchId));
  const activeExperiments = experiments.filter((experiment) => experiment.status === "active");
  const observationTotals = useObservationTotals(experiments.map((experiment) => experiment.id));
  const mentors = flattenPages(mentorsQuery.data?.pages);
  const mentor = mentors.find((item) => matches.some((match) => match.mentorId === item.userId));
  const school = flattenPages(schoolsQuery.data?.pages).find((item) => matches.some((match) => match.schoolId === item.id));
  const queries = [me, matchesQuery, experimentsQuery, mentorsQuery, schoolsQuery];
  const error = queries.find((query) => query.error)?.error as Error | null | undefined;
  const pending = queries.some((query) => query.isPending);
  const empty = !pending && matches.length === 0;

  return (
    <div className="space-y-6">
      <PageHeader description={appStrings.school.dashboard} title={appStrings.school.dashboardTitle} />
      <QueryState
        emptyAction={<Button asChild className="min-h-11" variant="accent"><Link href="/school/mentors">{appStrings.mentor.meetingCoordination}</Link></Button>}
        emptyDescription={appStrings.school.matchPendingDescription}
        emptyTitle={appStrings.school.mentorsPending}
        error={error ?? observationTotals.error ?? null}
        hasData={matches.length > 0}
        isEmpty={empty}
        isPending={pending || observationTotals.isPending}
        onRetry={() => { queries.forEach((query) => void query.refetch()); void observationTotals.refetch(); }}
      >
        <div className="space-y-6">
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            <StatCard label={appStrings.school.activeExperiments} value={String(activeExperiments.length)} />
            <StatCard label={appStrings.school.engagement} value={String(observationTotals.count)} delta={appStrings.school.classLogs} />
            <StatCard label={appStrings.school.nextSession} value={appStrings.school.scheduleToBeSet} delta={appStrings.school.coordinateSession} />
          </div>
          <div className="grid gap-4 lg:grid-cols-2">
            <Card>
              <CardHeader><CardTitle className="flex items-center gap-2"><UserRound aria-hidden="true" className="size-4" />{appStrings.school.assignedMentor}</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                {mentor ? (
                  <>
                    <p className="font-medium">{mentor.name ?? appStrings.school.mentorFallback}</p>
                    <p className="text-muted-foreground text-sm">{mentor.college} · {appStrings.school.mentorHoursPerWeek(mentor.hoursPerWeek)}</p>
                    <div className="flex flex-wrap gap-2">{mentor.topics.map((topic) => <Badge key={topic} variant="neutral">{topic}</Badge>)}</div>
                    <Button asChild className="min-h-11" variant="outline"><Link href="/school/mentors">{appStrings.school.viewMentorDetails}</Link></Button>
                  </>
                ) : <p className="text-muted-foreground">{appStrings.school.noMentor}</p>}
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle className="flex items-center gap-2"><GraduationCap aria-hidden="true" className="size-4" />{appStrings.school.schoolName}</CardTitle></CardHeader>
              <CardContent className="space-y-2">
                <p className="font-medium">{school?.name ?? me.data?.name}</p>
                {school && <p className="text-muted-foreground text-sm">{school.village}, {school.district} · {appStrings.common.studentCount(school.studentCount)}</p>}
                <p className="text-muted-foreground text-sm">{appStrings.school.classTotalsOnly}</p>
              </CardContent>
            </Card>
          </div>
          <Card>
            <CardHeader><CardTitle>{appStrings.school.currentExperiments}</CardTitle></CardHeader>
            <CardContent>
              {experiments.length ? (
                <ul className="divide-border divide-y">
                  {experiments.slice(0, 5).map((experiment) => (
                    <li className="flex flex-wrap items-center justify-between gap-3 py-3 first:pt-0 last:pb-0" key={experiment.id}>
                      <Link className="min-h-11 inline-flex items-center font-medium underline-offset-4 hover:underline" href={`/school/experiments/${experiment.id}`}>{experiment.title}</Link>
                      <Badge variant={experiment.status === "active" ? "success" : "neutral"}>{appStrings.common.statusLabel(experiment.status)}</Badge>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="space-y-3">
                  <p className="text-muted-foreground">{appStrings.school.noExperiments}</p>
                  <Button asChild className="min-h-11" variant="outline"><Link href="/school/experiments">{appStrings.school.viewExperiments}</Link></Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </QueryState>
    </div>
  );
}

export function SchoolMentorsView() {
  const matchesQuery = useMatches({ mine: "true", limit: 50 });
  const mentorsQuery = useMentors({ limit: 50 });
  const schoolsQuery = useSchools({ limit: 50 });
  const matches = flattenPages(matchesQuery.data?.pages);
  const mentors = flattenPages(mentorsQuery.data?.pages);
  const schools = flattenPages(schoolsQuery.data?.pages);
  const paired = matches.map((match) => ({
    match,
    mentor: mentors.find((item) => item.userId === match.mentorId),
    school: schools.find((item) => item.id === match.schoolId),
  }));
  const error = matchesQuery.error ?? mentorsQuery.error ?? schoolsQuery.error;

  return (
    <div className="space-y-6">
      <PageHeader description={appStrings.school.mentorsDescription} title={appStrings.school.mentors} />
      <QueryState
        emptyAction={<Button asChild className="min-h-11" variant="outline"><Link href="/school">{appStrings.school.backToDashboard}</Link></Button>}
        emptyDescription={appStrings.school.noMentor}
        emptyTitle={appStrings.school.mentorsPending}
        error={error}
        isEmpty={!matchesQuery.isPending && !mentorsQuery.isPending && !schoolsQuery.isPending && paired.length === 0}
        isPending={matchesQuery.isPending || mentorsQuery.isPending || schoolsQuery.isPending}
        onRetry={() => { void matchesQuery.refetch(); void mentorsQuery.refetch(); void schoolsQuery.refetch(); }}
      >
        <div className="grid gap-4 lg:grid-cols-2">
          {paired.map(({ match, mentor, school }) => (
            <Card key={match.id}>
              <CardHeader>
                <CardTitle>{mentor?.name ?? appStrings.school.mentorFallback}</CardTitle>
                <p className="text-muted-foreground text-sm">{school?.name ?? appStrings.school.matchedSchool}</p>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="flex items-center gap-2"><GraduationCap aria-hidden="true" className="size-4" />{mentor?.college ?? appStrings.school.collegePending}</p>
                <p className="flex items-center gap-2"><CalendarDays aria-hidden="true" className="size-4" />{appStrings.school.mentorHoursPerWeek(mentor?.hoursPerWeek ?? 0)}</p>
                <div className="flex flex-wrap gap-2">{(mentor?.topics ?? []).map((topic) => <Badge key={topic} variant="neutral"><Leaf aria-hidden="true" />{topic}</Badge>)}</div>
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <Badge variant={match.status === "active" ? "success" : "info"}>{appStrings.common.statusLabel(match.status)}</Badge>
                  <Button className="min-h-11" onClick={() => toast.info(appStrings.school.messagingToast)} variant="outline">{appStrings.school.messageCoordinator}</Button>
                </div>
                <p className="text-muted-foreground text-xs">{appStrings.school.messagingUnavailable}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </QueryState>
    </div>
  );
}
