import type { Page } from "@playwright/test";
import { tomorrowIsoDate } from "./mocks";

/** Complete the shared schedule step (one-time visit + pick a date). */
export async function completeOneTimeSchedule(
  page: Page,
  options?: { date?: string; time?: string }
) {
  const date = options?.date ?? tomorrowIsoDate();
  const time = options?.time ?? "09:00";

  await page.getByRole("button", { name: "One-time visit" }).click();
  await page.getByRole("button", { name: "Pick a date" }).click();
  await page.locator("#service-date").fill(date);
  await page.locator("#service-start-time").selectOption(time);
  await page.getByRole("button", { name: "Continue" }).click();
}
