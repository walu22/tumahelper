import { describe, expect, it } from "vitest";
import {
  buildBookAgainUrl,
  canBookAgainWithWorker,
  serviceDetailsFromBooking,
} from "./book-again";
import { defaultServiceDetails } from "@/lib/services/catalog";

describe("book again", () => {
  it("builds book url with worker profile id", () => {
    const url = buildBookAgainUrl(
      "b0000000-0000-0000-0000-000000000001",
      defaultServiceDetails("nanny")
    );
    expect(url).toContain("/customer/book?");
    expect(url).toContain("category=nanny");
    expect(url).toContain("worker=b0000000-0000-0000-0000-000000000001");
  });

  it("allows book again for completed and cancelled", () => {
    expect(canBookAgainWithWorker("completed")).toBe(true);
    expect(canBookAgainWithWorker("cancelled")).toBe(true);
    expect(canBookAgainWithWorker("pending")).toBe(false);
  });

  it("reuses stored service details when present", () => {
    const details = serviceDetailsFromBooking({
      service_details: {
        category: "cleaning",
        serviceType: "deep",
        durationHours: 6,
        bedrooms: 4,
        bathrooms: 3,
        addons: ["oven"],
      },
      category: null,
    });
    expect(details.serviceType).toBe("deep");
    expect(details.bedrooms).toBe(4);
  });
});
