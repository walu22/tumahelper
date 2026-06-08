import { NextRequest } from "next/server";
import { getCurrentUser, successResponse, errorResponse } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return errorResponse("UNAUTHORIZED", "Not authenticated", 401);
    }

    return successResponse({ user });
  } catch (error) {
    return errorResponse("INTERNAL_ERROR", "Failed to get user", 500);
  }
}
