import { expect, test } from "@playwright/test";
import { loginAsCustomer } from "./helpers/auth";
import {
  MOCK_CATEGORIES,
  MOCK_CLEANER_WORKER,
  mockServiceCategories,
  tomorrowIsoDate,
} from "./helpers/mocks";

const MOCK_BOOKING_ID = "h0000000-0000-0000-0000-000000000006";

test.describe("Handyman Plumbing booking end-to-end", () => {
  test.beforeEach(async ({ page }) => {
    await mockServiceCategories(page);

    await page.route("**/api/workers?category=house_cleaner*", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          success: true,
          data: [{ ...MOCK_CLEANER_WORKER, category: "handyman", full_name: "Plumber Pro" }],
        }),
      });
    });
  });

  test("customer can book a plumbing service", async ({ page, baseURL }) => {
    let capturedBookingBody: Record<string, unknown> | null = null;

    await page.route("**/api/bookings", async (route) => {
      if (route.request().method() !== "POST") return route.continue();
      capturedBookingBody = route.request().postDataJSON();
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          success: true,
          data: { id: MOCK_BOOKING_ID, booking_code: "TH-PLUMB01", status: "pending" },
        }),
      });
    });

    await loginAsCustomer(page, baseURL!);

    await page.goto("/customer/book?category=handyman&type=plumbing");
    await expect(page.getByRole("heading", { name: "Where is the repair needed?" })).toBeVisible();

    await page.locator("#handyman-street").fill("Plot 5, Woodlands");
    await page.getByText("Confirm this address").click();

    await expect(page.getByRole("heading", { name: "What plumbing help do you need?" })).toBeVisible();
    await page.getByRole("button", { name: "Blocked sink or drain" }).click();
    await page.getByRole("button", { name: "Continue" }).click();

    await expect(page.getByRole("heading", { name: "How often?" })).toBeVisible();
    await page.getByRole("button", { name: "One-time visit" }).click();
    await page.getByRole("button", { name: "Pick a date" }).click();
    await page.locator("#service-date").fill(tomorrowIsoDate());
    await page.locator("#service-start-time").selectOption("10:00");
    await page.getByRole("button", { name: "Continue" }).click();

    await expect(page.getByText("Describe the job clearly.")).toBeVisible();
    await page.locator("#handyman-job-notes").fill("Kitchen sink is completely blocked.");
    
    await page.getByRole("button", { name: "Yes", exact: true }).click();
    await page.getByRole("button", { name: "Yes, with receipt" }).click();

    await page.getByRole("button", { name: "Choose your helper" }).click();
    await expect(page.getByRole("heading", { name: "Choose your handyman" })).toBeVisible();
    await expect(page.getByText("Plumber Pro")).toBeVisible();

    await page.getByRole("button", { name: /Plumber Pro/i }).click();
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
        category: "handyman",
        serviceType: "plumbing",
        plumbingJobType: "blocked_sink_drain",
      }),
    });
  });

  test("blocks progress for un-isolatable active leaks", async ({ page, baseURL }) => {
    await loginAsCustomer(page, baseURL!);
    await page.goto("/customer/book?category=handyman&type=plumbing");
    
    await page.locator("#handyman-street").fill("Plot 5, Woodlands");
    await page.getByText("Confirm this address").click();

    await page.getByRole("button", { name: "Visible pipe leak" }).click();
    await expect(page.getByText("Is water actively leaking?")).toBeVisible();
    await page.getByRole("button", { name: "Yes, water is leaking now" }).click();
    
    await expect(page.getByText("Can the water be turned off?")).toBeVisible();
    await page.getByRole("button", { name: "No, water keeps flowing" }).click();

    await expect(page.getByText("Emergency plumbing unavailable")).toBeVisible();
    const continueBtn = page.getByRole("button", { name: "Continue" });
    await expect(continueBtn).toBeDisabled();
  });

  test("routes specialist jobs to admin review without worker selection", async ({ page, baseURL }) => {
    await loginAsCustomer(page, baseURL!);
    await page.goto("/customer/book?category=handyman&type=plumbing");

    await page.locator("#handyman-street").fill("Plot 5, Woodlands");
    await page.getByText("Confirm this address").click();

    await page.getByRole("button", { name: "Borehole / pump issue" }).click();
    await expect(page.getByText("TumaHelper will review your request before matching a specialist.")).toBeVisible();
    
    await page.getByRole("button", { name: "Continue" }).click();
    
    await expect(page.getByRole("heading", { name: "How often?" })).toBeVisible();
    await page.getByRole("button", { name: "One-time visit" }).click();
    await page.getByRole("button", { name: "Pick a date" }).click();
    await page.locator("#service-date").fill(tomorrowIsoDate());
    await page.locator("#service-start-time").selectOption("10:00");
    await page.getByRole("button", { name: "Continue" }).click();

    await expect(page.getByText("Describe the job clearly.")).toBeVisible();
    await page.locator("#handyman-job-notes").fill("Borehole pump stopped working entirely.");
    
    const submitBtn = page.getByRole("button", { name: "Submit for review" });
    await expect(submitBtn).toBeVisible();
  });
});
