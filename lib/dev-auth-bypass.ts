import {
  DEV_PASSWORD,
  DEV_SESSION_COOKIE,
  LOGIN_ACCOUNTS,
  LOGIN_ACCOUNTS_BY_EMAIL,
  normalizeEmail,
  isDevBypassEnabled,
} from "./auth/config";

export {
  DEV_PASSWORD,
  DEV_SESSION_COOKIE,
  LOGIN_ACCOUNTS,
  LOGIN_ACCOUNTS_BY_EMAIL,
  isDevBypassEnabled as isDevAuthBypassEnabled,
};

export {
  setDevSessionCookie as applyDevSessionCookie,
  clearDevSessionCookie,
  resolveUserFromRequest as getDevSessionFromRequest,
  resolveUserFromCookies as getDevSessionFromCookies,
} from "./auth/session";

export function getDevAccountByEmail(email: string) {
  return LOGIN_ACCOUNTS_BY_EMAIL[normalizeEmail(email)] ?? null;
}

export function getDevAccountByPhone(phone: string) {
  return LOGIN_ACCOUNTS.find((account) => account.phone === phone) ?? null;
}
