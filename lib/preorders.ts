import { apiClient } from "@/lib/api-client";
import { defaultFilters } from "@/lib/preorder-options";
import type {
  GetPreordersParams,
  Preorder,
  PreorderPayload,
  PreorderResponse,
} from "@/types/preorder";

export const getPreorders = async ({
  search = defaultFilters.search,
  status = defaultFilters.status,
  sortBy = defaultFilters.sortBy,
  sortOrder = defaultFilters.sortOrder,
  page = defaultFilters.page,
  limit = defaultFilters.limit,
}: GetPreordersParams = {}) => {
  const response = await apiClient.get<PreorderResponse>("/preorder", {
    params: {
      ...(search ? { search } : {}),
      ...(status ? { status } : {}),
      ...(sortBy ? { sortBy } : {}),
      ...(sortOrder ? { sortOrder } : {}),
      page,
      limit,
    },
  });

  return response.data;
};

export const createPreorder = async (payload: PreorderPayload) => {
  const response = await apiClient.post<{
    success: boolean;
    statusCode: number;
    message: string;
    data: Preorder;
  }>("/preorder", payload);

  return response.data;
};

export const updatePreorder = async (id: string, payload: PreorderPayload) => {
  const response = await apiClient.patch<{
    success: boolean;
    statusCode: number;
    message: string;
    data: Preorder;
  }>(`/preorder/${id}`, payload);

  return response.data;
};

export const deletePreorder = async (id: string) => {
  const response = await apiClient.delete<{
    success: boolean;
    statusCode: number;
    message: string;
  }>(`/preorder/${id}`);

  return response.data;
};
