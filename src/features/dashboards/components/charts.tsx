"use client";

import { useId, useState } from "react";
import {
  CartesianGrid,
  LabelList,
  Line,
  LineChart,
  ReferenceDot,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { appStrings } from "@/content/strings";

export type ChartPoint = { date: string; value: number };

function displayDate(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.valueOf())
    ? value
    : new Intl.DateTimeFormat(undefined, {
        month: "short",
        day: "numeric",
      }).format(date);
}

export function MetricChart({
  data,
  metric,
}: {
  data: readonly ChartPoint[];
  metric: string;
}) {
  const [tableView, setTableView] = useState(false);
  const descriptionId = useId();
  const values = data.map((point) => point.value);
  const lastPoint = data.at(-1);

  return (
    <section className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm font-medium">{appStrings.charts.observationsCaption(metric)}</p>
        <Button
          aria-pressed={tableView}
          className="min-h-11"
          onClick={() => setTableView((current) => !current)}
          variant="outline"
        >
          {tableView ? appStrings.charts.viewChart : appStrings.charts.viewTable}
        </Button>
      </div>
      <p className="text-muted-foreground text-sm" id={descriptionId}>
        {data.length
          ? appStrings.charts.chartSummary(
              data.length,
              displayDate(data[0]?.date ?? ""),
              displayDate(data.at(-1)?.date ?? ""),
              Math.min(...values),
              Math.max(...values),
            )
          : appStrings.charts.noObservations}
      </p>
      {tableView ? (
        <div className="overflow-x-auto rounded-lg border">
          <Table>
            <caption className="sr-only">{appStrings.charts.observationsCaption(metric)}</caption>
            <TableHeader>
              <TableRow>
                <TableHead>{appStrings.charts.date}</TableHead>
                <TableHead>{metric}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((point, index) => (
                <TableRow key={`${point.date}-${index}`}>
                  <TableCell>{displayDate(point.date)}</TableCell>
                  <TableCell>{point.value}</TableCell>
                </TableRow>
              ))}
              {data.length === 0 && (
                <TableRow>
                  <TableCell colSpan={2}>{appStrings.charts.emptyObservations}</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div
          aria-describedby={descriptionId}
          aria-label={appStrings.charts.lineChartLabel(metric)}
          className="h-64 min-w-0 w-full"
          role="img"
        >
          <ResponsiveContainer height="100%" width="100%">
            <LineChart data={data} margin={{ top: 16, right: 12, bottom: 8, left: 0 }}>
              <CartesianGrid stroke="currentColor" strokeDasharray="3 5" strokeOpacity=".15" />
              <XAxis
                dataKey="date"
                interval="preserveStartEnd"
                minTickGap={24}
                tickFormatter={displayDate}
                tick={{ fontSize: 11 }}
              />
              <YAxis width={36} tick={{ fontSize: 11 }} />
              <Tooltip labelFormatter={(label) => displayDate(String(label))} />
              <Line
                dataKey="value"
                isAnimationActive={false}
                stroke="var(--color-forest-700, #315c45)"
                strokeWidth={3}
                dot={{ r: 4, fill: "var(--color-forest-700, #315c45)" }}
                activeDot={{ r: 5, fill: "var(--color-forest-700, #315c45)" }}
              >
                <LabelList
                  className="fill-foreground text-[10px]"
                  dataKey="value"
                  position="top"
                />
              </Line>
              {lastPoint && (
                <ReferenceDot
                  fill="var(--color-purple-500, #8b5cf6)"
                  r={6}
                  stroke="none"
                  x={lastPoint.date}
                  y={lastPoint.value}
                />
              )}
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </section>
  );
}

export function DistributionChart({
  values,
}: {
  values: readonly { label: string; value: number }[];
}) {
  const [tableView, setTableView] = useState(false);
  const descriptionId = useId();
  const total = values.reduce((sum, item) => sum + item.value, 0) || 1;

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between gap-2">
        <p className="text-sm font-medium">{appStrings.charts.statusDistribution}</p>
        <Button
          aria-pressed={tableView}
          className="min-h-11"
          onClick={() => setTableView((current) => !current)}
          variant="outline"
        >
          {tableView ? appStrings.charts.viewChart : appStrings.charts.viewTable}
        </Button>
      </div>
      <p className="text-muted-foreground text-sm" id={descriptionId}>
        {appStrings.charts.statusSummary(values)}
      </p>
      {tableView ? (
        <div className="overflow-x-auto rounded-lg border">
          <Table>
            <caption className="sr-only">{appStrings.charts.statusCaption}</caption>
            <TableHeader>
              <TableRow>
                <TableHead>{appStrings.common.status}</TableHead>
                <TableHead>{appStrings.charts.experimentCount}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {values.map(({ label, value }) => (
                <TableRow key={label}>
                  <TableCell>{label}</TableCell>
                  <TableCell>{value}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div aria-describedby={descriptionId} role="img" className="space-y-3">
          {values.map(({ label, value }, index) => (
            <div className="space-y-1" key={label}>
              <div className="flex justify-between gap-3 text-sm">
                <span>{label}</span>
                <span>{value}</span>
              </div>
              <div className="bg-sand-100 h-3 overflow-hidden rounded-full">
                <div
                  className={`h-full ${index === 0 ? "bg-forest-700" : index === 1 ? "bg-purple-500" : "bg-forest-500"}`}
                  style={{ width: `${(value / total) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
