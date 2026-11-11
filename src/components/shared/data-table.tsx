"use client";

import { useMemo, useState, type ReactNode } from "react";
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export type DataTableColumn<T> = {
  id: string;
  header: string;
  cell: (row: T) => ReactNode;
  sortValue?: (row: T) => string | number | null;
};

type SortState = {
  columnId: string;
  direction: "ascending" | "descending";
};

function compareValues(
  left: string | number | null,
  right: string | number | null,
) {
  if (left === null) return right === null ? 0 : 1;
  if (right === null) return -1;
  if (typeof left === "number" && typeof right === "number") {
    return left - right;
  }
  return String(left).localeCompare(String(right), undefined, {
    numeric: true,
    sensitivity: "base",
  });
}

export function DataTable<T>({
  columns,
  data,
  getRowKey,
  loading = false,
  loadingRows = 5,
  emptyTitle = "No results yet",
  emptyDescription = "There is no data to show here.",
}: {
  columns: DataTableColumn<T>[];
  data: readonly T[];
  getRowKey: (row: T, index: number) => string;
  loading?: boolean;
  loadingRows?: number;
  emptyTitle?: string;
  emptyDescription?: string;
}) {
  const [sort, setSort] = useState<SortState | null>(null);
  const sortedData = useMemo(() => {
    if (!sort) return data;
    const column = columns.find(({ id }) => id === sort.columnId);
    const sortValue = column?.sortValue;
    if (!sortValue) return data;
    const direction = sort.direction === "ascending" ? 1 : -1;
    return [...data].sort(
      (left, right) =>
        direction * compareValues(sortValue(left), sortValue(right)),
    );
  }, [columns, data, sort]);

  function toggleSort(columnId: string) {
    setSort((current) =>
      current?.columnId === columnId
        ? {
            columnId,
            direction:
              current.direction === "ascending" ? "descending" : "ascending",
          }
        : { columnId, direction: "ascending" },
    );
  }

  return (
    <div className="border-border bg-card overflow-hidden rounded-xl border">
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((column) => {
              const isSorted = sort?.columnId === column.id;
              const SortIcon = !isSorted
                ? ArrowUpDown
                : sort.direction === "ascending"
                  ? ArrowUp
                  : ArrowDown;

              return (
                <TableHead
                  aria-sort={isSorted ? sort.direction : "none"}
                  key={column.id}
                >
                  {column.sortValue ? (
                    <Button
                      className="-ml-3"
                      onClick={() => toggleSort(column.id)}
                      variant="ghost"
                    >
                      {column.header}
                      <SortIcon aria-hidden="true" className="size-4" />
                    </Button>
                  ) : (
                    column.header
                  )}
                </TableHead>
              );
            })}
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading
            ? Array.from({ length: loadingRows }, (_, rowIndex) => (
                <TableRow key={`loading-${rowIndex}`}>
                  {columns.map((column) => (
                    <TableCell key={column.id}>
                      <Skeleton className="h-5 w-3/4" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            : sortedData.map((row, rowIndex) => (
                <TableRow key={getRowKey(row, rowIndex)}>
                  {columns.map((column) => (
                    <TableCell key={column.id}>{column.cell(row)}</TableCell>
                  ))}
                </TableRow>
              ))}
        </TableBody>
      </Table>
      {!loading && sortedData.length === 0 && (
        <div className="p-4">
          <EmptyState title={emptyTitle} description={emptyDescription} />
        </div>
      )}
    </div>
  );
}
