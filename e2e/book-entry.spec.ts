import { expect, test } from "@playwright/test";

function customerDevCookie(baseURL: string) {
  const payload = {
    id: "f0000000-0000-0000-0000-000000000001",
    role: "customer",
    email: "client@tumahelper.dev",
    phone: "+260976666666",
    full_name: "Demo Customer",
    exp: Date.now() + 86400000,
  };
  return {
    name: "tumahelper-dev-session",
    value: Buffer.from(JSON.stringify(payload)).toString("base64url"),
    url: baseURL.replace(/\/$/, ""),
    httpOnly: true,
    sameSite: "Lax" as const,
  };
}

test.describe("Booking entry points", () => {
  test.beforeEach(async ({ page, baseURL }) => {
    await page.context().addCookies([customerDevCookie(baseURL!)]);
  });

  test("hero Nannies icon opens babysitting details", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("main").getByRole("link", { name: "Nannies" }).click();
    await expect(page).toHaveURL(/category=nanny.*type=babysitting/);
    await expect(page.getByRole("heading", { name: "Book a service" })).toBeVisible();
    await expect(page.getByRole("heading", { level: 2, name: "Booking details" })).toBeVisible({
      timeout: 15_000,
    });
    await expect(page.locator("#service-date")).toBeVisible();
    await expect(page.getByText("Nanny Services")).toHaveCount(0);
    await expect(page.getByText("House Cleaning")).toHaveCount(0);
  });

  test("hero Cleaning icon opens standard clean details", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("main").getByRole("link", { name: "Cleaning" }).click();
    await expect(page).toHaveURL(/category=cleaning.*type=standard/);
    await expect(page.getByRole("heading", { level: 2, name: "Booking details" })).toBeVisible({
      timeout: 15_000,
    });
    await expect(page.locator("#service-date")).toBeVisible();
  });

  test("FAQ Book cleaning uses standard clean deep link", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("link", { name: "Book cleaning" }).click();
    await expect(page).toHaveURL(/category=cleaning.*type=standard/);
    await expect(page.getByRole("heading", { level: 2, name: "Booking details" })).toBeVisible({
      timeout: 15_000,
    });
  });

  test("plain /customer/book shows service types not category cards", async ({ page }) => {
    await page.goto("/customer/book");
    await expect(page.getByRole("heading", { name: "What do you need?" })).toBeVisible();
    await expect(page.getByText("Babysitting")).toBeVisible();
    await expect(page.getByText("Standard home clean")).toBeVisible();
    await expect(page.getByText("Nanny Services")).toHaveCount(0);
  });
});
