"use client";

import { useCallback, useEffect, useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import type { SortState } from "@/components/shared/data-table";
import { appStrings } from "@/content/strings";
import { useFiltersStore, type FilterTableId } from "@/stores/filters-store";
import type { Page } from "@/lib/api/schemas";

export function flattenPages<T>(
  pages: readonly Page<T>[] | undefined,
): T[] {
  return pages?.flatMap((page) => page.items) ?? [];
}

export function useUrlFilters(tableId: FilterTableId) {
  const filters = useFiltersStore((state) => state.filters[tableId]);
  const setFilters = useFiltersStore((state) => state.setFilters);
  const [page, setPage] = useState(1);

  const readUrl = useCallback(() => {
    const params = new URLSearchParams(window.location.search);
    setFilters(tableId, {
      search: params.get("search") ?? "",
      status: params.get("status") ?? "",
      sort: params.get("sort") ?? "",
    });
    const parsedPage = Number(params.get("page") ?? "1");
    setPage(Number.isInteger(parsedPage) && parsedPage > 0 ? parsedPage : 1);
  }, [setFilters, tableId]);

  useEffect(() => {
    readUrl();
    window.addEventListener("popstate", readUrl);
    return () => window.removeEventListener("popstate", readUrl);
  }, [readUrl]);

  const update = useCallback(
    (changes: Partial<typeof filters>) => {
      const next = { ...filters, ...changes };
      setFilters(tableId, changes);
      const url = new URL(window.location.href);
      for (const key of ["search", "status", "sort"] as const) {
        if (next[key]) url.searchParams.set(key, next[key]);
        else url.searchParams.delete(key);
      }
      url.searchParams.delete("page");
      window.history.replaceState(null, "", url);
      setPage(1);
    },
    [filters, setFilters, tableId],
  );

  const goToPage = useCallback((nextPage: number) => {
    const url = new URL(window.location.href);
    if (nextPage <= 1) url.searchParams.delete("page");
    else url.searchParams.set("page", String(nextPage));
    window.history.replaceState(null, "", url);
    setPage(nextPage);
  }, []);

  return { filters, page, update, goToPage };
}

export function SearchFilter({
  value,
  onChange,
  label = appStrings.common.search,
  placeholder,
}: {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  placeholder: string;
}) {
  return (
    <label className="relative block w-full sm:max-w-sm">
      <span className="sr-only">{label}</span>
      <Search
        aria-hidden="true"
        className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2"
      />
      <Input
        className="min-h-11 pl-9"
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        type="search"
        value={value}
      />
    </label>
  );
}

export function StatusFilter({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (value: string) => void;
  options: readonly string[];
}) {
  return (
    <label className="flex min-h-11 items-center gap-2 text-sm">
      <span className="text-muted-foreground">{appStrings.common.status}</span>
      <select
        className="border-border h-11 min-w-32 rounded-lg border bg-white px-3"
        onChange={(event) => onChange(event.target.value)}
        value={value}
      >
        <option value="">{appStrings.common.allStatuses}</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {appStrings.common.statusLabel(option)}
          </option>
        ))}
      </select>
    </label>
  );
}

export function filterBySearch<T>(
  rows: readonly T[],
  search: string,
  fields: (row: T) => string[],
) {
  const term = search.trim().toLocaleLowerCase();
  if (!term) return [...rows];
  return rows.filter((row) =>
    fields(row).some((field) => field.toLocaleLowerCase().includes(term)),
  );
}

export function paginate<T>(rows: readonly T[], page: number, pageSize = 10) {
  return rows.slice((page - 1) * pageSize, page * pageSize);
}

export function parseSortState(value: string): SortState | null {
  const [columnId, direction] = value.split(":");
  if (!columnId || (direction !== "ascending" && direction !== "descending")) {
    return null;
  }
  return { columnId, direction };
}

export function serializeSortState(sort: SortState | null) {
  return sort ? `${sort.columnId}:${sort.direction}` : "";
}
