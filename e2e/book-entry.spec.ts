import { expect, test } from "@playwright/test";
import { loginAsCustomer } from "./helpers/auth";

test.describe("Booking entry points", () => {
  test.beforeEach(async ({ page, baseURL }) => {
    await loginAsCustomer(page, baseURL!);
  });

  test("hero Nannies icon opens babysitting flow", async ({ page }) => {
    await page.goto("/");
    await page.locator('a[href="/customer/book?category=nanny&type=babysitting"]').first().click();
    await expect(page).toHaveURL(/category=nanny.*type=babysitting/);
    await expect(page.getByRole("heading", { name: "Book a nanny" })).toBeVisible({
      timeout: 15_000,
    });
    await expect(page.getByRole("heading", { name: "Where do you need care?" })).toBeVisible();
  });

  test("hero shows cleaning pills and deep clean opens booking", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("tab", { name: "Spring cleaning" })).toBeVisible();
    await page.getByRole("tab", { name: "Deep clean" }).click();
    await expect(page).toHaveURL(/category=cleaning.*type=deep/);
    await expect(page.getByRole("heading", { name: "Book house cleaning" })).toBeVisible({
      timeout: 15_000,
    });
    await expect(page.getByText("What type of clean?")).not.toBeVisible();
  });

  test("FAQ Book cleaning scrolls to homepage pills", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("link", { name: "Book cleaning" }).click();
    await expect(page).toHaveURL(/\/(#hero-cleaning-panel)?$/);
    await expect(page.getByRole("tab", { name: "Deep clean" })).toBeVisible();
    await expect(page.getByText("What type of clean?")).not.toBeVisible();
    await expect(page.getByText("Book this clean")).not.toBeVisible();
  });

  test("plain /customer/book shows cleaning pills and nanny options", async ({ page }) => {
    await page.goto("/customer/book");
    await expect(page.getByRole("heading", { name: "What do you need?" })).toBeVisible();
    await expect(page.getByRole("tab", { name: "Deep clean" })).toBeVisible();
    await expect(page.getByText("Book this clean")).not.toBeVisible();
    await expect(page.getByText("Babysitting")).toBeVisible();
  });

  test("book cleaning without type redirects to homepage pills", async ({ page }) => {
    await page.goto("/customer/book?category=cleaning");
    await expect(page).toHaveURL(/\/(#hero-cleaning-panel)?$/);
    await expect(page.getByRole("tab", { name: "Deep clean" })).toBeVisible();
  });
});
