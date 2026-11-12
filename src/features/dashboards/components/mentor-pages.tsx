"use client";

import Link from "next/link";
import { useEffect, useState, type FormEvent } from "react";
import { MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable, type DataTableColumn } from "@/components/shared/data-table";
import { PageHeader } from "@/components/shared/page-header";
import { QueryState } from "@/components/shared/query-state";
import { StatCard } from "@/components/shared/stat-card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { appStrings } from "@/content/strings";
import { useExperiments } from "@/features/experiments/hooks";
import { useMatches, useCreateMatch } from "@/features/matches/hooks";
import { useMentor, useUpdateMentor } from "@/features/mentors/hooks";
import { useSchools } from "@/features/schools/hooks";
import { filterBySearch, flattenPages, paginate, parseSortState, SearchFilter, serializeSortState, StatusFilter, useUrlFilters } from "@/features/dashboards/components/shared";
import { useMe } from "@/features/auth/hooks";
import { QueryState as QueryPanel } from "@/components/shared/query-state";
import { useObservationTotals } from "@/features/dashboards/components/query-hooks";

export function MentorDashboardView() {
  const me = useMe();
  const mentorQuery = useMentor(me.data?.id ?? "");
  const matchesQuery = useMatches({ mine: "true", limit: 50 });
  const experimentsQuery = useExperiments({ limit: 50 });
  const schoolsQuery = useSchools({ limit: 50 });
  const matchIds = new Set(flattenPages(matchesQuery.data?.pages).map((match) => match.id));
  const experimentRows = flattenPages(experimentsQuery.data?.pages).filter((experiment) => matchIds.has(experiment.matchId));
  const matches = flattenPages(matchesQuery.data?.pages);
  const observationTotals = useObservationTotals(experimentRows.map((item) => item.id));
  const schoolById = new Map(flattenPages(schoolsQuery.data?.pages).map((school) => [school.id, school]));
  const nextStep = !mentorQuery.data?.rawePlacement
    ? { text: appStrings.mentor.noPlacement, href: "/mentor/placement", label: appStrings.mentor.placementAction }
    : matches.length === 0
      ? { text: appStrings.mentor.noMatches, href: "/mentor/schools", label: appStrings.mentor.requestMatch }
      : experimentRows.length === 0
        ? { text: appStrings.mentor.noExperimentsNextStep, href: "/mentor/experiments", label: appStrings.mentor.newExperiment }
        : { text: appStrings.mentor.observationNextStep, href: `/mentor/experiments/${experimentRows[0]?.id}`, label: appStrings.mentor.addObservation };
  const queries = [me, mentorQuery, matchesQuery, experimentsQuery, schoolsQuery];
  const error = (queries.find((query) => query.error)?.error as Error | null | undefined) ?? observationTotals.error;
  const pending = queries.some((query) => query.isPending) || observationTotals.isPending;
  const empty = !pending && matches.length === 0 && experimentRows.length === 0 && !mentorQuery.data?.rawePlacement;

  return (
    <div className="space-y-6">
      <PageHeader description={appStrings.mentor.dashboard} title={appStrings.mentor.dashboardTitle} />
      <QueryPanel
        emptyAction={<Button asChild className="min-h-11" variant="accent"><Link href={nextStep.href}>{nextStep.label}</Link></Button>}
        emptyDescription={appStrings.mentor.noPlacement}
        emptyTitle={appStrings.mentor.dashboardTitle}
        error={error ?? null}
        hasData={pending === false && !empty}
        isEmpty={empty}
        isPending={pending}
        onRetry={() => { queries.forEach((query) => void query.refetch()); void observationTotals.refetch(); }}
      >
        <div className="space-y-6">
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard delta={appStrings.mentor.estimatedHours(mentorQuery.data?.hoursPerWeek ?? 0)} label={appStrings.mentor.hours} value={`${(mentorQuery.data?.hoursPerWeek ?? 0) * 4} h`} />
            <StatCard label={appStrings.mentor.activeExperiments} value={String(experimentRows.filter((item) => item.status === "active").length)} />
            <StatCard label={appStrings.mentor.schoolsMatched} value={String(matches.filter((match) => match.status === "active").length)} />
            <StatCard label={appStrings.mentor.observations} value={String(observationTotals.count)} />
          </div>
          <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
            <Card>
              <CardHeader><CardTitle>{appStrings.mentor.nextStep}</CardTitle></CardHeader>
              <CardContent className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-muted-foreground max-w-xl">{nextStep.text}</p>
                <Button asChild className="min-h-11" variant="accent"><Link href={nextStep.href}>{nextStep.label}</Link></Button>
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>{appStrings.mentor.placement}</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                {mentorQuery.data?.rawePlacement ? (
                  <>
                    <p className="flex items-center gap-2"><MapPin aria-hidden="true" className="size-4" />{mentorQuery.data.rawePlacement.village}, {mentorQuery.data.rawePlacement.district}</p>
                    <p className="text-muted-foreground text-sm">{mentorQuery.data.rawePlacement.startDate} – {mentorQuery.data.rawePlacement.endDate}</p>
                    <Button asChild className="min-h-11" variant="outline"><Link href="/mentor/placement">{appStrings.mentor.viewPlacement}</Link></Button>
                  </>
                ) : <p className="text-muted-foreground">{appStrings.mentor.noPlacement}</p>}
              </CardContent>
            </Card>
          </div>
          <Card>
            <CardHeader><CardTitle>{appStrings.mentor.recentActivity}</CardTitle></CardHeader>
            <CardContent>
              {experimentRows.length ? (
                <ul className="divide-border divide-y">
                  {experimentRows.slice(0, 5).map((experiment) => {
                    const school = matches.find((item) => item.id === experiment.matchId);
                    return (
                      <li className="flex flex-wrap items-center justify-between gap-3 py-3 first:pt-0 last:pb-0" key={experiment.id}>
                        <div>
                          <Link className="font-medium underline-offset-4 hover:underline" href={`/mentor/experiments/${experiment.id}`}>{experiment.title}</Link>
                          <p className="text-muted-foreground text-sm">{school ? schoolById.get(school.schoolId)?.name ?? appStrings.mentor.matchedSchool : appStrings.mentor.experiment} · {experiment.createdAt.slice(0, 10)}</p>
                        </div>
                        <Badge variant={experiment.status === "active" ? "success" : "neutral"}>{appStrings.common.statusLabel(experiment.status)}</Badge>
                      </li>
                    );
                  })}
                </ul>
              ) : <p className="text-muted-foreground">{appStrings.mentor.activityEmpty}</p>}
            </CardContent>
          </Card>
        </div>
      </QueryPanel>
    </div>
  );
}

