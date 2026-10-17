"use client";

import React from "react";
import { TaskFilter } from "@/types/todo";

interface TaskFiltersProps {
  currentFilter: TaskFilter;
  onFilterChange: (filter: TaskFilter) => void;
  totalCount: number;
  activeCount: number;
  completedCount: number;
}

export default function TaskFilters({
  currentFilter,
  onFilterChange,
  totalCount,
  activeCount,
  completedCount,
}: TaskFiltersProps) {
  const filters: { id: TaskFilter; label: string; count: number }[] = [
    { id: "all", label: "All", count: totalCount },
    { id: "active", label: "Active", count: activeCount },
    { id: "completed", label: "Completed", count: completedCount },
  ];

  return (
    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-200 pb-3">
      <div className="flex items-center gap-2">
        {filters.map((filter) => {
          const isActive = currentFilter === filter.id;
          return (
            <button
              key={filter.id}
              onClick={() => onFilterChange(filter.id)}
              className={`rounded px-3 py-1 text-sm font-medium ${
                isActive
                  ? "bg-blue-600 text-white"
                  : "border border-gray-300 text-gray-700 hover:bg-gray-50"
              }`}
              type="button"
              aria-pressed={isActive}
            >
              {filter.label} ({filter.count})
            </button>
          );
        })}
      </div>

      <div className="text-xs text-gray-500">
        {activeCount} remaining
      </div>
    </div>
  );
}
