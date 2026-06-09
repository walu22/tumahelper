import { NextResponse, type NextRequest } from "next/server";
import { getAdminClient } from "@/lib/supabase";
import { resolveUserFromRequest } from "@/lib/auth/session";
import { isDevBypassEnabled } from "@/lib/auth/config";

const PROTECTED_PREFIXES = ["/customer", "/worker", "/employer", "/admin"];

export async function middleware(request: NextRequest) {
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-pathname", request.nextUrl.pathname);

  const response = NextResponse.next({
    request: { headers: requestHeaders },
  });

  const isProtected = PROTECTED_PREFIXES.some((path) =>
    request.nextUrl.pathname.startsWith(path)
  );

  if (!isProtected) return response;

  const user = await resolveUserFromRequest(request);

  if (!user) {
    const url = new URL("/login", request.url);
    const returnTo = `${request.nextUrl.pathname}${request.nextUrl.search}`;
    url.searchParams.set("redirect", returnTo);
    return NextResponse.redirect(url);
  }

  if (request.nextUrl.pathname.startsWith("/admin") && user.role !== "admin") {
    if (isDevBypassEnabled()) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    const admin = getAdminClient();
    const { data: dbUser } = await admin
      .from("users")
      .select("role")
      .eq("id", user.id)
      .maybeSingle();

    if (dbUser?.role !== "admin") {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  return response;
}

export const config = {
  matcher: ["/(customer|worker|employer|admin)/:path*", "/api/admin/:path*"],
};
