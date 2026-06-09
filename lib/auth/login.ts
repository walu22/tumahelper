import { getRouteHandlerClient } from "@/lib/supabase";
import {
  getRedirectForRole,
  isDevBypassEnabled,
  LOGIN_ACCOUNTS_BY_EMAIL,
  resolveLoginEmail,
} from "./config";
import { clearDevSessionCookie, setDevSessionCookie } from "./session";

export class AuthError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AuthError";
  }
}

export interface SignInResult {
  redirect: string;
  user: { id: string; role: string; email: string };
}

export async function signIn(params: {
  email: string;
  password: string;
  redirect?: string | null;
}): Promise<SignInResult> {
  const email = resolveLoginEmail(params.email);
  const password = params.password;

  if (!email || !password) {
    throw new AuthError("Email and password are required");
  }

  if (isDevBypassEnabled()) {
    const account = LOGIN_ACCOUNTS_BY_EMAIL[email];
    if (!account || password !== "dev123") {
      throw new AuthError("Invalid email or password");
    }

    setDevSessionCookie(account);

    return {
      redirect: getRedirectForRole(account.role, params.redirect),
      user: { id: account.id, role: account.role, email: account.email },
    };
  }

  const supabase = getRouteHandlerClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error || !data.session || !data.user) {
    throw new AuthError(error?.message || "Invalid email or password");
  }

  const { getAdminClient } = await import("@/lib/supabase");
  const admin = getAdminClient();
  const { data: profile } = await admin
    .from("users")
    .select("id, role, email")
    .eq("id", data.user.id)
    .maybeSingle();

  if (!profile?.role) {
    throw new AuthError("No profile found for this account. Contact support.");
  }

  return {
    redirect: getRedirectForRole(profile.role, params.redirect),
    user: {
      id: profile.id,
      role: profile.role,
      email: profile.email || email,
    },
  };
}

export async function signOut() {
  clearDevSessionCookie();

  if (!isDevBypassEnabled()) {
    const supabase = getRouteHandlerClient();
    await supabase.auth.signOut();
  }
}
