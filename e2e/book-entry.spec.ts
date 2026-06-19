import { expect, test } from "@playwright/test";
import { loginAsCustomer } from "./helpers/auth";

test.describe("Booking entry points", () => {
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
    await page.getByRole("button", { name: "Cleaning", exact: true }).click();
    await expect(page.getByRole("tab", { name: "House cleaning" })).toBeVisible();
    await page.getByRole("tab", { name: "Deep cleaning" }).click();
    await expect(page).toHaveURL(/category=cleaning.*type=deep/);
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

  test("hero Laundry & Ironing expands laundry pills", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Laundry & Ironing" }).click();
    await expect(page.getByRole("tab", { name: "Wash & fold" })).toBeVisible();
    await page.getByRole("tab", { name: "Ironing" }).click();
    await expect(page).toHaveURL(/category=laundry.*type=ironing/);
  });

  test("hero Garden & Yard Work expands garden pills", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Garden & Yard Work" }).click();
    await expect(page.getByRole("tab", { name: "Lawn cutting" })).toBeVisible();
    await page.getByRole("tab", { name: "Yard sweeping" }).click();
    await expect(page).toHaveURL(/category=garden.*type=yard_sweeping/);
  });

  test("plain /customer/book shows all launch service pills", async ({ page }) => {
    await page.goto("/customer/book");
    await expect(page.getByRole("heading", { name: "What do you need?" })).toBeVisible();
    await expect(page.getByRole("tab", { name: "Deep cleaning" })).toBeVisible();
    await expect(page.getByRole("tab", { name: "Day nanny" })).toBeVisible();
    await expect(page.getByRole("tab", { name: "Guest checkout clean" })).toBeVisible();
    await expect(page.getByRole("tab", { name: "Wash & fold" })).toBeVisible();
    await expect(page.getByRole("tab", { name: "Lawn cutting" })).toBeVisible();
  });

  test("book cleaning without type redirects to homepage pills", async ({ page }) => {
    await page.goto("/customer/book?category=cleaning");
    await expect(page).toHaveURL(/#hero-cleaning-panel/);
  });

  test("book laundry without type redirects to homepage pills", async ({ page }) => {
    await page.goto("/customer/book?category=laundry");
    await expect(page).toHaveURL(/#hero-laundry-panel/);
  });
});
