import { expect, test } from "@playwright/test";

test.describe("Mobile layout", () => {
  test("booking page has no horizontal overflow at 375px", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto("/customer/book?category=nanny&type=babysitting");

    await expect(page.getByRole("heading", { name: "Book a nanny" })).toBeVisible({
      timeout: 15_000,
    });

    const overflow = await page.evaluate(() => {
      const doc = document.documentElement;
      return doc.scrollWidth > doc.clientWidth + 1;
    });

    expect(overflow).toBe(false);
  });

  test("shows compact step progress on mobile booking flow", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto("/customer/book?category=cleaning&type=standard");

    await expect(page.getByText(/Step 1 of 3/)).toBeVisible({ timeout: 15_000 });
  });
});
