import { expect, test } from "@playwright/test";
import { loginAsCustomer } from "./helpers/auth";
import { MOCK_LIFECYCLE_BOOKING_ID, tinyPngBuffer } from "./helpers/bookings";

const DEV_UI = "/dev/test/booking-ui";

test.describe("Customer payment proof", () => {
  test.beforeEach(async ({ page }) => {
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
  });

  test("customer can upload payment proof", async ({ page, baseURL }) => {
    await loginAsCustomer(page, baseURL!);
    await page.goto(DEV_UI);

    const section = page.getByTestId("payment-pending");
    await expect(section.getByRole("button", { name: "Upload payment proof" })).toBeVisible();

    await section.locator('input[type="file"]').setInputFiles({
      name: "momo-proof.png",
      mimeType: "image/png",
      buffer: tinyPngBuffer(),
    });

    await expect(section.getByText("Proof received")).toBeVisible({ timeout: 15_000 });
  });

  test("payment section shows total and upload steps", async ({ page, baseURL }) => {
    await loginAsCustomer(page, baseURL!);
    await page.goto(DEV_UI);

    const section = page.getByTestId("payment-pending");
    await expect(section.getByText("How to pay")).toBeVisible();
    await expect(section.getByText("Total due:")).toBeVisible();
    await expect(section.getByText("Upload your proof")).toBeVisible();
  });
});
