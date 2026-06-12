import { NextRequest } from "next/server";
import { createAuthenticatedRouteHandlerClient } from "@/lib/supabase-server";
import { requireAuth, successResponse, errorResponse } from "@/lib/auth";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await requireAuth();
    const { id } = params;
    const supabase = createAuthenticatedRouteHandlerClient();

    const { data, error } = await supabase
      .from("bookings")
      .select(`
        *,
        worker:worker_id(full_name, profile_photo_url, phone),
        customer:customer_id(full_name, phone),
        category:category_id(name)
      `)
      .eq("id", id)
      .single();

    if (error || !data) {
      return errorResponse("NOT_FOUND", "Booking not found", 404);
    }

    if (user.role !== "admin" && user.id !== data.customer_id && user.id !== data.worker_id) {
      return errorResponse("FORBIDDEN", "Access denied", 403);
    }

    return successResponse(data);
  } catch (error) {
    return errorResponse("INTERNAL_ERROR", "Failed to fetch booking", 500);
  }
}
