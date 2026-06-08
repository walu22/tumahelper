import { NextRequest } from "next/server";
import { getRouteHandlerClient } from "@/lib/supabase";
import { requireAuth, successResponse, errorResponse } from "@/lib/auth";
import { profileUpdateSchema } from "@/lib/validations";

export async function PUT(request: NextRequest) {
  try {
    const user = await requireAuth();
    const body = await request.json();

    const parsed = profileUpdateSchema.safeParse(body);
    if (!parsed.success) {
      return errorResponse("VALIDATION_ERROR", parsed.error.errors[0].message, 400);
    }

    const supabase = getRouteHandlerClient();
    const updateData: Record<string, any> = { updated_at: new Date().toISOString() };
    if (parsed.data.email !== undefined) updateData.email = parsed.data.email;
    if (parsed.data.avatarUrl !== undefined) updateData.avatar_url = parsed.data.avatarUrl;
    if (parsed.data.city !== undefined) updateData.city = parsed.data.city;
    if (parsed.data.area !== undefined) updateData.area = parsed.data.area;
    if (parsed.data.companyName !== undefined) updateData.company_name = parsed.data.companyName;

    const { error } = await supabase
      .from("users")
      .update(updateData)
      .eq("id", user.id);

    if (error) {
      return errorResponse("UPDATE_FAILED", error.message, 500);
    }

    return successResponse({ updated: true });
  } catch (error) {
    return errorResponse("INTERNAL_ERROR", "Failed to update profile", 500);
  }
}
