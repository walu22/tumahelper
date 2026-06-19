import { expect, test } from "@playwright/test";
import { loginAsCustomer } from "./helpers/auth";
import { completeOneTimeSchedule } from "./helpers/schedule";

test.describe("Service model regression", { tag: "@smoke" }, () => {
  test.beforeEach(async ({ page, baseURL }) => {
    await loginAsCustomer(page, baseURL!);
  });

  test("cleaning uses home size on scope step, not duty multi-select", async ({ page }) => {
    await page.goto("/customer/book?category=cleaning&type=standard");
    await expect(page.getByRole("heading", { name: "Where should we clean?" })).toBeVisible({
      timeout: 15_000,
    });

    await page.locator("#cleaning-street").fill("Plot 4, Roma");
    await page.getByText("Confirm this address").click();
    await completeOneTimeSchedule(page);

    await expect(page.getByRole("heading", { name: "Home size" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Duties for this visit" })).toHaveCount(0);
  });

  test("housekeeping uses duty multi-select on scope step, not home size", async ({ page }) => {
    await page.goto("/customer/book?category=housekeeping&type=half_day");
    await expect(page.getByRole("heading", { name: "Where should the helper work?" })).toBeVisible({
      timeout: 15_000,
    });

    await page.locator("#housekeeping-street").fill("Plot 9, Woodlands");
    await page.getByText("Confirm this address").click();
    await completeOneTimeSchedule(page);

    await expect(page.getByRole("heading", { name: "Duties for this visit" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Home size" })).toHaveCount(0);
    await expect(page.getByRole("button", { name: "General cleaning" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Washing dishes" })).toBeVisible();
  });

  test("locked housekeeping type shows time-based copy on address step", async ({ page }) => {
    await page.goto("/customer/book?category=housekeeping&type=full_day");
    await expect(page.getByRole("heading", { name: "Where should the helper work?" })).toBeVisible({
      timeout: 15_000,
    });

    await expect(
      page.getByText(/booking household help for a set time/i)
    ).toBeVisible();
    await expect(page.getByText(/not a fixed clean package/i)).toBeVisible();
  });
});
