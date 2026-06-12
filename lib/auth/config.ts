import type { UserRole } from "@/types";

export const ROLE_REDIRECTS: Record<string, string> = {
  customer: "/customer/dashboard",
  worker: "/worker/dashboard",
  employer: "/employer/dashboard",
  admin: "/admin",
};

export const DEV_SESSION_COOKIE = "tumahelper-dev-session";
export const DEV_PASSWORD = "dev123";

export interface DevAccount {
  id: string;
  role: UserRole;
  phone: string;
  full_name: string;
  email: string;
}

/** Primary login accounts (synced via npm run setup:credentials) */
export const LOGIN_ACCOUNTS: DevAccount[] = [
  {
    id: "00000000-0000-0000-0000-000000000001",
    role: "admin",
    phone: "+260970000001",
    full_name: "Platform Owner",
    email: "owner@tumahelper.dev",
  },
  {
    id: "a0000000-0000-0000-0000-000000000001",
    role: "worker",
    phone: "+260961111111",
    full_name: "Sarah Mulenga",
    email: "provider@tumahelper.dev",
  },
  {
    id: "f0000000-0000-0000-0000-000000000001",
    role: "customer",
    phone: "+260976666666",
    full_name: "Demo Customer",
    email: "client@tumahelper.dev",
  },
];

export const LOGIN_ACCOUNTS_BY_EMAIL = Object.fromEntries(
  LOGIN_ACCOUNTS.flatMap((account) => [
    [account.email, account],
    ...(account.role === "admin" ? [["admin@tumahelper.dev", account] as const] : []),
    ...(account.role === "worker" ? [["worker@tumahelper.dev", account] as const] : []),
    ...(account.role === "customer" ? [["customer@tumahelper.dev", account] as const] : []),
  ])
);

export function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

/** Map legacy demo emails to the current account emails */
export function resolveLoginEmail(email: string) {
  const normalized = normalizeEmail(email);
  const account = LOGIN_ACCOUNTS_BY_EMAIL[normalized];
  return account?.email ?? normalized;
}

/** All emails that should authenticate to the same dev account (e.g. worker@ + provider@). */
export function getLoginEmailsForAttempt(email: string): string[] {
  const normalized = normalizeEmail(email);
  const account = LOGIN_ACCOUNTS_BY_EMAIL[normalized];
  if (!account) return [normalized];

  const emails = new Set<string>([normalized, account.email]);
  for (const [alias, acc] of Object.entries(LOGIN_ACCOUNTS_BY_EMAIL)) {
    if (acc.id === account.id) emails.add(alias);
  }
  return Array.from(emails);
}

export function getRedirectForRole(role: string, fallback?: string | null) {
  if (fallback) {
    if (fallback.startsWith("/customer") && role !== "customer") {
      return ROLE_REDIRECTS[role] || "/dashboard";
    }
    return fallback;
  }
  return ROLE_REDIRECTS[role] || "/dashboard";
}

export function isDevBypassEnabled() {
  if (process.env.ALLOW_DEV_LOGIN === "true") return true;
  if (process.env.DEV_AUTH_BYPASS === "true") return true;
  if (process.env.NODE_ENV === "production") return false;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";

  return (
    !url ||
    !anonKey ||
    !serviceKey ||
    url.includes("placeholder") ||
    anonKey.includes("placeholder") ||
    serviceKey.includes("placeholder")
  );
}

export function getSupabaseProjectRef() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, "") ?? "";
  const match = url.match(/https:\/\/([^.]+)\.supabase\.co/);
  return match?.[1] ?? "local";
}

export function getSupabaseAuthCookieName() {
  return `sb-${getSupabaseProjectRef()}-auth-token`;
}
