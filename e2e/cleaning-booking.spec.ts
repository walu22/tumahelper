import { expect, test } from "@playwright/test";
import { loginAsCustomer } from "./helpers/auth";
import {
  MOCK_CATEGORIES,
  MOCK_CLEANER_WORKER,
  mockServiceCategories,
  tomorrowIsoDate,
} from "./helpers/mocks";

const MOCK_BOOKING_ID = "c0000000-0000-0000-0000-000000000002";

async function completeCleaningSchedule(page: import("@playwright/test").Page) {
  await page.getByRole("button", { name: "One-time visit" }).click();
  await page.getByRole("button", { name: "Pick a date" }).click();
  await page.locator("#service-date").fill(tomorrowIsoDate());
  await page.locator("#service-start-time").selectOption("09:00");
  await page.getByRole("button", { name: "Continue" }).click();
}

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
    await expect(page.getByRole("heading", { name: "Book house cleaning" })).toBeVisible({
      timeout: 15_000,
    });
    await expect(page.getByRole("heading", { name: "Where should we clean?" })).toBeVisible();

    await page.locator("#cleaning-street").fill("Plot 8, Woodlands");
    await page.getByText("Confirm this address").click();

    await expect(page.getByRole("heading", { name: "How often?" })).toBeVisible();
    await completeCleaningSchedule(page);

    await expect(page.getByRole("heading", { name: "Home size" })).toBeVisible();
    await page.getByRole("button", { name: "Choose your cleaner" }).click();
    await expect(page.getByText("Grace Phiri")).toBeVisible();
    await page.getByRole("button", { name: /Grace Phiri/i }).click();

    await expect(page.getByRole("heading", { name: "Confirm your booking" })).toBeVisible();

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
      locationAddress: expect.stringContaining("Plot 8, Woodlands"),
      serviceDetails: {
        category: "cleaning",
        serviceType: "standard",
      },
    });
  });

  test("schedule step requires date and time before continuing", async ({ page, baseURL }) => {
    await loginAsCustomer(page, baseURL!);
    await page.goto("/customer/book?category=cleaning&type=standard");
    await expect(page.getByRole("heading", { name: "Where should we clean?" })).toBeVisible({
      timeout: 15_000,
    });

    await page.locator("#cleaning-street").fill("Meanwood, Lusaka");
    await page.getByText("Confirm this address").click();

    await expect(page.getByRole("heading", { name: "How often?" })).toBeVisible();
    const continueBtn = page.getByRole("button", { name: "Continue" });
    await expect(continueBtn).toBeDisabled();

    await page.getByRole("button", { name: "One-time visit" }).click();
    await page.getByRole("button", { name: "Pick a date" }).click();
    await expect(continueBtn).toBeEnabled();

    await page.locator("#service-date").fill("");
    await page.locator("#service-start-time").selectOption("");
    await expect(continueBtn).toBeDisabled();

    await page.locator("#service-date").fill(tomorrowIsoDate());
    await page.locator("#service-start-time").selectOption("10:00");
    await expect(continueBtn).toBeEnabled();
  });

  test("spring cleaning does not offer late starts that cannot fit an 8-hour visit", async ({
    page,
    baseURL,
  }) => {
    await loginAsCustomer(page, baseURL!);
    await page.goto("/customer/book?category=cleaning&type=spring");
    await expect(page.getByRole("heading", { name: "Where should we clean?" })).toBeVisible({
      timeout: 15_000,
    });

    await page.locator("#cleaning-street").fill("Plot 20, Woodlands, Lusaka");
    await page.getByText("Confirm this address").click();

    await page.getByRole("button", { name: "One-time visit" }).click();
    await page.getByRole("button", { name: "Pick a date" }).click();
    await page.locator("#service-date").fill(tomorrowIsoDate());

    const options = await page.locator("#service-start-time option").allTextContents();
    expect(options.some((label) => label.includes("4:30 PM"))).toBe(false);
    expect(options.some((label) => label.includes("4:00 PM"))).toBe(false);
  });
});
