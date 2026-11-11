"use client";

import { create } from "zustand";

export type FilterTableId = "experiments" | "students" | "schools";

export interface TableFilters {
  search: string;
  status: string;
  sort: string;
}

interface FiltersState {
  filters: Record<FilterTableId, TableFilters>;
  setFilters: (tableId: FilterTableId, filters: Partial<TableFilters>) => void;
  resetFilters: (tableId: FilterTableId) => void;
}

const emptyFilters = (): TableFilters => ({ search: "", status: "", sort: "" });

export const useFiltersStore = create<FiltersState>()((set) => ({
  filters: {
    experiments: emptyFilters(),
    students: emptyFilters(),
    schools: emptyFilters(),
  },
  setFilters: (tableId, filters) =>
    set((state) => ({
      filters: {
        ...state.filters,
        [tableId]: { ...state.filters[tableId], ...filters },
      },
    })),
  resetFilters: (tableId) =>
    set((state) => ({
      filters: { ...state.filters, [tableId]: emptyFilters() },
    })),
}));
