"use client";

import { Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { BookingStepFooter } from "@/components/booking/booking-step-footer";
import { AddressStepFields } from "@/components/booking/address-step-fields";
import { BookingFlowProgress } from "@/components/booking/booking-flow-progress";
import { SchedulePlanSection } from "@/components/booking/schedule-plan-section";
import { HousekeepingTypeTabs } from "@/components/booking/housekeeping-type-tabs";
import { ServiceScopeTeaser } from "@/components/booking/service-scope-teaser";
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
  getServiceType,
  isRecurringHousekeepingType,
  sanitizeAddons,
  type ServiceDetails,
  type TurnoverFrequency,
} from "@/lib/services/catalog";
import { suggestDuration } from "@/lib/services/utils";

interface HousekeepingBookingFlowProps {
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

export function HousekeepingBookingFlow({
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
}: HousekeepingBookingFlowProps) {
  const flowSteps = getFlowSteps("housekeeping", serviceDetails.serviceType);
  const recommendedHours = suggestDuration(serviceDetails);
  const whenPreference = serviceDetails.whenPreference;
  const availableAddons = getAvailableAddons("housekeeping", serviceDetails.serviceType);
  const recurringType = isRecurringHousekeepingType(serviceDetails.serviceType);
  const isRepeat = serviceDetails.frequency !== "once";
  const repeatCadenceChosen =
    recurringType || !isRepeat || (isRepeat && !!serviceDetails.frequency);
  const selectedType = getServiceType("housekeeping", serviceDetails.serviceType);
  const canAdjustHours = !recurringType;

  function update(patch: Partial<ServiceDetails>) {
    onServiceDetailsChange({ ...serviceDetails, ...patch });
  }

  function setServiceType(serviceType: string, defaultHours: number) {
    const addons = sanitizeAddons("housekeeping", serviceType, serviceDetails.addons);
    const frequency: TurnoverFrequency =
      serviceType === "weekly" ? "weekly" : "once";
    const next = {
      ...serviceDetails,
      serviceType,
      addons,
      durationHours: defaultHours,
      frequency,
    };
    onServiceDetailsChange({ ...next, durationHours: suggestDuration(next) });
  }

  function toggleDuty(id: string) {
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
    const type = getServiceType("housekeeping", typeId);
    if (type) setServiceType(typeId, type.defaultHours);
  }

  const canContinuePlan =
    !!whenPreference && repeatCadenceChosen && !!serviceDate && !!serviceTime;
  const canChooseWorker =
    !!serviceDate &&
    !!serviceTime &&
    locationAddress.length >= 5 &&
    !!whenPreference;

  const typePicker =
    !lockServiceType && step === "address" ? (
      <div className="mb-6">
        <HousekeepingTypeTabs
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
        <ServiceScopeTeaser category="housekeeping" serviceType={serviceDetails.serviceType} />
        <p className="text-sm text-muted-foreground mt-3 leading-relaxed">
          You are booking household help for a set time. Choose duties in the next step, not a
          fixed clean package.
        </p>
      </div>
    ) : null;

  if (step === "address") {
    return (
      <div>
        <BookingFlowProgress steps={flowSteps} current="address" />
        {lockedTypeSummary}
        {typePicker}
        {!lockServiceType && (
          <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
            Housekeeping is sold by visit length and duties, including cleaning, laundry, dishes,
            and more. It is not a fixed clean checklist.
          </p>
        )}
        <AddressStepFields
          idPrefix="housekeeping"
          streetAddress={streetAddress}
          unitAddress={unitAddress}
          onStreetAddressChange={onStreetAddressChange}
          onUnitAddressChange={onUnitAddressChange}
          onConfirm={onLocationConfirm}
          heading="Where should the helper work?"
          description="Start typing your home address in Lusaka so we can match housekeepers nearby."
        />
      </div>
    );
  }

  if (step === "plan") {
    return (
      <div>
        <BookingFlowProgress steps={flowSteps} current="plan" />
        <SchedulePlanSection
          category="housekeeping"
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
          hideFrequency={recurringType}
          frequencyHeading="How often?"
          frequencyDescription={
            recurringType
              ? "This visit type already includes a regular schedule."
              : "Is this a one-off visit, or something you want on a regular schedule?"
          }
          timingHeading="When should the helper arrive?"
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
            Visit type
          </p>
          <p className="font-semibold text-foreground">{selectedType.label}</p>
        </div>
      )}

      <div className="rounded-2xl border border-border bg-surface/40 px-4 py-3 text-sm">
        <p className="font-semibold text-foreground">
          {formatVisitCadence(serviceDetails.frequency, {
            category: "housekeeping",
            serviceType: serviceDetails.serviceType,
          })}
          {whenPreference ? ` · ${formatWhenPreference(whenPreference)}` : ""}
        </p>
        <p className="text-muted-foreground mt-1 leading-relaxed">
          Choose what the helper should focus on during the visit. The guide price in your booking
          summary updates as you go.
        </p>
      </div>

      {availableAddons.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-1">Duties for this visit</h3>
          <p className="text-sm text-muted-foreground mb-3">Select all that apply.</p>
          <div className="grid sm:grid-cols-2 gap-3">
            {availableAddons.map((addon) => (
              <AirbnbOptionCard
                key={addon.id}
                selected={serviceDetails.addons.includes(addon.id)}
                onClick={() => toggleDuty(addon.id)}
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
          {canAdjustHours
            ? "Half-day and full-day visits can be adjusted between 3 and 8 hours. We suggest a length based on your duties."
            : `This visit type is booked for about ${selectedType?.defaultHours ?? serviceDetails.durationHours} hours.`}
        </p>
        <div className="flex flex-wrap items-center gap-4">
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={() => adjustHours(-1)}
            disabled={!canAdjustHours || serviceDetails.durationHours <= DURATION_OPTIONS[0]}
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
              !canAdjustHours ||
              serviceDetails.durationHours >= DURATION_OPTIONS[DURATION_OPTIONS.length - 1]
            }
          >
            <Plus className="h-4 w-4" />
          </Button>
          {canAdjustHours && recommendedHours !== serviceDetails.durationHours && (
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
        <label htmlFor="housekeeping-notes" className="text-sm font-medium mb-2 block">
          Access and notes for your housekeeper
        </label>
        <Textarea
          id="housekeeping-notes"
          placeholder="Gate code, laundry access, meal preferences, areas to prioritise..."
          value={description}
          onChange={(e) => onDescriptionChange(e.target.value)}
          rows={3}
          className="rounded-xl resize-none"
        />
      </div>

      <BookingStepFooter
        onBack={() => onStepChange("plan")}
        primaryLabel="Choose your housekeeper"
        onPrimary={onFindWorker}
        primaryDisabled={!canChooseWorker}
      />
    </div>
  );
}
