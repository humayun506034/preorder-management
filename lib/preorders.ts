import { apiClient } from "@/lib/api-client";
import { defaultFilters } from "@/lib/preorder-options";
import type { GetPreordersParams, PreorderResponse } from "@/types/preorder";

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
