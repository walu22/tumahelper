import {
  ROLE_REDIRECTS,
  normalizeEmail,
  LOGIN_ACCOUNTS,
  LOGIN_ACCOUNTS_BY_EMAIL,
} from "./auth/config";

export { ROLE_REDIRECTS, normalizeEmail, LOGIN_ACCOUNTS };

export { findUserByEmail, ensureAuthUser, ensureAuthUser as ensureDevAuthUser } from "./auth/provision";

export function getDevRole(email: string) {
  return LOGIN_ACCOUNTS_BY_EMAIL[normalizeEmail(email)]?.role ?? null;
}

export function getDevEmail(role: string, phone?: string) {
  if (phone) return `${phone.replace("+", "")}@tumahelper.dev`;
  return `${role}@tumahelper.dev`;
}

export async function findDevUser(role: string) {
  const { getAdminClient } = await import("./supabase");
  const admin = getAdminClient();
  const { data } = await admin
    .from("users")
    .select("id, role, email, phone")
    .eq("role", role)
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle();
  return data;
}

export async function findDevUserByPhone(phone: string) {
  const { getAdminClient } = await import("./supabase");
  const admin = getAdminClient();
  const { data } = await admin
    .from("users")
    .select("id, role, email, phone")
    .eq("phone", phone)
    .maybeSingle();
  return data;
}
