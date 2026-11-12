"use client";

import Link from "next/link";
import Image from "next/image";
import { useMemo, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable, type DataTableColumn } from "@/components/shared/data-table";
import { PageHeader } from "@/components/shared/page-header";
import { QueryState } from "@/components/shared/query-state";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MetricChart } from "@/features/dashboards/components/charts";
import { filterBySearch, flattenPages, paginate, parseSortState, SearchFilter, serializeSortState, StatusFilter, useUrlFilters } from "@/features/dashboards/components/shared";
import { useCreateObservation, useCreateExperiment, useExperiment, useExperimentObservations, useExperiments, useUpdateExperiment } from "@/features/experiments/hooks";
import { useMatches } from "@/features/matches/hooks";
import { useSchools } from "@/features/schools/hooks";
import { appStrings } from "@/content/strings";
import type {
  Experiment,
  Match,
  Observation,
  ObservationInput,
  School,
} from "@/lib/api/schemas";
import { useObservationDraftStore } from "@/stores/observation-draft-store";

const syncLabels = {
  draft: appStrings.mentor.syncStateDraft,
  queued: appStrings.mentor.savedOffline,
  failed: appStrings.mentor.failedSync,
} as const;

function StatusBadge({ status }: { status: Experiment["status"] }) {
  const variant =
    status === "active" ? "success" : status === "completed" ? "neutral" : "outline";
  return <Badge variant={variant}>{appStrings.common.statusLabel(status)}</Badge>;
}

