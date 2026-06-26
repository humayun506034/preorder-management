"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import type {
  PreorderSortBy,
  PreorderSortByFilter,
  PreorderStatusFilter,
  SortOrder,
  SortOrderFilter,
} from "@/features/preorders/preorder.types";
import {
  sortByOptions,
  sortOrderOptions,
  statusOptions,
} from "@/features/preorders/preorder-options";

type PreorderFiltersProps = {
  status: PreorderStatusFilter;
  sortBy: PreorderSortByFilter;
  sortOrder: SortOrderFilter;
  onStatusChange: (value: PreorderStatusFilter) => void;
  onSortByChange: (value: PreorderSortByFilter) => void;
  onSortOrderChange: (value: SortOrderFilter) => void;
};

const buttonMotion = {
  whileHover: { scale: 1.03 },
  whileTap: { scale: 0.96 },
  transition: { type: "spring", stiffness: 500, damping: 30 },
} as const;

function SortIcon() {
  return (
    <svg
      aria-hidden="true"
      className="h-4 w-4"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M8 4v16m0 0-4-4m4 4 4-4M16 20V4m0 0-4 4m4-4 4 4" />
    </svg>
  );
}

function OrderIcon({ direction }: { direction: "asc" | "desc" }) {
  const path =
    direction === "asc"
      ? "M12 19V5m0 0-5 5m5-5 5 5"
      : "M12 5v14m0 0-5-5m5 5 5-5";

  return (
    <svg
      aria-hidden="true"
      className="h-4 w-4"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d={path} />
    </svg>
  );
}

const hasSortByValue = (
  option: (typeof sortByOptions)[number],
): option is { label: string; value: PreorderSortBy } => option.value !== "";

const hasSortOrderValue = (
  option: (typeof sortOrderOptions)[number],
): option is { label: string; value: SortOrder } => option.value !== "";

export function PreorderFilters({
  status,
  sortBy,
  sortOrder,
  onStatusChange,
  onSortByChange,
  onSortOrderChange,
}: PreorderFiltersProps) {
  const [isSortOpen, setIsSortOpen] = useState(false);

  return (
    <div className="relative flex min-w-0 items-center justify-between gap-2 border-b border-neutral-200 bg-white px-2 py-2 sm:h-12 sm:px-3 sm:py-0">
      <div className="flex min-w-0 flex-1 items-center gap-1 overflow-x-auto [scrollbar-width:none] sm:gap-2 [&::-webkit-scrollbar]:hidden">
        {statusOptions.map((option) => (
          <motion.button
            key={option.value}
            type="button"
            onClick={() => onStatusChange(option.value)}
            {...buttonMotion}
            className={`h-8 shrink-0 rounded-lg px-3 text-sm font-semibold leading-none transition sm:px-4 ${
              status === option.value
                ? "bg-neutral-100 text-neutral-950"
                : "text-neutral-600 hover:bg-neutral-50 hover:text-neutral-950"
            }`}
          >
            {option.label}
          </motion.button>
        ))}
      </div>

      <div className="relative shrink-0">
        <motion.button
          type="button"
          aria-label="Sort preorders"
          aria-expanded={isSortOpen}
          onClick={() => setIsSortOpen((current) => !current)}
          {...buttonMotion}
          className="grid h-8 w-8 place-items-center rounded-lg border border-neutral-200 bg-white text-neutral-700 shadow-sm transition hover:bg-neutral-50"
        >
          <SortIcon />
        </motion.button>

        {isSortOpen ? (
          <div className="absolute right-0 top-10 z-20 w-44 max-w-[calc(100vw-2rem)] overflow-hidden rounded-xl border border-neutral-200 bg-white py-2 text-sm text-neutral-700 shadow-lg">
            <div className="px-3 pb-2 text-sm text-neutral-700">Sort by</div>
            <div className="space-y-1 px-2">
              {sortByOptions
                .filter(hasSortByValue)
                .map((option) => (
                  <motion.button
                    key={option.value}
                    type="button"
                    onClick={() => onSortByChange(option.value)}
                    {...buttonMotion}
                    className="flex h-8 w-full items-center gap-2 rounded-md px-1.5 text-left transition hover:bg-neutral-100"
                  >
                    <span
                      className={`h-4 w-4 rounded-full border ${
                        sortBy === option.value
                          ? "border-neutral-900 bg-neutral-900 shadow-[inset_0_0_0_4px_white]"
                          : "border-neutral-300"
                      }`}
                    />
                    {option.label}
                  </motion.button>
                ))}
            </div>

            <div className="mt-2 border-t border-neutral-200 px-2 pt-2">
              {sortOrderOptions
                .filter(hasSortOrderValue)
                .map((option) => (
                  <motion.button
                    key={option.value}
                    type="button"
                    onClick={() => onSortOrderChange(option.value)}
                    {...buttonMotion}
                    className={`flex h-8 w-full items-center gap-2 rounded-md px-2 text-left font-semibold transition ${
                      sortOrder === option.value
                        ? "bg-neutral-100 text-neutral-950"
                        : "hover:bg-neutral-50"
                    }`}
                  >
                    <OrderIcon direction={option.value} />
                    {option.label}
                  </motion.button>
                ))}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
