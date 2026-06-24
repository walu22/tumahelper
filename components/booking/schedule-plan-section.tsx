"use client";

import { useEffect, useMemo } from "react";
import { Calendar, CalendarClock, Repeat, Zap } from "lucide-react";
import { Input } from "@/components/ui/input";
import { BookingStepFooter } from "@/components/booking/booking-step-footer";
import { AirbnbOptionCard } from "@/components/booking/airbnb-option-card";
import { ScheduleFeasibilityNotice } from "@/components/booking/schedule-feasibility-notice";
import {
  REGULAR_FREQUENCY_OPTIONS,
  formatVisitCadence,
  todayIsoDate,
  tomorrowIsoDate,
  type WhenPreference,
} from "@/lib/booking/shared-flow";
import type { ServiceDetails, TurnoverFrequency } from "@/lib/services/catalog";
import {
  getAvailableStartTimes,
  getLatestStartForDuration,
  formatBookingTime,
  isScheduleBookable,
} from "@/lib/booking/time-slots";
import type { ServiceCategoryKey } from "@/lib/services/catalog";
import { useScheduleClock } from "@/lib/booking/use-schedule-clock";
import { cn } from "@/lib/utils";

interface SchedulePlanSectionProps {
  category: ServiceCategoryKey;
  serviceType: string;
  serviceDetails: ServiceDetails;
  onServiceDetailsChange: (details: ServiceDetails) => void;
  serviceDate: string;
  serviceTime: string;
  onDateChange: (value: string) => void;
  onTimeChange: (value: string) => void;
  onBack: () => void;
  onContinue: () => void;
  canContinue: boolean;
  frequencyHeading?: string;
  frequencyDescription?: string;
  timingHeading?: string;
  timingDescription?: string;
  hideFrequency?: boolean;
}

