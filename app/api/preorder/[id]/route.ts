import { apiResponse, errorResponse } from "@/lib/server/api-response";
import {
  deletePreorder,
  findPreorder,
  PreorderNotFoundError,
  updatePreorder,
} from "@/features/preorders/server/preorder.service";
import type { PreorderPayload } from "@/features/preorders/preorder.types";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

function toErrorResponse(error: unknown, fallback: string) {
  if (error instanceof PreorderNotFoundError) {
    return errorResponse(error.message, 404);
  }

  return errorResponse(error instanceof Error ? error.message : fallback);
}

export async function GET(_request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const preorder = await findPreorder(id);

    return apiResponse({
      statusCode: 200,
      message: "Preorder fetched successfully.",
      data: preorder,
    });
  } catch (error) {
    return toErrorResponse(error, "Failed to fetch preorder.");
  }
}

export async function PATCH(request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const payload = (await request.json()) as Partial<PreorderPayload>;
    const preorder = await updatePreorder(id, payload);

    return apiResponse({
      statusCode: 200,
      message: "Preorder updated successfully.",
      data: preorder,
    });
  } catch (error) {
    return toErrorResponse(error, "Failed to update preorder.");
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const preorder = await deletePreorder(id);

    return apiResponse({
      statusCode: 200,
      message: "Preorder deleted successfully.",
      data: preorder,
    });
  } catch (error) {
    return toErrorResponse(error, "Failed to delete preorder.");
  }
}
