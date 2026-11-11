"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCompleteOnboarding, useMe } from "@/features/auth/hooks";
import { roleHome } from "@/config/nav";
import type { Role } from "@/config/nav";
import { useOnboardingStore } from "@/stores/onboarding-store";

const mentorTopics = [
  "soil health",
  "crop cycles",
  "irrigation",
  "pests",
  "farm tech",
  "agri-business",
  "climate-resilient practices",
];
const roleStepTitles: Record<Role, string[]> = {
  mentor: ["Your studies", "RAWE placement", "Topics and availability"],
  school: ["School details", "Grades and class sizes", "Connectivity and devices"],
  admin: ["College details", "Upcoming RAWE students", "Review and finish"],
};

function storedValue(data: Record<string, unknown>, key: string) {
  const value = data[key];
  return typeof value === "string" ? value : "";
}

function TextField({
  name,
  label,
  defaultValue,
  type = "text",
  required = true,
}: {
  name: string;
  label: string;
  defaultValue: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <label className="grid gap-2 text-sm font-medium">
      {label}
      <Input
        autoComplete="off"
        defaultValue={defaultValue}
        name={name}
        required={required}
        type={type}
      />
    </label>
  );
}

function RoleStepFields({
  role,
  step,
  data,
}: {
  role: Role;
  step: number;
  data: Record<string, unknown>;
}) {
  if (role === "mentor" && step === 0) {
    return (
      <>
        <TextField defaultValue={storedValue(data, "college")} label="College" name="college" />
        <label className="grid gap-2 text-sm font-medium">
          Year of study
          <select className="border-input h-10 rounded-lg border bg-white px-3" defaultValue={storedValue(data, "year") || "1"} name="year">
            {["1", "2", "3", "4"].map((year) => <option key={year} value={year}>Year {year}</option>)}
          </select>
        </label>
      </>
    );
  }
  if (role === "mentor" && step === 1) {
    return (
      <>
        <TextField defaultValue={storedValue(data, "village")} label="Village" name="village" />
        <TextField defaultValue={storedValue(data, "district")} label="District" name="district" />
        <TextField defaultValue={storedValue(data, "state")} label="State" name="state" />
        <TextField defaultValue={storedValue(data, "startDate")} label="Start date" name="startDate" type="date" />
        <TextField defaultValue={storedValue(data, "endDate")} label="End date" name="endDate" type="date" />
      </>
    );
  }
  if (role === "mentor") {
    const savedTopics = Array.isArray(data.topics) ? data.topics : [];
    return (
      <>
        <fieldset className="space-y-3">
          <legend className="text-sm font-medium">Topics you’re comfortable teaching</legend>
          <div className="grid gap-2 sm:grid-cols-2">
            {mentorTopics.map((topic) => (
              <label className="flex items-center gap-2 text-sm" key={topic}>
                <input defaultChecked={savedTopics.includes(topic)} name="topics" type="checkbox" value={topic} />
                {topic}
              </label>
            ))}
          </div>
        </fieldset>
        <label className="grid gap-2 text-sm font-medium">
          Time each week
          <select className="border-input h-10 rounded-lg border bg-white px-3" defaultValue={storedValue(data, "hoursPerWeek") || "1"} name="hoursPerWeek">
            {[1, 3, 5].map((hours) => <option key={hours} value={hours}>{hours} hours</option>)}
          </select>
        </label>
      </>
    );
  }
  if (role === "school" && step === 0) {
    return (
      <>
        <TextField defaultValue={storedValue(data, "schoolName")} label="School name" name="schoolName" />
        <TextField defaultValue={storedValue(data, "village")} label="Village" name="village" />
        <TextField defaultValue={storedValue(data, "district")} label="District" name="district" />
        <TextField defaultValue={storedValue(data, "contactName")} label="Contact person" name="contactName" />
      </>
    );
  }
  if (role === "school" && step === 1) {
    return (
      <>
        <TextField defaultValue={storedValue(data, "grades")} label="Grades served" name="grades" />
        <TextField defaultValue={storedValue(data, "studentCount")} label="Total student count" name="studentCount" type="number" />
        <TextField defaultValue={storedValue(data, "classSizes")} label="Class sizes by grade (optional)" name="classSizes" required={false} />
      </>
    );
  }
  if (role === "school") {
    return (
      <>
        <label className="grid gap-2 text-sm font-medium">
          Internet availability
          <select className="border-input h-10 rounded-lg border bg-white px-3" defaultValue={storedValue(data, "internet")} name="internet">
            <option value="">Choose one</option><option value="reliable">Usually reliable</option><option value="intermittent">Intermittent</option><option value="none">No regular access</option>
          </select>
        </label>
        <TextField defaultValue={storedValue(data, "devices")} label="Available devices (optional)" name="devices" required={false} />
      </>
    );
  }
  if (role === "admin" && step === 0) {
    return (
      <>
        <TextField defaultValue={storedValue(data, "collegeName")} label="College name" name="collegeName" />
        <TextField defaultValue={storedValue(data, "designation")} label="Your designation" name="designation" />
      </>
    );
  }
  if (role === "admin" && step === 1) {
    return (
      <>
        <label className="grid gap-2 text-sm font-medium">
          Import a student CSV (interface preview)
          <Input accept=".csv,text/csv" name="studentCsv" type="file" />
        </label>
        <TextField defaultValue={storedValue(data, "studentList")} label="Or enter student names, one per line" name="studentList" required={false} />
      </>
    );
  }
  return <p className="text-muted-foreground text-sm">Your details are saved on this device. You can update student information later.</p>;
}

