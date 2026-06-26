import type {
  GetPreordersParams,
  PreorderSortByFilter,
  PreorderStatusFilter,
  SortOrderFilter,
} from "@/features/preorders/preorder.types";

type Option<TValue extends string | number> = {
  label: string;
  value: TValue;
};

export const defaultFilters = {
  search: "",
  status: "all",
  sortBy: "",
  sortOrder: "",
  page: 1,
  limit: 10,
} satisfies Required<GetPreordersParams>;

export const statusOptions: Option<PreorderStatusFilter>[] = [
  { label: "All", value: "all" },
  { label: "Active", value: "active" },
  { label: "Inactive", value: "inactive" },
];

export const sortByOptions: Option<PreorderSortByFilter>[] = [
  { label: "", value: "" },
  { label: "Name", value: "name" },
  { label: "Created Date", value: "createdAt" },
  { label: "Start Date", value: "startsAt" },
  { label: "End Date", value: "endsAt" },
];

export const sortOrderOptions: Option<SortOrderFilter>[] = [
  { label: "", value: "" },
  { label: "Ascending", value: "asc" },
  { label: "Descending", value: "desc" },
];

export const limitOptions: Option<number>[] = [
  { label: "10 per page", value: 10 },
  { label: "20 per page", value: 20 },
  { label: "50 per page", value: 50 },
  { label: "100 per page", value: 100 },
];
