import { NextRequest } from "next/server";
import { getRouteHandlerClient } from "@/lib/supabase";
import { requireRole, successResponse, errorResponse } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const user = await requireRole("worker");

    const formData = await request.formData();
    const file = formData.get("file") as File;
    const documentType = formData.get("documentType") as string;

    if (!file || !documentType) {
      return errorResponse("MISSING_FIELDS", "File and document type required", 400);
    }

    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      return errorResponse("FILE_TOO_LARGE", "Max file size is 5MB", 400);
    }

    const allowedTypes = ["image/jpeg", "image/png", "application/pdf"];
    if (!allowedTypes.includes(file.type)) {
      return errorResponse("INVALID_TYPE", "Only JPEG, PNG, PDF allowed", 400);
    }

    const supabase = getRouteHandlerClient();

    const fileName = `${user.id}/${documentType}-${Date.now()}.${file.name.split('.').pop()}`;
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("worker-documents")
      .upload(fileName, file, {
        contentType: file.type,
        upsert: false,
      });

    if (uploadError) {
      return errorResponse("UPLOAD_FAILED", uploadError.message, 500);
    }

    const { data: { publicUrl } } = supabase.storage
      .from("worker-documents")
      .getPublicUrl(fileName);

    const { data: doc, error: docError } = await supabase
      .from("verification_documents")
      .insert({
        worker_id: user.id,
        document_type: documentType,
        file_url: publicUrl,
        file_name: file.name,
        file_size: file.size,
        mime_type: file.type,
        status: "submitted",
      })
      .select()
      .single();

    if (docError) {
      return errorResponse("SAVE_FAILED", docError.message, 500);
    }

    await supabase
      .from("worker_profiles")
      .update({ verification_status: "pending" })
      .eq("user_id", user.id);

    return successResponse(doc);
  } catch (error) {
    return errorResponse("INTERNAL_ERROR", "Failed to upload document", 500);
  }
}

export async function GET(request: NextRequest) {
  try {
    const user = await requireRole("worker");
    const supabase = getRouteHandlerClient();

    const { data, error } = await supabase
      .from("verification_documents")
      .select("*")
      .eq("worker_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      return errorResponse("FETCH_FAILED", error.message, 500);
    }

    return successResponse(data || []);
  } catch (error) {
    return errorResponse("INTERNAL_ERROR", "Failed to fetch documents", 500);
  }
}
