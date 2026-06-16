import { NextResponse, type NextRequest } from "next/server";
import { getAdminClient } from "@/lib/supabase";
import { resolveUserFromRequest } from "@/lib/auth/session";
import { getRedirectForRole, isDevBypassEnabled } from "@/lib/auth/config";

const PROTECTED_PREFIXES = ["/customer", "/worker", "/employer", "/admin"];
const ONBOARDING_ROLES = ["customer", "worker", "employer"] as const;

export async function middleware(request: NextRequest) {
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-pathname", request.nextUrl.pathname);

  const response = NextResponse.next({
    request: { headers: requestHeaders },
  });

  const { pathname } = request.nextUrl;

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
  matcher: [
    "/(customer|worker|employer|admin)/:path*",
    "/api/admin/:path*",
    "/onboarding/:path*",
  ],
};
