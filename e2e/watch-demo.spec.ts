import { expect, test } from "@playwright/test";
import { assertPlaywrightRunsLocally } from "./helpers/ensure-local-base-url";
import { loginAsCustomer } from "./helpers/auth";
import {
  MOCK_CATEGORIES,
  MOCK_NANNY_WORKER,
  mockServiceCategories,
  tomorrowIsoDate,
} from "./helpers/mocks";

const MOCK_BOOKING_ID = "c0000000-0000-0000-0000-000000000001";
const SLOW_MS = Number(process.env.PLAYWRIGHT_SLOW_MO_MS ?? "1200");

async function slowMo(page: import("@playwright/test").Page) {
  if (SLOW_MS > 0) {
    await page.waitForTimeout(SLOW_MS);
  }
}

test("Customer Booking Flow Demo (Watch Mode)", async ({ page, baseURL }) => {
  test.setTimeout(120_000);
  assertPlaywrightRunsLocally(baseURL!);

  await mockServiceCategories(page);

  await page.route("**/api/workers?category=nanny*", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ success: true, data: [MOCK_NANNY_WORKER] }),
    });
  });

  await page.route("**/api/bookings", async (route) => {
    if (route.request().method() !== "POST") {
      await route.continue();
      return;
    }

    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        success: true,
        data: {
          id: MOCK_BOOKING_ID,
          booking_code: "TH-DEMO01",
          status: "pending",
        },
      }),
    });
  });

  await loginAsCustomer(page, baseURL!);

  // 1. Initial page load
  await page.goto("/customer/book?category=nanny&type=babysitter");
  await expect(page.getByRole("heading", { name: "Book a nanny" })).toBeVisible({
    timeout: 15_000,
  });
  await expect(page.getByRole("heading", { name: "Where do you need care?" })).toBeVisible();
  await slowMo(page);

  // 2. Fill address
  await page.locator("#nanny-street").fill("Plot 12, Kabulonga");
  await page.getByText("Confirm this address").click();
  await slowMo(page);

  // 3. Schedule
  await expect(page.getByRole("heading", { name: "How often?" })).toBeVisible();
  await page.getByRole("button", { name: "One-time visit" }).click();
  await page.getByRole("button", { name: "Pick a date" }).click();
  await page.locator("#service-date").fill(tomorrowIsoDate());
  await page.locator("#service-start-time").selectOption("08:00");
  await page.getByRole("button", { name: "Continue" }).click();
  await slowMo(page);

  // 4. Care details
  await expect(page.getByText("Child's age range")).toBeVisible();
  await page.locator("#nanny-child-age").selectOption("3-5");
  await page.locator("#nanny-emergency-contact").fill("Jane Mwanza · 0977 123 456");
  await page.getByRole("button", { name: "Choose your nanny" }).click();
  await slowMo(page);

  // 5. Worker selection
  await expect(page.getByRole("heading", { name: "Choose your nanny" })).toBeVisible();
  await expect(page.getByText("Sarah Mulenga")).toBeVisible();
  await page.getByRole("button", { name: /Sarah Mulenga/i }).click();
  await slowMo(page);

  // 6. Confirm booking
  await expect(page.getByRole("heading", { name: "Confirm your booking" })).toBeVisible();
  await expect(page.getByText(/Guide price \(ZMW\)/i)).toBeVisible();
  await slowMo(page);

  await Promise.all([
    page.waitForURL(new RegExp(`/customer/bookings/${MOCK_BOOKING_ID}`), { timeout: 15_000 }),
    page.getByRole("button", { name: "Confirm booking" }).click(),
  ]);

  await expect(page).toHaveURL(new RegExp(`/customer/bookings/${MOCK_BOOKING_ID}`));
});
