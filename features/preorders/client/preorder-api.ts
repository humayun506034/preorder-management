import { defaultFilters } from "@/features/preorders/preorder-options";
import type {
  GetPreordersParams,
  Preorder,
  PreorderListResponse,
  PreorderMutationResponse,
  PreorderPayload,
} from "@/features/preorders/preorder.types";

type ApiErrorResponse = {
  message?: string;
};

export class ApiError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ApiError";
  }
}

async function apiRequest<TResponse>(
  path: string,
  init?: RequestInit,
): Promise<TResponse> {
  const response = await fetch(path, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...init?.headers,
    },
  });
  const result = (await response.json()) as TResponse & ApiErrorResponse;

  if (!response.ok) {
    throw new ApiError(result.message ?? "Request failed.");
  }

  return result;
}

export const getPreorders = async ({
  search = defaultFilters.search,
  status = defaultFilters.status,
  sortBy = defaultFilters.sortBy,
  sortOrder = defaultFilters.sortOrder,
  page = defaultFilters.page,
  limit = defaultFilters.limit,
}: GetPreordersParams = {}) => {
  const searchParams = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });

  if (search) searchParams.set("search", search);
  if (status) searchParams.set("status", status);
  if (sortBy) searchParams.set("sortBy", sortBy);
  if (sortOrder) searchParams.set("sortOrder", sortOrder);

  return apiRequest<PreorderListResponse>(
    `/api/preorder?${searchParams.toString()}`,
  );
};

export const createPreorder = async (payload: PreorderPayload) => {
  return apiRequest<PreorderMutationResponse>("/api/preorder", {
    method: "POST",
    body: JSON.stringify(payload),
  });
};

export const updatePreorder = async (id: string, payload: PreorderPayload) => {
  return apiRequest<PreorderMutationResponse>(`/api/preorder/${id}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
};

export const deletePreorder = async (id: string) => {
  return apiRequest<{
    success: boolean;
    statusCode: number;
    message: string;
    data: Preorder;
  }>(`/api/preorder/${id}`, {
    method: "DELETE",
  });
};
