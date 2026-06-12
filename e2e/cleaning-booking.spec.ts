import { expect, test } from "@playwright/test";
import { loginAsCustomer } from "./helpers/auth";
import {
  MOCK_CATEGORIES,
  MOCK_CLEANER_WORKER,
  mockServiceCategories,
  tomorrowIsoDate,
} from "./helpers/mocks";

const MOCK_BOOKING_ID = "c0000000-0000-0000-0000-000000000002";

test.describe("Cleaning booking end-to-end", () => {
  test.beforeEach(async ({ page }) => {
    await mockServiceCategories(page);

    await page.route("**/api/workers?category=house_cleaner*", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ success: true, data: [MOCK_CLEANER_WORKER] }),
      });
    });
  });

  test("customer can book standard home clean", async ({ page, baseURL }) => {
    test.setTimeout(60_000);

    let capturedBookingBody: Record<string, unknown> | null = null;

    await page.route("**/api/bookings", async (route) => {
      if (route.request().method() !== "POST") {
        await route.continue();
        return;
      }
      capturedBookingBody = route.request().postDataJSON();
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          success: true,
          data: {
            id: MOCK_BOOKING_ID,
            booking_code: "TH-CLN001",
            status: "pending",
          },
        }),
      });
    });

    await loginAsCustomer(page, baseURL!);
    await page.goto("/customer/book?category=cleaning&type=standard");
    await expect(page.getByRole("heading", { level: 2, name: "Booking details" })).toBeVisible({
      timeout: 15_000,
    });

    await page.locator("#service-date").fill(tomorrowIsoDate());
    await page.locator("#service-start-time").selectOption("09:00");
    await page.locator("#service-address").fill("Plot 8, Woodlands, Lusaka");

    await page.getByRole("button", { name: "Choose worker" }).click();
    await expect(page.getByText("Grace Phiri")).toBeVisible();
    await page.getByRole("button", { name: /Grace Phiri/i }).click();

    await expect(page.getByRole("heading", { name: "Confirm & pay" })).toBeVisible();

    const feeInput = page.getByRole("spinbutton");
    await expect(feeInput).not.toHaveValue("", { timeout: 10_000 });
    await expect(page.getByRole("button", { name: "Confirm booking" })).toBeEnabled();

    await Promise.all([
      page.waitForURL(new RegExp(`/customer/bookings/${MOCK_BOOKING_ID}`), { timeout: 15_000 }),
      page.getByRole("button", { name: "Confirm booking" }).click(),
    ]);

    expect(capturedBookingBody).toMatchObject({
      workerId: MOCK_CLEANER_WORKER.user_id,
      categoryId: MOCK_CATEGORIES[1].id,
      serviceDate: tomorrowIsoDate(),
      serviceTime: "09:00",
      locationAddress: "Plot 8, Woodlands, Lusaka",
      serviceDetails: {
        category: "cleaning",
        serviceType: "standard",
      },
    });
  });

  test("cleaning details require date, time, and address", async ({ page, baseURL }) => {
    await loginAsCustomer(page, baseURL!);
    await page.goto("/customer/book?category=cleaning&type=standard");
    await expect(page.locator("#service-date")).toBeVisible({ timeout: 15_000 });

    const continueBtn = page.getByRole("button", { name: "Choose worker" });
    await expect(continueBtn).toBeDisabled();

    await page.locator("#service-date").fill(tomorrowIsoDate());
    await page.locator("#service-start-time").selectOption("10:00");
    await page.locator("#service-address").fill("Meanwood, Lusaka");
    await expect(continueBtn).toBeEnabled();
  });
});
