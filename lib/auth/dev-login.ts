import type { DevAccount } from "./config";
import { getRedirectForRole } from "./config";
import { setDevSessionCookie } from "./session";

export function isDevLoginPageEnabled(): boolean {
  if (process.env.NODE_ENV === "production") {
    return process.env.ALLOW_DEV_LOGIN === "true";
  }
  return true;
}

export function signInAsDevAccount(
  account: DevAccount,
  redirect?: string | null
): { redirect: string } {
  setDevSessionCookie(account);
  return {
    redirect: getRedirectForRole(account.role, redirect),
  };
}

export function getDevAccountAliases(account: DevAccount): string[] {
  switch (account.role) {
    case "admin":
      return ["admin@tumahelper.dev", account.email];
    case "worker":
      return ["worker@tumahelper.dev", account.email];
    case "customer":
      return ["customer@tumahelper.dev", account.email];
    default:
      return [account.email];
  }
}
