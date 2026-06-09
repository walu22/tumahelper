import { NextResponse } from "next/server";
import { getRouteHandlerClient } from "@/lib/supabase";
import { errorResponse } from "@/lib/auth";
import { clearDevSessionCookie, isDevAuthBypassEnabled } from "@/lib/dev-auth-bypass";

export async function POST() {
  try {
    if (isDevAuthBypassEnabled()) {
      const response = NextResponse.json({
        success: true,
        data: { message: "Logged out successfully" },
      });
      return clearDevSessionCookie(response);
    }

    const supabase = getRouteHandlerClient();
    const { error } = await supabase.auth.signOut();

    if (error) {
      return errorResponse("LOGOUT_FAILED", error.message, 500);
    }

    return NextResponse.json({
      success: true,
      data: { message: "Logged out successfully" },
    });
  } catch (error) {
    return errorResponse("INTERNAL_ERROR", "Logout failed", 500);
  }
}
