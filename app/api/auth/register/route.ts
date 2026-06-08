import { NextRequest } from "next/server";
import { getRouteHandlerClient, getAdminClient } from "@/lib/supabase";
import { errorResponse, successResponse } from "@/lib/auth";
import { registerSchema } from "@/lib/validations";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { phone, role, fullName } = registerSchema.parse(body);

    const supabase = getRouteHandlerClient();
    const adminClient = getAdminClient();

    const { data: { user: authUser } } = await supabase.auth.getUser();

    if (!authUser) {
      return errorResponse("UNAUTHORIZED", "Must verify OTP first", 401);
    }

    const { data: user, error: userError } = await adminClient
      .from("users")
      .insert({
        id: authUser.id,
        phone,
        role,
        full_name: fullName,
        status: "active",
        phone_verified: true,
      })
      .select()
      .single();

    if (userError) {
      return errorResponse("CREATE_FAILED", userError.message, 500);
    }

    if (role === "worker") {
      const { error: profileError } = await adminClient
        .from("worker_profiles")
        .insert({
          user_id: authUser.id,
          full_name: fullName,
          city: "Lusaka",
          area: "Unknown",
          category: "nanny",
          verification_level: "none",
          verification_status: "not_submitted",
        });

      if (profileError) {
        return errorResponse("PROFILE_CREATE_FAILED", profileError.message, 500);
      }
    }

    return successResponse({ user });
  } catch (error) {
    if (error instanceof Error && error.name === "ZodError") {
      return errorResponse("VALIDATION_ERROR", "Invalid input", 400);
    }
    return errorResponse("INTERNAL_ERROR", "Registration failed", 500);
  }
}
