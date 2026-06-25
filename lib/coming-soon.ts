const BYPASS_COOKIE = "coming_soon_bypass";

const LIVE_SITE_HOST = "tumahelper.com";

function normalizeHost(host?: string | null): string {
  return (host ?? "").toLowerCase().split(":")[0]?.replace(/^www\./, "") ?? "";
}

export function isLiveSiteHost(host?: string | null): boolean {
  return normalizeHost(host) === LIVE_SITE_HOST;
}

export function isComingSoonEnabled(host?: string | null): boolean {
  if (process.env.COMING_SOON === "false") return false;
  if (process.env.COMING_SOON === "true") return true;
  if (isLiveSiteHost(host)) return true;
  return process.env.VERCEL_ENV === "production";
}

export function getComingSoonBypassSecret(): string | undefined {
  const secret = process.env.COMING_SOON_BYPASS_SECRET?.trim();
  return secret || undefined;
}

export function isStaticAssetPath(pathname: string): boolean {
  return (
    pathname.startsWith("/_next/") ||
    pathname === "/favicon.ico" ||
    pathname === "/logo.svg" ||
    /\.(svg|png|jpg|jpeg|gif|webp|ico)$/i.test(pathname)
  );
}

export function hasComingSoonBypassCookie(cookieValue: string | undefined): boolean {
  return cookieValue === "1" && !!getComingSoonBypassSecret();
}

export function isComingSoonExemptPath(pathname: string): boolean {
  return pathname === "/coming-soon" || isStaticAssetPath(pathname);
}

export function previewTokenMatches(token: string | null): boolean {
  const secret = getComingSoonBypassSecret();
  return !!secret && !!token && token === secret;
}

export function shouldGateRequest(
  host: string | null | undefined,
  pathname: string,
  bypassCookie?: string
): boolean {
  if (!isComingSoonEnabled(host)) return false;
  if (hasComingSoonBypassCookie(bypassCookie)) return false;
  if (isComingSoonExemptPath(pathname)) return false;
  return true;
}

export { BYPASS_COOKIE };
