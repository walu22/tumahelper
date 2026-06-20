import { describe, expect, it } from "vitest";
import { isWorkerSearchable } from "./eligibility";

describe("worker search eligibility", () => {
  it("requires approved verification and a complete profile", () => {
    expect(
      isWorkerSearchable({
        verification_status: "approved",
        full_name: "Grace Phiri",
        area: "Woodlands",
        category: "house_cleaner",
        skills: ["cooking", "laundry"],
        employment_types: ["part_time"],
      })
    ).toBe(true);

    expect(
      isWorkerSearchable({
        verification_status: "pending",
        full_name: "Grace Phiri",
        area: "Woodlands",
        category: "house_cleaner",
        skills: ["cooking"],
        employment_types: ["part_time"],
      })
    ).toBe(false);
  });
});
