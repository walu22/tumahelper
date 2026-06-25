import { afterEach, describe, expect, it, vi } from "vitest";
import { bookingSchema } from "@/lib/validations";
import { defaultServiceDetails } from "@/lib/services/catalog";

const baseBooking = {
  categoryId: "00000000-0000-4000-8000-000000000001",
  serviceDate: "2026-12-20",
  serviceTime: "09:00",
  locationAddress: "Plot 10, Kabulonga, Lusaka",
  workerId: "00000000-0000-4000-8000-000000000002",
  amount: 45000,
};

afterEach(() => {
  vi.useRealTimers();
});

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

  it("rejects same-day bookings with a start time that has already passed in Lusaka", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-06-20T14:07:00.000Z"));

    const result = bookingSchema.safeParse({
      ...baseBooking,
      serviceDate: "2026-06-20",
      serviceTime: "16:00",
      serviceDetails: {
        ...defaultServiceDetails("garden"),
        durationHours: 4,
      },
    });
    expect(result.success).toBe(false);
  });

  it("rejects bookings on calendar dates before today in Lusaka", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-06-20T14:07:00.000Z"));

    const result = bookingSchema.safeParse({
      ...baseBooking,
      serviceDate: "2026-06-19",
      serviceTime: "10:00",
      serviceDetails: {
        ...defaultServiceDetails("garden"),
        durationHours: 4,
      },
    });
    expect(result.success).toBe(false);
  });

  it("rejects deep cleaning with 8 hours starting at 4:30 PM", () => {
    const result = bookingSchema.safeParse({
      ...baseBooking,
      serviceDate: "2026-06-25",
      serviceTime: "16:30",
      serviceDetails: {
        ...defaultServiceDetails("cleaning"),
        serviceType: "deep",
        bedrooms: 5,
        bathrooms: 3,
        durationHours: 8,
        addons: ["ironing", "laundry", "oven", "fridge"],
      },
    });
    expect(result.success).toBe(false);
  });

  it("rejects deep cleaning when stored duration is too low but add-ons require 8 hours", () => {
    const result = bookingSchema.safeParse({
      ...baseBooking,
      serviceDate: "2026-06-25",
      serviceTime: "16:30",
      serviceDetails: {
        ...defaultServiceDetails("cleaning"),
        serviceType: "deep",
        bedrooms: 5,
        bathrooms: 3,
        durationHours: 4,
        addons: ["ironing", "laundry", "oven", "fridge"],
      },
    });
    expect(result.success).toBe(false);
  });

  it("rejects spring cleaning with 8 hours starting at 4:30 PM", () => {
    const result = bookingSchema.safeParse({
      ...baseBooking,
      serviceTime: "16:30",
      serviceDetails: {
        ...defaultServiceDetails("cleaning"),
        serviceType: "spring",
        bedrooms: 3,
        bathrooms: 2,
        durationHours: 8,
        addons: ["laundry", "ironing"],
      },
    });
    expect(result.success).toBe(false);
  });
});
