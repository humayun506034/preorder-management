
"use client";

import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { ConfirmDeleteModal } from "@/components/preorders/confirm-delete-modal";
import { PreorderFilters } from "@/components/preorders/preorder-filters";
import { PreorderForm } from "@/components/preorders/preorder-form";
import { PreorderPagination } from "@/components/preorders/preorder-pagination";
import { PreorderTable } from "@/components/preorders/preorder-table";
import { defaultFilters } from "@/lib/preorder-options";
import {
  createPreorder,
  deletePreorder,
  getPreorders,
  updatePreorder,
} from "@/lib/preorders";
import type {
  Preorder,
  PreorderMeta,
  PreorderPayload,
  PreorderSortByFilter,
  PreorderStatusFilter,
  SortOrderFilter,
} from "@/types/preorder";

type ViewMode = "list" | "create" | "edit";

const buttonMotion = {
  whileHover: { scale: 1.03 },
  whileTap: { scale: 0.96 },
  transition: { type: "spring", stiffness: 500, damping: 30 },
} as const;

const matchesStatusFilter = (
  preorder: Preorder,
  status: PreorderStatusFilter,
) => {
  if (status === "active") {
    return preorder.isActive;
  }

  if (status === "inactive") {
    return !preorder.isActive;
  }

  return true;
};

const decrementMeta = (meta: PreorderMeta | null) => {
  if (!meta) {
    return meta;
  }

  const itemCount = Math.max(meta.itemCount - 1, 0);
  const totalItems = Math.max(meta.totalItems - 1, 0);

  return {
    ...meta,
    itemCount,
    totalItems,
    totalPages: Math.max(Math.ceil(totalItems / meta.limit), 1),
    from: itemCount === 0 ? 0 : meta.from,
    to: itemCount === 0 ? 0 : Math.max(meta.to - 1, meta.from),
    hasNextPage: meta.page < Math.max(Math.ceil(totalItems / meta.limit), 1),
    hasPreviousPage: meta.page > 1,
  };
};

