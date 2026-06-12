import { expect, test } from "@playwright/test";
import { loginAsWorker } from "./helpers/auth";
import { MOCK_LIFECYCLE_BOOKING_ID } from "./helpers/bookings";

const DEV_UI = "/dev/test/booking-ui";

test.describe("Worker booking lifecycle", () => {
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
  });

  test("worker can accept, start, and complete via interactive harness", async ({
    page,
    baseURL,
  }) => {
    await loginAsWorker(page, baseURL!);
    await page.goto(DEV_UI);

    const live = page.getByTestId("actions-live");
    await expect(live.getByRole("button", { name: "Accept Booking" })).toBeVisible();

    await live.getByRole("button", { name: "Accept Booking" }).click();
    await expect(live.getByText("Status: accepted")).toBeVisible({ timeout: 10_000 });

    await live.getByRole("button", { name: "Start Job" }).click();
    await expect(live.getByText("Status: in progress")).toBeVisible({ timeout: 10_000 });

    await live.getByRole("button", { name: "Complete Job" }).click();
    await expect(page).toHaveURL(/\/worker\/bookings\/?$/, { timeout: 15_000 });
  });

  test("each status shows the correct action buttons", async ({ page, baseURL }) => {
    await loginAsWorker(page, baseURL!);
    await page.goto(DEV_UI);

    await expect(
      page.getByTestId("actions-pending").getByRole("button", { name: "Accept Booking" })
    ).toBeVisible();
    await expect(
      page.getByTestId("actions-pending").getByRole("button", { name: "Decline" })
    ).toBeVisible();
    await expect(
      page.getByTestId("actions-accepted").getByRole("button", { name: "Start Job" })
    ).toBeVisible();
    await expect(
      page.getByTestId("actions-in-progress").getByRole("button", { name: "Complete Job" })
    ).toBeVisible();
  });
});
