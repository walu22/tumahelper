"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Calendar,
  CalendarClock,
  MapPin,
  Minus,
  Plus,
  Repeat,
  Zap,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { BookingStepFooter } from "@/components/booking/booking-step-footer";
import { LusakaAddressInput } from "@/components/booking/lusaka-address-input";
import { UseCurrentLocationButton } from "@/components/booking/use-current-location-button";
import { AirbnbFlowProgress } from "@/components/booking/airbnb-flow-progress";
import { AirbnbOptionCard } from "@/components/booking/airbnb-option-card";
import { AirbnbTypeTabs } from "@/components/booking/airbnb-type-tabs";
import { ServiceDetailsCard } from "@/components/booking/service-details-card";
import {
  formatAirbnbAddress,
  formatTurnoverCadence,
  formatWhenPreference,
  LINEN_OPTIONS,
  todayIsoDate,
  tomorrowIsoDate,
  type AirbnbFlowStep,
  type AirbnbWhenPreference,
  type LinenPreference,
} from "@/lib/booking/airbnb-flow";
import type { LocationCoords } from "@/lib/booking/shared-flow";
import {
  DURATION_OPTIONS,
  TURNOVER_FREQUENCY_OPTIONS,
  getAddon,
  getAvailableAddons,
  getLinenPreferences,
  getServiceType,
  sanitizeAddons,
  type ServiceDetails,
  type TurnoverFrequency,
} from "@/lib/services/catalog";
import {
  formatBookingTime,
  getAvailableStartTimes,
  getLatestStartForDuration,
  isScheduleBookable,
} from "@/lib/booking/time-slots";
import {
  canIncreaseDuration,
  canProceedWithSchedule,
  stepBookingDuration,
  resolveDurationForSchedule,
} from "@/lib/booking/schedule-duration";
import { ScheduleFeasibilityNotice } from "@/components/booking/schedule-feasibility-notice";
import { useScheduleClock } from "@/lib/booking/use-schedule-clock";
import { suggestDuration } from "@/lib/services/utils";
import { cn } from "@/lib/utils";

const HOME_SIZE_PRESETS = [
  { id: "small", label: "Compact", sub: "1 to 2 bedrooms", bedrooms: 2, bathrooms: 1 },
  { id: "medium", label: "Standard", sub: "3 to 4 bedrooms", bedrooms: 3, bathrooms: 2 },
  { id: "large", label: "Large", sub: "5+ bedrooms", bedrooms: 5, bathrooms: 3 },
] as const;

interface AirbnbBookingFlowProps {
  step: AirbnbFlowStep;
  onStepChange: (step: AirbnbFlowStep) => void;
  streetAddress: string;
  unitAddress: string;
  onStreetAddressChange: (value: string) => void;
  onUnitAddressChange: (value: string) => void;
  locationAddress: string;
  onLocationConfirm: (fullAddress: string, coords?: LocationCoords) => void;
  serviceDetails: ServiceDetails;
  onServiceDetailsChange: (details: ServiceDetails) => void;
  serviceDate: string;
  serviceTime: string;
  description: string;
  onDateChange: (value: string) => void;
  onTimeChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onFindWorker: () => void;
  lockServiceType?: boolean;
  guestCheckoutTime?: string;
  nextCheckIn?: string;
  onGuestCheckoutTimeChange?: (value: string) => void;
  onNextCheckInChange?: (value: string) => void;
}

