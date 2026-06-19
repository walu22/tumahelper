"use client";

import { useMemo } from "react";
import { Calendar, CalendarClock, Repeat, Zap } from "lucide-react";
import { Input } from "@/components/ui/input";
import { BookingStepFooter } from "@/components/booking/booking-step-footer";
import { AirbnbOptionCard } from "@/components/booking/airbnb-option-card";
import {
  REGULAR_FREQUENCY_OPTIONS,
  formatVisitCadence,
  todayIsoDate,
  tomorrowIsoDate,
  type WhenPreference,
} from "@/lib/booking/shared-flow";
import type { ServiceDetails, TurnoverFrequency } from "@/lib/services/catalog";
import { getStartTimeOptions, type StartTimeOption } from "@/lib/booking/time-slots";
import type { ServiceCategoryKey } from "@/lib/services/catalog";
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

function filterStartTimes(
  times: StartTimeOption[],
  serviceDate: string,
  whenPreference?: WhenPreference
): StartTimeOption[] {
  if (serviceDate !== todayIsoDate()) return times;
  if (whenPreference !== "last_minute") return times;

  const minHour = new Date().getHours() + 1;
  const filtered = times.filter((slot) => {
    const hour = parseInt(slot.value.split(":")[0] ?? "0", 10);
    return hour >= minHour;
  });
  return filtered.length > 0 ? filtered : times.slice(-3);
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
  timingDescription = "Pick how soon you need help, then choose your arrival window.",
  hideFrequency = false,
}: SchedulePlanSectionProps) {
  const allStartTimes = getStartTimeOptions(category, serviceType);
  const whenPreference = serviceDetails.whenPreference;
  const startTimes = useMemo(
    () => filterStartTimes(allStartTimes, serviceDate, whenPreference),
    [allStartTimes, serviceDate, whenPreference]
  );
  const isRepeat = serviceDetails.frequency !== "once" && !!serviceDetails.frequency;

  function update(patch: Partial<ServiceDetails>) {
    onServiceDetailsChange({ ...serviceDetails, ...patch });
  }

  function setFrequencyMode(repeat: boolean) {
    update({
      frequency: repeat ? "weekly" : "once",
    });
  }

  function setWhenPreference(pref: WhenPreference) {
    update({ whenPreference: pref });
    if (pref === "today" || pref === "last_minute") {
      onDateChange(todayIsoDate());
      const slots = filterStartTimes(allStartTimes, todayIsoDate(), pref);
      onTimeChange(slots[0]?.value ?? "09:00");
    } else if (!serviceDate || serviceDate === todayIsoDate()) {
      onDateChange(tomorrowIsoDate());
      onTimeChange("09:00");
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
      </div>

      <div className="grid sm:grid-cols-3 gap-3">
        <AirbnbOptionCard
          selected={whenPreference === "today"}
          onClick={() => setWhenPreference("today")}
          title="As soon as possible"
          description="Today, during normal working hours"
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
          {whenPreference === "last_minute" && serviceDate === todayIsoDate() && (
            <p className="text-xs text-muted-foreground">
              Showing later slots today for urgent same-day visits.
            </p>
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
        primaryDisabled={!canContinue}
      />
    </div>
  );
}
