import { NextRequest } from "next/server";
import { getAdminClient } from "@/lib/supabase";
import { requireAdmin, successResponse, errorResponse } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    await requireAdmin();
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const dateFrom = searchParams.get("dateFrom");
    const dateTo = searchParams.get("dateTo");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");

    const adminClient = getAdminClient();

    let query = adminClient
      .from("bookings")
      .select(`
        *,
        customer:customer_id(full_name, phone),
        worker:worker_id(full_name, phone),
        category:category_id(name)
      `);

    if (status) query = query.eq("status", status);
    if (dateFrom) query = query.gte("service_date", dateFrom);
    if (dateTo) query = query.lte("service_date", dateTo);

    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const { data, error, count } = await query
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
    return errorResponse("INTERNAL_ERROR", "Failed to fetch bookings", 500);
  }
}
