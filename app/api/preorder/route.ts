import { apiResponse, errorResponse } from "@/lib/server/api-response";
import {
  createPreorder,
  findPreorders,
  parseFindPreordersQuery,
} from "@/features/preorders/server/preorder.service";
import type { PreorderPayload } from "@/features/preorders/preorder.types";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const result = await findPreorders(parseFindPreordersQuery(searchParams));

    return apiResponse({
      statusCode: 200,
      message: "Preorder list fetched successfully.",
      data: result.data,
      meta: result.meta,
    });
  } catch (error) {
    return errorResponse(
      error instanceof Error ? error.message : "Failed to fetch preorders.",
      500,
    );
  }
}

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as Partial<PreorderPayload>;
    const preorder = await createPreorder(payload);

    return apiResponse({
      statusCode: 201,
      message: "Preorder created successfully.",
      data: preorder,
    });
  } catch (error) {
    return errorResponse(
      error instanceof Error ? error.message : "Failed to create preorder.",
    );
  }
}
