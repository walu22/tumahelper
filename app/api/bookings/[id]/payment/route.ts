import { NextRequest } from "next/server";
import { getRouteHandlerClient } from "@/lib/supabase";
import { requireAuth, successResponse, errorResponse } from "@/lib/auth";

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await requireAuth();
    const { id } = params;

    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return errorResponse("MISSING_FILE", "Payment proof required", 400);
    }

    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      return errorResponse("FILE_TOO_LARGE", "Max 5MB", 400);
    }

    const supabase = getRouteHandlerClient();

    const { data: booking } = await supabase
      .from("bookings")
      .select("*")
      .eq("id", id)
      .single();

    if (!booking) {
      return errorResponse("NOT_FOUND", "Booking not found", 404);
    }

    if (user.id !== booking.customer_id) {
      return errorResponse("FORBIDDEN", "Only customer can upload payment proof", 403);
    }

    const fileName = `payments/${id}/${Date.now()}-${file.name}`;
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("payment-proofs")
      .upload(fileName, file);

    if (uploadError) {
      return errorResponse("UPLOAD_FAILED", uploadError.message, 500);
    }

    const { data: { publicUrl } } = supabase.storage
      .from("payment-proofs")
      .getPublicUrl(fileName);

    const { data, error } = await supabase
      .from("bookings")
      .update({
        payment_status: "paid",
        payment_proof_url: publicUrl,
      })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return errorResponse("UPDATE_FAILED", error.message, 500);
    }

    return successResponse(data);
  } catch (error) {
    return errorResponse("INTERNAL_ERROR", "Failed to upload payment proof", 500);
  }
}
