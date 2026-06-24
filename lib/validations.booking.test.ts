import { describe, expect, it } from "vitest";
import { bookingSchema } from "@/lib/validations";
import { defaultServiceDetails } from "@/lib/services/catalog";

const baseBooking = {
  categoryId: "00000000-0000-4000-8000-000000000001",
  serviceDate: "2026-06-20",
  serviceTime: "09:00",
  locationAddress: "Plot 10, Kabulonga, Lusaka",
  workerId: "00000000-0000-4000-8000-000000000002",
  amount: 45000,
};

describe("bookingSchema", () => {
  it("requires child age groups for nanny bookings", () => {
    const result = bookingSchema.safeParse({
      ...baseBooking,
      serviceDetails: {
        ...defaultServiceDetails("nanny"),
        children: 1,
        childAgeGroups: [],
      },
    });
    expect(result.success).toBe(false);
  });

  it("accepts nanny bookings with complete child ages", () => {
    const result = bookingSchema.safeParse({
      ...baseBooking,
      serviceDetails: {
        ...defaultServiceDetails("nanny"),
        children: 1,
        childAgeGroups: ["3-5"],
      },
    });
    expect(result.success).toBe(true);
  });

  it("requires handyman notes of at least 10 characters", () => {
    const result = bookingSchema.safeParse({
      ...baseBooking,
      description: "short",
      serviceDetails: defaultServiceDetails("handyman"),
    });
    expect(result.success).toBe(false);
  });

  it("allows amount 0 for admin review bookings", () => {
    const result = bookingSchema.safeParse({
      categoryId: baseBooking.categoryId,
      serviceDate: baseBooking.serviceDate,
      serviceTime: baseBooking.serviceTime,
      locationAddress: baseBooking.locationAddress,
      description: "Borehole pump stopped working yesterday morning.",
      amount: 0,
      requiresAdminReview: true,
      serviceDetails: {
        ...defaultServiceDetails("handyman"),
        serviceType: "plumbing",
        requiresAdminReview: true,
      },
    });
    expect(result.success).toBe(true);
  });

  it("rejects non-zero amount for admin review bookings", () => {
    const result = bookingSchema.safeParse({
      categoryId: baseBooking.categoryId,
      serviceDate: baseBooking.serviceDate,
      serviceTime: baseBooking.serviceTime,
      locationAddress: baseBooking.locationAddress,
      description: "Borehole pump stopped working yesterday morning.",
      amount: 50,
      requiresAdminReview: true,
      serviceDetails: {
        ...defaultServiceDetails("handyman"),
        serviceType: "plumbing",
        requiresAdminReview: true,
      },
    });
    expect(result.success).toBe(false);
  });

  it("rejects bookings where the visit runs past standard hours", () => {
    const result = bookingSchema.safeParse({
      ...baseBooking,
      serviceTime: "16:00",
      serviceDetails: {
        ...defaultServiceDetails("cleaning"),
        durationHours: 8,
      },
    });
    expect(result.success).toBe(false);
  });

  it("accepts bookings that finish within standard hours", () => {
    const result = bookingSchema.safeParse({
      ...baseBooking,
      serviceTime: "09:00",
      serviceDetails: {
        ...defaultServiceDetails("cleaning"),
        durationHours: 8,
      },
    });
    expect(result.success).toBe(true);
  });
});
