import { NextRequest, NextResponse } from "next/server";
import { getRouteHandlerClient } from "@/lib/supabase";
import { applySessionCookies, loginRedirectResponse } from "@/lib/auth-session";
import {
  ensureDevAuthUser,
  getDevEmail,
  ROLE_REDIRECTS,
} from "@/lib/dev-auth";

const ACCOUNTS: Record<string, { role: string }> = {
  "+260961111111": { role: "worker" },
  "+260962222222": { role: "worker" },
  "+260963333333": { role: "worker" },
  "+260964444444": { role: "worker" },
  "+260965555555": { role: "worker" },
  "+260966666666": { role: "worker" },
  "+260967777777": { role: "worker" },
  "+260968888888": { role: "worker" },
  "+260969999999": { role: "worker" },
  "+260960000000": { role: "worker" },
  "+260976666666": { role: "customer" },
  "+260977777777": { role: "customer" },
  "+260978888888": { role: "customer" },
  "+260970000004": { role: "customer" },
  "+260970000005": { role: "customer" },
  "+260970000001": { role: "admin" },
};

const DEV_PASSWORD = "dev123";

function appUrl() {
  return process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
}

async function loginWithPhone(phone: string) {
  const account = ACCOUNTS[phone];
  if (!account) {
    throw new Error("Invalid phone");
  }

  const email = getDevEmail(account.role, phone);
  const user = await ensureDevAuthUser({
    email,
    password: DEV_PASSWORD,
    role: account.role,
    phone,
  });

  const supabase = getRouteHandlerClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password: DEV_PASSWORD,
  });

  if (error || !data.session) {
    throw new Error(error?.message || "Sign in failed");
  }

  return {
    user: { id: user.id, role: account.role },
    redirect: ROLE_REDIRECTS[account.role] || "/dashboard",
    session: data.session,
  };
}

export async function GET(request: NextRequest) {
  const phone = request.nextUrl.searchParams.get("phone");
  if (!phone) {
    return NextResponse.redirect(new URL("/dev-login", appUrl()));
  }

  try {
    const { redirect, session } = await loginWithPhone(phone);
    return loginRedirectResponse(request, session, redirect);
  } catch (err: any) {
    const message = encodeURIComponent(err.message || "Login failed");
    return NextResponse.redirect(new URL(`/dev-login?error=${message}`, appUrl()));
  }
}

export async function POST(request: NextRequest) {
  try {
    const { phone } = await request.json();
    if (!phone || !ACCOUNTS[phone]) {
      return NextResponse.json({ success: false, error: "Invalid phone" }, { status: 400 });
    }

    const { user, redirect, session } = await loginWithPhone(phone);

    const response = NextResponse.json({
      success: true,
      data: { user, redirect, isNewUser: false },
    });

    return applySessionCookies(response, session);
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Login failed" },
      { status: 500 }
    );
  }
}
