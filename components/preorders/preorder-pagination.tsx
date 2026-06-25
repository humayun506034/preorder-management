import type { PreorderMeta } from "@/types/preorder";

type PreorderPaginationProps = {
  meta: PreorderMeta | null;
  onPageChange: (page: number) => void;
};

export function PreorderPagination({
  meta,
  onPageChange,
}: PreorderPaginationProps) {
  const currentPage = meta?.page ?? 1;

  return (
    <div className="flex min-w-0 flex-wrap items-center justify-center gap-2 border-t border-neutral-200 bg-neutral-50 px-2 py-2 sm:min-h-10 sm:gap-3">
      <button
        type="button"
        aria-label="Previous page"
        disabled={!meta?.hasPreviousPage}
        onClick={() => onPageChange(currentPage - 1)}
        className="grid h-7 w-8 place-items-center rounded-lg bg-neutral-200 text-neutral-500 transition hover:bg-neutral-300 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <svg
          aria-hidden="true"
          className="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="m15 18-6-6 6-6" />
        </svg>
      </button>

      <p className="min-w-0 text-center text-xs font-bold text-neutral-800 sm:min-w-44 sm:text-sm">
        Showing {meta?.from ?? 0} to {meta?.to ?? 0} from{" "}
        {meta?.totalItems ?? 0}
      </p>

      <button
        type="button"
        aria-label="Next page"
        disabled={!meta?.hasNextPage}
        onClick={() => onPageChange(currentPage + 1)}
        className="grid h-7 w-8 place-items-center rounded-lg bg-neutral-200 text-neutral-500 transition hover:bg-neutral-300 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <svg
          aria-hidden="true"
          className="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="m9 18 6-6-6-6" />
        </svg>
      </button>
    </div>
  );
}
