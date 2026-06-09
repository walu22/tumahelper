import { NextRequest, NextResponse } from "next/server";
import { getRouteHandlerClient, getAdminClient } from "@/lib/supabase";
import { applySessionCookies } from "@/lib/auth-session";
import {
  ensureDevAuthUser,
  getDevRole,
  normalizeEmail,
  ROLE_REDIRECTS,
} from "@/lib/dev-auth";
import {
  applyDevSessionCookie,
  DEV_PASSWORD,
  getDevAccountByEmail,
  isDevAuthBypassEnabled,
} from "@/lib/dev-auth-bypass";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, redirect: redirectParam } = body;

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: "Email and password required" },
        { status: 400 }
      );
    }

    const normalizedEmail = normalizeEmail(email);
    const devRole = getDevRole(normalizedEmail);

    if (isDevAuthBypassEnabled()) {
      const account = getDevAccountByEmail(normalizedEmail);
      if (!account || password !== DEV_PASSWORD) {
        return NextResponse.json(
          { success: false, error: "Invalid email or password" },
          { status: 401 }
        );
      }

      const redirect = redirectParam || ROLE_REDIRECTS[account.role] || "/dashboard";
      const response = NextResponse.json({
        success: true,
        data: {
          redirect,
          user: { id: account.id, role: account.role },
        },
      });

      return applyDevSessionCookie(response, account);
    }

    if (devRole) {
      await ensureDevAuthUser({
        email: normalizedEmail,
        password,
        role: devRole,
      });
    }

    const supabase = getRouteHandlerClient();
    const { data, error } = await supabase.auth.signInWithPassword({
      email: normalizedEmail,
      password,
    });

    if (error || !data.session) {
      return NextResponse.json(
        { success: false, error: error?.message || "Invalid email or password" },
        { status: 401 }
      );
    }

    const adminClient = getAdminClient();
    const { data: profile } = await adminClient
      .from("users")
      .select("id, role")
      .eq("id", data.user.id)
      .maybeSingle();

    const role = profile?.role || devRole;
    if (!role) {
      return NextResponse.json(
        { success: false, error: "Account profile not found" },
        { status: 404 }
      );
    }

    const redirect = redirectParam || ROLE_REDIRECTS[role] || "/dashboard";

    const response = NextResponse.json({
      success: true,
      data: {
        redirect,
        user: {
          id: profile?.id || data.user.id,
          role,
        },
      },
    });

    return applySessionCookies(response, data.session);
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Login failed" },
      { status: 500 }
    );
  }
}