export function ExperimentListView({
  role,
}: {
  role: "mentor" | "school";
}) {
  const router = useRouter();
  const experimentsQuery = useExperiments({ limit: 50 });
  const matchesQuery = useMatches({ mine: "true", limit: 50 });
  const schoolsQuery = useSchools({ limit: 50 });
  const { filters, page, update, goToPage } = useUrlFilters("experiments");
  const [createOpen, setCreateOpen] = useState(false);
  const allExperiments = flattenPages(experimentsQuery.data?.pages);
  const matchIds = new Set(flattenPages(matchesQuery.data?.pages).map((match) => match.id));
  const scoped = allExperiments.filter((experiment) => matchIds.has(experiment.matchId));
  const filtered = filterBySearch(
    scoped.filter((experiment) => !filters.status || experiment.status === filters.status),
    filters.search,
    (experiment) => [experiment.title, experiment.cropOrTopic, experiment.hypothesis],
  );
  const columns: DataTableColumn<Experiment>[] = [
    {
      id: "title",
      header: appStrings.mentor.experiment,
      cell: (experiment) => (
        <Link
          className="text-forest-800 min-h-11 inline-flex items-center font-medium underline-offset-4 hover:underline"
          href={`/${role}/experiments/${experiment.id}`}
        >
          {experiment.title}
        </Link>
      ),
      sortValue: (experiment) => experiment.title,
    },
    {
      id: "topic",
      header: appStrings.mentor.cropTopic,
      cell: (experiment) => experiment.cropOrTopic,
      sortValue: (experiment) => experiment.cropOrTopic,
    },
    {
      id: "plot",
      header: appStrings.mentor.plot,
      cell: (experiment) => appStrings.mentor.plotTypeName(experiment.plotType),
    },
    {
      id: "status",
      header: appStrings.common.status,
      cell: (experiment) => <StatusBadge status={experiment.status} />,
      sortValue: (experiment) => experiment.status,
    },
  ];

  const retry = () => {
    void experimentsQuery.refetch();
    void matchesQuery.refetch();
    void schoolsQuery.refetch();
  };
  const emptyAction =
    role === "mentor" ? (
      matchIds.size === 0 ? (
        <Button asChild className="min-h-11" variant="accent">
          <Link href="/mentor/schools">{appStrings.mentor.requestMatch}</Link>
        </Button>
      ) : (
        <Button className="min-h-11" onClick={() => setCreateOpen(true)} variant="accent">
          {appStrings.mentor.newExperiment}
        </Button>
      )
    ) : undefined;

  return (
    <div className="space-y-6">
      <PageHeader
        actions={
          role === "mentor" ? (
            <Button
              className="min-h-11"
              disabled={matchIds.size === 0}
              onClick={() => setCreateOpen(true)}
              variant="accent"
            >
              {appStrings.mentor.newExperiment}
            </Button>
          ) : undefined
        }
        description={appStrings.mentor.experimentsDescription}
        title={appStrings.mentor.experiments}
      />
      {scoped.length > 0 && (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <SearchFilter
            onChange={(search) => update({ search })}
            placeholder={appStrings.mentor.experimentSearch}
            value={filters.search}
          />
          <StatusFilter
            onChange={(status) => update({ status })}
            options={["draft", "active", "completed"]}
            value={filters.status}
          />
        </div>
      )}
      <QueryState
        emptyAction={
          role === "school" ? (
            <Button asChild className="min-h-11" variant="outline">
              <Link href="/school/mentors">{appStrings.mentor.meetingCoordination}</Link>
            </Button>
          ) : emptyAction
        }
        emptyDescription={
          matchIds.size === 0 && role === "mentor"
            ? appStrings.mentor.matchFirstDescription
            : role === "mentor"
              ? appStrings.mentor.noExperimentsNextStep
              : appStrings.school.noExperiments
        }
        emptyTitle={
          filters.search || filters.status
            ? appStrings.common.noResults
            : appStrings.mentor.noExperiments
        }
        error={
          experimentsQuery.error ??
          matchesQuery.error ??
          schoolsQuery.error ??
          null
        }
        isEmpty={
          !experimentsQuery.isPending &&
          !matchesQuery.isPending &&
          !schoolsQuery.isPending &&
          filtered.length === 0
        }
        hasData={filtered.length > 0}
        isPending={
          experimentsQuery.isPending ||
          matchesQuery.isPending ||
          schoolsQuery.isPending
        }
        onRetry={retry}
      >
        <Card className="p-0">
          <CardContent className="p-3 sm:p-5">
            <DataTable
              caption={appStrings.mentor.experimentListCaption}
              columns={columns}
              data={paginate(filtered, page)}
              emptyDescription={appStrings.common.noResults}
              getRowKey={(experiment) => experiment.id}
              onSortChange={(sort) => update({ sort: serializeSortState(sort) })}
              sortState={parseSortState(filters.sort)}
            />
            <div className="flex flex-wrap items-center justify-between gap-3 pt-4">
              <p className="text-muted-foreground text-sm">
                {appStrings.mentor.experimentCount(filtered.length)}
              </p>
              <div className="flex gap-2">
                {page > 1 && (
                  <Button onClick={() => goToPage(page - 1)} variant="outline">
                    {appStrings.mentor.previousPage}
                  </Button>
                )}
                {page * 10 < filtered.length && (
                  <Button onClick={() => goToPage(page + 1)} variant="outline">
                    {appStrings.mentor.nextPage}
                  </Button>
                )}
                {experimentsQuery.hasNextPage && (
                  <Button
                    disabled={experimentsQuery.isFetchingNextPage}
                    onClick={() => void experimentsQuery.fetchNextPage()}
                    variant="outline"
                  >
                    {experimentsQuery.isFetchingNextPage
                      ? appStrings.common.loading
                      : appStrings.common.loadMore}
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </QueryState>
      {role === "mentor" && (
        <ExperimentCreateSheet
          matches={flattenPages(matchesQuery.data?.pages)}
          schools={flattenPages(schoolsQuery.data?.pages)}
          onOpenChange={setCreateOpen}
          onCreated={(id) => {
            setCreateOpen(false);
            router.push(`/mentor/experiments/${id}`);
          }}
          open={createOpen}
        />
      )}
    </div>
  );
}

function ExperimentCreateSheet({
  matches,
  schools,
  open,
  onOpenChange,
  onCreated,
}: {
  matches: Match[];
  schools: School[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreated: (id: string) => void;
}) {
  const createExperiment = useCreateExperiment();
  const [step, setStep] = useState(0);
  const [matchId, setMatchId] = useState("");
  const [title, setTitle] = useState("");
  const [hypothesis, setHypothesis] = useState("");
  const [cropOrTopic, setCropOrTopic] = useState("");
  const [plotType, setPlotType] = useState<"family" | "community">("family");
  const [successCriteria, setSuccessCriteria] = useState("");
  const selectedMatchId = matchId || matches[0]?.id || "";

  async function submit() {
    if (!selectedMatchId || !title.trim() || !cropOrTopic) return;
    try {
      const experiment = await createExperiment.mutateAsync({
        matchId: selectedMatchId,
        title: title.trim(),
        hypothesis: hypothesis.trim(),
        cropOrTopic,
        plotType,
        status: "active",
        ...(successCriteria.trim() ? { successCriteria: successCriteria.trim() } : {}),
      });
      onCreated(experiment.id);
      setStep(0);
      setTitle("");
      setHypothesis("");
      setCropOrTopic("");
      setSuccessCriteria("");
    } catch {
      // The mutation hook reports the API error.
    }
  }

  const stepContent = [
    <div className="space-y-2" key="title">
      <Label htmlFor="experiment-title">{appStrings.mentor.titlePrompt}</Label>
      <Input className="min-h-11" id="experiment-title" onChange={(event) => setTitle(event.target.value)} placeholder={appStrings.mentor.titleExample} value={title} />
    </div>,
    <div className="space-y-2" key="hypothesis">
      <Label htmlFor="experiment-hypothesis">{appStrings.mentor.hypothesisPrompt}</Label>
      <Textarea className="min-h-28" id="experiment-hypothesis" onChange={(event) => setHypothesis(event.target.value)} placeholder={appStrings.mentor.hypothesisExample} value={hypothesis} />
    </div>,
    <div className="space-y-2" key="topic">
      <Label htmlFor="experiment-topic">{appStrings.mentor.topicLabel}</Label>
      <Select onValueChange={setCropOrTopic} value={cropOrTopic}>
        <SelectTrigger className="min-h-11" id="experiment-topic">
          <SelectValue placeholder={appStrings.mentor.chooseTopic} />
        </SelectTrigger>
        <SelectContent>
          {appStrings.mentor.topicOptions.map((topic) => (
            <SelectItem key={topic.value} value={topic.value}>
              {topic.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>,
    <div className="space-y-2" key="plot">
      <Label htmlFor="experiment-plot">{appStrings.mentor.plotPrompt}</Label>
      <Select onValueChange={(value) => setPlotType(value as "family" | "community")} value={plotType}>
        <SelectTrigger className="min-h-11" id="experiment-plot">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="family">{appStrings.mentor.familyFarm}</SelectItem>
          <SelectItem value="community">{appStrings.mentor.communityPlot}</SelectItem>
        </SelectContent>
      </Select>
      <p className="text-muted-foreground text-sm">{appStrings.mentor.safePlot}</p>
    </div>,
    <div className="space-y-2" key="criteria">
      <Label htmlFor="experiment-success">{appStrings.mentor.successCriteriaPrompt}</Label>
      <Textarea className="min-h-28" id="experiment-success" onChange={(event) => setSuccessCriteria(event.target.value)} placeholder={appStrings.mentor.compareWeekly} value={successCriteria} />
    </div>,
  ];
  const canAdvance = step !== 0 || Boolean(title.trim());
  const canSubmit = Boolean(title.trim() && cropOrTopic && selectedMatchId);

  return (
    <Sheet onOpenChange={onOpenChange} open={open}>
      <SheetContent className="w-full overflow-y-auto sm:max-w-lg" side="right">
        <SheetHeader>
          <SheetTitle>{appStrings.mentor.newExperiment}</SheetTitle>
          <SheetDescription>{appStrings.mentor.experimentStepDescription(step + 1)}</SheetDescription>
        </SheetHeader>
        <div className="space-y-5 px-4 pb-4">
          {matches.length > 0 ? (
            <div className="space-y-2">
              <Label htmlFor="experiment-match">{appStrings.mentor.schoolMatch}</Label>
              <Select onValueChange={setMatchId} value={selectedMatchId}>
                <SelectTrigger className="min-h-11" id="experiment-match">
                  <SelectValue placeholder={appStrings.mentor.chooseSchool} />
                </SelectTrigger>
                <SelectContent>
                  {matches.map((match) => (
                    <SelectItem key={match.id} value={match.id}>
                          {appStrings.mentor.matchSchoolLabel(
                            match.status,
                            schools.find((school) => school.id === match.schoolId)
                              ?.name ?? appStrings.mentor.matchedSchool,
                          )}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ) : (
            <p className="text-muted-foreground rounded-lg border p-4 text-sm">
              {appStrings.mentor.requestMatchFirst}
            </p>
          )}
          <div className="bg-sand-100 h-2 overflow-hidden rounded-full"           aria-label={appStrings.mentor.stepCount(step + 1)}>
            <div className="bg-forest-700 h-full transition-all" style={{ width: `${((step + 1) / 5) * 100}%` }} />
          </div>
          {stepContent[step]}
        </div>
        <SheetFooter className="border-t p-4 sm:flex-row sm:justify-between">
          <Button className="min-h-11" disabled={step === 0} onClick={() => setStep((current) => current - 1)} variant="outline">
            {appStrings.common.back}
          </Button>
          {step < 4 ? (
            <Button className="min-h-11" disabled={!canAdvance} onClick={() => setStep((current) => current + 1)} variant="accent">
              {appStrings.common.continue}
            </Button>
          ) : (
            <Button className="min-h-11" disabled={!canSubmit || createExperiment.isPending} onClick={() => void submit()} variant="accent">
              {createExperiment.isPending ? appStrings.common.creating : appStrings.mentor.createExperimentAction}
            </Button>
          )}
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

function PhotoField({
  onReady,
  onBusyChange,
}: {
  onReady: (dataUrl: string | undefined) => void;
  onBusyChange: (busy: boolean) => void;
}) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string>();

  async function compress(file: File) {
    setBusy(true);
    onBusyChange(true);
    setError(undefined);
    try {
      const source = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onerror = () => reject(new Error(appStrings.mentor.photoReadFailed));
        reader.onload = () => resolve(String(reader.result));
        reader.readAsDataURL(file);
      });
      const image = await new Promise<HTMLImageElement>((resolve, reject) => {
        const picture = new window.Image();
        picture.onerror = () => reject(new Error(appStrings.mentor.invalidImage));
        picture.onload = () => resolve(picture);
        picture.src = source;
      });
      const scale = Math.min(1, 600 / Math.max(image.width, image.height));
      const canvas = document.createElement("canvas");
      canvas.width = Math.max(1, Math.round(image.width * scale));
      canvas.height = Math.max(1, Math.round(image.height * scale));
      const context = canvas.getContext("2d");
      if (!context) throw new Error(appStrings.mentor.photoCompressFailed);
      context.drawImage(image, 0, 0, canvas.width, canvas.height);
      const compressed = canvas.toDataURL("image/jpeg", 0.62);
      if (compressed.length > 200_000) {
        throw new Error(appStrings.mentor.photoTooLarge);
      }
      onReady(compressed);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : appStrings.mentor.photoPrepareFailed);
      onReady(undefined);
    } finally {
      setBusy(false);
      onBusyChange(false);
    }
  }

  return (
    <div className="space-y-1">
      <Label htmlFor="observation-photo">{appStrings.mentor.plotPhoto}</Label>
      <Input
        accept="image/*"
        className="min-h-11"
        disabled={busy}
        id="observation-photo"
        onChange={(event) => {
          const file = event.target.files?.[0];
          onReady(undefined);
          if (file) void compress(file);
        }}
        type="file"
      />
      <p className="text-muted-foreground text-xs">{appStrings.mentor.plotOnly}</p>
      {busy && <p className="text-sm" role="status">{appStrings.mentor.compressingPhoto}</p>}
      {error && <p className="text-destructive text-sm" role="alert">{error}</p>}
    </div>
  );
}

function ObservationForm({ experimentId }: { experimentId: string }) {
  const createObservation = useCreateObservation();
  const upsertDraft = useObservationDraftStore((state) => state.upsertDraft);
  const markInFlight = useObservationDraftStore((state) => state.markInFlight);
  const [photoDataUrl, setPhotoDataUrl] = useState<string>();
  const [photoBusy, setPhotoBusy] = useState(false);
  const [date, setDate] = useState("");

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const observation: ObservationInput = {
      date: String(formData.get("date") ?? ""),
      metric: String(formData.get("metric") ?? "").trim(),
      value: Number(formData.get("value")),
      ...(String(formData.get("unit") ?? "").trim()
        ? { unit: String(formData.get("unit")).trim() }
        : {}),
      ...(String(formData.get("notes") ?? "").trim()
        ? { notes: String(formData.get("notes")).trim() }
        : {}),
      ...(photoDataUrl ? { photoDataUrl } : {}),
    };
    if (!observation.date || !observation.metric || !Number.isFinite(observation.value)) {
      toast.error(appStrings.mentor.observationEntryRequired);
      return;
    }
    const localId = crypto.randomUUID();
    try {
      upsertDraft({
        localId,
        experimentId,
        date: observation.date,
        metric: observation.metric,
        value: String(observation.value),
        ...(observation.unit ? { unit: observation.unit } : {}),
        ...(observation.notes ? { notes: observation.notes } : {}),
        ...(photoDataUrl ? { photoDataUrl } : {}),
        createdAt: Date.now(),
        syncStatus: "draft",
      });
      markInFlight(localId);
      createObservation.mutate({ experimentId, observation, draftId: localId });
      toast.success(
        typeof navigator !== "undefined" && !navigator.onLine
          ? appStrings.mentor.savedOffline
          : appStrings.mentor.observationSyncing,
      );
      event.currentTarget.reset();
      setPhotoDataUrl(undefined);
      setDate("");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : appStrings.mentor.retryDraftError);
    }
  }

  return (
    <form className="space-y-4 rounded-xl border bg-white p-4 sm:p-5" id="observation-form" onSubmit={submit}>
      <h3 className="font-semibold">{appStrings.mentor.addObservation}</h3>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1">
          <Label htmlFor="observation-date">{appStrings.mentor.observationDate}</Label>
          <Input className="min-h-11" id="observation-date" name="date" onChange={(event) => setDate(event.target.value)} required type="date" value={date} />
        </div>
        <div className="space-y-1">
          <Label htmlFor="observation-metric">{appStrings.mentor.metric}</Label>
          <Input className="min-h-11" id="observation-metric" name="metric" placeholder={appStrings.mentor.observationPlaceholderMetric} required />
        </div>
        <div className="space-y-1">
          <Label htmlFor="observation-value">{appStrings.mentor.observationValue}</Label>
          <Input className="min-h-11" id="observation-value" inputMode="decimal" name="value" required step="any" type="number" />
        </div>
        <div className="space-y-1">
          <Label htmlFor="observation-unit">{appStrings.mentor.optionalUnit}</Label>
          <Input className="min-h-11" id="observation-unit" name="unit" placeholder={appStrings.mentor.unitCentimeters} />
        </div>
      </div>
      <div className="space-y-1">
        <Label htmlFor="observation-notes">{appStrings.mentor.optionalNotes}</Label>
        <Textarea className="min-h-20" id="observation-notes" name="notes" />
      </div>
      <PhotoField onBusyChange={setPhotoBusy} onReady={setPhotoDataUrl} />
      <Button className="min-h-11 w-full sm:w-auto" disabled={createObservation.isPending || photoBusy} type="submit" variant="accent">
        {createObservation.isPending ? appStrings.common.saving : appStrings.mentor.addObservation}
      </Button>
    </form>
  );
}

export function ExperimentDetailView({
  id,
  role,
}: {
  id: string;
  role: "mentor" | "school";
}) {
  const experimentQuery = useExperiment(id);
  const observationsQuery = useExperimentObservations(id);
  const matchesQuery = useMatches({ mine: "true", limit: 50 });
  const schoolsQuery = useSchools({ limit: 50 });
  const drafts = useObservationDraftStore((state) => state.drafts);
  const localDrafts = useMemo(
    () =>
      Object.values(drafts)
        .filter((draft) => draft.experimentId === id)
        .sort((left, right) => right.createdAt - left.createdAt),
    [drafts, id],
  );
  const localDraftIds = useMemo(
    () => new Set(localDrafts.map((draft) => draft.localId)),
    [localDrafts],
  );
  const retry = () => {
    void experimentQuery.refetch();
    void observationsQuery.refetch();
    void matchesQuery.refetch();
    void schoolsQuery.refetch();
  };
  const experiment = experimentQuery.data;
  const match = flattenPages(matchesQuery.data?.pages).find((item) => item.id === experiment?.matchId);
  const school = flattenPages(schoolsQuery.data?.pages).find((item) => item.id === match?.schoolId);
  const observations = useMemo(
    () =>
      [...flattenPages(observationsQuery.data?.pages)]
        .filter(
          (observation) =>
            !observation.id.startsWith("optimistic-") ||
            !localDraftIds.has(observation.id.slice("optimistic-".length)),
        )
        .sort((left, right) => right.date.localeCompare(left.date)),
    [localDraftIds, observationsQuery.data?.pages],
  );
  const chartDrafts = role === "mentor" ? localDrafts : [];
  const updateExperiment = useUpdateExperiment();
  const [comment, setComment] = useState("");
  const [submittingComment, setSubmittingComment] = useState(false);
  const [selectedMetric, setSelectedMetric] = useState("");
  const metrics = useMemo(
    () =>
      [...new Set([
        ...observations.map((observation) => observation.metric),
        ...chartDrafts.map((draft) => draft.metric),
      ])],
    [chartDrafts, observations],
  );
  const chartMetric = metrics.includes(selectedMetric)
    ? selectedMetric
    : metrics[0] ?? appStrings.mentor.experimentMetric;
  const chartObservations = [
    ...observations
      .filter((observation) => observation.metric === chartMetric)
      .map(({ date, value }) => ({ date, value })),
    ...chartDrafts
      .filter(
        (draft) =>
          draft.metric === chartMetric && Number.isFinite(Number(draft.value)),
      )
      .map((draft) => ({ date: draft.date, value: Number(draft.value) })),
  ].sort((left, right) => left.date.localeCompare(right.date));

  async function addComment(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!experiment || !comment.trim()) return;
    setSubmittingComment(true);
    try {
      await updateExperiment.mutateAsync({
        id,
        changes: { schoolComments: [...(experiment.schoolComments ?? []), comment.trim()] },
      });
      setComment("");
    } catch {
      // The mutation hook reports the API error.
    } finally {
      setSubmittingComment(false);
    }
  }

  const content = experiment && (
    <div className="space-y-6">
      <PageHeader
        actions={<StatusBadge status={experiment.status} />}
        description={appStrings.mentor.plotDescription(
          experiment.cropOrTopic,
          experiment.plotType,
        )}
        title={experiment.title}
      />
      <Tabs className="space-y-5" defaultValue="overview">
        <TabsList className="h-auto w-full flex-wrap justify-start">
          <TabsTrigger className="min-h-11" value="overview">{appStrings.mentor.overview}</TabsTrigger>
          <TabsTrigger className="min-h-11" value="observations">{appStrings.mentor.observationsTab}</TabsTrigger>
          <TabsTrigger className="min-h-11" value="chart">{appStrings.mentor.chart}</TabsTrigger>
          <TabsTrigger className="min-h-11" value="students">{appStrings.mentor.studentsTab}</TabsTrigger>
        </TabsList>
        <TabsContent className="space-y-4" value="overview">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader><CardTitle>{appStrings.mentor.hypothesisLabel}</CardTitle></CardHeader>
              <CardContent>{experiment.hypothesis || appStrings.mentor.addHypothesisHint}</CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>{appStrings.mentor.successCriteria}</CardTitle></CardHeader>
              <CardContent>{experiment.successCriteria || appStrings.mentor.noSuccessCriteria}</CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>{appStrings.mentor.schoolAndPlot}</CardTitle></CardHeader>
              <CardContent className="space-y-1">
                <p>{school?.name ?? appStrings.mentor.matchedSchool}</p>
                <p className="text-muted-foreground text-sm">{school ? `${school.village}, ${school.district}` : appStrings.mentor.schoolDetailsUnavailable}</p>
                <p className="text-muted-foreground text-sm">{appStrings.mentor.plotTypeName(experiment.plotType)}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>{appStrings.mentor.progress}</CardTitle></CardHeader>
              <CardContent className="space-y-1">
                <p>{appStrings.mentor.observationCount(observations.length)}</p>
                <p>{experiment.sessionsAttended ?? 0} {appStrings.mentor.sessionsAttended}</p>
                <p className="text-muted-foreground text-sm">{appStrings.mentor.started} {experiment.createdAt.slice(0, 10)}</p>
              </CardContent>
            </Card>
          </div>
          {role === "school" && (
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader><CardTitle>{appStrings.mentor.sessionAttendance}</CardTitle></CardHeader>
                <CardContent className="space-y-3">
                  <p>{appStrings.mentor.completedSessionCount(experiment.sessionsAttended ?? 0)}</p>
                  <Button
                    className="min-h-11"
                    disabled={updateExperiment.isPending}
                    onClick={() => updateExperiment.mutate({
                      id,
                      changes: { sessionsAttended: (experiment.sessionsAttended ?? 0) + 1 },
                    })}
                    variant="outline"
                  >
                    {appStrings.school.attended}
                  </Button>
                </CardContent>
              </Card>
              <Card>
                <CardHeader><CardTitle>{appStrings.school.comment}</CardTitle></CardHeader>
                <CardContent>
                  <form className="space-y-3" onSubmit={addComment}>
                    <Textarea aria-label={appStrings.school.comment} className="min-h-20" onChange={(event) => setComment(event.target.value)} value={comment} />
                    <Button className="min-h-11" disabled={submittingComment || !comment.trim()} type="submit" variant="outline">{appStrings.mentor.sendNote}</Button>
                  </form>
                  <ul className="mt-4 list-disc space-y-1 pl-5 text-sm">
                    {(experiment.schoolComments ?? []).map((item, index) => <li key={`${index}-${item}`}>{item}</li>)}
                  </ul>
                </CardContent>
              </Card>
            </div>
          )}
          {role === "mentor" && (
            <Card>
              <CardHeader><CardTitle>{appStrings.mentor.statusTitle}</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                <p className="text-muted-foreground text-sm">{appStrings.mentor.statusDescription}</p>
                {experiment.status !== "completed" && (
                  <Button
                    className="min-h-11"
                    disabled={updateExperiment.isPending}
                    onClick={() => updateExperiment.mutate({
                      id,
                      changes: { status: experiment.status === "draft" ? "active" : "completed" },
                    })}
                    variant="outline"
                  >
                    {experiment.status === "draft" ? appStrings.mentor.startExperiment : appStrings.mentor.markCompleted}
                  </Button>
                )}
              </CardContent>
            </Card>
          )}
        </TabsContent>
        <TabsContent className="space-y-5" value="observations">
          {role === "mentor" && <ObservationForm experimentId={id} />}
          <QueryState
            emptyAction={
              role === "mentor" ? (
                <Button
                  className="min-h-11"
                  onClick={() =>
                    document.getElementById("observation-date")?.focus()
                  }
                  variant="accent"
                >
                  {appStrings.mentor.addObservation}
                </Button>
              ) : (
                <Button asChild className="min-h-11" variant="outline">
                  <Link href="/school/experiments">{appStrings.common.back}</Link>
                </Button>
              )
            }
            hasData={observations.length > 0 || localDrafts.length > 0}
            emptyDescription={appStrings.mentor.noObservations}
            emptyTitle={appStrings.mentor.noObservationTitle}
            error={observationsQuery.error}
            isEmpty={observations.length === 0 && localDrafts.length === 0}
            isPending={observationsQuery.isPending}
            onRetry={() => void observationsQuery.refetch()}
          >
            <div className="space-y-3">
              {localDrafts.map((draft) => (
                <Card className="gap-2 py-4" key={draft.localId}>
                  <CardContent className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="font-medium">{draft.metric}: {draft.value}{draft.unit ? ` ${draft.unit}` : ""}</p>
                      <p className="text-muted-foreground text-sm">{draft.date} · {draft.notes || appStrings.mentor.unsyncedDraft}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={draft.syncStatus === "queued" ? "info" : draft.syncStatus === "failed" ? "destructive" : "neutral"}>{syncLabels[draft.syncStatus]}</Badge>
                      {draft.syncStatus === "failed" && (
                        <RetryDraft localId={draft.localId} />
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
              {observations.map((observation) => <ObservationCard key={observation.id} observation={observation} />)}
              {observationsQuery.hasNextPage && (
                <Button className="min-h-11" disabled={observationsQuery.isFetchingNextPage} onClick={() => void observationsQuery.fetchNextPage()} variant="outline">
                  {observationsQuery.isFetchingNextPage ? appStrings.common.loading : appStrings.common.loadMore}
                </Button>
              )}
            </div>
          </QueryState>
        </TabsContent>
        <TabsContent value="chart">
          <Card>
            <CardHeader><CardTitle>{appStrings.mentor.metricChartTitle}</CardTitle></CardHeader>
            <CardContent>
              <label className="mb-4 flex max-w-sm flex-col gap-2 text-sm font-medium">
                {appStrings.mentor.metric}
                <select
                  className="border-border min-h-11 rounded-lg border bg-white px-3"
                  onChange={(event) => setSelectedMetric(event.target.value)}
                  value={chartMetric}
                >
                  {(metrics.length ? metrics : [appStrings.mentor.experimentMetric]).map((metric) => (
                    <option key={metric} value={metric}>{metric}</option>
                  ))}
                </select>
              </label>
              <MetricChart data={chartObservations} metric={chartMetric} />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="students">
          <Card>
            <CardHeader><CardTitle>{appStrings.mentor.participatingClass}</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              <p>{school?.studentCount ?? appStrings.mentor.classSizeFallback} {appStrings.mentor.studentsLabel.toLocaleLowerCase()} {appStrings.admin.grades.toLocaleLowerCase()} {school?.grades ?? appStrings.mentor.gradeFallback}.</p>
              <p className="text-muted-foreground text-sm">{appStrings.mentor.studentsPrivacy}</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );

  return (
    <QueryState
      emptyAction={
        <Button asChild className="min-h-11" variant="outline">
          <Link href={`/${role}/experiments`}>{appStrings.common.back}</Link>
        </Button>
      }
      emptyDescription={appStrings.mentor.noExperimentFound}
      emptyTitle={appStrings.mentor.experimentNotFound}
      error={
        experimentQuery.error ??
        matchesQuery.error ??
        schoolsQuery.error ??
        null
      }
      hasData={Boolean(experimentQuery.data)}
      isEmpty={!experimentQuery.data}
      isPending={
        experimentQuery.isPending ||
        matchesQuery.isPending ||
        schoolsQuery.isPending
      }
      onRetry={retry}
    >
      {content}
    </QueryState>
  );
}

function ObservationCard({ observation }: { observation: Observation }) {
  return (
    <Card className="gap-2 py-4">
      <CardContent>
        <p className="font-medium">{observation.metric}: {observation.value}{observation.unit ? ` ${observation.unit}` : ""}</p>
        <p className="text-muted-foreground text-sm">{observation.date}{observation.notes ? ` · ${observation.notes}` : ""}</p>
        {observation.photoDataUrl && (
          <Image
            alt={appStrings.mentor.observationPhotoAlt}
            className="mt-3 h-40 w-40 rounded-lg border object-cover"
            height={160}
            src={observation.photoDataUrl}
            unoptimized
            width={160}
          />
        )}
      </CardContent>
    </Card>
  );
}

function RetryDraft({ localId }: { localId: string }) {
  const markQueued = useObservationDraftStore((state) => state.markQueued);
  return <Button className="min-h-11" onClick={() => markQueued(localId)} size="sm" variant="outline">{appStrings.mentor.retrySync}</Button>;
}
