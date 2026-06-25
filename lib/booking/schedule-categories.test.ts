import { afterEach, describe, expect, it, vi } from "vitest";
import { bookingSchema } from "@/lib/validations";
import {
  defaultServiceDetails,
  type ServiceCategoryKey,
} from "@/lib/services/catalog";
import { suggestDuration } from "@/lib/services/utils";
import {
  getAvailableStartTimes,
  getLatestStartForDuration,
  isScheduleBookable,
  isStartTimeValidForDuration,
} from "./time-slots";
import { canProceedWithSchedule, syncDetailsWithSchedule } from "./schedule-duration";

const FUTURE_DATE = "2026-12-20";
const BASE_BOOKING = {
  categoryId: "00000000-0000-4000-8000-000000000001",
  serviceDate: FUTURE_DATE,
  serviceTime: "09:00",
  locationAddress: "Plot 10, Kabulonga, Lusaka",
  workerId: "00000000-0000-4000-8000-000000000002",
  amount: 45000,
};

interface CategoryScenario {
  label: string;
  category: ServiceCategoryKey;
  serviceType: string;
  details?: Record<string, unknown>;
  durationHours: number;
  validStart: string;
  invalidStart: string;
}

const SCENARIOS: CategoryScenario[] = [
  {
    label: "standard cleaning",
    category: "cleaning",
    serviceType: "standard",
    durationHours: 8,
    validStart: "09:00",
    invalidStart: "16:30",
  },
  {
    label: "deep cleaning",
    category: "cleaning",
    serviceType: "deep",
    details: {
      bedrooms: 5,
      bathrooms: 3,
      addons: ["ironing", "laundry", "oven", "fridge"],
    },
    durationHours: 8,
    validStart: "09:00",
    invalidStart: "16:30",
  },
  {
    category: "cleaning",
    serviceType: "spring",
    details: { bedrooms: 3, bathrooms: 2, addons: ["laundry", "ironing"] },
    durationHours: 8,
    validStart: "09:00",
    invalidStart: "16:30",
  },
  {
    label: "Airbnb turnover",
    category: "cleaning",
    serviceType: "guest_checkout",
    details: { bedrooms: 2, bathrooms: 1 },
    durationHours: 6,
    validStart: "08:00",
    invalidStart: "15:00",
  },
  {
    label: "day nanny",
    category: "nanny",
    serviceType: "day_nanny",
    details: { children: 2, childAgeGroups: ["3-5", "6-9"] },
    durationHours: 8,
    validStart: "09:00",
    invalidStart: "16:30",
  },
  {
    label: "evening nanny",
    category: "nanny",
    serviceType: "babysitter",
    details: { children: 1, childAgeGroups: ["3-5"] },
    durationHours: 4,
    validStart: "17:00",
    invalidStart: "18:30",
  },
  {
    label: "housekeeping full day",
    category: "housekeeping",
    serviceType: "full_day",
    durationHours: 8,
    validStart: "09:00",
    invalidStart: "16:30",
  },
  {
    label: "cooking lunch",
    category: "cooking",
    serviceType: "lunch",
    durationHours: 6,
    validStart: "10:00",
    invalidStart: "16:30",
  },
  {
    label: "laundry wash & fold",
    category: "laundry",
    serviceType: "wash_fold",
    durationHours: 8,
    validStart: "09:00",
    invalidStart: "16:30",
  },
  {
    label: "garden lawn cutting",
    category: "garden",
    serviceType: "lawn_cutting",
    durationHours: 8,
    validStart: "09:00",
    invalidStart: "16:30",
  },
  {
    label: "handyman general",
    category: "handyman",
    serviceType: "general_handyman",
    durationHours: 8,
    validStart: "09:00",
    invalidStart: "16:30",
  },
];

function buildDetails(scenario: CategoryScenario) {
  return {
    ...defaultServiceDetails(scenario.category),
    serviceType: scenario.serviceType,
    durationHours: scenario.durationHours,
    ...(scenario.details ?? {}),
  };
}

afterEach(() => {
  vi.useRealTimers();
});

