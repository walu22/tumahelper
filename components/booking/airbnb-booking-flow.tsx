"use client";

import { useMemo } from "react";
import {
  Calendar,
  CalendarClock,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Minus,
  Plus,
  Repeat,
  Zap,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { AirbnbOptionCard } from "@/components/booking/airbnb-option-card";
import {
  AIRBNB_EXTRA_TASKS,
  formatAirbnbAddress,
  LINEN_OPTIONS,
  todayIsoDate,
  tomorrowIsoDate,
  type AirbnbFlowStep,
  type AirbnbWhenPreference,
  type LinenPreference,
} from "@/lib/booking/airbnb-flow";
import {
  DURATION_OPTIONS,
  TURNOVER_FREQUENCY_OPTIONS,
  type ServiceDetails,
  type TurnoverFrequency,
} from "@/lib/services/catalog";
import { getStartTimeOptions } from "@/lib/booking/time-slots";
import { suggestDuration, suggestPrice } from "@/lib/services/utils";
import { cn } from "@/lib/utils";

const HOME_SIZE_PRESETS = [
  { id: "small", label: "Small", sub: "1 to 2 bedrooms", bedrooms: 2, bathrooms: 1 },
  { id: "medium", label: "Medium", sub: "3 to 4 bedrooms", bedrooms: 3, bathrooms: 2 },
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
  onLocationConfirm: (fullAddress: string) => void;
  serviceDetails: ServiceDetails;
  onServiceDetailsChange: (details: ServiceDetails) => void;
  serviceDate: string;
  serviceTime: string;
  description: string;
  onDateChange: (value: string) => void;
  onTimeChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onFindWorker: () => void;
}

function formatDisplayDate(isoDate: string): string {
  if (!isoDate) return "";
  const d = new Date(`${isoDate}T12:00:00`);
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
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
}: AirbnbBookingFlowProps) {
  const previewAddress = useMemo(
    () => formatAirbnbAddress(streetAddress, unitAddress),
    [streetAddress, unitAddress]
  );
  const canPreviewLocation = streetAddress.trim().length >= 5;
  const startTimes = getStartTimeOptions("cleaning", "airbnb");
  const recommendedHours = suggestDuration(serviceDetails);
  const isRepeat = serviceDetails.frequency !== "once" && serviceDetails.frequency !== undefined;
  const whenPreference = serviceDetails.whenPreference;
  const linenPreference = serviceDetails.linenPreference ?? "replace_no_wash";

  function update(patch: Partial<ServiceDetails>) {
    onServiceDetailsChange({ ...serviceDetails, ...patch });
  }

  function setFrequencyMode(repeat: boolean) {
    update({
      frequency: repeat ? "per_checkout" : "once",
    });
  }

  function setWhenPreference(pref: AirbnbWhenPreference) {
    update({ whenPreference: pref });
    if (pref === "today" || pref === "last_minute") {
      onDateChange(todayIsoDate());
      if (!serviceTime) onTimeChange("14:00");
    } else {
      if (!serviceDate || serviceDate === todayIsoDate()) {
        onDateChange(tomorrowIsoDate());
      }
    }
  }

  function setLinenPreference(pref: LinenPreference) {
    const addons = [...serviceDetails.addons];
    const hasLaundry = addons.includes("laundry");
    if (pref === "wash_repack" && !hasLaundry) {
      addons.push("laundry");
    }
    if (pref !== "wash_repack" && hasLaundry) {
      const idx = addons.indexOf("laundry");
      addons.splice(idx, 1);
    }
    const next = { ...serviceDetails, linenPreference: pref, addons };
    onServiceDetailsChange({ ...next, durationHours: suggestDuration(next) });
  }

  function toggleExtraTask(id: string) {
    const addons = serviceDetails.addons.includes(id)
      ? serviceDetails.addons.filter((a) => a !== id)
      : [...serviceDetails.addons, id];
    const next = { ...serviceDetails, addons };
    onServiceDetailsChange({ ...next, durationHours: suggestDuration(next) });
  }

  function adjustHours(delta: number) {
    const options = [...DURATION_OPTIONS];
    const current = serviceDetails.durationHours;
    const idx = options.indexOf(current as (typeof options)[number]);
    const nextIdx = Math.max(0, Math.min(options.length - 1, idx + delta));
    update({ durationHours: options[nextIdx] ?? current });
  }

  function applyHomePreset(bedrooms: number, bathrooms: number) {
    const next = { ...serviceDetails, bedrooms, bathrooms };
    onServiceDetailsChange({ ...next, durationHours: suggestDuration(next) });
  }

  const canFindWorker =
    !!serviceDate &&
    !!serviceTime &&
    locationAddress.length >= 5 &&
    !!whenPreference &&
    !!linenPreference;

  if (step === "address") {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-semibold">Where do you need help?</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Enter your short-stay property address in Lusaka.
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <label htmlFor="airbnb-street" className="text-sm font-medium mb-2 block">
              Street address <span className="text-primary">*</span>
            </label>
            <Input
              id="airbnb-street"
              placeholder="e.g. Plot 12, Kabulonga"
              value={streetAddress}
              onChange={(e) => onStreetAddressChange(e.target.value)}
              className="h-11 rounded-xl"
            />
          </div>

          <div>
            <label htmlFor="airbnb-unit" className="text-sm font-medium mb-2 block">
              Unit / apartment no. and name (optional)
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
            onClick={() => onLocationConfirm(previewAddress)}
            className="w-full rounded-2xl border-2 border-primary bg-primary/5 p-4 text-left hover:bg-primary/10 transition-colors"
          >
            <p className="text-xs font-semibold uppercase tracking-wide text-primary mb-2">
              Set location
            </p>
            <p className="flex items-start gap-2 font-medium text-foreground leading-snug">
              <MapPin className="h-4 w-4 text-primary shrink-0 mt-0.5" />
              {previewAddress}
            </p>
            <p className="text-sm text-muted-foreground mt-2">Tap to use this address</p>
          </button>
        )}
      </div>
    );
  }

  if (step === "plan") {
    return (
      <div className="space-y-8">
        <div>
          <h2 className="text-2xl font-semibold">How often do you need help?</h2>
          <p className="text-sm text-muted-foreground mt-1">
            How often do you need the service?
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-3">
          <AirbnbOptionCard
            selected={!isRepeat}
            onClick={() => setFrequencyMode(false)}
            title="One time"
            description="For once-off services that will not repeat"
          />
          <AirbnbOptionCard
            selected={isRepeat}
            onClick={() => setFrequencyMode(true)}
            title="Repeat"
            description="Book regular turnover cleans for your property"
            icon={Repeat}
          />
        </div>

        {isRepeat && (
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
        )}

        <div>
          <h2 className="text-2xl font-semibold">When do you need help?</h2>
          <p className="text-sm text-muted-foreground mt-1">Choose when the clean should happen.</p>
        </div>

        <div className="grid sm:grid-cols-3 gap-3">
          <AirbnbOptionCard
            selected={whenPreference === "today"}
            onClick={() => setWhenPreference("today")}
            title="Today"
            description="Get help asap today"
            icon={Zap}
          />
          <AirbnbOptionCard
            selected={whenPreference === "last_minute"}
            onClick={() => setWhenPreference("last_minute")}
            title="Last minute"
            description="Urgent turnover today"
            icon={CalendarClock}
          />
          <AirbnbOptionCard
            selected={whenPreference === "tomorrow_later"}
            onClick={() => setWhenPreference("tomorrow_later")}
            title="Tomorrow / later"
            description="Get help tomorrow or on another day"
            icon={Calendar}
          />
        </div>

        <div className="flex justify-between pt-2 gap-3">
          <Button variant="outline" onClick={() => onStepChange("address")}>
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <Button onClick={() => onStepChange("scope")} disabled={!whenPreference}>
            Continue
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  }

  const selectedTimeLabel =
    startTimes.find((s) => s.value === serviceTime)?.label ?? serviceTime;

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-semibold">How long should I book?</h2>
        <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
          You can book between 3 and 8 hours with us. Airbnb suggests that turnover cleans
          typically take 4 to 7 hours. When choosing the duration, consider the size of your
          property and whether laundry is required.
        </p>
      </div>

      <div className="rounded-2xl border border-border bg-surface/40 p-4">
        <p className="text-sm font-semibold text-foreground">
          {isRepeat ? "Repeat booking" : "One time booking"}
        </p>
        <p className="text-sm text-muted-foreground mt-1">
          {isRepeat
            ? "Regular turnover help. You can change your cleaner any time."
            : "Get once-off help. Try a new worker. Cancel any time."}
        </p>
      </div>

      <div>
        <p className="text-sm font-medium mb-2">Property size</p>
        <div className="grid grid-cols-3 gap-2 mb-4">
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

      <div className="rounded-2xl border border-border p-5 space-y-4">
        <p className="text-sm font-semibold">
          {whenPreference === "today" || whenPreference === "last_minute" ? "Today" : "Date & time"}
        </p>
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
            {serviceDate && (
              <p className="text-xs text-muted-foreground mt-1">{formatDisplayDate(serviceDate)}</p>
            )}
          </div>
          <div>
            <label htmlFor="service-start-time" className="text-sm font-medium mb-2 block">
              Time
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
            {selectedTimeLabel && (
              <p className="text-xs text-muted-foreground mt-1">{selectedTimeLabel}</p>
            )}
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-1">Do you require linen to be cleaned?</h3>
        <p className="text-sm text-muted-foreground mb-3">
          What should we do with linen (dirty bedding, mats and towels)?
        </p>
        <div className="space-y-2">
          {LINEN_OPTIONS.map((option) => (
            <AirbnbOptionCard
              key={option.id}
              selected={linenPreference === option.id}
              onClick={() => setLinenPreference(option.id)}
              title={option.label}
              description={option.description}
            />
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-3">Extra tasks</h3>
        <div className="grid sm:grid-cols-3 gap-3">
          {AIRBNB_EXTRA_TASKS.map((task) => (
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
        <p className="text-sm font-medium mb-3">How long?</p>
        <div className="flex items-center gap-4">
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
              serviceDetails.durationHours >= DURATION_OPTIONS[DURATION_OPTIONS.length - 1]
            }
          >
            <Plus className="h-4 w-4" />
          </Button>
          {recommendedHours !== serviceDetails.durationHours && (
            <button
              type="button"
              onClick={() => update({ durationHours: recommendedHours })}
              className="text-sm font-semibold text-primary hover:underline"
            >
              Use recommended {recommendedHours}h
            </button>
          )}
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          Est. price K{suggestPrice(serviceDetails).typical} for {serviceDetails.durationHours}{" "}
          hours
        </p>
      </div>

      <div>
        <label htmlFor="service-notes" className="text-sm font-medium mb-2 block">
          Add specific instructions
        </label>
        <Textarea
          id="service-notes"
          placeholder="Add your notes here. Gate code, lockbox, linen location..."
          value={description}
          onChange={(e) => onDescriptionChange(e.target.value)}
          rows={3}
          className="rounded-xl resize-none"
        />
      </div>

      <div className="flex justify-between pt-2 gap-3">
        <Button variant="outline" onClick={() => onStepChange("plan")}>
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <Button onClick={onFindWorker} disabled={!canFindWorker}>
          Find a worker
          <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
