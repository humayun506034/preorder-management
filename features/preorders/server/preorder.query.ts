import type {
  PreorderSortBy,
  PreorderStatus,
  SortOrder,
} from "@/features/preorders/preorder.types";
import {
  DEFAULT_PREORDER_LIMIT,
  DEFAULT_PREORDER_PAGE,
  MAX_PREORDER_LIMIT,
  preorderSortableFields,
  preorderSortOrders,
  preorderStatusFilters,
} from "@/features/preorders/server/preorder.constants";

export type FindPreordersQuery = {
  search?: string;
  status?: PreorderStatus;
  sortBy?: PreorderSortBy;
  sortOrder?: SortOrder;
  page?: number;
  limit?: number;
};

function parsePositiveInt(value: string | null, fallback: number, max?: number) {
  const parsed = Number(value);

  if (!Number.isInteger(parsed) || parsed < 1) {
    return fallback;
  }

  return max ? Math.min(parsed, max) : parsed;
}

function parseEnum<TValue extends string>(
  value: string | null,
  options: readonly TValue[],
  fallback: TValue,
) {
  return options.includes(value as TValue) ? (value as TValue) : fallback;
}

export function parseFindPreordersQuery(searchParams: URLSearchParams) {
  return {
    search: searchParams.get("search")?.trim() || undefined,
    status: parseEnum(searchParams.get("status"), preorderStatusFilters, "all"),
    sortBy: parseEnum(
      searchParams.get("sortBy"),
      preorderSortableFields,
      "createdAt",
    ),
    sortOrder: parseEnum(searchParams.get("sortOrder"), preorderSortOrders, "desc"),
    page: parsePositiveInt(searchParams.get("page"), DEFAULT_PREORDER_PAGE),
    limit: parsePositiveInt(
      searchParams.get("limit"),
      DEFAULT_PREORDER_LIMIT,
      MAX_PREORDER_LIMIT,
    ),
  } satisfies FindPreordersQuery;
}
