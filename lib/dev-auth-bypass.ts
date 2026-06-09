import type { User, UserRole } from "@/types";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export const DEV_SESSION_COOKIE = "tumahelper-dev-session";
export const DEV_PASSWORD = "dev123";

export interface DevAccount {
  id: string;
  role: UserRole;
  phone: string;
  full_name: string;
  email: string;
}

export const DEV_ACCOUNTS: Record<string, DevAccount> = {
  "admin@tumahelper.dev": {
    id: "00000000-0000-0000-0000-000000000001",
    role: "admin",
    phone: "+260970000001",
    full_name: "Dev Admin",
    email: "admin@tumahelper.dev",
  },
  "worker@tumahelper.dev": {
    id: "a0000000-0000-0000-0000-000000000001",
    role: "worker",
    phone: "+260961111111",
    full_name: "Sarah Mulenga",
    email: "worker@tumahelper.dev",
  },
  "customer@tumahelper.dev": {
    id: "f0000000-0000-0000-0000-000000000001",
    role: "customer",
    phone: "+260976666666",
    full_name: "Dev Customer",
    email: "customer@tumahelper.dev",
  },
};

export const DEV_ACCOUNTS_BY_PHONE: Record<string, DevAccount> = Object.fromEntries(
  Object.values(DEV_ACCOUNTS).map((account) => [account.phone, account])
);

export function isDevAuthBypassEnabled() {
  if (process.env.NODE_ENV === "production") return false;
  if (process.env.DEV_AUTH_BYPASS === "true") return true;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";

  return (
    !url ||
    !anonKey ||
    !serviceKey ||
    url.includes("placeholder") ||
    anonKey.includes("placeholder") ||
    serviceKey.includes("placeholder") ||
    url.includes("your-project")
  );
}

export function toDevUser(account: DevAccount): User {
  const now = new Date().toISOString();
  return {
    id: account.id,
    phone: account.phone,
    full_name: account.full_name,
    email: account.email,
    role: account.role,
    status: "active",
    phone_verified: true,
    email_verified: true,
    avatar_url: null,
    created_at: now,
    updated_at: now,
  };
}

interface DevSessionPayload {
  id: string;
  role: UserRole;
  email: string;
  phone: string;
  full_name: string;
  exp: number;
}

function encodeSession(payload: DevSessionPayload) {
  return Buffer.from(JSON.stringify(payload)).toString("base64url");
}

function decodeSession(value: string): DevSessionPayload | null {
  try {
    const payload = JSON.parse(
      Buffer.from(value, "base64url").toString("utf8")
    ) as DevSessionPayload;

    if (!payload?.id || !payload?.role || payload.exp < Date.now()) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}

export function createDevSession(account: DevAccount): DevSessionPayload {
  return {
    id: account.id,
    role: account.role,
    email: account.email,
    phone: account.phone,
    full_name: account.full_name,
    exp: Date.now() + 1000 * 60 * 60 * 24 * 365,
  };
}

export function applyDevSessionCookie(response: NextResponse, account: DevAccount) {
  response.cookies.set(DEV_SESSION_COOKIE, encodeSession(createDevSession(account)), {
    path: "/",
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 365,
  });
  return response;
}

export function clearDevSessionCookie(response: NextResponse) {
  response.cookies.set(DEV_SESSION_COOKIE, "", {
    path: "/",
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 0,
  });
  return response;
}

export function getDevSessionFromRequest(request: NextRequest) {
  const value = request.cookies.get(DEV_SESSION_COOKIE)?.value;
  if (!value) return null;

  const payload = decodeSession(value);
  if (!payload) return null;

  return toDevUser({
    id: payload.id,
    role: payload.role,
    email: payload.email,
    phone: payload.phone,
    full_name: payload.full_name,
  });
}

export function getDevSessionFromCookies() {
  const value = cookies().get(DEV_SESSION_COOKIE)?.value;
  if (!value) return null;

  const payload = decodeSession(value);
  if (!payload) return null;

  return toDevUser({
    id: payload.id,
    role: payload.role,
    email: payload.email,
    phone: payload.phone,
    full_name: payload.full_name,
  });
}

export function getDevAccountByEmail(email: string) {
  return DEV_ACCOUNTS[email.trim().toLowerCase()] ?? null;
}

export function getDevAccountByPhone(phone: string) {
  return DEV_ACCOUNTS_BY_PHONE[phone] ?? null;
}
