import type { Page } from "@playwright/test";

type DevRole = "customer" | "worker" | "admin" | "employer";

const DEV_ACCOUNTS: Record<
  DevRole,
  { id: string; email: string; phone: string; full_name: string }
> = {
  customer: {
    id: "f0000000-0000-0000-0000-000000000001",
    email: "client@tumahelper.dev",
    phone: "+260976666666",
    full_name: "Demo Customer",
  },
  worker: {
    id: "a0000000-0000-0000-0000-000000000001",
    email: "worker@tumahelper.dev",
    phone: "+260971111111",
    full_name: "Sarah Mulenga",
  },
  admin: {
    id: "e0000000-0000-0000-0000-000000000001",
    email: "admin@tumahelper.dev",
    phone: "+260970000001",
    full_name: "Admin User",
  },
  employer: {
    id: "d0000000-0000-0000-0000-000000000001",
    email: "employer@tumahelper.dev",
    phone: "+260972222222",
    full_name: "Demo Employer",
  },
};

export function devSessionCookie(baseURL: string, role: DevRole) {
  const account = DEV_ACCOUNTS[role];
  const payload = {
    id: account.id,
    role,
    email: account.email,
    phone: account.phone,
    full_name: account.full_name,
    exp: Date.now() + 86400000 * 365,
  };
  return {
    name: "tumahelper-dev-session",
    value: Buffer.from(JSON.stringify(payload)).toString("base64url"),
    url: baseURL.replace(/\/$/, ""),
    httpOnly: true,
    sameSite: "Lax" as const,
  };
}

export async function loginAs(page: Page, baseURL: string, role: DevRole) {
  await page.context().addCookies([devSessionCookie(baseURL, role)]);
}

export async function loginAsCustomer(page: Page, baseURL: string) {
  await loginAs(page, baseURL, "customer");
}

export async function loginAsWorker(page: Page, baseURL: string) {
  await loginAs(page, baseURL, "worker");
}

export async function loginAsAdmin(page: Page, baseURL: string) {
  await loginAs(page, baseURL, "admin");
}
