import { NextResponse, type NextRequest } from "next/server";
import { getAdminClient } from "@/lib/supabase";
import { resolveUserFromRequest } from "@/lib/auth/session";
import { getRedirectForRole, isDevBypassEnabled } from "@/lib/auth/config";
import {
  BYPASS_COOKIE,
  hasComingSoonBypassCookie,
  isComingSoonExemptPath,
  previewTokenMatches,
  shouldGateRequest,
} from "@/lib/coming-soon";

const PROTECTED_PREFIXES = ["/customer", "/worker", "/employer", "/admin"];
const ONBOARDING_ROLES = ["customer", "worker", "employer"] as const;

function withPathname(request: NextRequest, pathname: string) {
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-pathname", pathname);
  return requestHeaders;
}

function handleComingSoon(request: NextRequest): NextResponse | null {
  const host = request.headers.get("host");
  const { pathname, searchParams } = request.nextUrl;
  const preview = searchParams.get("preview");

  if (previewTokenMatches(preview)) {
    const url = request.nextUrl.clone();
    url.searchParams.delete("preview");
    const response = NextResponse.redirect(url);
    response.cookies.set(BYPASS_COOKIE, "1", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });
    return response;
  }

  if (
    hasComingSoonBypassCookie(request.cookies.get(BYPASS_COOKIE)?.value) ||
    isComingSoonExemptPath(pathname)
  ) {
    return null;
  }

  if (!shouldGateRequest(host, pathname)) return null;

  const url = request.nextUrl.clone();
  url.pathname = "/coming-soon";
  url.search = "";
  const requestHeaders = withPathname(request, "/coming-soon");
  return NextResponse.rewrite(url, { request: { headers: requestHeaders } });
}

export async function middleware(request: NextRequest) {
  const comingSoonResponse = handleComingSoon(request);
  if (comingSoonResponse) return comingSoonResponse;

  const { pathname } = request.nextUrl;
  const requestHeaders = withPathname(request, pathname);

  const response = NextResponse.next({
    request: { headers: requestHeaders },
  });

  if (pathname.startsWith("/onboarding/")) {
    const onboardingRole = pathname.split("/")[2];
    const user = await resolveUserFromRequest(request, response);

    if (!user) {
      const url = new URL("/login", request.url);
      url.searchParams.set(
        "redirect",
        `${pathname}${request.nextUrl.search}`
      );
      return NextResponse.redirect(url);
    }

    if (
      ONBOARDING_ROLES.includes(onboardingRole as (typeof ONBOARDING_ROLES)[number]) &&
      user.role !== onboardingRole
    ) {
      return NextResponse.redirect(
        new URL(getRedirectForRole(user.role), request.url)
      );
    }

    return response;
  }

  // Allow /customer/book to be accessed without login so users can browse
  // services from the landing page. Auth is enforced at booking submission.
  const PUBLIC_PATHS = ["/customer/book"];
  const isPublicPath = PUBLIC_PATHS.some((path) => pathname.startsWith(path));

  const isProtected = PROTECTED_PREFIXES.some((path) =>
    pathname.startsWith(path)
  );

  if (!isProtected || isPublicPath) return response;

  const user = await resolveUserFromRequest(request, response);

  if (!user) {
    const url = new URL("/login", request.url);
    const returnTo = `${pathname}${request.nextUrl.search}`;
    url.searchParams.set("redirect", returnTo);
    return NextResponse.redirect(url);
  }

  if (pathname.startsWith("/admin") && user.role !== "admin") {
    if (isDevBypassEnabled()) {
      return NextResponse.redirect(
        new URL(getRedirectForRole(user.role), request.url)
      );
    }

    const admin = getAdminClient();
    const { data: dbUser } = await admin
      .from("users")
      .select("role")
      .eq("id", user.id)
      .maybeSingle();

    if (dbUser?.role !== "admin") {
      return NextResponse.redirect(
        new URL(getRedirectForRole(dbUser?.role ?? user.role), request.url)
      );
    }
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|logo\\.svg|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