export function MentorPlacementView() {
  const me = useMe();
  const mentorQuery = useMentor(me.data?.id ?? "");
  const updateMentor = useUpdateMentor();
  const placement = mentorQuery.data?.rawePlacement;
  const [saving, setSaving] = useState(false);
  const [mountedAt, setMountedAt] = useState<number>();

  useEffect(() => {
    setMountedAt(Date.now());
  }, []);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const nextPlacement = {
      id: placement?.id ?? `placement-${me.data?.id ?? "new"}`,
      village: String(form.get("village") ?? "").trim(),
      district: String(form.get("district") ?? "").trim(),
      state: String(form.get("state") ?? "").trim(),
      startDate: String(form.get("startDate") ?? ""),
      endDate: String(form.get("endDate") ?? ""),
      status: "active" as const,
    };
    if (
      !nextPlacement.village ||
      !nextPlacement.district ||
      !nextPlacement.state ||
      !nextPlacement.startDate ||
      !nextPlacement.endDate ||
      nextPlacement.endDate <= nextPlacement.startDate
    ) {
      toast.error(appStrings.mentor.placementValidationError);
      return;
    }
    if (mountedAt) {
      nextPlacement.status =
        mountedAt < new Date(nextPlacement.startDate).getTime()
          ? "upcoming"
          : mountedAt > new Date(nextPlacement.endDate).getTime()
            ? "completed"
            : "active";
    }
    setSaving(true);
    try {
      await updateMentor.mutateAsync({
        id: me.data?.id ?? "",
        changes: { rawePlacement: nextPlacement },
      });
    } catch {
      // The mutation hook reports the API error.
    } finally {
      setSaving(false);
    }
  }

  const elapsed = placement && mountedAt
    ? Math.max(0, Math.min(100, ((mountedAt - new Date(placement.startDate).getTime()) / (new Date(placement.endDate).getTime() - new Date(placement.startDate).getTime())) * 100))
    : 0;

  return (
    <div className="space-y-6">
      <PageHeader description={appStrings.mentor.placementDescription} title={appStrings.mentor.placement} />
      <QueryState
        emptyAction={<Button asChild className="min-h-11" variant="outline"><Link href="/mentor">{appStrings.common.back}</Link></Button>}
        emptyDescription={appStrings.mentor.profileUnavailable}
        emptyTitle={appStrings.mentor.profileUnavailableTitle}
        error={mentorQuery.error ?? me.error}
        isEmpty={!mentorQuery.isPending && !mentorQuery.data}
        isPending={mentorQuery.isPending || me.isPending}
        onRetry={() => { void mentorQuery.refetch(); void me.refetch(); }}
      >
        <Card>
          <CardHeader><CardTitle>{placement ? appStrings.mentor.placementDetails : appStrings.mentor.addPlacement}</CardTitle></CardHeader>
          <CardContent className="space-y-6">
            {placement && (
              <div className="space-y-2" aria-label={appStrings.mentor.placementProgress}>
                <div className="flex justify-between gap-2 text-sm"><span>{appStrings.mentor.placementProgress}</span><span>{Math.round(elapsed)}%</span></div>
                <div className="bg-sand-100 h-3 overflow-hidden rounded-full"><div className="bg-forest-700 h-full" style={{ width: `${elapsed}%` }} /></div>
                <p className="text-muted-foreground text-sm">{appStrings.common.statusLabel(placement.status)} · {appStrings.mentor.placementDates(placement.startDate, placement.endDate)}</p>
              </div>
            )}
            <form className="grid gap-4 sm:grid-cols-2" key={JSON.stringify(placement ?? "new")} onSubmit={(event) => void submit(event)}>
              <div className="space-y-2"><Label htmlFor="placement-village">{appStrings.mentor.village}</Label><Input className="min-h-11" defaultValue={placement?.village} id="placement-village" name="village" required /></div>
              <div className="space-y-2"><Label htmlFor="placement-district">{appStrings.mentor.district}</Label><Input className="min-h-11" defaultValue={placement?.district} id="placement-district" name="district" required /></div>
              <div className="space-y-2"><Label htmlFor="placement-state">{appStrings.mentor.state}</Label><Input className="min-h-11" defaultValue={placement?.state ?? ""} id="placement-state" name="state" required /></div>
              <div className="space-y-2"><Label htmlFor="placement-start">{appStrings.mentor.startDate}</Label><Input className="min-h-11" defaultValue={placement?.startDate} id="placement-start" name="startDate" required type="date" /></div>
              <div className="space-y-2"><Label htmlFor="placement-end">{appStrings.mentor.endDate}</Label><Input className="min-h-11" defaultValue={placement?.endDate} id="placement-end" name="endDate" required type="date" /></div>
              <div className="sm:col-span-2"><Button className="min-h-11 w-full sm:w-auto" disabled={saving} type="submit" variant="accent">{saving ? appStrings.common.saving : appStrings.mentor.savePlacement}</Button></div>
            </form>
          </CardContent>
        </Card>
      </QueryState>
    </div>
  );
}