export function OnboardingFlow() {
  const router = useRouter();
  const me = useMe();
  const step = useOnboardingStore((state) => state.step);
  const data = useOnboardingStore((state) => state.data);
  const next = useOnboardingStore((state) => state.next);
  const back = useOnboardingStore((state) => state.back);
  const updateData = useOnboardingStore((state) => state.updateData);
  const reset = useOnboardingStore((state) => state.reset);
  const complete = useCompleteOnboarding();
  const role = me.data?.role;
  const titles = useMemo(() => (role ? roleStepTitles[role] : []), [role]);
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    void useOnboardingStore.persist.rehydrate().then(() => setHydrated(true));
  }, []);

  if (me.isPending || !hydrated) {
    return <p className="p-8 text-center" role="status">Loading your onboarding…</p>;
  }
  if (me.isError || !role) {
    return <p className="p-8 text-center" role="alert">Please log in to continue.</p>;
  }

  const lastStep = titles.length - 1;
  const progress = ((step + 1) / titles.length) * 100;

  function collectValues(formData: FormData) {
    const values: Record<string, unknown> = {};
    for (const [key, value] of formData.entries()) {
      if (value instanceof File) {
        if (value.name) values.studentCsvName = value.name;
      } else if (key === "topics") {
        const topics = formData.getAll("topics").map(String);
        values.topics = topics;
      } else {
        values[key] = value;
      }
    }
    if (role === "mentor" && step === 2) {
      values.topics = formData.getAll("topics").map(String);
    }
    if (formData.has("studentCount")) {
      values.studentCount = Number(formData.get("studentCount"));
    }
    if (formData.has("hoursPerWeek")) {
      values.hoursPerWeek = Number(formData.get("hoursPerWeek"));
    }
    return values;
  }

  function finish(finalData: Record<string, unknown>) {
    complete.mutate(
      { role, data: finalData },
      {
        onSuccess: () => {
          reset();
          toast.success("Welcome to Kisan Shiksha Setu!");
          router.replace(roleHome[role]);
        },
      },
    );
  }

  function advance(values: Record<string, unknown>) {
    const merged = { ...data, ...values };
    updateData(values);
    if (step < lastStep) {
      next();
      return;
    }
    finish(merged);
  }

  function skipStep() {
    if (step < lastStep) {
      next();
      return;
    }
    finish(data);
  }

  return (
    <section className="space-y-6">
      <div>
        <div className="mb-2 flex justify-between text-sm">
          <span>Step {Math.min(step + 1, titles.length)} of {titles.length}</span>
          <span>{role}</span>
        </div>
        <div aria-label={`Onboarding ${Math.round(progress)}% complete`} className="bg-muted h-2 overflow-hidden rounded-full" role="progressbar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100}>
          <div className="bg-forest-700 h-full transition-all" style={{ width: `${progress}%` }} />
        </div>
      </div>
      <h2 className="text-xl font-semibold">{titles[Math.min(step, lastStep)]}</h2>
      <form
        className="space-y-5"
        onSubmit={(event) => {
          event.preventDefault();
          advance(collectValues(new FormData(event.currentTarget)));
        }}
        onChange={(event) => {
          const values = collectValues(new FormData(event.currentTarget));
          updateData(values);
        }}
      >
        <RoleStepFields role={role} step={Math.min(step, lastStep)} data={data} />
        <div className="flex flex-wrap justify-between gap-3">
          <Button disabled={step === 0 || complete.isPending} onClick={back} type="button" variant="outline">Back</Button>
          <div className="flex gap-3">
            <Button disabled={complete.isPending} onClick={skipStep} type="button" variant="ghost">Skip</Button>
            <Button disabled={complete.isPending} type="submit">{step === lastStep ? "Finish" : "Continue"}</Button>
          </div>
        </div>
      </form>
    </section>
  );
}
