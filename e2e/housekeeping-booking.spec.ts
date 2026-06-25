import { expect, test } from "@playwright/test";
import { loginAsCustomer } from "./helpers/auth";
import {
  MOCK_CATEGORIES,
  MOCK_CLEANER_WORKER,
  mockServiceCategories,
  tomorrowIsoDate,
} from "./helpers/mocks";
import { completeOneTimeSchedule } from "./helpers/schedule";

const MOCK_BOOKING_ID = "c0000000-0000-0000-0000-000000000004";

test.describe("Housekeeping booking end-to-end", () => {
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

  test("customer can book full-day housekeeping with duties through confirmation", async ({
    page,
    baseURL,
  }) => {
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
            booking_code: "TH-HKP001",
            status: "pending",
          },
        }),
      });
    });

    await loginAsCustomer(page, baseURL!);
    await page.goto("/customer/book?category=housekeeping&type=full_day");
    await expect(page.getByRole("heading", { name: "Book housekeeping" })).toBeVisible({
      timeout: 15_000,
    });
    await expect(page.getByRole("heading", { name: "Where should the helper work?" })).toBeVisible();

    await page.locator("#housekeeping-street").fill("Plot 15, Kabulonga");
    await page.getByText("Confirm this address").click();

    await expect(page.getByText("Every week")).toHaveCount(0);
    await completeOneTimeSchedule(page, { time: "09:00" });

    await expect(page.getByRole("heading", { name: "Duties for this visit" })).toBeVisible();
    await page.getByRole("button", { name: "Laundry" }).click();
    await page.getByRole("button", { name: "Washing dishes" }).click();

    await page.getByRole("button", { name: "Choose your housekeeper" }).click();
    await expect(page.getByText("Grace Phiri")).toBeVisible();
    await page.getByRole("button", { name: /Grace Phiri/i }).click();

    await expect(page.getByRole("heading", { name: "Confirm your booking" })).toBeVisible();
    await expect(page.getByText("Duties", { exact: true })).toBeVisible();

    await Promise.all([
      page.waitForURL(new RegExp(`/customer/bookings/${MOCK_BOOKING_ID}`), { timeout: 15_000 }),
      page.getByRole("button", { name: "Confirm booking" }).click(),
    ]);

    expect(capturedBookingBody).toMatchObject({
      workerId: MOCK_CLEANER_WORKER.user_id,
      categoryId: MOCK_CATEGORIES[1].id,
      serviceDate: tomorrowIsoDate(),
      serviceTime: "09:00",
      locationAddress: expect.stringContaining("Plot 15, Kabulonga"),
      serviceDetails: {
        category: "housekeeping",
        serviceType: "full_day",
        addons: expect.arrayContaining(["laundry", "dishes"]),
      },
    });
  });

  test("weekly housekeeping hides frequency picker on plan step", async ({ page, baseURL }) => {
    await loginAsCustomer(page, baseURL!);
    await page.goto("/customer/book?category=housekeeping&type=weekly");
    await expect(page.getByRole("heading", { name: "Where should the helper work?" })).toBeVisible({
      timeout: 15_000,
    });

    await page.locator("#housekeeping-street").fill("Meanwood, Lusaka");
    await page.getByText("Confirm this address").click();

    await expect(page.getByText("Every week").first()).toBeVisible();
    await expect(page.getByRole("button", { name: "One-time visit" })).toHaveCount(0);
    await page.getByRole("button", { name: "Pick a date" }).click();
    await page.locator("#service-date").fill(tomorrowIsoDate());
    await page.locator("#service-start-time").selectOption("08:00");
    await expect(page.getByRole("button", { name: "Continue" })).toBeEnabled();
  });
});