export function AirbnbBookingFlow({
  step,
  onStepChange,
  streetAddress,
  unitAddress,
  onStreetAddressChange,
  onUnitAddressChange,
  locationAddress,
  onLocationConfirm,
  serviceDetails,
  onServiceDetailsChange,
  serviceDate,
  serviceTime,
  description,
  onDateChange,
  onTimeChange,
  onDescriptionChange,
  onFindWorker,
  lockServiceType = false,
  guestCheckoutTime = "",
  nextCheckIn = "",
  onGuestCheckoutTimeChange,
  onNextCheckInChange,
}: AirbnbBookingFlowProps) {
  const scheduleNow = useScheduleClock();
  const [pendingCoords, setPendingCoords] = useState<LocationCoords | null>(null);
  const previewAddress = useMemo(
    () => formatAirbnbAddress(streetAddress, unitAddress),
    [streetAddress, unitAddress]
  );
  const canPreviewLocation = streetAddress.trim().length >= 5;
  const startTimes = useMemo(
    () =>
      getAvailableStartTimes({
        category: "cleaning",
        serviceType: serviceDetails.serviceType,
        serviceDate,
        whenPreference: serviceDetails.whenPreference,
        durationHours: serviceDetails.durationHours,
        now: scheduleNow,
      }),
    [
      serviceDate,
      serviceDetails.whenPreference,
      serviceDetails.durationHours,
      serviceDetails.serviceType,
      scheduleNow,
    ]
  );
  const latestStart = useMemo(
    () => getLatestStartForDuration(serviceDetails.durationHours, "cleaning", serviceDetails.serviceType),
    [serviceDetails.durationHours, serviceDetails.serviceType]
  );

  useEffect(() => {
    if (startTimes.length === 0) {
      if (serviceTime) onTimeChange("");
      return;
    }
    if (!serviceTime || !startTimes.some((slot) => slot.value === serviceTime)) {
      onTimeChange(startTimes[0]?.value ?? "");
    }
  }, [startTimes, serviceTime, onTimeChange]);

  function pickStartTimesForDate(date: string, pref: AirbnbWhenPreference) {
    let slots = getAvailableStartTimes({
      category: "cleaning",
      serviceType: serviceDetails.serviceType,
      serviceDate: date,
      whenPreference: pref,
      durationHours: serviceDetails.durationHours,
      now: scheduleNow,
    });
    if ((pref === "today" || pref === "last_minute") && date === todayIsoDate() && slots.length === 0) {
      const tomorrow = tomorrowIsoDate();
      slots = getAvailableStartTimes({
        category: "cleaning",
        serviceType: serviceDetails.serviceType,
        serviceDate: tomorrow,
        whenPreference: "tomorrow_later",
        durationHours: serviceDetails.durationHours,
        now: scheduleNow,
      });
      return { date: tomorrow, preference: "tomorrow_later" as const, time: slots[0]?.value ?? "" };
    }
    return { date, preference: pref, time: slots[0]?.value ?? "" };
  }
  const recommendedHours = suggestDuration(serviceDetails);
  const isRepeat = serviceDetails.frequency !== "once";
  const whenPreference = serviceDetails.whenPreference;
  const linenPreferences = getLinenPreferences(serviceDetails);
  const repeatCadenceChosen =
    !isRepeat ||
    (serviceDetails.frequency !== "once" && !!serviceDetails.frequency);

  function update(patch: Partial<ServiceDetails>) {
    onServiceDetailsChange({ ...serviceDetails, ...patch });
  }

  function setFrequencyMode(repeat: boolean) {
    update({
      frequency: repeat ? "per_checkout" : "once",
    });
  }

  function setWhenPreference(pref: AirbnbWhenPreference) {
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

  function toggleLinenPreference(pref: LinenPreference) {
    const current = getLinenPreferences(serviceDetails);
    let next: LinenPreference[];
    if (current.includes(pref)) {
      next = current.filter((p) => p !== pref);
      if (next.length === 0) return;
    } else {
      next = [...current, pref];
    }

    const addons = [...serviceDetails.addons];
    const wantsLaundry = next.includes("wash_repack");
    const hasLaundry = addons.includes("laundry");
    if (wantsLaundry && !hasLaundry) addons.push("laundry");
    if (!wantsLaundry && hasLaundry) addons.splice(addons.indexOf("laundry"), 1);

    const updated = { ...serviceDetails, linenPreferences: next, addons };
    onServiceDetailsChange({ ...updated, durationHours: suggestDuration(updated) });
  }

  function toggleExtraTask(id: string) {
    const addons = serviceDetails.addons.includes(id)
      ? serviceDetails.addons.filter((a) => a !== id)
      : [...serviceDetails.addons, id];
    const next = { ...serviceDetails, addons };
    onServiceDetailsChange({ ...next, durationHours: suggestDuration(next) });
  }

  function adjustHours(delta: number) {
    const { durationHours, serviceTime: nextTime } = stepBookingDuration(
      serviceDetails.durationHours,
      delta,
      serviceTime,
      "cleaning",
      serviceDetails.serviceType,
      serviceDate
    );
    update({ durationHours });
    if (nextTime !== serviceTime) onTimeChange(nextTime);
  }

  function applySuggestedHours(hours: number) {
    const { durationHours, serviceTime: nextTime } = resolveDurationForSchedule(
      hours,
      serviceTime,
      "cleaning",
      serviceDetails.serviceType,
      serviceDate
    );
    update({ durationHours });
    if (nextTime !== serviceTime) onTimeChange(nextTime);
  }

  function applyHomePreset(bedrooms: number, bathrooms: number) {
    const next = { ...serviceDetails, bedrooms, bathrooms };
    onServiceDetailsChange({ ...next, durationHours: suggestDuration(next) });
  }

  const canContinuePlan =
    !!whenPreference &&
    repeatCadenceChosen &&
    !!serviceDate &&
    !!serviceTime &&
    isScheduleBookable({
      serviceDate,
      startTime: serviceTime,
      durationHours: serviceDetails.durationHours,
      category: "cleaning",
      serviceType: serviceDetails.serviceType,
      now: scheduleNow,
    });
  const canChooseCleaner =
    !!serviceDate &&
    !!serviceTime &&
    locationAddress.length >= 5 &&
    !!whenPreference &&
    linenPreferences.length > 0 &&
    canProceedWithSchedule(
      serviceDate,
      serviceTime,
      serviceDetails.durationHours,
      "cleaning",
      serviceDetails.serviceType,
      scheduleNow
    );

  const selectedType = getServiceType("cleaning", serviceDetails.serviceType);
  const availableAddons = getAvailableAddons("cleaning", serviceDetails.serviceType);

  function setServiceType(serviceType: string, defaultHours: number) {
    const addons = sanitizeAddons("cleaning", serviceType, serviceDetails.addons);
    const next = { ...serviceDetails, serviceType, addons, durationHours: defaultHours };
    onServiceDetailsChange({ ...next, durationHours: suggestDuration(next) });
  }

  function handleAirbnbTypeChange(typeId: string) {
    const type = getServiceType("cleaning", typeId);
    if (type) setServiceType(typeId, type.defaultHours);
  }

  const airbnbTypePicker =
    !lockServiceType && step === "address" ? (
      <div className="mb-6">
        <AirbnbTypeTabs
          value={serviceDetails.serviceType}
          onChange={handleAirbnbTypeChange}
          showDetails
          centered
        />
      </div>
    ) : null;

  const lockedTypeSummary =
    lockServiceType && selectedType && step === "address" ? (
      <div className="mb-6">
        <ServiceDetailsCard
          category="cleaning"
          serviceType={serviceDetails.serviceType}
          variant="selection"
        />
      </div>
    ) : null;

  if (step === "address") {
    return (
      <div className="space-y-6">
        <AirbnbFlowProgress current="address" />
        {lockedTypeSummary}
        {airbnbTypePicker}
        <div>
          <h2 className="text-2xl font-semibold">Where is your property?</h2>
          <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
            Start typing a street or plot. Matching roads and suburbs in Lusaka will appear as you
            type.
          </p>
        </div>

        <div className="space-y-4">
          <UseCurrentLocationButton
            className="w-full h-11 rounded-xl justify-center"
            onResult={({ streetAddress: locatedStreet, coords }) => {
              onStreetAddressChange(locatedStreet);
              setPendingCoords(coords);
            }}
          />

          <div>
            <label htmlFor="airbnb-street" className="text-sm font-medium mb-2 block">
              Street or plot address <span className="text-primary">*</span>
            </label>
            <LusakaAddressInput
              id="airbnb-street"
              value={streetAddress}
              onChange={(value) => {
                onStreetAddressChange(value);
                setPendingCoords(null);
              }}
              placeholder="e.g. Plot 12, Kabulonga"
              required
            />
          </div>

          <div>
            <label htmlFor="airbnb-unit" className="text-sm font-medium mb-2 block">
              Unit or building name (optional)
            </label>
            <Input
              id="airbnb-unit"
              placeholder="e.g. Unit 4, Woodlands Apartments"
              value={unitAddress}
              onChange={(e) => onUnitAddressChange(e.target.value)}
              className="h-11 rounded-xl"
            />
          </div>
        </div>

        {canPreviewLocation && (
          <button
            type="button"
            onClick={() => onLocationConfirm(previewAddress, pendingCoords ?? undefined)}
            className="w-full rounded-2xl border-2 border-primary bg-primary/5 p-4 text-left hover:bg-primary/10 transition-colors"
          >
            <p className="text-xs font-semibold uppercase tracking-wide text-primary mb-2">
              Confirm this address
            </p>
            <p className="flex items-start gap-2 font-medium text-foreground leading-snug">
              <MapPin className="h-4 w-4 text-primary shrink-0 mt-0.5" />
              {previewAddress}
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Continue with this property location
            </p>
          </button>
        )}
      </div>
    );
  }

  if (step === "plan") {
    return (
      <div className="space-y-8">
        <AirbnbFlowProgress current="plan" />
        <ServiceDetailsCard
          category="cleaning"
          serviceType={serviceDetails.serviceType}
          variant="plan"
        />
        <div>
          <h2 className="text-2xl font-semibold">How often?</h2>
          <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
            Is this a one-off clean between guests, or something you want on a regular schedule?
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-3">
          <AirbnbOptionCard
            selected={!isRepeat}
            onClick={() => setFrequencyMode(false)}
            title="One-time clean"
            description="A single clean before your next guest arrives"
          />
          <AirbnbOptionCard
            selected={isRepeat}
            onClick={() => setFrequencyMode(true)}
            title="Regular cleans"
            description="The same property cleaned on a repeating schedule"
            icon={Repeat}
          />
        </div>

        {isRepeat && (
          <div className="space-y-2">
            <p className="text-sm font-medium">How often should we return?</p>
            <div className="grid sm:grid-cols-2 gap-2">
              {TURNOVER_FREQUENCY_OPTIONS.filter((o) => o.id !== "once").map((option) => (
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

        <div>
          <h2 className="text-2xl font-semibold">When should the clean happen?</h2>
          <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
            Pick how soon you need the clean, then choose a start time that fits your visit length.
          </p>
          {serviceDetails.durationHours >= 6 && latestStart && (
            <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
              This clean is booked for about {serviceDetails.durationHours} hours. The latest start
              time is {formatBookingTime(latestStart.value)}.
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
            description="Guest checked out and you need help today"
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
                Showing later slots today for urgent same-day cleans.
              </p>
            )}
            {serviceTime && serviceDetails.durationHours > 0 && serviceDate && (
              <ScheduleFeasibilityNotice
                category="cleaning"
                serviceType={serviceDetails.serviceType}
                serviceDate={serviceDate}
                serviceTime={serviceTime}
                durationHours={serviceDetails.durationHours}
              />
            )}
          </div>
        )}

        <BookingStepFooter
          onBack={() => onStepChange("address")}
          primaryLabel="Continue"
          onPrimary={() => onStepChange("scope")}
          primaryDisabled={!canContinuePlan}
        />
      </div>
    );
  }

  const laundryAddon = getAddon("cleaning", "laundry");
  const includesLaundry = linenPreferences.includes("wash_repack");

  return (
    <div className="space-y-8">
      <AirbnbFlowProgress current="scope" />

      <ServiceDetailsCard
        category="cleaning"
        serviceType={serviceDetails.serviceType}
        variant="scope"
      />

      <div className="rounded-2xl border border-border bg-surface/40 px-4 py-3 text-sm">
        <p className="font-semibold text-foreground">
          {formatTurnoverCadence(serviceDetails.frequency)}
          {whenPreference ? ` · ${formatWhenPreference(whenPreference)}` : ""}
        </p>
        <p className="text-muted-foreground mt-1 leading-relaxed">
          Tell us about the property and what the cleaner should focus on. The guide price in your
          booking summary updates as you go.
        </p>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-2">Property type</h3>
        <p className="text-sm text-muted-foreground mb-3">
          What type of short-stay property is this?
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {["Room", "Studio", "Apartment", "House", "Guesthouse unit"].map((label) => (
            <button
              key={label}
              type="button"
              onClick={() =>
                onDescriptionChange(
                  [description.replace(/^Property type:.*\n?/m, "").trim(), `Property type: ${label}`]
                    .filter(Boolean)
                    .join("\n")
                )
              }
              className={cn(
                "rounded-xl border-2 p-3 text-left text-sm transition-colors",
                description.includes(`Property type: ${label}`)
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary/40"
              )}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-2">Property size</h3>
        <p className="text-sm text-muted-foreground mb-3">
          Bedrooms and bathrooms set our suggested visit length.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {HOME_SIZE_PRESETS.map((preset) => {
            const active =
              (serviceDetails.bedrooms ?? 3) === preset.bedrooms &&
              (serviceDetails.bathrooms ?? 2) === preset.bathrooms;
            return (
              <button
                key={preset.id}
                type="button"
                onClick={() => applyHomePreset(preset.bedrooms, preset.bathrooms)}
                className={cn(
                  "rounded-xl border-2 p-3 text-left transition-colors",
                  active ? "border-primary bg-primary/5" : "border-border hover:border-primary/40"
                )}
              >
                <p className="text-sm font-semibold">{preset.label}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{preset.sub}</p>
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-1">Linen and towels</h3>
        <p className="text-sm text-muted-foreground mb-3">
          How should the cleaner handle bedding, mats, and towels? Select all that apply.
        </p>
        <div className="space-y-2">
          {LINEN_OPTIONS.map((option) => {
            const checked = linenPreferences.includes(option.id);
            return (
              <label
                key={option.id}
                className={cn(
                  "flex items-start gap-3 rounded-xl border-2 p-4 cursor-pointer transition-colors",
                  checked
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/40 bg-card"
                )}
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => toggleLinenPreference(option.id)}
                  className="mt-0.5 h-4 w-4 shrink-0 rounded border-border text-primary accent-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
                />
                <span className="min-w-0">
                  <span className="block font-semibold text-foreground">{option.label}</span>
                  <span className="block text-sm text-muted-foreground mt-1 leading-relaxed">
                    {option.description}
                  </span>
                </span>
              </label>
            );
          })}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-1">Add-on tasks</h3>
        {includesLaundry && laundryAddon && (
          <p className="text-sm text-muted-foreground mb-3">
            <span className="font-medium text-foreground">{laundryAddon.label}</span> is included
            with wash and repack linen (+visit time).
          </p>
        )}
        <div className="grid sm:grid-cols-3 gap-3">
          {availableAddons.map((task) => (
            <AirbnbOptionCard
              key={task.id}
              selected={serviceDetails.addons.includes(task.id)}
              onClick={() => toggleExtraTask(task.id)}
              title={task.label}
              description={task.description}
            />
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-2">Visit length</h3>
        <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
          Book between 3 and 8 hours. Most between-guest cleans in Lusaka run 4 to 6 hours depending on
          size, laundry, and add-ons.
        </p>
        <div className="flex flex-wrap items-center gap-4">
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={() => adjustHours(-1)}
            disabled={serviceDetails.durationHours <= DURATION_OPTIONS[0]}
          >
            <Minus className="h-4 w-4" />
          </Button>
          <span className="font-display text-3xl font-bold w-12 text-center">
            {serviceDetails.durationHours}
          </span>
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={() => adjustHours(1)}
            disabled={
              !canIncreaseDuration(
                serviceDetails.durationHours,
                serviceTime,
                "cleaning",
                serviceDetails.serviceType
              )
            }
          >
            <Plus className="h-4 w-4" />
          </Button>
          {recommendedHours !== serviceDetails.durationHours && (
            <button
              type="button"
              onClick={() => applySuggestedHours(recommendedHours)}
              className="text-sm font-semibold text-primary hover:underline"
            >
              Suggested {recommendedHours}h
            </button>
          )}
        </div>
        {serviceTime && serviceDate && (
          <ScheduleFeasibilityNotice
            category="cleaning"
            serviceType={serviceDetails.serviceType}
            serviceDate={serviceDate}
            serviceTime={serviceTime}
            durationHours={serviceDetails.durationHours}
            className="mt-4"
          />
        )}
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="guest-checkout-time" className="text-sm font-medium mb-2 block">
            Guest check-out time (optional)
          </label>
          <Input
            id="guest-checkout-time"
            type="time"
            value={guestCheckoutTime}
            onChange={(e) => onGuestCheckoutTimeChange?.(e.target.value)}
            className="rounded-xl"
          />
        </div>
        <div>
          <label htmlFor="next-check-in" className="text-sm font-medium mb-2 block">
            Next check-in (optional)
          </label>
          <Input
            id="next-check-in"
            placeholder="e.g. Tomorrow 3pm"
            value={nextCheckIn}
            onChange={(e) => onNextCheckInChange?.(e.target.value)}
            className="rounded-xl"
          />
        </div>
      </div>

      <div>
        <label htmlFor="service-notes" className="text-sm font-medium mb-2 block">
          Access and notes for your cleaner
        </label>
        <Textarea
          id="service-notes"
          placeholder="Gate code, lockbox, clean linen location, same-day check-in deadline, photo reporting, key access..."
          value={description}
          onChange={(e) => onDescriptionChange(e.target.value)}
          rows={3}
          className="rounded-xl resize-none"
        />
      </div>

      <BookingStepFooter
        onBack={() => onStepChange("plan")}
        primaryLabel="Choose your cleaner"
        onPrimary={onFindWorker}
        primaryDisabled={!canChooseCleaner}
      />
    </div>
  );
}
