import { NextRequest, NextResponse } from "next/server";
import { AuthError, signIn } from "@/lib/auth/login";
import { successResponse } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const result = await signIn({
      email: body.email,
      password: body.password,
      redirect: body.redirect,
    });

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error) {
    const message = error instanceof AuthError ? error.message : "Login failed";
    return NextResponse.json({ success: false, error: message }, { status: 401 });
  }
}
