import { NextRequest } from "next/server";
import { getAdminClient } from "@/lib/supabase";
import { requireAdmin, successResponse, errorResponse } from "@/lib/auth";
import { rejectDocumentSchema } from "@/lib/validations";

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const admin = await requireAdmin();
    const { id } = params;
    const body = await request.json();
    const { reason } = rejectDocumentSchema.parse(body);

    const adminClient = getAdminClient();

    const { data, error } = await adminClient
      .from("verification_documents")
      .update({
        status: "rejected",
        reviewed_by: admin.id,
        reviewed_at: new Date().toISOString(),
        rejection_reason: reason,
      })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return errorResponse("UPDATE_FAILED", error.message, 500);
    }

    return successResponse(data);
  } catch (error) {
    return errorResponse("INTERNAL_ERROR", "Failed to reject document", 500);
  }
}