export function MentorSchoolsView() {
  const me = useMe();
  const matchesQuery = useMatches({ mine: "true", limit: 50 });
  const schoolsQuery = useSchools({ limit: 50 });
  const { filters, page, update, goToPage } = useUrlFilters("schools");
  const [dialogOpen, setDialogOpen] = useState(false);
  const matches = flattenPages(matchesQuery.data?.pages);
  const schoolMap = new Map(flattenPages(schoolsQuery.data?.pages).map((school) => [school.id, school]));
  const filtered = filterBySearch(
    matches.filter((match) => !filters.status || match.status === filters.status),
    filters.search,
    (match) => {
      const school = schoolMap.get(match.schoolId);
      return [school?.name ?? "", school?.village ?? "", school?.district ?? ""];
    },
  );
  const columns: DataTableColumn<(typeof matches)[number]>[] = [
    { id: "school", header: appStrings.mentor.schoolMatch, cell: (match) => <div><p className="font-medium">{schoolMap.get(match.schoolId)?.name ?? appStrings.mentor.schoolFallback}</p><p className="text-muted-foreground text-sm">{schoolMap.get(match.schoolId)?.village}, {schoolMap.get(match.schoolId)?.district}</p></div>, sortValue: (match) => schoolMap.get(match.schoolId)?.name ?? "" },
    { id: "students", header: appStrings.mentor.studentsLabel, cell: (match) => schoolMap.get(match.schoolId)?.studentCount ?? "—" },
    { id: "status", header: appStrings.mentor.matchStatus, cell: (match) => <Badge variant={match.status === "active" ? "success" : match.status === "pending" ? "info" : "neutral"}>{appStrings.common.statusLabel(match.status)}</Badge>, sortValue: (match) => match.status },
    { id: "started", header: appStrings.mentor.startedLabel, cell: (match) => match.startedAt.slice(0, 10), sortValue: (match) => match.startedAt },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        actions={<Button className="min-h-11" onClick={() => setDialogOpen(true)} variant="accent">{appStrings.mentor.requestMatch}</Button>}
        description={appStrings.mentor.schoolsDescription}
        title={appStrings.mentor.schools}
      />
      {matches.length > 0 && (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <SearchFilter onChange={(search) => update({ search })} placeholder={appStrings.mentor.schoolSearch} value={filters.search} />
          <StatusFilter onChange={(status) => update({ status })} options={["pending", "active", "completed"]} value={filters.status} />
        </div>
      )}
      <QueryState
        emptyDescription={appStrings.mentor.noMatches}
        emptyTitle={appStrings.mentor.noMatchedSchools}
        emptyAction={<Button className="min-h-11" onClick={() => setDialogOpen(true)} variant="accent">{appStrings.mentor.requestMatch}</Button>}
        error={matchesQuery.error ?? schoolsQuery.error}
        isEmpty={!matchesQuery.isPending && !schoolsQuery.isPending && filtered.length === 0}
        isPending={matchesQuery.isPending || schoolsQuery.isPending}
        onRetry={() => { void matchesQuery.refetch(); void schoolsQuery.refetch(); }}
      >
        <div className="rounded-xl border bg-white p-3 sm:p-5">
          <DataTable caption={appStrings.mentor.matchedSchoolsCaption} columns={columns} data={paginate(filtered, page)} getRowKey={(match) => match.id} onSortChange={(sort) => update({ sort: serializeSortState(sort) })} sortState={parseSortState(filters.sort)} />
          <div className="flex justify-end gap-2 pt-4">
            {page > 1 && <Button className="min-h-11" onClick={() => goToPage(page - 1)} variant="outline">{appStrings.common.previous}</Button>}
            {page * 10 < filtered.length && <Button className="min-h-11" onClick={() => goToPage(page + 1)} variant="outline">{appStrings.common.next}</Button>}
          </div>
        </div>
      </QueryState>
      <MatchRequestDialog
        currentMatches={matches}
        mentorId={me.data?.id ?? ""}
        onOpenChange={setDialogOpen}
        open={dialogOpen}
      />
    </div>
  );
}

