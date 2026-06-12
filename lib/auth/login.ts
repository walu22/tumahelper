import { getRouteHandlerClient } from "@/lib/supabase";
import {
  DEV_PASSWORD,
  getLoginEmailsForAttempt,
  getRedirectForRole,
  isDevBypassEnabled,
  LOGIN_ACCOUNTS_BY_EMAIL,
  normalizeEmail,
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
  const password = params.password;
  const loginEmail = normalizeEmail(params.email);

  if (!loginEmail || !password) {
    throw new AuthError("Email and password are required");
  }

  if (isDevBypassEnabled()) {
    const account = LOGIN_ACCOUNTS_BY_EMAIL[loginEmail];
    if (!account || password !== DEV_PASSWORD) {
      throw new AuthError("Invalid email or password");
    }

    setDevSessionCookie(account);

    return {
      redirect: getRedirectForRole(account.role, params.redirect),
      user: { id: account.id, role: account.role, email: account.email },
    };
  }

  const supabase = getRouteHandlerClient();
  let sessionUser: { id: string } | null = null;
  let lastError: { message: string } | null = null;

  for (const email of getLoginEmailsForAttempt(loginEmail)) {
    const result = await supabase.auth.signInWithPassword({ email, password });
    if (result.data.session && result.data.user) {
      sessionUser = result.data.user;
      break;
    }
    lastError = result.error;
  }

  if (!sessionUser) {
    const isKnownDevAccount = !!LOGIN_ACCOUNTS_BY_EMAIL[loginEmail];
    if (isKnownDevAccount && password === DEV_PASSWORD) {
      throw new AuthError(
        "Dev password not recognized in Supabase. Run npm run setup:auth, or set DEV_AUTH_BYPASS=true in .env.local and restart the dev server."
      );
    }
    throw new AuthError(lastError?.message || "Invalid email or password");
  }

  const { getAdminClient } = await import("@/lib/supabase");
  const admin = getAdminClient();
  const { data: profile } = await admin
    .from("users")
    .select("id, role, email")
    .eq("id", sessionUser.id)
    .maybeSingle();

  if (!profile?.role) {
    throw new AuthError("No profile found for this account. Contact support.");
  }

  return {
    redirect: getRedirectForRole(profile.role, params.redirect),
    user: {
      id: profile.id,
      role: profile.role,
      email: profile.email || loginEmail,
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
