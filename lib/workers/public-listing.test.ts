import { describe, expect, it } from "vitest";
import { PUBLIC_WORKER_AVAILABILITY, WORKER_STUB_AREA } from "./public-listing";

describe("public worker listing constants", () => {
  it("uses available status and excludes stub area", () => {
    expect(PUBLIC_WORKER_AVAILABILITY).toBe("available");
    expect(WORKER_STUB_AREA).toBe("Unknown");
  });
});
