import { NextRequest } from "next/server";
import { getRouteHandlerClient } from "@/lib/supabase";
import { successResponse, errorResponse } from "@/lib/auth";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const supabase = getRouteHandlerClient();

    const { data, error } = await supabase
      .from("job_posts")
      .select(`
        *,
        employer:employer_id(full_name),
        applications:job_applications(count)
      `)
      .eq("id", id)
      .eq("status", "open")
      .single();

    if (error || !data) {
      return errorResponse("NOT_FOUND", "Job not found", 404);
    }

    return successResponse(data);
  } catch (error) {
    return errorResponse("INTERNAL_ERROR", "Failed to fetch job", 500);
  }
}
