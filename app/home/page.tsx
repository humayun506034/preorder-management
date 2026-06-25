
"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { PreorderFilters } from "@/components/preorders/preorder-filters";
import { PreorderPagination } from "@/components/preorders/preorder-pagination";
import { PreorderTable } from "@/components/preorders/preorder-table";
import { defaultFilters } from "@/lib/preorder-options";
import { getPreorders } from "@/lib/preorders";
import type {
  Preorder,
  PreorderMeta,
  PreorderSortByFilter,
  PreorderStatusFilter,
  SortOrderFilter,
} from "@/types/preorder";

export default function Home() {
  const [status, setStatus] =
    useState<PreorderStatusFilter>(defaultFilters.status);
  const [sortBy, setSortBy] =
    useState<PreorderSortByFilter>(defaultFilters.sortBy);
  const [sortOrder, setSortOrder] = useState<SortOrderFilter>(
    defaultFilters.sortOrder,
  );
  const [page, setPage] = useState(defaultFilters.page);
  const [limit] = useState(defaultFilters.limit);
  const [preorders, setPreorders] = useState<Preorder[]>([]);
  const [meta, setMeta] = useState<PreorderMeta | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let shouldUpdate = true;

    const loadPreorders = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const result = await getPreorders({
          status,
          sortBy,
          sortOrder,
          page,
          limit,
        });

        if (!shouldUpdate) {
          return;
        }

        setPreorders(result.data);
        setMeta(result.meta);
      } catch (unknownError) {
        if (!shouldUpdate) {
          return;
        }

        const message = axios.isAxiosError(unknownError)
          ? unknownError.response?.data?.message ?? "Failed to fetch preorders."
          : "Failed to fetch preorders.";

        setPreorders([]);
        setMeta(null);
        setError(message);
      } finally {
        if (shouldUpdate) {
          setIsLoading(false);
        }
      }
    };

    loadPreorders();

    return () => {
      shouldUpdate = false;
    };
  }, [status, sortBy, sortOrder, page, limit]);

  const handleStatusChange = (value: PreorderStatusFilter) => {
    setStatus(value);
    setPage(1);
  };

  const handleSortByChange = (value: PreorderSortByFilter) => {
    setSortBy(value);
    setPage(1);
  };

  const handleSortOrderChange = (value: SortOrderFilter) => {
    setSortOrder(value);
    setPage(1);
  };

  return (
    <main className="min-h-screen w-full overflow-x-hidden bg-[#f3f3f3] px-3 py-8 text-neutral-900 sm:px-6 sm:py-14 lg:px-8">
      <div className="mx-auto flex w-full min-w-0 max-w-[950px] flex-col gap-5 sm:gap-6">
        <div className="flex min-w-0 flex-col gap-4 border-t border-neutral-200 pt-5 sm:flex-row sm:items-center sm:justify-between sm:pt-6">
          <h1 className="text-2xl font-bold tracking-tight text-neutral-900">
            Preorders
          </h1>

          <button
            type="button"
            className="h-8 w-fit rounded-lg border border-neutral-950 bg-neutral-900 px-4 text-sm font-bold text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.35)] transition hover:bg-neutral-800"
          >
            Create Preorder
          </button>
        </div>

        {error ? (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
            {error}
          </div>
        ) : null}

        <section className="min-w-0 overflow-hidden rounded-xl border border-neutral-300 bg-white shadow-sm">
          <PreorderFilters
            status={status}
            sortBy={sortBy}
            sortOrder={sortOrder}
            onStatusChange={handleStatusChange}
            onSortByChange={handleSortByChange}
            onSortOrderChange={handleSortOrderChange}
          />
          <PreorderTable preorders={preorders} isLoading={isLoading} />
          <PreorderPagination meta={meta} onPageChange={setPage} />
        </section>
      </div>
    </main>
  );
}
