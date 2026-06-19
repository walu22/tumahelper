import { expect, test } from "@playwright/test";
import { loginAsCustomer } from "./helpers/auth";

const LAUNCH_HERO_LABELS = ["Nannies", "Cleaning", "Housekeeping", "Short-Stay Cleaning"] as const;

const LAUNCH_HERO_PANEL_IDS = [
  "hero-nanny-panel",
  "hero-cleaning-panel",
  "hero-housekeeping-panel",
  "hero-short-stay-panel",
] as const;

test.describe("Launch hero regression", { tag: "@smoke" }, () => {
  test.beforeEach(async ({ page, baseURL }) => {
    await loginAsCustomer(page, baseURL!);
  });

  test("homepage shows exactly four launch service categories in order", async ({ page }) => {
    await page.goto("/");

    const categoryButtons = page.locator(
      'button[aria-controls^="hero-"][aria-controls$="-panel"]'
    );
    await expect(categoryButtons).toHaveCount(4);

    for (let i = 0; i < LAUNCH_HERO_LABELS.length; i++) {
      await expect(categoryButtons.nth(i)).toHaveAttribute(
        "aria-controls",
        LAUNCH_HERO_PANEL_IDS[i]
      );
      await expect(categoryButtons.nth(i)).toContainText(LAUNCH_HERO_LABELS[i]);
    }
  });

  test("laundry and garden are not on the homepage hero", async ({ page }) => {
    await page.goto("/");

    await expect(page.getByRole("button", { name: "Laundry & Ironing" })).toHaveCount(0);
    await expect(page.getByRole("button", { name: "Garden & Yard Work" })).toHaveCount(0);
  });

  test("legacy laundry hash expands housekeeping pills", async ({ page }) => {
    await page.goto("/#hero-laundry-panel");
    await expect(page.getByRole("tab", { name: "Half-day" })).toBeVisible({ timeout: 10_000 });
    await expect(page.locator("#hero-housekeeping-panel")).toBeVisible();
  });
});
