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
import { LusakaAddressInput } from "@/components/booking/lusaka-address-input";
import { AirbnbFlowProgress } from "@/components/booking/airbnb-flow-progress";
import { AirbnbOptionCard } from "@/components/booking/airbnb-option-card";
import {
  AIRBNB_EXTRA_TASKS,
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
import {
  DURATION_OPTIONS,
  TURNOVER_FREQUENCY_OPTIONS,
  getLinenPreferences,
  type ServiceDetails,
  type TurnoverFrequency,
} from "@/lib/services/catalog";
import { getStartTimeOptions, type StartTimeOption } from "@/lib/booking/time-slots";
import { suggestDuration, suggestPrice } from "@/lib/services/utils";
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

function filterStartTimes(
  times: StartTimeOption[],
  serviceDate: string,
  whenPreference?: AirbnbWhenPreference
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
  const allStartTimes = getStartTimeOptions("cleaning", "airbnb");
  const startTimes = useMemo(
    () => filterStartTimes(allStartTimes, serviceDate, serviceDetails.whenPreference),
    [allStartTimes, serviceDate, serviceDetails.whenPreference]
  );
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
    const options = [...DURATION_OPTIONS];
    const current = serviceDetails.durationHours;
    const idx = Math.max(0, options.indexOf(current as (typeof options)[number]));
    const nextIdx = Math.max(0, Math.min(options.length - 1, idx + delta));
    update({ durationHours: options[nextIdx] ?? current });
  }

  function applyHomePreset(bedrooms: number, bathrooms: number) {
    const next = { ...serviceDetails, bedrooms, bathrooms };
    onServiceDetailsChange({ ...next, durationHours: suggestDuration(next) });
  }

  const canContinuePlan = !!whenPreference && repeatCadenceChosen;
  const canChooseCleaner =
    !!serviceDate &&
    !!serviceTime &&
    locationAddress.length >= 5 &&
    !!whenPreference &&
    linenPreferences.length > 0;

  if (step === "address") {
    return (
      <div className="space-y-6">
        <AirbnbFlowProgress current="address" />
        <div>
          <h2 className="text-2xl font-semibold">Where is your property?</h2>
          <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
            Start typing a street or plot. Matching roads and suburbs in Lusaka will appear as you
            type.
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <label htmlFor="airbnb-street" className="text-sm font-medium mb-2 block">
              Street or plot address <span className="text-primary">*</span>
            </label>
            <LusakaAddressInput
              id="airbnb-street"
              value={streetAddress}
              onChange={onStreetAddressChange}
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
            onClick={() => onLocationConfirm(previewAddress)}
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
            Pick how soon you need the clean. You can fine-tune the exact slot on the next
            screen.
          </p>
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

        <div className="flex justify-between pt-2 gap-3">
          <Button variant="outline" onClick={() => onStepChange("address")}>
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <Button onClick={() => onStepChange("scope")} disabled={!canContinuePlan}>
            Continue
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  }

  const selectedTimeLabel =
    startTimes.find((s) => s.value === serviceTime)?.label ?? serviceTime;
  const price = suggestPrice(serviceDetails);

  return (
    <div className="space-y-8">
      <AirbnbFlowProgress current="scope" />

      <div className="rounded-2xl border border-border bg-surface/40 px-4 py-3 text-sm">
        <p className="font-semibold text-foreground">
          {formatTurnoverCadence(serviceDetails.frequency)}
          {whenPreference ? ` · ${formatWhenPreference(whenPreference)}` : ""}
        </p>
        <p className="text-muted-foreground mt-1 leading-relaxed">
          Tell us about the property and what the cleaner should focus on. You agree the final
          fee with your cleaner before the visit.
        </p>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-2">Property size</h3>
        <p className="text-sm text-muted-foreground mb-3">
          Bedrooms and bathrooms set our suggested visit length.
        </p>
        <div className="grid grid-cols-3 gap-2">
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
          {LINEN_OPTIONS.map((option) => (
            <AirbnbOptionCard
              key={option.id}
              selected={linenPreferences.includes(option.id)}
              onClick={() => toggleLinenPreference(option.id)}
              title={option.label}
              description={option.description}
            />
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-3">Add-on tasks</h3>
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
        <h3 className="text-lg font-semibold mb-2">Visit length</h3>
        <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
          Book between 3 and 8 hours. Most between-guest cleans in Lusaka run 4 to 6 hours depending on
          size, laundry, and add-ons.
        </p>
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
              Suggested {recommendedHours}h
            </button>
          )}
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          Guide price about K{price.typical} for {serviceDetails.durationHours} hours
        </p>
      </div>

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
            {serviceDate && (
              <p className="text-xs text-muted-foreground mt-1">{formatDisplayDate(serviceDate)}</p>
            )}
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
            {selectedTimeLabel && (
              <p className="text-xs text-muted-foreground mt-1">{selectedTimeLabel}</p>
            )}
          </div>
        </div>
        {whenPreference === "last_minute" && serviceDate === todayIsoDate() && (
          <p className="text-xs text-muted-foreground">
            Showing later slots today for urgent same-day cleans.
          </p>
        )}
      </div>

      <div>
        <label htmlFor="service-notes" className="text-sm font-medium mb-2 block">
          Access and notes for your cleaner
        </label>
        <Textarea
          id="service-notes"
          placeholder="Gate code, lockbox, where linen is kept, parking..."
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
        <Button onClick={onFindWorker} disabled={!canChooseCleaner}>
          Choose your cleaner
          <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
