"use client";

import { Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { BookingStepFooter } from "@/components/booking/booking-step-footer";
import { AddressStepFields } from "@/components/booking/address-step-fields";
import { BookingFlowProgress } from "@/components/booking/booking-flow-progress";
import { SchedulePlanSection } from "@/components/booking/schedule-plan-section";
import { CleaningTypeTabs } from "@/components/booking/cleaning-type-tabs";
import { AirbnbOptionCard } from "@/components/booking/airbnb-option-card";
import {
  formatVisitCadence,
  formatWhenPreference,
  getFlowSteps,
  type ServiceFlowStep,
} from "@/lib/booking/shared-flow";
import {
  DURATION_OPTIONS,
  getAvailableAddons,
  sanitizeAddons,
  getServiceType,
  type ServiceDetails,
} from "@/lib/services/catalog";
import { suggestDuration } from "@/lib/services/utils";
import { cn } from "@/lib/utils";

const HOME_SIZE_PRESETS = [
  { id: "small", label: "Compact", sub: "1 to 2 bedrooms", bedrooms: 2, bathrooms: 1 },
  { id: "medium", label: "Standard", sub: "3 to 4 bedrooms", bedrooms: 3, bathrooms: 2 },
  { id: "large", label: "Large", sub: "5+ bedrooms", bedrooms: 5, bathrooms: 3 },
] as const;

interface CleaningBookingFlowProps {
  step: ServiceFlowStep;
  onStepChange: (step: ServiceFlowStep) => void;
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
  lockServiceType?: boolean;
}

export function CleaningBookingFlow({
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
}: CleaningBookingFlowProps) {
  const flowSteps = getFlowSteps("cleaning", serviceDetails.serviceType);
  const recommendedHours = suggestDuration(serviceDetails);
  const whenPreference = serviceDetails.whenPreference;
  const availableAddons = getAvailableAddons("cleaning", serviceDetails.serviceType);
  const isRepeat = serviceDetails.frequency !== "once";
  const repeatCadenceChosen =
    !isRepeat ||
    (serviceDetails.frequency !== "once" && !!serviceDetails.frequency);

  function update(patch: Partial<ServiceDetails>) {
    onServiceDetailsChange({ ...serviceDetails, ...patch });
  }

  function setServiceType(serviceType: string, defaultHours: number) {
    const addons = sanitizeAddons("cleaning", serviceType, serviceDetails.addons);
    let next: ServiceDetails = {
      ...serviceDetails,
      serviceType,
      addons,
      durationHours: defaultHours,
    };
    if (serviceType === "apartment") {
      next = { ...next, bedrooms: 2, bathrooms: 1 };
    }
    onServiceDetailsChange({ ...next, durationHours: suggestDuration(next) });
  }

  function toggleAddon(id: string) {
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

  const canContinuePlan =
    !!whenPreference &&
    repeatCadenceChosen &&
    !!serviceDate &&
    !!serviceTime;
  const canChooseWorker =
    !!serviceDate &&
    !!serviceTime &&
    locationAddress.length >= 5 &&
    !!whenPreference;

  function handleCleaningTypeChange(typeId: string) {
    const type = getServiceType("cleaning", typeId);
    if (type) setServiceType(typeId, type.defaultHours);
  }

  const selectedType = getServiceType("cleaning", serviceDetails.serviceType);

  const cleaningTypePicker =
    !lockServiceType && step === "address" ? (
      <div className="mb-6">
        <CleaningTypeTabs
          value={serviceDetails.serviceType}
          onChange={handleCleaningTypeChange}
          showDetails={false}
          centered
        />
      </div>
    ) : null;

  if (step === "address") {
    return (
      <div>
        <BookingFlowProgress steps={flowSteps} current="address" />
        {cleaningTypePicker}
        <AddressStepFields
          idPrefix="cleaning"
          streetAddress={streetAddress}
          unitAddress={unitAddress}
          onStreetAddressChange={onStreetAddressChange}
          onUnitAddressChange={onUnitAddressChange}
          onConfirm={onLocationConfirm}
          heading="Where should we clean?"
          description="Start typing a street or plot. Matching roads and suburbs in Lusaka will appear as you type."
        />
      </div>
    );
  }

  if (step === "plan") {
    return (
      <div>
        <BookingFlowProgress steps={flowSteps} current="plan" />
        <SchedulePlanSection
          category="cleaning"
          serviceType={serviceDetails.serviceType}
          serviceDetails={serviceDetails}
          onServiceDetailsChange={onServiceDetailsChange}
          serviceDate={serviceDate}
          serviceTime={serviceTime}
          onDateChange={onDateChange}
          onTimeChange={onTimeChange}
          onBack={() => onStepChange("address")}
          onContinue={() => onStepChange("scope")}
          canContinue={canContinuePlan}
          frequencyHeading="How often?"
          frequencyDescription="Is this a one-off clean, or something you want on a regular schedule?"
          timingHeading="When should the clean happen?"
        />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <BookingFlowProgress steps={flowSteps} current="scope" />

      {lockServiceType && selectedType && (
        <div className="rounded-xl border border-border bg-card px-4 py-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1">
            Clean type
          </p>
          <p className="font-semibold text-foreground">{selectedType.label}</p>
        </div>
      )}

      <div className="rounded-2xl border border-border bg-surface/40 px-4 py-3 text-sm">
        <p className="font-semibold text-foreground">
          {formatVisitCadence(serviceDetails.frequency, {
            category: "cleaning",
            serviceType: serviceDetails.serviceType,
          })}
          {whenPreference ? ` · ${formatWhenPreference(whenPreference)}` : ""}
        </p>
        <p className="text-muted-foreground mt-1 leading-relaxed">
          Tell us about your home and what the cleaner should focus on. The guide price in your
          booking summary updates as you go.
        </p>
      </div>

      {serviceDetails.serviceType !== "garage" && (
      <div>
        <h3 className="text-lg font-semibold mb-2">Home size</h3>
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
      )}

      {availableAddons.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-1">Add-on tasks</h3>
          <p className="text-sm text-muted-foreground mb-3">Select all that apply.</p>
          <div className="grid sm:grid-cols-2 gap-3">
            {availableAddons.map((addon) => (
              <AirbnbOptionCard
                key={addon.id}
                selected={serviceDetails.addons.includes(addon.id)}
                onClick={() => toggleAddon(addon.id)}
                title={addon.label}
                description={addon.description}
              />
            ))}
          </div>
        </div>
      )}

      <div>
        <h3 className="text-lg font-semibold mb-2">Visit length</h3>
        <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
          Book between 3 and 8 hours. We suggest a length based on your home size and add-ons.
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
      </div>

      <div>
        <label htmlFor="cleaning-notes" className="text-sm font-medium mb-2 block">
          Access and notes for your cleaner
        </label>
        <Textarea
          id="cleaning-notes"
          placeholder="Gate code, parking, pets, areas to focus on..."
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
        primaryDisabled={!canChooseWorker}
      />
    </div>
  );
}
