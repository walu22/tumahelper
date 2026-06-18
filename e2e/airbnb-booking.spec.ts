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
    await page.goto("/customer/book/airbnb");
    await expect(page.getByRole("heading", { level: 1, name: "Book a between-guest clean" })).toBeVisible({
      timeout: 15_000,
    });
    await expect(page.getByText("Between-guest clean for your property")).toBeVisible();
    await expect(page.getByText("How often?")).toBeVisible();
    await expect(page.getByText("Booking details")).toBeVisible();
    await expect(page.getByText("Live estimate")).toBeVisible();
    await expect(page.getByText("What's included in my clean?")).toBeVisible();
    await expect(page.getByRole("button", { name: "Tell me more" })).toBeVisible();
    await expect(page.getByText("Optional add-ons")).toBeVisible();
    await expect(page.getByText("When & where")).toBeVisible();

    await page.getByRole("button", { name: "Tell me more" }).click();
    await expect(page.getByRole("dialog", { name: "What's included in my clean?" })).toBeVisible();
    await expect(page.getByText("Living room")).toBeVisible();
    await expect(page.getByText("Not included")).toBeVisible();
    await page.getByRole("button", { name: "Close" }).click();

    await page.locator("#service-date").fill(tomorrowIsoDate());
    await page.locator("#service-start-time").selectOption("09:00");
    await page.locator("#service-address").fill("Plot 10, Roma, Lusaka");

    await page.getByRole("button", { name: "Choose cleaner" }).click();
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
      locationAddress: "Plot 10, Roma, Lusaka",
      serviceDetails: {
        category: "cleaning",
        serviceType: "airbnb",
      },
    });
  });
});
