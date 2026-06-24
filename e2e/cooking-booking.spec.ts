import { expect, test } from "@playwright/test";
import { loginAsCustomer } from "./helpers/auth";
import {
  MOCK_CATEGORIES,
  MOCK_CLEANER_WORKER,
  mockServiceCategories,
  tomorrowIsoDate,
} from "./helpers/mocks";

const MOCK_BOOKING_ID = "c0000000-0000-0000-0000-000000000003";

test.describe("Cooking booking end-to-end", () => {
  test.beforeEach(async ({ page }) => {
    await mockServiceCategories(page);

    await page.route("**/api/workers?category=house_cleaner*", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          success: true,
          data: [{ ...MOCK_CLEANER_WORKER, category: "cooking", full_name: "Cooking Pro" }],
        }),
      });
    });
  });

  test("customer can book a cooking service", async ({ page, baseURL }) => {
    let capturedBookingBody: Record<string, unknown> | null = null;

    await page.route("**/api/bookings", async (route) => {
      if (route.request().method() !== "POST") return route.continue();
      capturedBookingBody = route.request().postDataJSON();
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          success: true,
          data: { id: MOCK_BOOKING_ID, booking_code: "TH-COOK01", status: "pending" },
        }),
      });
    });

    await loginAsCustomer(page, baseURL!);

    await page.goto("/customer/book?category=cooking&type=lunch");
    await expect(page.getByRole("heading", { name: "Where should the cook come?" })).toBeVisible();

    await page.locator("#cooking-street").fill("Plot 5, Woodlands");
    await page.getByText("Confirm this address").click();

    await expect(page.getByRole("heading", { name: "How often?" })).toBeVisible();
    await page.getByRole("button", { name: "One-time visit" }).click();
    await page.getByRole("button", { name: "Pick a date" }).click();
    await page.locator("#service-date").fill(tomorrowIsoDate());
    await page.locator("#service-start-time").selectOption("10:00");
    await page.getByRole("button", { name: "Continue" }).click();

    await expect(page.getByText("Meals and kitchen tasks")).toBeVisible();
    await page.locator("#cooking-notes").fill("No peanuts, prefer mild spices.");

    await page.getByRole("button", { name: "Choose your cook" }).click();
    await expect(page.getByRole("heading", { name: "Choose your cook" })).toBeVisible();
    await expect(page.getByText("Cooking Pro")).toBeVisible();

    await page.getByRole("button", { name: /Cooking Pro/i }).click();
    await expect(page.getByRole("heading", { name: "Confirm your booking" })).toBeVisible();

    await Promise.all([
      page.waitForURL(new RegExp(`/customer/bookings/${MOCK_BOOKING_ID}`)),
      page.getByRole("button", { name: "Confirm booking" }).click(),
    ]);

    expect(capturedBookingBody).toMatchObject({
      categoryId: MOCK_CATEGORIES[1].id,
      serviceDate: tomorrowIsoDate(),
      serviceTime: "10:00",
      amount: expect.any(Number),
      serviceDetails: expect.objectContaining({
        category: "cooking",
        serviceType: "lunch",
      }),
    });
  });
});
