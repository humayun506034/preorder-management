export type EmptyFilter = "";

export type PreorderStatus = "all" | "active" | "inactive";

export type PreorderStatusFilter = EmptyFilter | PreorderStatus;

export type PreorderSortBy = "name" | "createdAt" | "startsAt" | "endsAt";

export type PreorderSortByFilter = EmptyFilter | PreorderSortBy;

export type SortOrder = "asc" | "desc";

export type SortOrderFilter = EmptyFilter | SortOrder;

export type Preorder = {
  id: string;
  name: string;
  products: number;
  preorderWhen: string;
  startsAt: string;
  endsAt: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type PreorderMeta = {
  page: number;
  limit: number;
  itemCount: number;
  totalItems: number;
  totalPages: number;
  from: number;
  to: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
};

export type PreorderListResponse = {
  success: boolean;
  statusCode: number;
  message: string;
  data: Preorder[];
  meta: PreorderMeta;
};

export type PreorderMutationResponse = {
  success: boolean;
  statusCode: number;
  message: string;
  data: Preorder;
};

export type PreorderPayload = {
  name: string;
  products: number;
  preorderWhen: string;
  startsAt: string;
  endsAt?: string | null;
  isActive: boolean;
};

export type GetPreordersParams = {
  search?: string;
  status?: PreorderStatusFilter;
  sortBy?: PreorderSortByFilter;
  sortOrder?: SortOrderFilter;
  page?: number;
  limit?: number;
};
