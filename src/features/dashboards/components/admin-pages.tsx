"use client";

import Link from "next/link";
import { useState } from "react";
import { Download, UsersRound } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable, type DataTableColumn } from "@/components/shared/data-table";
import { PageHeader } from "@/components/shared/page-header";
import { QueryState } from "@/components/shared/query-state";
import { StatCard } from "@/components/shared/stat-card";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { DistributionChart, MetricChart } from "@/features/dashboards/components/charts";
import { filterBySearch, flattenPages, paginate, parseSortState, SearchFilter, serializeSortState, StatusFilter, useUrlFilters } from "@/features/dashboards/components/shared";
import { useInsights } from "@/features/insights/hooks";
import { useExperiments } from "@/features/experiments/hooks";
import { useMatches } from "@/features/matches/hooks";
import { useMentors } from "@/features/mentors/hooks";
import { useSchools } from "@/features/schools/hooks";
import { useAdminStudents } from "@/features/admin/hooks";
import { appStrings } from "@/content/strings";
import type { MentorProfile, User } from "@/lib/api/schemas";

type StudentRow = {
  user: User;
  mentor?: MentorProfile;
  village: string;
  dates: string;
  status: string;
};

function studentRows(users: User[], mentors: MentorProfile[]): StudentRow[] {
  return users.map((user) => {
    const mentor = mentors.find((item) => item.userId === user.id);
    const placement = mentor?.rawePlacement;
    return {
      user,
      mentor,
      village: placement?.village ?? appStrings.admin.studentPlacementFallback,
      dates: placement ? `${placement.startDate} – ${placement.endDate}` : appStrings.admin.studentPlacementFallback,
      status: placement?.status ?? "upcoming",
    };
  });
}

