"use client";

import { Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { BookingStepFooter } from "@/components/booking/booking-step-footer";
import { AddressStepFields } from "@/components/booking/address-step-fields";
import { BookingFlowProgress } from "@/components/booking/booking-flow-progress";
import { SchedulePlanSection } from "@/components/booking/schedule-plan-section";
import { ServiceDetailsCard } from "@/components/booking/service-details-card";
import { AirbnbOptionCard } from "@/components/booking/airbnb-option-card";
import { LaundryTypeTabs } from "@/components/booking/laundry-type-tabs";
import { GardenTypeTabs } from "@/components/booking/garden-type-tabs";
import {
  formatVisitCadence,
  formatWhenPreference,
  getFlowSteps,
  type ServiceFlowStep,
} from "@/lib/booking/shared-flow";
import {
  DURATION_OPTIONS,
  getAvailableAddons,
  getServiceType,
  sanitizeAddons,
  type ServiceCategoryKey,
  type ServiceDetails,
} from "@/lib/services/catalog";
import { suggestDuration } from "@/lib/services/utils";

interface TaskServiceBookingFlowProps {
  category: "laundry" | "garden";
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

const COPY = {
  laundry: {
    addressHeading: "Where should we collect or help with laundry?",
    addressDescription:
      "Start typing your home address in Lusaka so we can match helpers nearby.",
    scopeIntro:
      "Tell us about the laundry load and what you need. The guide price in your booking summary updates as you go.",
    notesLabel: "Laundry notes for your helper",
    notesPlaceholder: "Machine access, detergent on site, delicate items, pickup instructions...",
    primaryLabel: "Choose your helper",
    serviceLabel: "Laundry type",
  },
  garden: {
    addressHeading: "Where is the yard or garden?",
    addressDescription:
      "Start typing your home address in Lusaka so we can match gardeners nearby.",
    scopeIntro:
      "Tell us about the outside areas and what needs doing. The guide price in your booking summary updates as you go.",
    notesLabel: "Access and notes for your gardener",
    notesPlaceholder: "Gate code, water access, areas to focus on, tools on site...",
    primaryLabel: "Choose your gardener",
    serviceLabel: "Garden type",
  },
} as const;

export function TaskServiceBookingFlow({
  category,
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
}: TaskServiceBookingFlowProps) {
  const copy = COPY[category];
  const flowSteps = getFlowSteps(category);
  const recommendedHours = suggestDuration(serviceDetails);
  const whenPreference = serviceDetails.whenPreference;
  const availableAddons = getAvailableAddons(category, serviceDetails.serviceType);
  const isRepeat = serviceDetails.frequency !== "once";
  const repeatCadenceChosen =
    !isRepeat ||
    (serviceDetails.frequency !== "once" && !!serviceDetails.frequency);
  const selectedType = getServiceType(category, serviceDetails.serviceType);

  function update(patch: Partial<ServiceDetails>) {
    onServiceDetailsChange({ ...serviceDetails, ...patch });
  }

  function setServiceType(serviceType: string, defaultHours: number) {
    const addons = sanitizeAddons(category, serviceType, serviceDetails.addons);
    const next = { ...serviceDetails, serviceType, addons, durationHours: defaultHours };
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

  function handleTypeChange(typeId: string) {
    const type = getServiceType(category, typeId);
    if (type) setServiceType(typeId, type.defaultHours);
  }

  const canContinuePlan =
    !!whenPreference && repeatCadenceChosen && !!serviceDate && !!serviceTime;
  const canChooseWorker =
    !!serviceDate && !!serviceTime && locationAddress.length >= 5 && !!whenPreference;

  const TypeTabs = category === "laundry" ? LaundryTypeTabs : GardenTypeTabs;

  const typePicker =
    !lockServiceType && step === "address" ? (
      <div className="mb-6">
        <TypeTabs
          value={serviceDetails.serviceType}
          onChange={handleTypeChange}
          showDetails
          centered
        />
      </div>
    ) : null;

  const lockedTypeSummary =
    lockServiceType && selectedType && step === "address" ? (
      <div className="mb-6">
        <ServiceDetailsCard
          category={category}
          serviceType={serviceDetails.serviceType}
          variant="selection"
        />
      </div>
    ) : null;

  if (step === "address") {
    return (
      <div>
        <BookingFlowProgress steps={flowSteps} current="address" />
        {lockedTypeSummary}
        {typePicker}
        <AddressStepFields
          idPrefix={category}
          streetAddress={streetAddress}
          unitAddress={unitAddress}
          onStreetAddressChange={onStreetAddressChange}
          onUnitAddressChange={onUnitAddressChange}
          onConfirm={onLocationConfirm}
          heading={copy.addressHeading}
          description={copy.addressDescription}
        />
      </div>
    );
  }

  if (step === "plan") {
    return (
      <div>
        <BookingFlowProgress steps={flowSteps} current="plan" />
        <ServiceDetailsCard
          category={category}
          serviceType={serviceDetails.serviceType}
          variant="plan"
          className="mb-6"
        />
        <SchedulePlanSection
          category={category as ServiceCategoryKey}
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
          frequencyDescription="Is this a one-off visit, or something you want on a regular schedule?"
          timingHeading="When should the helper arrive?"
        />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <BookingFlowProgress steps={flowSteps} current="scope" />

      <ServiceDetailsCard
        category={category}
        serviceType={serviceDetails.serviceType}
        variant="scope"
      />

      {lockServiceType && selectedType && (
        <div className="rounded-xl border border-border bg-card px-4 py-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1">
            {copy.serviceLabel}
          </p>
          <p className="font-semibold text-foreground">{selectedType.label}</p>
        </div>
      )}

      <div className="rounded-2xl border border-border bg-surface/40 px-4 py-3 text-sm">
        <p className="font-semibold text-foreground">
          {formatVisitCadence(serviceDetails.frequency, { category })}
          {whenPreference ? ` · ${formatWhenPreference(whenPreference)}` : ""}
        </p>
        <p className="text-muted-foreground mt-1 leading-relaxed">{copy.scopeIntro}</p>
      </div>

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
          Book between 3 and 8 hours. We suggest a length based on your job and add-ons.
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
        <label htmlFor={`${category}-notes`} className="text-sm font-medium mb-2 block">
          {copy.notesLabel}
        </label>
        <Textarea
          id={`${category}-notes`}
          placeholder={copy.notesPlaceholder}
          value={description}
          onChange={(e) => onDescriptionChange(e.target.value)}
          rows={3}
          className="rounded-xl resize-none"
        />
      </div>

      <BookingStepFooter
        onBack={() => onStepChange("plan")}
        primaryLabel={copy.primaryLabel}
        onPrimary={onFindWorker}
        primaryDisabled={!canChooseWorker}
      />
    </div>
  );
}
