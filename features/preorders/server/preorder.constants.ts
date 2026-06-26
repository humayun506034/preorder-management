import type {
  PreorderSortBy,
  PreorderStatus,
  SortOrder,
} from "@/features/preorders/preorder.types";

export const DEFAULT_PREORDER_PAGE = 1;
export const DEFAULT_PREORDER_LIMIT = 10;
export const MAX_PREORDER_LIMIT = 100;

export const preorderStatusFilters = [
  "all",
  "active",
  "inactive",
] as const satisfies readonly PreorderStatus[];

export const preorderSortableFields = [
  "name",
  "createdAt",
  "startsAt",
  "endsAt",
] as const satisfies readonly PreorderSortBy[];

export const preorderSortOrders = [
  "asc",
  "desc",
] as const satisfies readonly SortOrder[];
