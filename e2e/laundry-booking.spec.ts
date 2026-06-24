import { expect, test } from "@playwright/test";
import { loginAsCustomer } from "./helpers/auth";
import {
  MOCK_CATEGORIES,
  MOCK_CLEANER_WORKER,
  mockServiceCategories,
  tomorrowIsoDate,
} from "./helpers/mocks";

const MOCK_BOOKING_ID = "l0000000-0000-0000-0000-000000000004";

test.describe("Laundry booking end-to-end", () => {
  test.beforeEach(async ({ page }) => {
    await mockServiceCategories(page);

    await page.route("**/api/workers?category=house_cleaner*", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          success: true,
          data: [{ ...MOCK_CLEANER_WORKER, category: "laundry", full_name: "Laundry Pro" }],
        }),
      });
    });
  });

  test("customer can book a laundry service", async ({ page, baseURL }) => {
    let capturedBookingBody: Record<string, unknown> | null = null;

    await page.route("**/api/bookings", async (route) => {
      if (route.request().method() !== "POST") return route.continue();
      capturedBookingBody = route.request().postDataJSON();
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          success: true,
          data: { id: MOCK_BOOKING_ID, booking_code: "TH-LAUND01", status: "pending" },
        }),
      });
    });

    await loginAsCustomer(page, baseURL!);

    await page.goto("/customer/book?category=laundry&type=wash_fold");
    await expect(page.getByRole("heading", { name: "Where should we collect or help with laundry?" })).toBeVisible();

    await page.locator("#laundry-street").fill("Plot 5, Woodlands");
    await page.getByText("Confirm this address").click();

    await expect(page.getByRole("heading", { name: "How often?" })).toBeVisible();
    await page.getByRole("button", { name: "One-time visit" }).click();
    await page.getByRole("button", { name: "Pick a date" }).click();
    await page.locator("#service-date").fill(tomorrowIsoDate());
    await page.locator("#service-start-time").selectOption("10:00");
    await page.getByRole("button", { name: "Continue" }).click();

    await expect(page.getByText("Tell us about the laundry load and what you need")).toBeVisible();
    await page.locator("#laundry-notes").fill("Lots of white shirts, please separate them.");

    await page.getByRole("button", { name: "Choose your helper" }).click();
    await expect(page.getByRole("heading", { name: "Choose your laundry helper" })).toBeVisible();
    await expect(page.getByText("Laundry Pro")).toBeVisible();

    await page.getByRole("button", { name: /Laundry Pro/i }).click();
    await expect(page.getByRole("heading", { name: "Confirm your booking" })).toBeVisible();

    await Promise.all([
      page.waitForURL(new RegExp(`/customer/bookings/${MOCK_BOOKING_ID}`)),
      page.getByRole("button", { name: "Confirm booking" }).click(),
    ]);

    expect(capturedBookingBody).toMatchObject({
      serviceDate: tomorrowIsoDate(),
      serviceTime: "10:00",
      amount: expect.any(Number),
      serviceDetails: expect.objectContaining({
        category: "laundry",
        serviceType: "wash_fold",
      }),
    });
  });
});
