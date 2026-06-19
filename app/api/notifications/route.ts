import { NextRequest } from "next/server";
import { createAuthenticatedRouteHandlerClient } from "@/lib/supabase-server";
import { requireAuth, successResponse, errorResponse } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth();
    const limit = Math.min(
      parseInt(request.nextUrl.searchParams.get("limit") || "20", 10),
      50
    );

    const supabase = createAuthenticatedRouteHandlerClient();
    const { data, error } = await supabase
      .from("notifications")
      .select("id, type, title, message, data, is_read, created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) {
      return errorResponse("FETCH_FAILED", error.message, 500);
    }

    return successResponse(data ?? []);
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return errorResponse("UNAUTHORIZED", "Not authenticated", 401);
    }
    return errorResponse("INTERNAL_ERROR", "Failed to load notifications", 500);
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const user = await requireAuth();
    const body = await request.json();
    const markAll = body?.all === true;
    const ids = Array.isArray(body?.ids) ? (body.ids as string[]) : [];

    const supabase = createAuthenticatedRouteHandlerClient();

    if (markAll) {
      const { error } = await supabase
        .from("notifications")
        .update({ is_read: true })
        .eq("user_id", user.id)
        .eq("is_read", false);

      if (error) {
        return errorResponse("UPDATE_FAILED", error.message, 500);
      }
      return successResponse({ updated: "all" });
    }

    if (ids.length === 0) {
      return errorResponse("VALIDATION_ERROR", "Provide ids or all: true", 400);
    }

    const { error } = await supabase
      .from("notifications")
      .update({ is_read: true })
      .eq("user_id", user.id)
      .in("id", ids);

    if (error) {
      return errorResponse("UPDATE_FAILED", error.message, 500);
    }

    return successResponse({ updated: ids.length });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return errorResponse("UNAUTHORIZED", "Not authenticated", 401);
    }
    return errorResponse("INTERNAL_ERROR", "Failed to update notifications", 500);
  }
}
