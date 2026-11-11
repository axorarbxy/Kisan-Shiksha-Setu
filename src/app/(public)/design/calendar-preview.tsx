"use client";

import dynamic from "next/dynamic";
import { enUS } from "date-fns/locale";
import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";

const Calendar = dynamic(
  () => import("@/components/ui/calendar").then((module) => module.Calendar),
  {
    ssr: false,
    loading: () => <Skeleton className="h-80 w-full max-w-sm rounded-xl" />,
  },
);

export function CalendarPreview() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();

  return (
    <Calendar
      locale={enUS}
      mode="single"
      onSelect={setSelectedDate}
      selected={selectedDate}
      timeZone="UTC"
    />
  );
}
