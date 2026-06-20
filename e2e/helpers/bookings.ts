import type { Page } from "@playwright/test";

export const MOCK_LIFECYCLE_BOOKING_ID = "c0000000-0000-0000-0000-000000000010";

export const DEV_WORKER_USER_ID = "a0000000-0000-0000-0000-000000000001";

export const MOCK_WORKER_BOOKING = {
  id: MOCK_LIFECYCLE_BOOKING_ID,
  booking_code: "TH-TEST01",
  worker_id: DEV_WORKER_USER_ID,
  customer_id: "f0000000-0000-0000-0000-000000000001",
  status: "pending",
  payment_status: "paid",
  service_date: "2026-06-20",
  service_time: "09:00",
  location_address: "Plot 12, Kabulonga, Lusaka",
  description: "E2E lifecycle test booking",
  amount: 35000,
  worker_earnings: 31500,
  created_at: "2026-06-01T10:00:00.000Z",
  service_details: null,
  customer: {
    id: "f0000000-0000-0000-0000-000000000001",
    full_name: "Demo Customer",
    phone: "+260976666666",
  },
};

export function tinyPngBuffer() {
  return Buffer.from(
    "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==",
    "base64"
  );
}

export async function mockWorkerBookingDetail(
  page: Page,
  initialStatus: string = MOCK_WORKER_BOOKING.status
) {
  let currentStatus = initialStatus;

  await page.route(`**/api/bookings/${MOCK_LIFECYCLE_BOOKING_ID}`, async (route) => {
    const request = route.request();

    if (request.method() === "GET") {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          success: true,
          data: {
            ...MOCK_WORKER_BOOKING,
            status: currentStatus,
          },
        }),
      });
      return;
    }

    if (request.method() === "PATCH" && request.url().includes("/status")) {
      const body = request.postDataJSON() as { status: string };
      currentStatus = body.status;
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          success: true,
          data: {
            ...MOCK_WORKER_BOOKING,
            status: body.status,
          },
        }),
      });
      return;
    }

    await route.continue();
  });
}
