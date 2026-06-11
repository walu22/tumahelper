import { expect, test } from "@playwright/test";
import { loginAsCustomer } from "./helpers/auth";
import {
  MOCK_CATEGORIES,
  MOCK_NANNY_WORKER,
  mockServiceCategories,
  tomorrowIsoDate,
} from "./helpers/mocks";

const MOCK_BOOKING_ID = "c0000000-0000-0000-0000-000000000001";

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

    await page.goto("/customer/book?category=nanny&type=babysitting");
    await expect(page.getByRole("heading", { name: "Book a service" })).toBeVisible();
    await expect(page.locator("#service-date")).toBeVisible({ timeout: 15_000 });

    await page.locator("#service-date").fill(tomorrowIsoDate());
    await page.locator("#service-start-time").selectOption("08:00");
    await page.locator("#service-address").fill("Plot 12, Kabulonga, Lusaka");
    await page.locator("#child-age").selectOption("3-5");

    await page.getByRole("button", { name: "Choose worker" }).click();
    await expect(page.getByRole("heading", { name: "Choose a worker" })).toBeVisible();
    await expect(page.getByText("Sarah Mulenga")).toBeVisible();

    await page.getByRole("button", { name: /Sarah Mulenga/i }).click();
    await expect(page.getByRole("heading", { name: "Confirm & pay" })).toBeVisible();

    const feeInput = page.getByRole("spinbutton");
    await expect(feeInput).toHaveValue("275");
    await feeInput.fill("350");

    await Promise.all([
      page.waitForURL(new RegExp(`/customer/bookings/${MOCK_BOOKING_ID}`), { timeout: 15_000 }),
      page.getByRole("button", { name: "Confirm booking" }).click(),
    ]);

    expect(capturedBookingBody).toMatchObject({
      workerId: MOCK_NANNY_WORKER.user_id,
      categoryId: MOCK_CATEGORIES[0].id,
      serviceDate: tomorrowIsoDate(),
      serviceTime: "08:00",
      locationAddress: "Plot 12, Kabulonga, Lusaka",
      amount: 35000,
      serviceDetails: {
        category: "nanny",
        serviceType: "babysitting",
        childAgeGroups: ["3-5"],
      },
    });
  });

  test("blocks progress without date, start time, and child age", async ({ page, baseURL }) => {
    await loginAsCustomer(page, baseURL!);
    await page.goto("/customer/book?category=nanny&type=babysitting");
    await expect(page.locator("#service-date")).toBeVisible({ timeout: 15_000 });

    const continueBtn = page.getByRole("button", { name: "Choose worker" });
    await expect(continueBtn).toBeDisabled();

    await page.locator("#service-date").fill(tomorrowIsoDate());
    await page.locator("#service-start-time").selectOption("19:00");
    await page.locator("#service-address").fill("Plot 12, Kabulonga, Lusaka");
    await expect(continueBtn).toBeDisabled();

    await page.locator("#child-age").selectOption("6-12");
    await expect(continueBtn).toBeEnabled();
  });

  test("single child shows one age dropdown, not multi-select chips", async ({ page, baseURL }) => {
    await loginAsCustomer(page, baseURL!);
    await page.goto("/customer/book?category=nanny&type=babysitting");
    await expect(page.locator("#child-age")).toBeVisible({ timeout: 15_000 });
    await expect(page.locator("#child-age")).toHaveCount(1);
    await expect(page.getByText("Child's age range")).toBeVisible();
    await expect(page.getByText("Child 1")).toHaveCount(0);
  });
});
