import { expect, test } from "@playwright/test";
import { loginAsCustomer } from "./helpers/auth";
import {
  MOCK_CATEGORIES,
  MOCK_NANNY_WORKER,
  mockServiceCategories,
  tomorrowIsoDate,
} from "./helpers/mocks";

const MOCK_BOOKING_ID = "c0000000-0000-0000-0000-000000000001";

async function completeNannySchedule(page: import("@playwright/test").Page) {
  await page.getByRole("button", { name: "One-time visit" }).click();
  await page.getByRole("button", { name: "Pick a date" }).click();
  await page.locator("#service-date").fill(tomorrowIsoDate());
  await page.locator("#service-start-time").selectOption("08:00");
  await page.getByRole("button", { name: "Continue" }).click();
}

test.describe("Nanny booking end-to-end", () => {
  test.beforeEach(async ({ page }) => {
    await mockServiceCategories(page);

    await page.route("**/api/workers?category=nanny*", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ success: true, data: [MOCK_NANNY_WORKER] }),
      });
    });
  });

  test("customer can book babysitting from login through confirmation", async ({ page, baseURL }) => {
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
            booking_code: "TH-TEST01",
            status: "pending",
          },
        }),
      });
    });

    await loginAsCustomer(page, baseURL!);

    await page.goto("/customer/book?category=nanny&type=babysitter");
    await expect(page.getByRole("heading", { name: "Book a nanny" })).toBeVisible({
      timeout: 15_000,
    });
    await expect(page.getByRole("heading", { name: "Where do you need care?" })).toBeVisible();

    await page.locator("#nanny-street").fill("Plot 12, Kabulonga");
    await page.getByText("Confirm this address").click();

    await expect(page.getByRole("heading", { name: "How often?" })).toBeVisible();
    await completeNannySchedule(page);

    await expect(page.getByText("Child's age range")).toBeVisible();
    await page.locator("#nanny-child-age").selectOption("3-5");
    await page.locator("#nanny-emergency-contact").fill("Jane Mwanza · 0977 123 456");

    await page.getByRole("button", { name: "Choose your nanny" }).click();
    await expect(page.getByRole("heading", { name: "Choose your nanny" })).toBeVisible();
    await expect(page.getByText("Sarah Mulenga")).toBeVisible();

    await page.getByRole("button", { name: /Sarah Mulenga/i }).click();
    await expect(page.getByRole("heading", { name: "Confirm & pay" })).toBeVisible();

    await expect(page.getByText(/Guide price \(ZMW\)/i)).toBeVisible();
    await expect(page.getByText(/^K\d+$/).first()).toBeVisible();

    await Promise.all([
      page.waitForURL(new RegExp(`/customer/bookings/${MOCK_BOOKING_ID}`), { timeout: 15_000 }),
      page.getByRole("button", { name: "Confirm booking" }).click(),
    ]);

    expect(capturedBookingBody).toMatchObject({
      workerId: MOCK_NANNY_WORKER.user_id,
      categoryId: MOCK_CATEGORIES[0].id,
      serviceDate: tomorrowIsoDate(),
      serviceTime: "08:00",
      locationAddress: expect.stringContaining("Plot 12, Kabulonga"),
      amount: 27500,
      serviceDetails: {
        category: "nanny",
        serviceType: "babysitter",
        childAgeGroups: ["3-5"],
      },
    });
  });

  test("blocks progress without child age on care details step", async ({ page, baseURL }) => {
    await loginAsCustomer(page, baseURL!);
    await page.goto("/customer/book?category=nanny&type=babysitter");
    await expect(page.getByRole("heading", { name: "Where do you need care?" })).toBeVisible({
      timeout: 15_000,
    });

    await page.locator("#nanny-street").fill("Plot 12, Kabulonga, Lusaka");
    await page.getByText("Confirm this address").click();
    await completeNannySchedule(page);

    const continueBtn = page.getByRole("button", { name: "Choose your nanny" });
    await expect(continueBtn).toBeDisabled();

    await page.locator("#nanny-child-age").selectOption("6-12");
    await page.locator("#nanny-emergency-contact").fill("Jane Mwanza · 0977 123 456");
    await expect(continueBtn).toBeEnabled();
  });

  test("single child shows one age dropdown, not multi-select chips", async ({ page, baseURL }) => {
    await loginAsCustomer(page, baseURL!);
    await page.goto("/customer/book?category=nanny&type=babysitter");
    await expect(page.getByRole("heading", { name: "Where do you need care?" })).toBeVisible({
      timeout: 15_000,
    });

    await page.locator("#nanny-street").fill("Plot 12, Kabulonga");
    await page.getByText("Confirm this address").click();
    await completeNannySchedule(page);

    await expect(page.locator("#nanny-child-age")).toHaveCount(1);
    await expect(page.getByText("Child's age range")).toBeVisible();
    await expect(page.getByText("Child 1")).toHaveCount(0);
  });
});
