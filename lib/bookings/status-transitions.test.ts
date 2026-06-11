import { describe, expect, it } from "vitest";
import {
  assertBookingStatusTransition,
  canTransitionBookingStatus,
} from "./status-transitions";

describe("booking status transitions", () => {
  it("allows worker accept from pending", () => {
    expect(canTransitionBookingStatus("pending", "accepted")).toBe(true);
    expect(assertBookingStatusTransition("pending", "accepted", "worker")).toEqual({
      ok: true,
    });
  });

  it("allows worker complete flow pending → accepted → in_progress → completed", () => {
    expect(assertBookingStatusTransition("pending", "accepted", "worker").ok).toBe(true);
    expect(assertBookingStatusTransition("accepted", "in_progress", "worker").ok).toBe(true);
    expect(assertBookingStatusTransition("in_progress", "completed", "worker").ok).toBe(true);
  });

  it("blocks worker from cancelling (customer only)", () => {
    const result = assertBookingStatusTransition("pending", "cancelled", "worker");
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.code).toBe("FORBIDDEN");
  });

  it("allows customer to cancel pending booking", () => {
    expect(assertBookingStatusTransition("pending", "cancelled", "customer")).toEqual({
      ok: true,
    });
  });

  it("blocks customer from accepting", () => {
    const result = assertBookingStatusTransition("pending", "accepted", "customer");
    expect(result.ok).toBe(false);
  });

  it("blocks skip from pending to completed", () => {
    expect(canTransitionBookingStatus("pending", "completed")).toBe(false);
  });

  it("blocks changes after completed", () => {
    expect(canTransitionBookingStatus("completed", "cancelled")).toBe(false);
  });
});
