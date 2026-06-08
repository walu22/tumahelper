import { NextRequest } from "next/server";
import { getAdminClient } from "@/lib/supabase";
import { requireAdmin, successResponse, errorResponse } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    await requireAdmin();
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status") || "pending";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");

    const adminClient = getAdminClient();

    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const { data, error, count } = await adminClient
      .from("bookings")
      .select(`
        *,
        customer:customer_id(full_name),
        worker:worker_id(full_name)
      `)
      .eq("payment_status", status)
      .order("created_at", { ascending: false })
      .range(from, to);

    if (error) {
      return errorResponse("FETCH_FAILED", error.message, 500);
    }

    return successResponse(data || [], {
      page,
      per_page: limit,
      total: count || 0,
      total_pages: Math.ceil((count || 0) / limit),
    });
  } catch (error) {
    return errorResponse("INTERNAL_ERROR", "Failed to fetch payments", 500);
  }
}
