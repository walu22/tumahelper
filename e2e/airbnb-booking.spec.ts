import { expect, test } from "@playwright/test";
import { loginAsCustomer } from "./helpers/auth";
import {
  MOCK_CATEGORIES,
  MOCK_CLEANER_WORKER,
  mockServiceCategories,
  tomorrowIsoDate,
} from "./helpers/mocks";

const MOCK_BOOKING_ID = "c0000000-0000-0000-0000-000000000003";

test.describe("Between-guest clean booking end-to-end", () => {
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

  test("customer can book a between-guest clean", async ({ page, baseURL }) => {
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
            booking_code: "TH-ABNB001",
            status: "pending",
          },
        }),
      });
    });

    await loginAsCustomer(page, baseURL!);
    await page.goto("/customer/book/airbnb?type=guest_checkout");
    await expect(page.getByRole("heading", { level: 1, name: "Book short-stay cleaning" })).toBeVisible({
      timeout: 15_000,
    });
    await expect(page.getByRole("heading", { name: "Where is your property?" })).toBeVisible();
    await expect(page.getByText("Your booking", { exact: true })).toBeVisible();

    await page.locator("#airbnb-street").fill("Plot 10, Roma");
    await page.getByText("Confirm this address").click();

    await expect(page.getByRole("heading", { name: "How often?" })).toBeVisible();
    await page.getByRole("button", { name: "One-time clean" }).click();
    await page.getByRole("button", { name: "Pick a date" }).click();
    await page.locator("#service-date").fill(tomorrowIsoDate());
    await page.locator("#service-start-time").selectOption("09:00");
    await page.getByRole("button", { name: "Continue" }).click();

    await expect(page.getByRole("heading", { name: "Property size" })).toBeVisible();

    await page.getByRole("button", { name: "Choose your cleaner" }).click();
    await expect(page.getByText("Grace Phiri")).toBeVisible();
    await page.getByRole("button", { name: /Grace Phiri/i }).click();

    await expect(page.getByRole("heading", { name: "Confirm & pay" })).toBeVisible();

    await expect(page.getByText(/Guide price \(ZMW\)/i)).toBeVisible();
    await expect(page.getByText(/^K\d+$/).first()).toBeVisible();
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
      locationAddress: expect.stringContaining("Plot 10, Roma"),
      serviceDetails: {
        category: "cleaning",
        serviceType: "guest_checkout",
      },
    });
  });
});
