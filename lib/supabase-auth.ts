import { createClient, type User as AuthUser } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import type { NextRequest } from "next/server";
import { getAuthCookieName } from "@/lib/auth-session";

function getSupabaseAnonClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
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

export function getAccessTokenFromRequest(request: NextRequest): string | null {
  const cookieName = getAuthCookieName();
  const raw = request.cookies.get(cookieName)?.value;

  if (raw) {
    const token = readAccessToken(raw);
    if (token) return token;
  }

  const chunks: string[] = [];
  for (let i = 0; i < 10; i++) {
    const chunk = request.cookies.get(`${cookieName}.${i}`)?.value;
    if (!chunk) break;
    chunks.push(chunk);
  }

  if (chunks.length > 0) {
    return readAccessToken(chunks.join(""));
  }

  return null;
}

export function getAccessTokenFromCookies(): string | null {
  const cookieName = getAuthCookieName();
  const raw = cookies().get(cookieName)?.value;

  if (raw) {
    const token = readAccessToken(raw);
    if (token) return token;
  }

  const chunks: string[] = [];
  for (let i = 0; i < 10; i++) {
    const chunk = cookies().get(`${cookieName}.${i}`)?.value;
    if (!chunk) break;
    chunks.push(chunk);
  }

  if (chunks.length > 0) {
    return readAccessToken(chunks.join(""));
  }

  return null;
}

export async function getAuthUserFromAccessToken(
  accessToken: string
): Promise<AuthUser | null> {
  const supabase = getSupabaseAnonClient();
  const { data, error } = await supabase.auth.getUser(accessToken);

  if (error || !data.user) {
    return null;
  }

  return data.user;
}

export async function getAuthUserFromRequest(
  request: NextRequest
): Promise<AuthUser | null> {
  const accessToken = getAccessTokenFromRequest(request);
  if (!accessToken) return null;
  return getAuthUserFromAccessToken(accessToken);
}

export async function getAuthUserFromCookies(): Promise<AuthUser | null> {
  const accessToken = getAccessTokenFromCookies();
  if (!accessToken) return null;
  return getAuthUserFromAccessToken(accessToken);
}