const incrementMeta = (meta: PreorderMeta | null) => {
  if (!meta) {
    return meta;
  }

  const itemCount = Math.min(meta.itemCount + 1, meta.limit);
  const totalItems = meta.totalItems + 1;

  return {
    ...meta,
    itemCount,
    totalItems,
    totalPages: Math.max(Math.ceil(totalItems / meta.limit), 1),
    from: meta.from || 1,
    to: meta.from ? meta.from + itemCount - 1 : itemCount,
    hasNextPage: meta.page < Math.max(Math.ceil(totalItems / meta.limit), 1),
    hasPreviousPage: meta.page > 1,
  };
};

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
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [meta, setMeta] = useState<PreorderMeta | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [updatingStatusId, setUpdatingStatusId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [selectedPreorder, setSelectedPreorder] = useState<Preorder | null>(
    null,
  );
  const [preorderToDelete, setPreorderToDelete] = useState<Preorder | null>(
    null,
  );

  const loadPreorders = useCallback(
    async (shouldUpdate = true) => {
      try {
        await Promise.resolve();

        if (!shouldUpdate) {
          return;
        }

        setIsLoading(true);

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
        setSelectedIds([]);
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
        toast.error(message);
      } finally {
        if (shouldUpdate) {
          setIsLoading(false);
        }
      }
    },
    [limit, page, sortBy, sortOrder, status],
  );

  const syncCurrentPage = useCallback(async () => {
    const result = await getPreorders({
      status,
      sortBy,
      sortOrder,
      page,
      limit,
    });

    setPreorders(result.data);
    setMeta(result.meta);
  }, [limit, page, sortBy, sortOrder, status]);

  useEffect(() => {
    let shouldUpdate = true;
    const timeoutId = window.setTimeout(() => {
      void loadPreorders(shouldUpdate);
    }, 0);

    return () => {
      shouldUpdate = false;
      window.clearTimeout(timeoutId);
    };
  }, [loadPreorders]);

  useEffect(() => {
    const currentPageIds = new Set(
      preorders.map((currentPreorder) => currentPreorder.id),
    );
    const timeoutId = window.setTimeout(() => {
      setSelectedIds((currentIds) =>
        currentIds.filter((currentId) => currentPageIds.has(currentId)),
      );
    }, 0);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [preorders]);

  const handleStatusChange = (value: PreorderStatusFilter) => {
    setStatus(value);
    setPage(1);
    setSelectedIds([]);
  };

  const handleSortByChange = (value: PreorderSortByFilter) => {
    setSortBy(value);
    setPage(1);
    setSelectedIds([]);
  };

  const handleSortOrderChange = (value: SortOrderFilter) => {
    setSortOrder(value);
    setPage(1);
    setSelectedIds([]);
  };

  const handleSelectAll = (checked: boolean) => {
    setSelectedIds(checked ? preorders.map((preorder) => preorder.id) : []);
  };

  const handleSelectOne = (id: string, checked: boolean) => {
    setSelectedIds((currentIds) =>
      checked
        ? Array.from(new Set([...currentIds, id]))
        : currentIds.filter((currentId) => currentId !== id),
    );
  };

  const handleCreateClick = () => {
    setSelectedPreorder(null);
    setViewMode("create");
  };

  const handleEditClick = (preorder: Preorder) => {
    setSelectedPreorder(preorder);
    setViewMode("edit");
  };

  const handleStatusToggle = async (preorder: Preorder) => {
    const nextIsActive = !preorder.isActive;

    try {
      setUpdatingStatusId(preorder.id);

      const result = await updatePreorder(preorder.id, {
        name: preorder.name,
        products: preorder.products,
        preorderWhen: preorder.preorderWhen,
        startsAt: preorder.startsAt,
        endsAt: preorder.endsAt,
        isActive: nextIsActive,
      });

      const wasRemovedFromCurrentFilter = !matchesStatusFilter(
        result.data,
        status,
      );

      if (wasRemovedFromCurrentFilter && meta?.hasNextPage) {
        await syncCurrentPage();
      } else if (wasRemovedFromCurrentFilter && preorders.length === 1 && page > 1) {
        setPage((currentPage) => currentPage - 1);
      } else {
        setPreorders((currentPreorders) => {
          const nextPreorders = currentPreorders
            .map((currentPreorder) =>
              currentPreorder.id === preorder.id ? result.data : currentPreorder,
            )
            .filter((currentPreorder) =>
              matchesStatusFilter(currentPreorder, status),
            );

          if (nextPreorders.length < currentPreorders.length) {
            setMeta(decrementMeta);
          }

          return nextPreorders;
        });
      }

      toast.success(
        `Preorder status updated to ${result.data.isActive ? "Active" : "Inactive"}.`,
      );
    } catch (unknownError) {
      const message = axios.isAxiosError(unknownError)
        ? unknownError.response?.data?.message ??
          "Failed to update preorder status."
        : "Failed to update preorder status.";

      toast.error(message);
    } finally {
      setUpdatingStatusId(null);
    }
  };

  const handleDeleteClick = (preorder: Preorder) => {
    setPreorderToDelete(preorder);
  };

  const handleDeleteCancel = () => {
    setPreorderToDelete(null);
  };

  const handleDeleteConfirm = async () => {
    if (!preorderToDelete) {
      return;
    }

    const preorder = preorderToDelete;

    try {
      setDeletingId(preorder.id);

      await deletePreorder(preorder.id);

      if (meta?.hasNextPage) {
        await syncCurrentPage();
      } else if (preorders.length === 1 && page > 1) {
        setPage((currentPage) => currentPage - 1);
      } else {
        setPreorders((currentPreorders) =>
          currentPreorders.filter(
            (currentPreorder) => currentPreorder.id !== preorder.id,
          ),
        );
        setSelectedIds((currentIds) =>
          currentIds.filter((currentId) => currentId !== preorder.id),
        );
        setMeta(decrementMeta);
      }

      toast.success("Preorder deleted.");
      setPreorderToDelete(null);
    } catch (unknownError) {
      const message = axios.isAxiosError(unknownError)
        ? unknownError.response?.data?.message ?? "Failed to delete preorder."
        : "Failed to delete preorder.";

      toast.error(message);
    } finally {
      setDeletingId(null);
    }
  };

  const handleFormCancel = () => {
    setSelectedPreorder(null);
    setViewMode("list");
  };

  const handleFormSubmit = async (payload: PreorderPayload) => {
    try {
      setIsSubmitting(true);

      if (viewMode === "edit" && selectedPreorder) {
        const result = await updatePreorder(selectedPreorder.id, payload);

        const wasRemovedFromCurrentFilter = !matchesStatusFilter(
          result.data,
          status,
        );

        if (wasRemovedFromCurrentFilter && meta?.hasNextPage) {
          await syncCurrentPage();
        } else if (
          wasRemovedFromCurrentFilter &&
          preorders.length === 1 &&
          page > 1
        ) {
          setPage((currentPage) => currentPage - 1);
        } else {
          setPreorders((currentPreorders) => {
            const nextPreorders = currentPreorders
              .map((currentPreorder) =>
                currentPreorder.id === selectedPreorder.id
                  ? result.data
                  : currentPreorder,
              )
              .filter((currentPreorder) =>
                matchesStatusFilter(currentPreorder, status),
              );

            if (nextPreorders.length < currentPreorders.length) {
              setMeta(decrementMeta);
            }

            return nextPreorders;
          });
        }

        toast.success("Preorder updated.");
      } else {
        const result = await createPreorder(payload);

        if (matchesStatusFilter(result.data, status)) {
          setPreorders((currentPreorders) => [
            result.data,
            ...currentPreorders,
          ].slice(0, limit));
          setMeta(incrementMeta);
        }

        toast.success("Preorder created.");
      }

      setSelectedPreorder(null);
      setViewMode("list");
    } catch (unknownError) {
      const message = axios.isAxiosError(unknownError)
        ? unknownError.response?.data?.message ?? "Failed to save preorder."
        : "Failed to save preorder.";

      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (viewMode !== "list") {
    return (
      <PreorderForm
        preorder={selectedPreorder ?? undefined}
        isSubmitting={isSubmitting}
        onCancel={handleFormCancel}
        onSubmit={handleFormSubmit}
      />
    );
  }

  return (
    <main className="min-h-screen w-full overflow-x-hidden bg-[#f3f3f3] px-3 py-6 text-neutral-900 sm:px-5 sm:py-10 lg:px-8 lg:py-14">
      <div className="mx-auto flex w-full min-w-0 max-w-[min(1120px,100%)] flex-col gap-4 sm:gap-6">
        <div className="flex min-w-0 flex-col gap-3 border-t border-neutral-200 pt-5 sm:flex-row sm:items-center sm:justify-between sm:pt-6">
          <h1 className="min-w-0 text-2xl font-bold tracking-tight text-neutral-900">
            Preorders
          </h1>

          <motion.button
            type="button"
            onClick={handleCreateClick}
            {...buttonMotion}
            className="h-8 w-fit shrink-0 rounded-lg border border-neutral-950 bg-neutral-900 px-4 text-sm font-bold text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.35)] transition hover:bg-neutral-800"
          >
            Create Preorder
          </motion.button>
        </div>

        <section className="min-w-0 overflow-hidden rounded-xl border border-neutral-300 bg-white shadow-sm">
          <PreorderFilters
            status={status}
            sortBy={sortBy}
            sortOrder={sortOrder}
            onStatusChange={handleStatusChange}
            onSortByChange={handleSortByChange}
            onSortOrderChange={handleSortOrderChange}
          />
          <PreorderTable
            preorders={preorders}
            isLoading={isLoading}
            selectedIds={selectedIds}
            onEdit={handleEditClick}
            onDelete={handleDeleteClick}
            onSelectAll={handleSelectAll}
            onSelectOne={handleSelectOne}
            onStatusToggle={handleStatusToggle}
            deletingId={deletingId}
            updatingStatusId={updatingStatusId}
          />
          <PreorderPagination meta={meta} onPageChange={setPage} />
        </section>

        {preorderToDelete ? (
          <ConfirmDeleteModal
            preorder={preorderToDelete}
            isDeleting={deletingId === preorderToDelete.id}
            onCancel={handleDeleteCancel}
            onConfirm={handleDeleteConfirm}
          />
        ) : null}
      </div>
    </main>
  );
}
