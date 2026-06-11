import { expect, test } from "@playwright/test";
import { loginAs, loginAsCustomer, loginAsWorker } from "./helpers/auth";

test.describe("Auth & route access", () => {
  test("unauthenticated customer route redirects to login", async ({ page }) => {
    await page.goto("/customer/dashboard");
    await expect(page).toHaveURL(/\/login\?redirect=/);
  });

  test("unauthenticated worker route redirects to login", async ({ page }) => {
    await page.goto("/worker/dashboard");
    await expect(page).toHaveURL(/\/login\?redirect=/);
  });

  test("customer cannot access admin", async ({ page, baseURL }) => {
    await loginAsCustomer(page, baseURL!);
    await page.goto("/admin");
    await expect(page).not.toHaveURL(/\/admin$/);
  });

  test("worker can access worker dashboard", async ({ page, baseURL }) => {
    await loginAsWorker(page, baseURL!);
    await page.goto("/worker/dashboard");
    await expect(page).toHaveURL(/\/worker\/dashboard/);
    await expect(page.getByRole("heading").first()).toBeVisible();
  });

  test("admin can access admin dashboard", async ({ page, baseURL }) => {
    test.setTimeout(60_000);
    await loginAs(page, baseURL!, "admin");
    await page.goto("/admin", { waitUntil: "domcontentloaded" });
    await expect(page).toHaveURL(/\/admin/, { timeout: 15_000 });
    await expect(page.getByRole("heading").first()).toBeVisible({ timeout: 30_000 });
  });
});
