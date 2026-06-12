import { expect, test } from "@playwright/test";
import { loginAsCustomer } from "./helpers/auth";

test.describe("Booking entry points", () => {
  test.beforeEach(async ({ page, baseURL }) => {
    await loginAsCustomer(page, baseURL!);
  });

  test("hero Nannies icon opens babysitting details", async ({ page }) => {
    await page.goto("/");
    await page.locator('a[href="/customer/book?category=nanny&type=babysitting"]').first().click();
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
    await page.locator('a[href="/customer/book?category=cleaning&type=standard"]').first().click();
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
