import { describe, expect, it } from "vitest";
import { getServiceType } from "./catalog";
import { resolveFunnelParam } from "./utils";

describe("Airbnb cleaning service type", () => {
  it("is registered in the cleaning catalog", () => {
    const type = getServiceType("cleaning", "airbnb");
    expect(type).toBeDefined();
    expect(type?.label).toMatch(/Airbnb/i);
    expect(type?.defaultHours).toBe(3);
  });

  it("resolves funnel aliases to airbnb type", () => {
    expect(resolveFunnelParam("airbnb-clean")).toEqual({
      category: "cleaning",
      type: "airbnb",
    });
    expect(resolveFunnelParam("airbnb-cleaning")).toEqual({
      category: "cleaning",
      type: "airbnb",
    });
  });
});
