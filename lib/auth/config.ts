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
  LOGIN_ACCOUNTS.map((account) => [account.email, account])
);

export function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

export function getRedirectForRole(role: string, fallback?: string | null) {
  return fallback || ROLE_REDIRECTS[role] || "/dashboard";
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
