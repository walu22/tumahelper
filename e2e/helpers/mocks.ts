import type { Page } from "@playwright/test";

export const MOCK_CATEGORIES = [
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
];

export const MOCK_NANNY_WORKER = {
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

export const MOCK_CLEANER_WORKER = {
  id: "b0000000-0000-0000-0000-000000000002",
  user_id: "a0000000-0000-0000-0000-000000000002",
  full_name: "Grace Phiri",
  city: "Lusaka",
  area: "Woodlands",
  category: "house_cleaner",
  skills: ["deep_cleaning", "laundry", "garden", "housekeeping"],
  profile_photo_url: null,
  average_rating: 4.6,
  total_reviews: 5,
  trust_score: 82,
  verification_level: "gold",
  experience_years: 4,
  availability_status: "available",
};

export function tomorrowIsoDate() {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d.toISOString().split("T")[0];
}

export async function mockServiceCategories(page: Page) {
  await page.route("**/rest/v1/service_categories**", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      headers: { "content-range": "0-1/2" },
      body: JSON.stringify(MOCK_CATEGORIES),
    });
  });
}
