import { NextRequest } from "next/server";
import { getRouteHandlerClient } from "@/lib/supabase";
import { errorResponse, successResponse } from "@/lib/auth";
import { z } from "zod";

const verifySchema = z.object({
  phone: z.string().regex(/^\+260\d{9}$/),
  code: z.string().regex(/^\d{6}$/),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { phone, code } = verifySchema.parse(body);

    const supabase = getRouteHandlerClient();

    const { data, error } = await supabase.auth.verifyOtp({
      phone,
      token: code,
      type: "sms",
    });

    if (error || !data.session) {
      return errorResponse("INVALID_OTP", "Invalid or expired OTP", 401);
    }

    const { data: user } = await supabase
      .from("users")
      .select("*")
      .eq("phone", phone)
      .single();

    return successResponse({
      token: data.session.access_token,
      user: user || null,
      isNewUser: !user,
    });
  } catch (error) {
    return errorResponse("VALIDATION_ERROR", "Invalid input", 400);
  }
}
