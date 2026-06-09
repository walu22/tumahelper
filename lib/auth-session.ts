import type { Session } from "@supabase/supabase-js";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const MAX_CHUNK_SIZE = 3180;

export function getSupabaseProjectRef() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, "") ?? "";
  const match = url.match(/https:\/\/([^.]+)\.supabase\.co/);
  return match?.[1] ?? "local";
}

export function getAuthCookieName() {
  return `sb-${getSupabaseProjectRef()}-auth-token`;
}

export function stringifyAuthCookie(session: Session) {
  return JSON.stringify([
    session.access_token,
    session.refresh_token,
    session.provider_token,
    session.provider_refresh_token,
    session.user?.factors ?? null,
  ]);
}

function createCookieChunks(key: string, value: string) {
  if (value.length <= MAX_CHUNK_SIZE) {
    return [{ name: key, value }];
  }

  const chunks: Array<{ name: string; value: string }> = [];
  for (let i = 0; i * MAX_CHUNK_SIZE < value.length; i++) {
    chunks.push({
      name: `${key}.${i}`,
      value: value.slice(i * MAX_CHUNK_SIZE, (i + 1) * MAX_CHUNK_SIZE),
    });
  }
  return chunks;
}

export function applySessionCookies(response: NextResponse, session: Session) {
  const cookieName = getAuthCookieName();
  const value = stringifyAuthCookie(session);
  const chunks = createCookieChunks(cookieName, value);

  for (const chunk of chunks) {
    response.cookies.set(chunk.name, chunk.value, {
      path: "/",
      httpOnly: false,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 365,
    });
  }

  return response;
}

export function loginRedirectResponse(
  request: NextRequest,
  session: Session,
  redirectTo: string
) {
  const response = NextResponse.redirect(new URL(redirectTo, request.url));
  return applySessionCookies(response, session);
}
