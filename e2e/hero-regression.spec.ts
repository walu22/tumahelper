import { expect, test } from "@playwright/test";
import { loginAsCustomer } from "./helpers/auth";

const LAUNCH_HERO_LABELS = [
  "Nannies",
  "Cleaning",
  "Housekeeping",
  "Cooking & Meals",
  "Laundry & Ironing",
  "Garden & Yard",
  "Short-Stay Cleaning",
] as const;

const LAUNCH_HERO_PANEL_IDS = [
  "hero-nanny-panel",
  "hero-cleaning-panel",
  "hero-housekeeping-panel",
  "hero-cooking-panel",
  "hero-laundry-panel",
  "hero-garden-panel",
  "hero-short-stay-panel",
] as const;

test.describe("Launch hero regression", { tag: "@smoke" }, () => {
  test.beforeEach(async ({ page, baseURL }) => {
    await loginAsCustomer(page, baseURL!);
  });

  test("homepage shows seven launch service categories in order", async ({ page }) => {
    await page.goto("/");

    const categoryButtons = page.locator(
      'button[aria-controls^="hero-"][aria-controls$="-panel"]'
    );
    await expect(categoryButtons).toHaveCount(7);

    for (let i = 0; i < LAUNCH_HERO_LABELS.length; i++) {
      await expect(categoryButtons.nth(i)).toHaveAttribute(
        "aria-controls",
        LAUNCH_HERO_PANEL_IDS[i]
      );
      await expect(categoryButtons.nth(i)).toContainText(LAUNCH_HERO_LABELS[i]);
    }
  });

  test("cooking hash expands cooking pills", async ({ page }) => {
    await page.goto("/#hero-cooking-panel");
    await expect(
      page.locator("#hero-cooking-panel").getByRole("tab", { name: /^Lunch\./ })
    ).toBeVisible({ timeout: 10_000 });
    await expect(page.locator("#hero-cooking-panel")).toBeVisible();
  });

  test("laundry hash expands laundry pills", async ({ page }) => {
    await page.goto("/#hero-laundry-panel");
    await expect(page.getByRole("tab", { name: "Wash & fold" })).toBeVisible({ timeout: 10_000 });
    await expect(page.locator("#hero-laundry-panel")).toBeVisible();
  });

  test("garden hash expands garden pills", async ({ page }) => {
    await page.goto("/#hero-garden-panel");
    await expect(page.getByRole("tab", { name: "Lawn cutting" })).toBeVisible({ timeout: 10_000 });
    await expect(page.locator("#hero-garden-panel")).toBeVisible();
  });
});
