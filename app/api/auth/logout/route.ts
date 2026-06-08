import { NextRequest } from "next/server";
import { getRouteHandlerClient } from "@/lib/supabase";
import { successResponse, errorResponse } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const supabase = getRouteHandlerClient();
    const { error } = await supabase.auth.signOut();

    if (error) {
      return errorResponse("LOGOUT_FAILED", error.message, 500);
    }

    return successResponse({ message: "Logged out successfully" });
  } catch (error) {
    return errorResponse("INTERNAL_ERROR", "Logout failed", 500);
  }
}
