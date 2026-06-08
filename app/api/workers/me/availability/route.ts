import { NextRequest } from "next/server";
import { getRouteHandlerClient } from "@/lib/supabase";
import { requireRole, successResponse, errorResponse } from "@/lib/auth";
import { z } from "zod";

const availabilitySchema = z.object({
  availabilityStatus: z.enum(["available", "busy", "not_available"]),
});

export async function PATCH(request: NextRequest) {
  try {
    const user = await requireRole("worker");
    const body = await request.json();
    const { availabilityStatus } = availabilitySchema.parse(body);

    const supabase = getRouteHandlerClient();

    const { data, error } = await supabase
      .from("worker_profiles")
      .update({ availability_status: availabilityStatus })
      .eq("user_id", user.id)
      .select()
      .single();

    if (error) {
      return errorResponse("UPDATE_FAILED", error.message, 500);
    }

    return successResponse(data);
  } catch (error) {
    if (error instanceof Error && error.name === "ZodError") {
      return errorResponse("VALIDATION_ERROR", "Invalid availability status", 400);
    }
    return errorResponse("INTERNAL_ERROR", "Failed to update availability", 500);
  }
}
