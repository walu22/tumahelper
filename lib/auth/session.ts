import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import type { NextRequest } from "next/server";
import type { User } from "@/types";
import {
  DEV_SESSION_COOKIE,
  LOGIN_ACCOUNTS_BY_EMAIL,
  getSupabaseAuthCookieName,
  isDevBypassEnabled,
} from "./config";

interface SessionPayload {
  id: string;
  role: User["role"];
  email: string;
  phone: string;
  full_name: string;
  exp: number;
}

function encodeDevSession(payload: SessionPayload) {
  return Buffer.from(JSON.stringify(payload)).toString("base64url");
}

function decodeDevSession(value: string): SessionPayload | null {
  try {
    const payload = JSON.parse(
      Buffer.from(value, "base64url").toString("utf8")
    ) as SessionPayload;

    if (!payload?.id || !payload?.role || payload.exp < Date.now()) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}

function toUser(payload: SessionPayload): User {
  const now = new Date().toISOString();
  return {
    id: payload.id,
    phone: payload.phone,
    full_name: payload.full_name,
    email: payload.email,
    role: payload.role,
    status: "active",
    phone_verified: true,
    email_verified: true,
    avatar_url: null,
    created_at: now,
    updated_at: now,
  };
}

export function setDevSessionCookie(account: (typeof LOGIN_ACCOUNTS_BY_EMAIL)[string]) {
  const payload: SessionPayload = {
    id: account.id,
    role: account.role,
    email: account.email,
    phone: account.phone,
    full_name: account.full_name,
    exp: Date.now() + 1000 * 60 * 60 * 24 * 365,
  };

  cookies().set(DEV_SESSION_COOKIE, encodeDevSession(payload), {
    path: "/",
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 365,
  });
}

export function clearDevSessionCookie() {
  cookies().set(DEV_SESSION_COOKIE, "", {
    path: "/",
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 0,
  });
}

function readAccessToken(raw: string | undefined): string | null {
  if (!raw) return null;

  try {
    const decoded = raw.startsWith("%") ? decodeURIComponent(raw) : raw;
    const parsed = JSON.parse(decoded);

    if (Array.isArray(parsed) && typeof parsed[0] === "string") {
      return parsed[0];
    }

    if (parsed && typeof parsed.access_token === "string") {
      return parsed.access_token;
    }
  } catch {
    return null;
  }

  return null;
}

function readSupabaseTokenFromCookieStore(
  getValue: (name: string) => string | undefined
) {
  const cookieName = getSupabaseAuthCookieName();
  const direct = readAccessToken(getValue(cookieName));
  if (direct) return direct;

  const chunks: string[] = [];
  for (let i = 0; i < 10; i++) {
    const chunk = getValue(`${cookieName}.${i}`);
    if (!chunk) break;
    chunks.push(chunk);
  }

  return chunks.length > 0 ? readAccessToken(chunks.join("")) : null;
}

function readDevUserFromCookieStore(
  getValue: (name: string) => string | undefined
): User | null {
  const value = getValue(DEV_SESSION_COOKIE);
  if (!value) return null;

  const payload = decodeDevSession(value);
  return payload ? toUser(payload) : null;
}

export async function resolveUserFromRequest(
  request: NextRequest
): Promise<User | null> {
  if (isDevBypassEnabled()) {
    return readDevUserFromCookieStore((name) => request.cookies.get(name)?.value);
  }

  const token = readSupabaseTokenFromCookieStore(
    (name) => request.cookies.get(name)?.value
  );

  if (!token) return null;

  return resolveUserFromAccessToken(token);
}

export async function resolveUserFromCookies(): Promise<User | null> {
  if (isDevBypassEnabled()) {
    return readDevUserFromCookieStore((name) => cookies().get(name)?.value);
  }

  const token = readSupabaseTokenFromCookieStore(
    (name) => cookies().get(name)?.value
  );

  if (!token) return null;

  return resolveUserFromAccessToken(token);
}

async function resolveUserFromAccessToken(token: string): Promise<User | null> {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const { data, error } = await supabase.auth.getUser(token);
  if (error || !data.user) return null;

  const admin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );

  const { data: profile } = await admin
    .from("users")
    .select("*")
    .eq("id", data.user.id)
    .maybeSingle();

  return (profile as User | null) ?? null;
}

export async function resolveAuthIdFromRequest(
  request: NextRequest
): Promise<string | null> {
  const user = await resolveUserFromRequest(request);
  return user?.id ?? null;
}
