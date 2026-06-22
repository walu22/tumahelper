import { expect, test } from "@playwright/test";
import { loginAsCustomer } from "./helpers/auth";

test.describe("Booking entry points", { tag: "@smoke" }, () => {
  test.beforeEach(async ({ page, baseURL }) => {
    await loginAsCustomer(page, baseURL!);
  });

  test("hero Nannies icon expands nanny pills", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("tab", { name: "Day nanny" })).not.toBeVisible();
    await page.getByRole("button", { name: "Nannies" }).click();
    await expect(page.getByRole("tab", { name: "Day nanny" })).toBeVisible();
    await page.getByRole("tab", { name: "Babysitter" }).click();
    await expect(page).toHaveURL(/category=nanny.*type=babysitter/);
    await expect(page.getByRole("heading", { name: "Book a nanny" })).toBeVisible({
      timeout: 15_000,
    });
  });

  test("hero shows cleaning options after tapping Cleaning", async ({ page }) => {
    await page.goto("/");
    await page.locator('button[aria-controls="hero-cleaning-panel"]').click();
    await expect(page.getByRole("tab", { name: "House cleaning" })).toBeVisible();
    await page.getByRole("tab", { name: "Deep cleaning" }).click();
    await expect(page).toHaveURL(/category=cleaning.*type=deep/);
  });

  test("hero Housekeeping expands housekeeping pills", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("tab", { name: "Half-day" })).not.toBeVisible();
    await page.getByRole("button", { name: "Housekeeping" }).click();
    await expect(page.getByRole("tab", { name: "Half-day" })).toBeVisible();
    await page.getByRole("tab", { name: "Full-day" }).click();
    await expect(page).toHaveURL(/category=housekeeping.*type=full_day/);
    await expect(page.getByRole("heading", { name: "Book housekeeping" })).toBeVisible({
      timeout: 15_000,
    });
  });

  test("hero Short-Stay Cleaning expands short-stay pills", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("tab", { name: "Guest checkout clean" })).not.toBeVisible();
    await page.getByRole("button", { name: "Short-Stay Cleaning" }).click();
    await expect(page.getByRole("tab", { name: "Guest checkout clean" })).toBeVisible();
    await page.getByRole("tab", { name: "Same-day turnaround" }).click();
    await expect(page).toHaveURL(/type=same_day_turnaround/);
    await expect(page.getByRole("heading", { name: "Book short-stay cleaning" })).toBeVisible({
      timeout: 15_000,
    });
  });

  test("hero Cooking & Meals expands cooking pills", async ({ page }) => {
    await page.goto("/");
    await expect(
      page.locator("#hero-cooking-panel").getByRole("tab", { name: /^Lunch\./ })
    ).not.toBeVisible();
    await page.getByRole("button", { name: "Cooking & Meals" }).click();
    await expect(
      page.locator("#hero-cooking-panel").getByRole("tab", { name: /^Lunch\./ })
    ).toBeVisible();
    await page.locator("#hero-cooking-panel").getByRole("tab", { name: /^Dinner\./ }).click();
    await expect(page).toHaveURL(/category=cooking.*type=dinner/);
    await expect(page.getByRole("heading", { name: "Book cooking & meals" })).toBeVisible({
      timeout: 15_000,
    });
  });

  test("hero Laundry & Ironing expands laundry pills", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("tab", { name: "Wash & fold" })).not.toBeVisible();
    await page.getByRole("button", { name: "Laundry & Ironing" }).click();
    await expect(page.getByRole("tab", { name: "Wash & fold" })).toBeVisible();
    await page.getByRole("tab", { name: "Ironing" }).click();
    await expect(page).toHaveURL(/category=laundry.*type=ironing/);
    await expect(page.getByRole("heading", { name: "Book laundry & ironing" })).toBeVisible({
      timeout: 15_000,
    });
  });

  test("hero Garden & Yard expands garden pills", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("tab", { name: "Lawn cutting" })).not.toBeVisible();
    await page.getByRole("button", { name: "Garden & Yard" }).click();
    await expect(page.getByRole("tab", { name: "Lawn cutting" })).toBeVisible();
    await page.getByRole("tab", { name: "Yard sweeping" }).click();
    await expect(page).toHaveURL(/category=garden.*type=yard_sweeping/);
    await expect(page.getByRole("heading", { name: "Book garden & yard work" })).toBeVisible({
      timeout: 15_000,
    });
  });

  test("plain /customer/book shows launch service pills", async ({ page }) => {
    await page.goto("/customer/book");
    await expect(page.getByRole("heading", { name: "What do you need?" })).toBeVisible();
    await expect(page.getByRole("tab", { name: "Deep cleaning" })).toBeVisible();
    await expect(page.getByRole("tab", { name: "Day nanny" })).toBeVisible();
    await expect(page.getByRole("tab", { name: "Half-day" })).toBeVisible();
    await expect(
      page.getByRole("tablist", { name: "Type of cooking visit" }).getByRole("tab", {
        name: /^Lunch\./,
      })
    ).toBeVisible();
    await expect(page.getByRole("tab", { name: "Guest checkout clean" })).toBeVisible();
    await expect(page.getByRole("tab", { name: "Wash & fold" })).toBeVisible();
    await expect(page.getByRole("tab", { name: "Lawn cutting" })).toBeVisible();
  });

  test("book cooking without type starts guided flow with default visit", async ({ page }) => {
    await page.goto("/customer/book?category=cooking");
    await expect(page).toHaveURL(/\/customer\/book\?category=cooking/);
    await expect(page.getByRole("heading", { name: "Book cooking & meals" })).toBeVisible({
      timeout: 15_000,
    });
  });

  test("book laundry without type starts guided flow with default visit", async ({ page }) => {
    await page.goto("/customer/book?category=laundry");
    await expect(page).toHaveURL(/\/customer\/book\?category=laundry/);
    await expect(page.getByRole("heading", { name: "Book laundry & ironing" })).toBeVisible({
      timeout: 15_000,
    });
  });

  test("book garden without type starts guided flow with default visit", async ({ page }) => {
    await page.goto("/customer/book?category=garden");
    await expect(page).toHaveURL(/\/customer\/book\?category=garden/);
    await expect(page.getByRole("heading", { name: "Book garden & yard work" })).toBeVisible({
      timeout: 15_000,
    });
  });

  test("book cleaning without type starts guided flow with default visit", async ({ page }) => {
    await page.goto("/customer/book?category=cleaning");
    await expect(page).toHaveURL(/\/customer\/book\?category=cleaning/);
    await expect(page.getByRole("heading", { name: "Book house cleaning" })).toBeVisible({
      timeout: 15_000,
    });
  });

  test("book housekeeping without type starts guided flow with default visit", async ({ page }) => {
    await page.goto("/customer/book?category=housekeeping");
    await expect(page).toHaveURL(/\/customer\/book\?category=housekeeping/);
    await expect(page.getByRole("heading", { name: "Book housekeeping" })).toBeVisible({
      timeout: 15_000,
    });
  });
});
