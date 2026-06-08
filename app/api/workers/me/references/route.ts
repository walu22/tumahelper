import { NextRequest } from "next/server";
import { getRouteHandlerClient } from "@/lib/supabase";
import { requireRole, successResponse, errorResponse } from "@/lib/auth";
import { referenceSchema } from "@/lib/validations";

export async function POST(request: NextRequest) {
  try {
    const user = await requireRole("worker");
    const body = await request.json();
    const validated = referenceSchema.parse(body);

    const supabase = getRouteHandlerClient();

    const { data, error } = await supabase
      .from("worker_references")
      .insert({
        worker_id: user.id,
        referee_name: validated.refereeName,
        referee_phone: validated.refereePhone,
        relationship: validated.relationship,
        work_period: validated.workPeriod,
        status: "pending",
      })
      .select()
      .single();

    if (error) {
      return errorResponse("SAVE_FAILED", error.message, 500);
    }

    return successResponse(data);
  } catch (error) {
    if (error instanceof Error && error.name === "ZodError") {
      return errorResponse("VALIDATION_ERROR", "Invalid reference data", 400);
    }
    return errorResponse("INTERNAL_ERROR", "Failed to add reference", 500);
  }
}

export async function GET(request: NextRequest) {
  try {
    const user = await requireRole("worker");
    const supabase = getRouteHandlerClient();

    const { data, error } = await supabase
      .from("worker_references")
      .select("*")
      .eq("worker_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      return errorResponse("FETCH_FAILED", error.message, 500);
    }

    return successResponse(data || []);
  } catch (error) {
    return errorResponse("INTERNAL_ERROR", "Failed to fetch references", 500);
  }
}
