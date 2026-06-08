import { NextRequest } from "next/server";
import { getRouteHandlerClient } from "@/lib/supabase";
import { successResponse, errorResponse } from "@/lib/auth";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");

    const supabase = getRouteHandlerClient();

    const { data: profile } = await supabase
      .from("worker_profiles")
      .select("user_id")
      .eq("id", id)
      .single();

    if (!profile) {
      return errorResponse("NOT_FOUND", "Worker not found", 404);
    }

    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const { data, error, count } = await supabase
      .from("reviews")
      .select(`
        *,
        reviewer:reviewer_id(full_name, avatar_url)
      `, { count: "exact" })
      .eq("reviewee_id", profile.user_id)
      .eq("is_visible", true)
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
    return errorResponse("INTERNAL_ERROR", "Failed to fetch reviews", 500);
  }
}
