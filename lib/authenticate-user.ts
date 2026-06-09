import { getRouteHandlerClient, getAdminClient } from "@/lib/supabase";
import {
  ensureDevAuthUser,
  getDevRole,
  normalizeEmail,
  ROLE_REDIRECTS,
} from "@/lib/dev-auth";
import {
  DEV_PASSWORD,
  getDevAccountByEmail,
  isDevAuthBypassEnabled,
  setDevSessionInCookies,
} from "@/lib/dev-auth-bypass";
import type { Session } from "@supabase/supabase-js";

export type AuthenticateSuccess = {
  ok: true;
  redirect: string;
  user: { id: string; role: string };
  session?: Session;
  usedDevBypass: boolean;
};

export type AuthenticateFailure = {
  ok: false;
  error: string;
};

export type AuthenticateResult = AuthenticateSuccess | AuthenticateFailure;

export async function authenticateUser(params: {
  email: string;
  password: string;
  redirect?: string | null;
}): Promise<AuthenticateResult> {
  if (!params.email || !params.password) {
    return { ok: false, error: "Email and password required" };
  }

  const normalizedEmail = normalizeEmail(params.email);
  const devRole = getDevRole(normalizedEmail);

  if (isDevAuthBypassEnabled()) {
    const account = getDevAccountByEmail(normalizedEmail);
    if (!account || params.password !== DEV_PASSWORD) {
      return { ok: false, error: "Invalid email or password" };
    }

    setDevSessionInCookies(account);

    return {
      ok: true,
      redirect: params.redirect || ROLE_REDIRECTS[account.role] || "/dashboard",
      user: { id: account.id, role: account.role },
      usedDevBypass: true,
    };
  }

  if (devRole) {
    await ensureDevAuthUser({
      email: normalizedEmail,
      password: params.password,
      role: devRole,
    });
  }

  const supabase = getRouteHandlerClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email: normalizedEmail,
    password: params.password,
  });

  if (error || !data.session) {
    return { ok: false, error: error?.message || "Invalid email or password" };
  }

  const adminClient = getAdminClient();
  const { data: profile } = await adminClient
    .from("users")
    .select("id, role")
    .eq("id", data.user.id)
    .maybeSingle();

  const role = profile?.role || devRole;
  if (!role) {
    return { ok: false, error: "Account profile not found" };
  }

  return {
    ok: true,
    redirect: params.redirect || ROLE_REDIRECTS[role] || "/dashboard",
    user: { id: profile?.id || data.user.id, role },
    session: data.session,
    usedDevBypass: false,
  };
}
