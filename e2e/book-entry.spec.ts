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
    await expect(page.getByRole("heading", { name: "Where do you need care?" })).toBeVisible();
  });

  test("hero shows cleaning options after tapping Cleaning", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("tab", { name: "House cleaning" })).not.toBeVisible();
    await page.getByRole("button", { name: "Cleaning" }).click();
    await expect(page.getByRole("tab", { name: "House cleaning" })).toBeVisible();
    await page.getByRole("tab", { name: "Deep cleaning" }).click();
    await expect(page).toHaveURL(/category=cleaning.*type=deep/);
    await expect(page.getByRole("heading", { name: "Book house cleaning" })).toBeVisible({
      timeout: 15_000,
    });
    await expect(page.getByText("What type of clean?")).not.toBeVisible();
  });

  test("hero Airbnb clean expands airbnb pills", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("tab", { name: "Guest checkout clean" })).not.toBeVisible();
    await page.getByRole("button", { name: "Airbnb clean" }).click();
    await expect(page.getByRole("tab", { name: "Guest checkout clean" })).toBeVisible();
    await page.getByRole("tab", { name: "Same-day turnaround" }).click();
    await expect(page).toHaveURL(/type=same_day_turnaround/);
    await expect(page.getByRole("heading", { name: "Book Airbnb cleaning" })).toBeVisible({
      timeout: 15_000,
    });
  });

  test("FAQ Book cleaning scrolls to homepage pills", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("link", { name: "Book cleaning" }).click();
    await expect(page).toHaveURL(/#hero-cleaning-panel/);
    await expect(page.getByRole("tab", { name: "Deep cleaning" })).toBeVisible();
    await expect(page.getByText("What type of clean?")).not.toBeVisible();
    await expect(page.getByText("Book this clean")).not.toBeVisible();
  });

  test("plain /customer/book shows cleaning, nanny, and airbnb pills", async ({ page }) => {
    await page.goto("/customer/book");
    await expect(page.getByRole("heading", { name: "What do you need?" })).toBeVisible();
    await expect(page.getByRole("tab", { name: "Deep cleaning" })).toBeVisible();
    await expect(page.getByRole("tab", { name: "Day nanny" })).toBeVisible();
    await expect(page.getByRole("tab", { name: "Guest checkout clean" })).toBeVisible();
    await expect(page.getByText("Book this clean")).not.toBeVisible();
  });

  test("book cleaning without type redirects to homepage pills", async ({ page }) => {
    await page.goto("/customer/book?category=cleaning");
    await expect(page).toHaveURL(/#hero-cleaning-panel/);
    await page.getByRole("button", { name: "Cleaning" }).click();
    await expect(page.getByRole("tab", { name: "Deep cleaning" })).toBeVisible();
  });

  test("book nanny without type redirects to homepage pills", async ({ page }) => {
    await page.goto("/customer/book?category=nanny");
    await expect(page).toHaveURL(/#hero-nanny-panel/);
    await page.getByRole("button", { name: "Nannies" }).click();
    await expect(page.getByRole("tab", { name: "Babysitter" })).toBeVisible();
  });

  test("book airbnb without type redirects to homepage pills", async ({ page }) => {
    await page.goto("/customer/book/airbnb");
    await expect(page).toHaveURL(/#hero-airbnb-panel/);
    await page.getByRole("button", { name: "Airbnb clean" }).click();
    await expect(page.getByRole("tab", { name: "Same-day turnaround" })).toBeVisible();
  });
});