export function SchedulePlanSection({
  category,
  serviceType,
  serviceDetails,
  onServiceDetailsChange,
  serviceDate,
  serviceTime,
  onDateChange,
  onTimeChange,
  onBack,
  onContinue,
  canContinue,
  frequencyHeading = "How often?",
  frequencyDescription = "Is this a one-off visit, or something you want on a regular schedule?",
  timingHeading = "When should the visit happen?",
  timingDescription = "Pick how soon you need help, then choose a start time that fits your visit length.",
  hideFrequency = false,
}: SchedulePlanSectionProps) {
  const scheduleNow = useScheduleClock();
  const whenPreference = serviceDetails.whenPreference;
  const durationHours = serviceDetails.durationHours;
  const startTimes = useMemo(
    () =>
      getAvailableStartTimes({
        category,
        serviceType,
        serviceDate,
        whenPreference,
        durationHours,
        now: scheduleNow,
      }),
    [category, serviceType, serviceDate, whenPreference, durationHours, scheduleNow]
  );
  const isRepeat = serviceDetails.frequency !== "once" && !!serviceDetails.frequency;
  const latestStart = useMemo(
    () => getLatestStartForDuration(durationHours, category, serviceType),
    [durationHours, category, serviceType]
  );
  const noSlotsLeftToday =
    !!serviceDate &&
    serviceDate === todayIsoDate() &&
    !!whenPreference &&
    startTimes.length === 0;
  const scheduleReady =
    !!serviceDate &&
    !!serviceTime &&
    isScheduleBookable({
      serviceDate,
      startTime: serviceTime,
      durationHours,
      category,
      serviceType,
      now: scheduleNow,
    });

  useEffect(() => {
    if (startTimes.length === 0) {
      if (serviceTime) onTimeChange("");
      return;
    }
    if (!serviceTime || !startTimes.some((slot) => slot.value === serviceTime)) {
      onTimeChange(startTimes[0]?.value ?? "");
    }
  }, [startTimes, serviceTime, onTimeChange]);

  function pickStartTimesForDate(
    date: string,
    pref: WhenPreference
  ): { date: string; preference: WhenPreference; time: string } {
    let slots = getAvailableStartTimes({
      category,
      serviceType,
      serviceDate: date,
      whenPreference: pref,
      durationHours,
      now: scheduleNow,
    });
    if (
      (pref === "today" || pref === "last_minute") &&
      date === todayIsoDate() &&
      slots.length === 0
    ) {
      const tomorrow = tomorrowIsoDate();
      slots = getAvailableStartTimes({
        category,
        serviceType,
        serviceDate: tomorrow,
        whenPreference: "tomorrow_later",
        durationHours,
        now: scheduleNow,
      });
      return {
        date: tomorrow,
        preference: "tomorrow_later",
        time: slots[0]?.value ?? "",
      };
    }
    return {
      date,
      preference: pref,
      time: slots[0]?.value ?? "",
    };
  }

  function update(patch: Partial<ServiceDetails>) {
    onServiceDetailsChange({ ...serviceDetails, ...patch });
  }

  function setFrequencyMode(repeat: boolean) {
    update({
      frequency: repeat ? "weekly" : "once",
    });
  }

  function setWhenPreference(pref: WhenPreference) {
    if (pref === "today" || pref === "last_minute") {
      const picked = pickStartTimesForDate(todayIsoDate(), pref);
      update({ whenPreference: picked.preference });
      onDateChange(picked.date);
      onTimeChange(picked.time);
      return;
    }

    update({ whenPreference: pref });
    if (!serviceDate || serviceDate === todayIsoDate()) {
      const picked = pickStartTimesForDate(tomorrowIsoDate(), pref);
      onDateChange(picked.date);
      onTimeChange(picked.time);
    }
  }

  return (
    <div className="space-y-8">
      {!hideFrequency ? (
        <>
          <div>
            <h2 className="text-2xl font-semibold">{frequencyHeading}</h2>
            <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
              {frequencyDescription}
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-3">
            <AirbnbOptionCard
              selected={!isRepeat}
              onClick={() => setFrequencyMode(false)}
              title="One-time visit"
              description="A single booking for the date you choose"
            />
            <AirbnbOptionCard
              selected={isRepeat}
              onClick={() => setFrequencyMode(true)}
              title="Regular visits"
              description="The same help on a repeating schedule"
              icon={Repeat}
            />
          </div>

          {isRepeat && (
            <div className="space-y-2">
              <p className="text-sm font-medium">How often should we return?</p>
              <div className="grid sm:grid-cols-2 gap-2">
                {REGULAR_FREQUENCY_OPTIONS.map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => update({ frequency: option.id as TurnoverFrequency })}
                    className={cn(
                      "rounded-xl border-2 p-3 text-left text-sm transition-colors",
                      serviceDetails.frequency === option.id
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/40"
                    )}
                  >
                    <p className="font-semibold">{option.label}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{option.description}</p>
                  </button>
                ))}
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="rounded-2xl border border-border bg-surface/40 px-4 py-3 text-sm">
          <p className="font-semibold text-foreground">
            {formatVisitCadence(serviceDetails.frequency, {
              category,
              serviceType,
            })}
          </p>
          <p className="text-muted-foreground mt-1 leading-relaxed">{frequencyDescription}</p>
        </div>
      )}

      <div>
        <h2 className="text-2xl font-semibold">{timingHeading}</h2>
        <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{timingDescription}</p>
        {durationHours >= 6 && latestStart && (
          <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
            This visit is booked for about {durationHours} hours. The latest start time is{" "}
            {formatBookingTime(latestStart.value)}.
          </p>
        )}
      </div>

      <div className="grid sm:grid-cols-3 gap-3">
        <AirbnbOptionCard
          selected={whenPreference === "today"}
          onClick={() => setWhenPreference("today")}
          title="As soon as possible"
          description="Today, during standard visit hours"
          icon={Zap}
        />
        <AirbnbOptionCard
          selected={whenPreference === "last_minute"}
          onClick={() => setWhenPreference("last_minute")}
          title="Same-day urgent"
          description="You need help today at short notice"
          icon={CalendarClock}
        />
        <AirbnbOptionCard
          selected={whenPreference === "tomorrow_later"}
          onClick={() => setWhenPreference("tomorrow_later")}
          title="Pick a date"
          description="Tomorrow or another day that suits you"
          icon={Calendar}
        />
      </div>

      {whenPreference && (
        <div className="rounded-2xl border border-border p-5 space-y-4">
          <h3 className="text-lg font-semibold">Arrival window</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="service-date" className="text-sm font-medium mb-2 block">
                Date
              </label>
              <Input
                id="service-date"
                type="date"
                value={serviceDate}
                onChange={(e) => onDateChange(e.target.value)}
                min={todayIsoDate()}
                className="h-11 rounded-xl"
              />
            </div>
            <div>
              <label htmlFor="service-start-time" className="text-sm font-medium mb-2 block">
                Start time
              </label>
              <select
                id="service-start-time"
                className="h-11 w-full rounded-xl border border-border bg-background px-3 text-sm"
                value={serviceTime}
                onChange={(e) => onTimeChange(e.target.value)}
              >
                <option value="">Choose a time</option>
                {startTimes.map((slot) => (
                  <option key={slot.value} value={slot.value}>
                    {slot.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          {noSlotsLeftToday && (
            <p className="text-sm text-amber-800 leading-relaxed">
              No arrival times are left today for a {durationHours}-hour visit. Pick another day
              or shorten the visit on the next step.
            </p>
          )}
          {whenPreference === "last_minute" && serviceDate === todayIsoDate() && !noSlotsLeftToday && (
            <p className="text-xs text-muted-foreground">
              Showing later slots today for urgent same-day visits.
            </p>
          )}
          {serviceTime && durationHours > 0 && serviceDate && (
            <ScheduleFeasibilityNotice
              category={category}
              serviceType={serviceType}
              serviceDate={serviceDate}
              serviceTime={serviceTime}
              durationHours={durationHours}
            />
          )}
        </div>
      )}

      {whenPreference && (
        <div className="rounded-2xl border border-border bg-surface/40 px-4 py-3 text-sm">
          <p className="font-semibold text-foreground">
            {formatVisitCadence(serviceDetails.frequency, {
              category,
              serviceType,
            })}
          </p>
        </div>
      )}

      <BookingStepFooter
        onBack={onBack}
        primaryLabel="Continue"
        onPrimary={onContinue}
        primaryDisabled={!canContinue || !scheduleReady || noSlotsLeftToday}
      />
    </div>
  );
}
