import { describe, expect, it } from "vitest";
import {
  formatPaymentStatusLabel,
  getCustomerBookingNextStep,
  getWorkerBookingNextStep,
} from "./display-labels";

describe("booking display labels", () => {
  it("formats payment status for customers", () => {
    expect(formatPaymentStatusLabel("pending")).toBe("Payment due");
    expect(formatPaymentStatusLabel("paid")).toBe("Proof received");
    expect(formatPaymentStatusLabel("confirmed")).toBe("Payment confirmed");
  });

  it("guides customer when worker has not accepted", () => {
    const step = getCustomerBookingNextStep({
      status: "pending",
      paymentStatus: "pending",
      workerName: "Sarah Mulenga",
    });
    expect(step?.title).toContain("Sarah");
    expect(step?.tone).toBe("action");
  });

  it("guides worker on pending request", () => {
    const step = getWorkerBookingNextStep({
      status: "pending",
      paymentStatus: "pending",
      customerName: "Demo Customer",
    });
    expect(step?.title).toBe("New booking request");
  });
});