function downloadCsv(rows: StudentRow[]) {
  const escape = (value: string) => `"${value.replaceAll('"', '""')}"`;
  const content = [
    appStrings.admin.studentCsvHeader.map(escape).join(","),
    ...rows.map(({ user, mentor, village, dates, status }) =>
      [user.name, village, dates, String(mentor?.hoursPerWeek ?? 0), status].map(escape).join(","),
    ),
  ].join("\r\n");
  const blob = new Blob([content], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = "kss-rawe-students.csv";
  anchor.click();
  URL.revokeObjectURL(url);
}

export function AdminDashboardView() {
  const studentsQuery = useAdminStudents({ limit: 50 });
  const matchesQuery = useMatches({ limit: 50 });
  const schoolsQuery = useSchools({ limit: 50 });
  const experimentsQuery = useExperiments({ limit: 50 });
  const students = flattenPages(studentsQuery.data?.pages);
  const matches = flattenPages(matchesQuery.data?.pages);
  const schools = flattenPages(schoolsQuery.data?.pages);
  const experiments = flattenPages(experimentsQuery.data?.pages);
  const activeMatches = matches.filter((match) => match.status === "active");
  const activeSchools = new Set(activeMatches.map((match) => match.schoolId));
  const distribution = ["active", "draft", "completed"].map((status) => ({
    label: appStrings.common.statusLabel(status),
    value: experiments.filter((item) => item.status === status).length,
  }));
  const queries = [studentsQuery, matchesQuery, schoolsQuery, experimentsQuery];
  const error = queries.find((query) => query.error)?.error as Error | null | undefined;
  const pending = queries.some((query) => query.isPending);
  const empty = !pending && students.length === 0 && matches.length === 0 && schools.length === 0 && experiments.length === 0;

  return (
    <div className="space-y-6">
      <PageHeader description={appStrings.admin.dashboard} title={appStrings.admin.dashboardTitle} />
      <QueryState
        emptyAction={<Button asChild className="min-h-11" variant="outline"><Link href="/admin/students">{appStrings.admin.reviewStudents}</Link></Button>}
        emptyDescription={appStrings.admin.activityDescription}
        emptyTitle={appStrings.admin.noActivity}
        error={error ?? null}
        hasData={students.length > 0 || matches.length > 0 || schools.length > 0 || experiments.length > 0}
        isEmpty={empty}
        isPending={pending}
        onRetry={() => queries.forEach((query) => void query.refetch())}
      >
        <div className="space-y-6">
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard label={appStrings.admin.studentsOnRawe} value={String(students.length)} />
            <StatCard label={appStrings.admin.matchedMentors} value={String(new Set(activeMatches.map((match) => match.mentorId)).size)} />
            <StatCard label={appStrings.admin.activeSchools} value={String(activeSchools.size)} />
            <StatCard highlight label={appStrings.admin.completedExperiments} value={String(distribution.find((item) => item.label === appStrings.common.completed)?.value ?? 0)} />
          </div>
          <Card>
            <CardHeader><CardTitle>{appStrings.admin.chartSummary}</CardTitle></CardHeader>
            <CardContent><DistributionChart values={distribution} /></CardContent>
          </Card>
          <div className="grid gap-4 sm:grid-cols-3">
            <QuickLink href="/admin/students" label={appStrings.admin.students} value={students.length} />
            <QuickLink href="/admin/schools" label={appStrings.admin.schools} value={schools.length} />
            <QuickLink href="/admin/insights" label={appStrings.admin.insights} value={experiments.length} />
          </div>
        </div>
      </QueryState>
    </div>
  );
}

function QuickLink({ href, label, value }: { href: string; label: string; value: number }) {
  return (
    <Link className="border-border flex min-h-20 items-center justify-between rounded-xl border bg-white p-4 hover:bg-sand-50" href={href}>
      <span className="font-medium">{label}</span>
      <span className="text-muted-foreground flex items-center gap-2"><UsersRound aria-hidden="true" className="size-4" />{value}</span>
    </Link>
  );
}

export function AdminStudentsView() {
  const studentsQuery = useAdminStudents({ limit: 50 });
  const mentorsQuery = useMentors({ limit: 50 });
  const { filters, page, update, goToPage } = useUrlFilters("students");
  const [selected, setSelected] = useState<StudentRow>();
  const rows = studentRows(flattenPages(studentsQuery.data?.pages), flattenPages(mentorsQuery.data?.pages));
  const filtered = filterBySearch(
    rows.filter((row) => !filters.status || row.status === filters.status),
    filters.search,
    ({ user, village, mentor }) => [user.name, user.email, village, mentor?.college ?? ""],
  );
  const columns: DataTableColumn<StudentRow>[] = [
    {
      id: "student",
      header: appStrings.admin.student,
      cell: (row) => <Button className="min-h-11 px-0 font-medium" onClick={() => setSelected(row)} variant="link">{row.user.name}</Button>,
      sortValue: (row) => row.user.name,
    },
    { id: "village", header: appStrings.admin.placementVillage, cell: (row) => row.village, sortValue: (row) => row.village },
    { id: "dates", header: appStrings.admin.placementDates, cell: (row) => row.dates, sortValue: (row) => row.dates },
    { id: "hours", header: appStrings.admin.hoursPerWeek, cell: (row) => row.mentor?.hoursPerWeek ?? "—", sortValue: (row) => row.mentor?.hoursPerWeek ?? 0 },
    { id: "status", header: appStrings.common.status, cell: (row) => <Badge variant={row.status === "active" ? "success" : row.status === "completed" ? "neutral" : "info"}>{appStrings.common.statusLabel(row.status)}</Badge>, sortValue: (row) => row.status },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        actions={<Button className="min-h-11" disabled={filtered.length === 0} onClick={() => downloadCsv(filtered)} variant="outline"><Download aria-hidden="true" />{appStrings.admin.exportCsv}</Button>}
        description={appStrings.admin.studentDescription}
        title={appStrings.admin.students}
      />
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <SearchFilter onChange={(search) => update({ search })} placeholder={appStrings.admin.searchStudents} value={filters.search} />
        <StatusFilter onChange={(status) => update({ status })} options={["upcoming", "active", "completed"]} value={filters.status} />
      </div>
      <QueryState
        emptyAction={<Button asChild className="min-h-11" variant="outline"><Link href="/admin">{appStrings.admin.backToDashboard}</Link></Button>}
        emptyDescription={appStrings.admin.noStudents}
        emptyTitle={filters.search || filters.status ? appStrings.common.noResults : appStrings.admin.noStudentRows}
        error={studentsQuery.error ?? mentorsQuery.error}
        hasData={filtered.length > 0}
        isEmpty={!studentsQuery.isPending && !mentorsQuery.isPending && filtered.length === 0}
        isPending={studentsQuery.isPending || mentorsQuery.isPending}
        onRetry={() => { void studentsQuery.refetch(); void mentorsQuery.refetch(); }}
      >
        <div className="rounded-xl border bg-white p-3 sm:p-5">
          <DataTable caption={appStrings.admin.studentsCaption} columns={columns} data={paginate(filtered, page)} getRowKey={(row) => row.user.id} onSortChange={(sort) => update({ sort: serializeSortState(sort) })} sortState={parseSortState(filters.sort)} />
          <div className="flex justify-end gap-2 pt-4">
            {page > 1 && <Button className="min-h-11" onClick={() => goToPage(page - 1)} variant="outline">{appStrings.mentor.previousPage}</Button>}
            {page * 10 < filtered.length && <Button className="min-h-11" onClick={() => goToPage(page + 1)} variant="outline">{appStrings.mentor.nextPage}</Button>}
          </div>
        </div>
      </QueryState>
      <StudentDetailSheet onOpenChange={(open) => { if (!open) setSelected(undefined); }} student={selected} />
    </div>
  );
}

function StudentDetailSheet({
  student,
  onOpenChange,
}: {
  student?: StudentRow;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <Sheet onOpenChange={onOpenChange} open={Boolean(student)}>
      <SheetContent className="w-full overflow-y-auto sm:max-w-md" side="right">
        {student && (
          <>
            <SheetHeader>
              <SheetTitle>{student.user.name}</SheetTitle>
              <SheetDescription>{appStrings.admin.studentDetailTitle}</SheetDescription>
            </SheetHeader>
            <div className="space-y-4 px-4">
              <Detail label={appStrings.admin.college} value={student.mentor?.college ?? appStrings.admin.noCollege} />
              <Detail label={appStrings.admin.placementVillage} value={student.village} />
              <Detail label={appStrings.admin.placementDates} value={student.dates} />
              <Detail label={appStrings.admin.weeklyCommitment} value={appStrings.admin.hourCount(student.mentor?.hoursPerWeek ?? 0)} />
              <Detail label={appStrings.common.status} value={student.status} />
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return <div className="rounded-lg border p-3"><p className="text-muted-foreground text-xs">{label}</p><p className="mt-1 font-medium">{value}</p></div>;
}

export function AdminSchoolsView() {
  const schoolsQuery = useSchools({ limit: 50 });
  const matchesQuery = useMatches({ limit: 50 });
  const { filters, page, update, goToPage } = useUrlFilters("schools");
  const schools = flattenPages(schoolsQuery.data?.pages);
  const matches = flattenPages(matchesQuery.data?.pages);
  const rows = schools.map((school) => ({
    school,
    status: matches.some((match) => match.schoolId === school.id && match.status === "active")
      ? "active"
      : matches.some((match) => match.schoolId === school.id && match.status === "pending")
        ? "pending"
        : matches.some((match) => match.schoolId === school.id)
          ? "completed"
          : "unmatched",
  }));
  const filtered = filterBySearch(
    rows.filter((row) => !filters.status || row.status === filters.status),
    filters.search,
    ({ school }) => [school.name, school.village, school.district],
  );
  const columns: DataTableColumn<(typeof rows)[number]>[] = [
    { id: "school", header: appStrings.mentor.schoolFallback, cell: ({ school }) => <div><p className="font-medium">{school.name}</p><p className="text-muted-foreground text-sm">{school.village}, {school.district}</p></div>, sortValue: ({ school }) => school.name },
    { id: "students", header: appStrings.admin.classSize, cell: ({ school }) => school.studentCount, sortValue: ({ school }) => school.studentCount },
    { id: "grades", header: appStrings.admin.grades, cell: ({ school }) => school.grades },
    { id: "status", header: appStrings.mentor.matchStatus, cell: ({ status }) => <Badge variant={status === "active" ? "success" : status === "pending" ? "info" : "neutral"}>{appStrings.common.statusLabel(status)}</Badge>, sortValue: ({ status }) => status },
  ];

  return (
    <div className="space-y-6">
      <PageHeader description={appStrings.admin.schoolDescription} title={appStrings.admin.schools} />
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <SearchFilter onChange={(search) => update({ search })} placeholder={appStrings.admin.searchSchools} value={filters.search} />
        <StatusFilter onChange={(status) => update({ status })} options={["active", "pending", "completed", "unmatched"]} value={filters.status} />
      </div>
      <QueryState
        emptyAction={<Button asChild className="min-h-11" variant="outline"><Link href="/admin">{appStrings.admin.backToDashboard}</Link></Button>}
        emptyDescription={appStrings.admin.noSchools}
        emptyTitle={filters.search || filters.status ? appStrings.common.noResults : appStrings.admin.noSchoolsTitle}
        error={schoolsQuery.error ?? matchesQuery.error}
        hasData={filtered.length > 0}
        isEmpty={!schoolsQuery.isPending && !matchesQuery.isPending && filtered.length === 0}
        isPending={schoolsQuery.isPending || matchesQuery.isPending}
        onRetry={() => { void schoolsQuery.refetch(); void matchesQuery.refetch(); }}
      >
        <div className="rounded-xl border bg-white p-3 sm:p-5">
          <DataTable caption={appStrings.admin.schoolsCaption} columns={columns} data={paginate(filtered, page)} getRowKey={({ school }) => school.id} onSortChange={(sort) => update({ sort: serializeSortState(sort) })} sortState={parseSortState(filters.sort)} />
          <div className="flex justify-end gap-2 pt-4">
            {page > 1 && <Button className="min-h-11" onClick={() => goToPage(page - 1)} variant="outline">{appStrings.common.previous}</Button>}
            {page * 10 < filtered.length && <Button className="min-h-11" onClick={() => goToPage(page + 1)} variant="outline">{appStrings.common.next}</Button>}
          </div>
        </div>
      </QueryState>
    </div>
  );
}

export function AdminInsightsView() {
  const [scope, setScope] = useState<"school" | "district" | "program">("program");
  const [metric, setMetric] = useState(appStrings.admin.activeExperimentsMetric);
  const insightQuery = useInsights(scope, metric);
  const series = insightQuery.data?.series ?? [];

  return (
    <div className="space-y-6">
      <PageHeader description={appStrings.admin.insightsDescription} title={appStrings.admin.insights} />
      <div className="border-border flex flex-col gap-4 rounded-xl border bg-white p-4 sm:flex-row sm:items-end">
        <label className="flex flex-1 flex-col gap-2 text-sm font-medium">
          {appStrings.admin.scope}
          <select className="border-border min-h-11 rounded-lg border bg-white px-3" onChange={(event) => setScope(event.target.value as typeof scope)} value={scope}>
            <option value="school">{appStrings.admin.schoolScope}</option><option value="district">{appStrings.admin.districtScope}</option><option value="program">{appStrings.admin.programScope}</option>
          </select>
        </label>
        <label className="flex flex-1 flex-col gap-2 text-sm font-medium">
          {appStrings.admin.metric}
          <select className="border-border min-h-11 rounded-lg border bg-white px-3" onChange={(event) => setMetric(event.target.value)} value={metric}>
            <option value={appStrings.admin.activeExperimentsMetric}>{appStrings.admin.activeExperimentsMetric}</option>
            <option value={appStrings.admin.completedExperimentsMetric}>{appStrings.admin.completedExperimentsMetric}</option>
            <option value={appStrings.admin.observationsMetric}>{appStrings.admin.observationsMetric}</option>
          </select>
        </label>
      </div>
      <div className="border-forest-700 flex items-start gap-3 rounded-xl border bg-forest-50 p-4" role="note">
        <span className="font-semibold">{appStrings.admin.note}</span>
        <p className="text-sm">{appStrings.admin.aggregateNotice}</p>
      </div>
      <QueryState
        emptyAction={<Button asChild className="min-h-11" variant="outline"><Link href="/admin">{appStrings.admin.insightDashboardLink}</Link></Button>}
        emptyDescription={appStrings.admin.insightEmptyDescription}
        emptyTitle={appStrings.admin.noInsightData}
        error={insightQuery.error}
        hasData={series.length > 0}
        isEmpty={series.length === 0}
        isPending={insightQuery.isPending}
        onRetry={() => void insightQuery.refetch()}
      >
        <Card>
          <CardHeader><CardTitle>{metric} · {scope}</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <MetricChart data={series} metric={metric} />
            <p className="text-muted-foreground text-sm">{appStrings.admin.insightCaption(metric, scope)}</p>
          </CardContent>
        </Card>
      </QueryState>
    </div>
  );
}
