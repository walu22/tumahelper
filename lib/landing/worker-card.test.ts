import { describe, expect, it } from "vitest";
import {
  buildWorkerSpotlightBookUrl,
  getWorkerSkillLabels,
  getWorkerSpotlightStatusLine,
  getWorkerStartingPriceLabel,
} from "./worker-card";
import type { PublicWorkerProfile } from "@/types";

function worker(overrides: Partial<PublicWorkerProfile> = {}): PublicWorkerProfile {
  return {
    id: "worker-1",
    user_id: "user-1",
    full_name: "Mary Banda",
    city: "Lusaka",
    area: "Woodlands",
    bio: null,
    experience_years: 4,
    category: "house_cleaner",
    subcategory: null,
    profile_photo_url: null,
    trust_score: 80,
    trust_score_label: "Good",
    trust_score_color: "green",
    is_provisional: false,
    verification_level: "silver",
    average_rating: 4.8,
    total_jobs_completed: 0,
    total_reviews: 2,
    languages: ["English"],
    skills: ["deep_cleaning", "cooking"],
    employment_types: ["part_time"],
    availability_status: "available",
    ...overrides,
  };
}

describe("worker-card helpers", () => {
  it("builds a book URL with the worker id", () => {
    const url = buildWorkerSpotlightBookUrl(worker());
    expect(url).toContain("/customer/book?");
    expect(url).toContain("worker=worker-1");
  });

  it("shows booked count when the helper has completed jobs", () => {
    expect(getWorkerSpotlightStatusLine(worker({ total_jobs_completed: 12 }))).toBe(
      "Booked 12 times"
    );
  });

  it("shows available tomorrow when there is no booking history", () => {
    expect(getWorkerSpotlightStatusLine(worker())).toBe("Available tomorrow");
  });

  it("maps skills to readable labels", () => {
    expect(getWorkerSkillLabels(worker())).toEqual(["Deep cleaning", "Cooking"]);
  });

  it("shows a starting price from the inferred main service", () => {
    expect(getWorkerStartingPriceLabel(worker())).toMatch(/^From K\d+/);
  });
});
