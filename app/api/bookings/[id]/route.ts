import { NextRequest } from "next/server";
import { createAuthenticatedRouteHandlerClient } from "@/lib/supabase-server";
import { requireAuth, successResponse, errorResponse } from "@/lib/auth";

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await requireAuth();
    const supabase = createAuthenticatedRouteHandlerClient();

    const { data: booking, error } = await supabase
      .from("bookings")
      .select(
        `
        *,
        customer:customer_id(
          id,
          full_name,
          phone
        )
      `
      )
      .eq("id", params.id)
      .single();

    if (error || !booking) {
      return errorResponse("NOT_FOUND", "Booking not found", 404);
    }

    const isCustomer = user.id === booking.customer_id;
    const isWorker = user.id === booking.worker_id;
    const isAdmin = user.role === "admin";

    if (!isCustomer && !isWorker && !isAdmin) {
      return errorResponse("FORBIDDEN", "Access denied", 403);
    }

    if (user.role === "worker" && !isWorker) {
      return errorResponse("FORBIDDEN", "Access denied", 403);
    }

    return successResponse(booking);
  } catch {
    return errorResponse("INTERNAL_ERROR", "Failed to fetch booking", 500);
  }
}
