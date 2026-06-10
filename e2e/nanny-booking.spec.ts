import { expect, test, type Page } from "@playwright/test";

const MOCK_NANNY_WORKER = {
  id: "b0000000-0000-0000-0000-000000000001",
  user_id: "a0000000-0000-0000-0000-000000000001",
  full_name: "Sarah Mulenga",
  city: "Lusaka",
  area: "Kabulonga",
  category: "nanny",
  profile_photo_url: null,
  average_rating: 4.8,
  total_reviews: 8,
  trust_score: 87,
  verification_level: "gold",
  experience_years: 5,
  availability_status: "available",
};

const MOCK_BOOKING_ID = "c0000000-0000-0000-0000-000000000001";

function tomorrowIsoDate() {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d.toISOString().split("T")[0];
}

/** Dev bypass session cookie (matches lib/auth/session.ts) */
function customerDevCookie() {
  const payload = {
    id: "f0000000-0000-0000-0000-000000000001",
    role: "customer",
    email: "client@tumahelper.dev",
    phone: "+260976666666",
    full_name: "Demo Customer",
    exp: Date.now() + 1000 * 60 * 60 * 24 * 365,
  };
  const value = Buffer.from(JSON.stringify(payload)).toString("base64url");
  return {
    name: "tumahelper-dev-session",
    value,
    domain: "localhost",
    path: "/",
    httpOnly: true,
    sameSite: "Lax" as const,
  };
}

async function loginAsCustomer(page: Page) {
  await page.context().addCookies([customerDevCookie()]);
  await page.goto("/customer/dashboard");
  await expect(page).toHaveURL(/\/customer\/dashboard/);
}

test.describe("Nanny booking end-to-end", () => {
  test.beforeEach(async ({ page }) => {
    await page.route("**/rest/v1/service_categories**", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        headers: { "content-range": "0-1/2" },
        body: JSON.stringify([
          {
            id: "11111111-1111-1111-1111-111111111111",
            name: "Nanny Services",
            slug: "nanny-services",
            icon: "baby",
            sort_order: 1,
            is_active: true,
          },
          {
            id: "22222222-2222-2222-2222-222222222222",
            name: "House Cleaning",
            slug: "house-cleaning",
            icon: "home",
            sort_order: 2,
            is_active: true,
          },
        ]),
      });
    });

    await page.route("**/api/workers?category=nanny*", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ success: true, data: [MOCK_NANNY_WORKER] }),
      });
    });
  });

  test("customer can book babysitting from login through confirmation", async ({ page }) => {
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

    await loginAsCustomer(page);

    await page.goto("/customer/book?category=nanny&type=babysitting");
    await expect(page.getByRole("heading", { name: "Book a Service" })).toBeVisible();
    await expect(page.locator("#service-date")).toBeVisible({ timeout: 15_000 });

    await page.locator("#service-date").fill(tomorrowIsoDate());
    await page.getByRole("button", { name: "Morning 8:00 AM – 12:00 PM" }).click();
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
      categoryId: "11111111-1111-1111-1111-111111111111",
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

  test("blocks progress without date, time window, and child age", async ({ page }) => {
    await loginAsCustomer(page);
    await page.goto("/customer/book?category=nanny&type=babysitting");
    await expect(page.locator("#service-date")).toBeVisible({ timeout: 15_000 });

    const continueBtn = page.getByRole("button", { name: "Choose worker" });
    await expect(continueBtn).toBeDisabled();

    await page.locator("#service-date").fill(tomorrowIsoDate());
    await page.getByRole("button", { name: "Evening 5:00 – 9:00 PM" }).click();
    await page.locator("#service-address").fill("Plot 12, Kabulonga, Lusaka");
    await expect(continueBtn).toBeDisabled();

    await page.locator("#child-age").selectOption("6-12");
    await expect(continueBtn).toBeEnabled();
  });

  test("single child shows one age dropdown, not multi-select chips", async ({ page }) => {
    await loginAsCustomer(page);
    await page.goto("/customer/book?category=nanny&type=babysitting");
    await expect(page.locator("#child-age")).toBeVisible({ timeout: 15_000 });
    await expect(page.locator("#child-age")).toHaveCount(1);
    await expect(page.getByText("Child's age range")).toBeVisible();
    await expect(page.getByText("Child 1")).toHaveCount(0);
  });
});
