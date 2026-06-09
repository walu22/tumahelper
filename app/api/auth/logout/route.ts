import { NextResponse } from "next/server";
import { signOut } from "@/lib/auth/login";
import { errorResponse } from "@/lib/auth";

export async function POST() {
  try {
    await signOut();
    return NextResponse.json({
      success: true,
      data: { message: "Logged out successfully" },
    });
  } catch (error) {
    return errorResponse("INTERNAL_ERROR", "Logout failed", 500);
  }
}
