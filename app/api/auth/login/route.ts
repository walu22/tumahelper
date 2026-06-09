import { NextRequest, NextResponse } from "next/server";
import { applySessionCookies } from "@/lib/auth-session";
import { authenticateUser } from "@/lib/authenticate-user";
import {
  applyDevSessionCookie,
  getDevAccountByEmail,
} from "@/lib/dev-auth-bypass";
import { normalizeEmail } from "@/lib/dev-auth";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, redirect: redirectParam } = body;

    const result = await authenticateUser({
      email,
      password,
      redirect: redirectParam,
    });

    if (!result.ok) {
      return NextResponse.json({ success: false, error: result.error }, { status: 401 });
    }

    const response = NextResponse.json({
      success: true,
      data: {
        redirect: result.redirect,
        user: result.user,
      },
    });

    if (result.usedDevBypass) {
      const account = getDevAccountByEmail(normalizeEmail(email));
      if (account) return applyDevSessionCookie(response, account);
    }

    if (result.session) {
      return applySessionCookies(response, result.session);
    }

    return response;
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Login failed" },
      { status: 500 }
    );
  }
}