describe("schedule rules across service categories", () => {
  describe.each(SCENARIOS)("$label", (scenario) => {
    const details = buildDetails(scenario);

    it("accepts a valid start time that fits within service hours", () => {
      expect(
        isScheduleBookable({
          serviceDate: FUTURE_DATE,
          startTime: scenario.validStart,
          durationHours: scenario.durationHours,
          category: scenario.category,
          serviceType: scenario.serviceType,
        })
      ).toBe(true);
      expect(canProceedWithSchedule(
        FUTURE_DATE,
        scenario.validStart,
        scenario.durationHours,
        scenario.category,
        scenario.serviceType
      )).toBe(true);
    });

    it("rejects a late start that would run past service hours", () => {
      expect(
        isScheduleBookable({
          serviceDate: FUTURE_DATE,
          startTime: scenario.invalidStart,
          durationHours: scenario.durationHours,
          category: scenario.category,
          serviceType: scenario.serviceType,
        })
      ).toBe(false);
      expect(canProceedWithSchedule(
        FUTURE_DATE,
        scenario.invalidStart,
        scenario.durationHours,
        scenario.category,
        scenario.serviceType
      )).toBe(false);
    });

    it("never offers the invalid late start in the time dropdown", () => {
      const slots = getAvailableStartTimes({
        category: scenario.category,
        serviceType: scenario.serviceType,
        serviceDate: FUTURE_DATE,
        durationHours: scenario.durationHours,
      });
      expect(slots.some((slot) => slot.value === scenario.invalidStart)).toBe(false);
      if (slots.length > 0) {
        expect(
          isStartTimeValidForDuration(
            slots[slots.length - 1].value,
            scenario.durationHours,
            scenario.category,
            scenario.serviceType
          )
        ).toBe(true);
      }
    });

    it("rejects impossible schedules via booking API validation", () => {
      const payload = {
        ...BASE_BOOKING,
        serviceTime: scenario.invalidStart,
        serviceDetails: details,
        ...(scenario.category === "nanny"
          ? {}
          : {}),
      };
      const nannyPayload =
        scenario.category === "nanny"
          ? {
              ...payload,
              serviceDetails: {
                ...details,
                children: (details.children as number) ?? 1,
                childAgeGroups: (details.childAgeGroups as string[]) ?? ["3-5"],
              },
            }
          : payload;
      const handymanPayload =
        scenario.category === "handyman"
          ? {
              ...nannyPayload,
              description: "Leaking kitchen tap needs repair this week.",
            }
          : nannyPayload;

      expect(bookingSchema.safeParse(handymanPayload).success).toBe(false);
    });

    it("latest allowed start matches the last dropdown slot for max duration", () => {
      const latest = getLatestStartForDuration(
        scenario.durationHours,
        scenario.category,
        scenario.serviceType
      );
      const slots = getAvailableStartTimes({
        category: scenario.category,
        serviceType: scenario.serviceType,
        serviceDate: FUTURE_DATE,
        durationHours: scenario.durationHours,
      });
      if (latest && slots.length > 0) {
        expect(slots[slots.length - 1]?.value).toBe(latest.value);
      }
    });
  });

  it("rejects same-day past slots for every category at 4:07 PM Lusaka", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-06-20T14:07:00.000Z"));
    const today = "2026-06-20";

    for (const scenario of SCENARIOS) {
      expect(
        isScheduleBookable({
          serviceDate: today,
          startTime: "16:00",
          durationHours: Math.min(scenario.durationHours, 4),
          category: scenario.category,
          serviceType: scenario.serviceType,
          now: new Date(),
        })
      ).toBe(false);
    }
  });

  it("clamps invalid starts when scope changes push cleaning to 8 hours", () => {
    const next = {
      ...defaultServiceDetails("cleaning"),
      serviceType: "spring",
      bedrooms: 3,
      bathrooms: 2,
      addons: ["laundry", "ironing"],
    };
    expect(suggestDuration(next)).toBe(8);

    const { details, serviceTime } = syncDetailsWithSchedule(next, "16:30", FUTURE_DATE);
    expect(details.durationHours).toBe(8);
    expect(serviceTime).toBe("09:00");
    expect(
      isScheduleBookable({
        serviceDate: FUTURE_DATE,
        startTime: serviceTime,
        durationHours: details.durationHours,
        category: "cleaning",
        serviceType: "spring",
      })
    ).toBe(true);
  });

  it("clamps invalid starts when garden add-ons increase visit length", () => {
    const next = {
      ...defaultServiceDetails("garden"),
      serviceType: "lawn_cutting",
      addons: ["hedge_trim", "green_waste"],
    };
    const { details, serviceTime } = syncDetailsWithSchedule(next, "15:00", FUTURE_DATE);
    expect(
      isScheduleBookable({
        serviceDate: FUTURE_DATE,
        startTime: serviceTime,
        durationHours: details.durationHours,
        category: "garden",
        serviceType: "lawn_cutting",
      })
    ).toBe(true);
    expect(serviceTime).not.toBe("15:00");
  });

  it("limits evening nanny bookings to 4 hours maximum", () => {
    expect(
      isScheduleBookable({
        serviceDate: FUTURE_DATE,
        startTime: "17:00",
        durationHours: 6,
        category: "nanny",
        serviceType: "babysitter",
      })
    ).toBe(false);
    expect(
      isScheduleBookable({
        serviceDate: FUTURE_DATE,
        startTime: "17:00",
        durationHours: 4,
        category: "nanny",
        serviceType: "babysitter",
      })
    ).toBe(true);
  });
});
