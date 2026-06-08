import { NextRequest } from "next/server";
import { getRouteHandlerClient } from "@/lib/supabase";
import { errorResponse, successResponse } from "@/lib/auth";
import { phoneSchema } from "@/lib/validations";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const phone = phoneSchema.parse(body.phone);

    const supabase = getRouteHandlerClient();

    const { data: existingUser } = await supabase
      .from("users")
      .select("id")
      .eq("phone", phone)
      .single();

    const { error } = await supabase.auth.signInWithOtp({
      phone,
      options: {
        channel: "sms",
      },
    });

    if (error) {
      return errorResponse("OTP_SEND_FAILED", error.message, 500);
    }

    return successResponse({
      message: "OTP sent successfully",
      isExistingUser: !!existingUser,
    });
  } catch (error) {
    if (error instanceof Error && error.name === "ZodError") {
      return errorResponse("VALIDATION_ERROR", "Invalid phone number", 400);
    }
    return errorResponse("INTERNAL_ERROR", "Failed to send OTP", 500);
  }
}
