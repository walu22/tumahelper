import { describe, expect, it } from "vitest";
import {
  getWorkerSelectionHeading,
  resolveServiceDetailsForWorker,
  resolveServiceDetailsFromSearchParams,
} from "./worker-deep-link";
import type { PublicWorkerProfile } from "@/types";

const gardener: PublicWorkerProfile = {
  id: "w1",
  user_id: "u1",
  full_name: "John Phiri",
  city: "Lusaka",
  area: "Woodlands",
  bio: null,
  experience_years: 3,
  category: "house_cleaner",
  subcategory: null,
  profile_photo_url: null,
  trust_score: 70,
  trust_score_label: "Good",
  trust_score_color: "green",
  is_provisional: false,
  verification_level: "silver",
  average_rating: 4.5,
  total_jobs_completed: 5,
  total_reviews: 2,
  languages: ["English"],
  skills: ["garden"],
  employment_types: ["part_time"],
  availability_status: "available",
};

describe("resolveServiceDetailsFromSearchParams", () => {
  it("reads category and type from the query string", () => {
    const params = new URLSearchParams("category=handyman&type=plumbing&hours=2");
    const details = resolveServiceDetailsFromSearchParams(params, "handyman", null);
    expect(details?.category).toBe("handyman");
    expect(details?.serviceType).toBe("plumbing");
  });
});

describe("resolveServiceDetailsForWorker", () => {
  it("uses URL params when category and type are provided", () => {
    const params = new URLSearchParams(
      "category=handyman&type=electrical&hours=3&worker=w1"
    );
    const details = resolveServiceDetailsForWorker(gardener, params, "handyman", null);
    expect(details.category).toBe("handyman");
    expect(details.serviceType).toBe("electrical");
  });

  it("infers garden booking from worker skills when params are missing", () => {
    const params = new URLSearchParams("worker=w1");
    const details = resolveServiceDetailsForWorker(gardener, params, null, null);
    expect(details.category).toBe("garden");
  });

  it("infers nanny booking for nanny workers", () => {
    const nanny = { ...gardener, category: "nanny" as const, skills: ["infant_care"] };
    const params = new URLSearchParams("worker=w1");
    const details = resolveServiceDetailsForWorker(nanny, params, null, null);
    expect(details.category).toBe("nanny");
  });
});

describe("getWorkerSelectionHeading", () => {
  it("returns category-specific headings", () => {
    expect(getWorkerSelectionHeading("handyman", "plumbing")).toBe("Choose your handyman");
    expect(getWorkerSelectionHeading("laundry", "wash_fold")).toBe("Choose your laundry helper");
    expect(getWorkerSelectionHeading("garden", "garden_cleanup")).toBe("Choose your gardener");
    expect(getWorkerSelectionHeading("cleaning", "guest_checkout")).toBe(
      "Choose your short-stay cleaner"
    );
  });
});