function MatchRequestDialog({
  currentMatches,
  mentorId,
  open,
  onOpenChange,
}: {
  currentMatches: { schoolId: string }[];
  mentorId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const schoolsQuery = useSchools({ limit: 50 });
  const allMatchesQuery = useMatches({ limit: 50 });
  const createMatch = useCreateMatch();
  const [district, setDistrict] = useState("");
  const [selectedSchool, setSelectedSchool] = useState("");
  const matchedIds = new Set([
    ...currentMatches.map((match) => match.schoolId),
    ...flattenPages(allMatchesQuery.data?.pages)
      .filter((match) => match.status !== "completed")
      .map((match) => match.schoolId),
  ]);
  const opportunities = flattenPages(schoolsQuery.data?.pages).filter(
    (school) => !matchedIds.has(school.id) && (!district || school.district.toLocaleLowerCase().includes(district.toLocaleLowerCase())),
  );

  function requestMatch() {
    if (!selectedSchool || !mentorId) return;
    createMatch.mutate(
      { mentorId, schoolId: selectedSchool, status: "pending", startedAt: new Date().toISOString().slice(0, 10) },
      { onSuccess: () => { onOpenChange(false); setSelectedSchool(""); setDistrict(""); } },
    );
  }

  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{appStrings.mentor.matchRequestTitle}</DialogTitle>
              <DialogDescription>{appStrings.mentor.matchRequestDescription}</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <Input aria-label={appStrings.mentor.districtFilter} className="min-h-11" onChange={(event) => setDistrict(event.target.value)} placeholder={appStrings.mentor.districtFilter} value={district} />
          {schoolsQuery.isPending || allMatchesQuery.isPending ? (
            <p aria-live="polite">{appStrings.common.loadingNearbySchools}</p>
          ) : schoolsQuery.error || allMatchesQuery.error ? (
            <div role="alert" className="space-y-2"><p>{schoolsQuery.error?.message ?? allMatchesQuery.error?.message}</p><Button onClick={() => { void schoolsQuery.refetch(); void allMatchesQuery.refetch(); }} variant="outline">{appStrings.common.tryAgain}</Button></div>
          ) : opportunities.length ? (
            <div className="space-y-2">
              {opportunities.map((school) => (
                <label className="flex min-h-14 cursor-pointer items-center gap-3 rounded-lg border p-3" key={school.id}>
                  <input checked={selectedSchool === school.id} name="school" onChange={() => setSelectedSchool(school.id)} type="radio" value={school.id} />
                  <span><span className="block font-medium">{school.name}</span><span className="text-muted-foreground text-sm">{school.village}, {school.district} · {school.studentCount} {appStrings.mentor.studentsLabel.toLocaleLowerCase()}</span></span>
                </label>
              ))}
            </div>
          ) : <p className="text-muted-foreground rounded-lg border p-4">{appStrings.mentor.noUnmatchedSchools}</p>}
        </div>
        <DialogFooter>
          <Button className="min-h-11" onClick={requestMatch} disabled={!selectedSchool || createMatch.isPending} variant="accent">
            {createMatch.isPending ? appStrings.mentor.matchSending : appStrings.common.sendRequest}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
