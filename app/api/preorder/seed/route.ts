import { apiResponse, errorResponse } from "@/lib/server/api-response";
import { seedPreorders } from "@/features/preorders/server/preorder.service";

export async function POST() {
  try {
    const result = await seedPreorders();

    return apiResponse({
      statusCode: 201,
      message: "Sample preorder data seeded successfully.",
      data: result,
    });
  } catch (error) {
    return errorResponse(
      error instanceof Error ? error.message : "Failed to seed preorders.",
      500,
    );
  }
}
