import { expect, test } from "@playwright/test";
import { loginAsAdmin, loginAsCustomer, loginAsWorker } from "./helpers/auth";
import {
  MOCK_LIFECYCLE_BOOKING_ID,
  mockWorkerBookingDetail,
  tinyPngBuffer,
} from "./helpers/bookings";

const DEV_UI = "/dev/test/booking-ui";
const WORKER_BOOKING_PAGE = `/worker/bookings/${MOCK_LIFECYCLE_BOOKING_ID}`;

test.describe("Go-live booking loop", { tag: "@smoke" }, () => {
  test.beforeEach(async ({ page }) => {
    await page.route(`**/api/bookings/${MOCK_LIFECYCLE_BOOKING_ID}/status`, async (route) => {
      if (route.request().method() !== "PATCH") {
        await route.continue();
        return;
      }
      const body = route.request().postDataJSON() as { status: string };
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ success: true, data: { status: body.status } }),
      });
    });

    await page.route(
      `**/api/bookings/${MOCK_LIFECYCLE_BOOKING_ID}/payment-proof`,
      async (route) => {
        if (route.request().method() !== "POST") {
          await route.continue();
          return;
        }
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({ success: true, data: { payment_status: "paid" } }),
        });
      }
    );

    await page.route(
      `**/api/admin/payments/${MOCK_LIFECYCLE_BOOKING_ID}/confirm`,
      async (route) => {
        if (route.request().method() !== "PATCH") {
          await route.continue();
          return;
        }
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({
            success: true,
            data: {
              id: MOCK_LIFECYCLE_BOOKING_ID,
              payment_status: "confirmed",
              booking_code: "TH-TEST01",
            },
          }),
        });
      }
    );
  });

  test("worker accepts booking on detail page", async ({ page, baseURL }) => {
    await mockWorkerBookingDetail(page, "pending");
    await loginAsWorker(page, baseURL!);
    await page.goto(WORKER_BOOKING_PAGE);

    const actions = page.getByTestId("worker-booking-actions");
    await actions.getByRole("button", { name: "Accept Booking" }).click();
    await expect(actions.getByRole("button", { name: "Start Job" })).toBeVisible({
      timeout: 10_000,
    });
  });

  test("customer uploads payment proof after booking", async ({ page, baseURL }) => {
    await loginAsCustomer(page, baseURL!);
    await page.goto(DEV_UI);

    const section = page.getByTestId("payment-pending");
    await section.locator('input[type="file"]').setInputFiles({
      name: "momo-proof.png",
      mimeType: "image/png",
      buffer: tinyPngBuffer(),
    });

    await expect(section.getByText("Proof received")).toBeVisible({ timeout: 15_000 });
  });

  test("admin confirms submitted payment", async ({ page, baseURL }) => {
    await loginAsAdmin(page, baseURL!);
    await page.goto(DEV_UI);

    const section = page.getByTestId("admin-payment-review");
    await section.getByRole("button", { name: "Confirm payment" }).click();
    await expect(page.getByText("Payment confirmed")).toBeVisible({ timeout: 10_000 });
  });

  test("full loop: accept → upload proof → admin confirm", async ({ page, baseURL }) => {
    await mockWorkerBookingDetail(page, "pending");
    await loginAsWorker(page, baseURL!);
    await page.goto(WORKER_BOOKING_PAGE);

    const actions = page.getByTestId("worker-booking-actions");
    await actions.getByRole("button", { name: "Accept Booking" }).click();
    await expect(actions.getByRole("button", { name: "Start Job" })).toBeVisible({
      timeout: 10_000,
    });

    await loginAsCustomer(page, baseURL!);
    await page.goto(DEV_UI);

    const paymentSection = page.getByTestId("payment-pending");
    await paymentSection.locator('input[type="file"]').setInputFiles({
      name: "momo-proof.png",
      mimeType: "image/png",
      buffer: tinyPngBuffer(),
    });
    await expect(paymentSection.getByText("Proof received")).toBeVisible({ timeout: 15_000 });

    await loginAsAdmin(page, baseURL!);
    await page.goto(DEV_UI);

    const adminSection = page.getByTestId("admin-payment-review");
    await adminSection.getByRole("button", { name: "Confirm payment" }).click();
    await expect(page.getByText("Payment confirmed")).toBeVisible({ timeout: 10_000 });
  });
});
