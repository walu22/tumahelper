"use client";

import { Lightbulb, Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { BookingStepFooter } from "@/components/booking/booking-step-footer";
import { AddressStepFields } from "@/components/booking/address-step-fields";
import { BookingFlowProgress } from "@/components/booking/booking-flow-progress";
import { SchedulePlanSection } from "@/components/booking/schedule-plan-section";
import { HousekeepingTypeTabs } from "@/components/booking/housekeeping-type-tabs";
import { CookingTypeTabs } from "@/components/booking/cooking-type-tabs";
import { ServiceDetailsCard } from "@/components/booking/service-details-card";
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
  isRecurringCookingType,
  isRecurringHousekeepingType,
  sanitizeAddons,
  type ServiceCategoryKey,
  type ServiceDetails,
  type TurnoverFrequency,
} from "@/lib/services/catalog";
import { suggestDuration, getDurationHelperText, getAddonSectionCopy } from "@/lib/services/utils";
import {
  canIncreaseDuration,
  canProceedWithSchedule,
  stepBookingDuration,
  resolveDurationForSchedule,
  syncDetailsWithSchedule,
  canProceedWithBookingDetails,
} from "@/lib/booking/schedule-duration";
import { ScheduleFeasibilityNotice } from "@/components/booking/schedule-feasibility-notice";

export interface HousekeepingBookingFlowProps {
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
  variant?: "housekeeping" | "cooking";
}

const FLOW_COPY = {
  housekeeping: {
    idPrefix: "housekeeping",
    addressHeading: "Where should the helper work?",
    addressDescription:
      "Start typing your home address in Lusaka so we can match housekeepers nearby.",
    intro:
      "Housekeeping is sold by visit length and duties, including cleaning, laundry, dishes, and more. It is not a fixed clean checklist.",
    lockedSummary:
      "You are booking household help for a set time. Choose duties in the next step, not a fixed clean package.",
    scopeLead: "Choose what the helper should focus on during the visit.",
    dutiesTitle: getAddonSectionCopy("housekeeping").pickerTitle,
    dutiesSubtitle: getAddonSectionCopy("housekeeping").pickerSubtitle,
    visitLengthHint:
      "Half-day and full-day visits can be adjusted between 3 and 8 hours. We suggest a length based on your duties.",
    notesLabel: "Access and notes for your housekeeper",
    notesPlaceholder: "Gate code, laundry access, meal preferences, areas to prioritise...",
    workerCta: "Choose your housekeeper",
    timingHeading: "When should the helper arrive?",
  },
  cooking: {
    idPrefix: "cooking",
    addressHeading: "Where should the cook come?",
    addressDescription:
      "Start typing your home address in Lusaka so we can match cooks nearby.",
    intro:
      "Cooking visits are sold by meal type, visit length, and what you need prepared. Ingredients stay yours unless you agree otherwise.",
    lockedSummary:
      "You are booking a cooking visit for a set time. Choose meals and kitchen tasks in the next step.",
    scopeLead: "Choose what the cook should prepare during the visit.",
    dutiesTitle: getAddonSectionCopy("cooking").pickerTitle,
    dutiesSubtitle: getAddonSectionCopy("cooking").pickerSubtitle,
    visitLengthHint:
      "Visit length can be adjusted between 3 and 8 hours. We suggest a length based on your meal choices.",
    notesLabel: "Dietary notes and kitchen access",
    notesPlaceholder: "Gate code, allergies, favourite dishes, ingredients on site, areas off limits...",
    workerCta: "Choose your cook",
    timingHeading: "When should the cook arrive?",
  },
} as const;

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
  variant = "housekeeping",
}: HousekeepingBookingFlowProps) {
  const category: ServiceCategoryKey = variant;
  const copy = FLOW_COPY[variant];
  const flowSteps = getFlowSteps(category, serviceDetails.serviceType);
  const recommendedHours = suggestDuration(serviceDetails);
  const whenPreference = serviceDetails.whenPreference;
  const availableAddons = getAvailableAddons(category, serviceDetails.serviceType);
  const recurringType =
    category === "cooking"
      ? isRecurringCookingType(serviceDetails.serviceType)
      : isRecurringHousekeepingType(serviceDetails.serviceType);
  const isRepeat = serviceDetails.frequency !== "once";
  const repeatCadenceChosen =
    recurringType || !isRepeat || (isRepeat && !!serviceDetails.frequency);
  const selectedType = getServiceType(category, serviceDetails.serviceType);
  const canAdjustHours = !recurringType;

  function update(patch: Partial<ServiceDetails>) {
    onServiceDetailsChange({ ...serviceDetails, ...patch });
  }

  function applyDetailsWithSchedule(next: ServiceDetails) {
    const { details, serviceTime: nextTime } = syncDetailsWithSchedule(
      next,
      serviceTime,
      serviceDate
    );
    onServiceDetailsChange(details);
    if (nextTime !== serviceTime) onTimeChange(nextTime);
  }

  function setServiceType(serviceType: string, defaultHours: number) {
    const addons = sanitizeAddons(category, serviceType, serviceDetails.addons);
    const frequency: TurnoverFrequency =
      serviceType === "weekly" || serviceType === "weekly_cooking" ? "weekly" : "once";
    applyDetailsWithSchedule({
      ...serviceDetails,
      serviceType,
      addons,
      durationHours: defaultHours,
      frequency,
    });
  }

  function toggleDuty(id: string) {
    const addons = serviceDetails.addons.includes(id)
      ? serviceDetails.addons.filter((a) => a !== id)
      : [...serviceDetails.addons, id];
    applyDetailsWithSchedule({ ...serviceDetails, addons });
  }

  function adjustHours(delta: number) {
    const { durationHours, serviceTime: nextTime } = stepBookingDuration(
      serviceDetails.durationHours,
      delta,
      serviceTime,
      category,
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
      category,
      serviceDetails.serviceType,
      serviceDate
    );
    update({ durationHours });
    if (nextTime !== serviceTime) onTimeChange(nextTime);
  }

  function handleTypeChange(typeId: string) {
    const type = getServiceType(category, typeId);
    if (type) setServiceType(typeId, type.defaultHours);
  }

  const TypeTabs = category === "cooking" ? CookingTypeTabs : HousekeepingTypeTabs;

  const canContinuePlan =
    !!whenPreference && repeatCadenceChosen && !!serviceDate && !!serviceTime;
  const canChooseWorker =
    !!serviceDate &&
    !!serviceTime &&
    locationAddress.length >= 5 &&
    !!whenPreference &&
    canProceedWithBookingDetails(serviceDate, serviceTime, serviceDetails);

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
        <p className="text-sm text-muted-foreground mt-3 leading-relaxed">{copy.lockedSummary}</p>
      </div>
    ) : null;

  if (step === "address") {
    return (
      <div>
        <BookingFlowProgress steps={flowSteps} current="address" />
        {lockedTypeSummary}
        {typePicker}
        {!lockServiceType && (
          <p className="text-sm text-muted-foreground mb-4 leading-relaxed">{copy.intro}</p>
        )}
        <AddressStepFields
          idPrefix={copy.idPrefix}
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
          category={category}
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
          timingHeading={copy.timingHeading}
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
            Visit type
          </p>
          <p className="font-semibold text-foreground">{selectedType.label}</p>
        </div>
      )}

      <div className="rounded-2xl border border-border bg-surface/40 px-4 py-3 text-sm">
        <p className="font-semibold text-foreground">
          {formatVisitCadence(serviceDetails.frequency, {
            category,
            serviceType: serviceDetails.serviceType,
          })}
          {whenPreference ? ` · ${formatWhenPreference(whenPreference)}` : ""}
        </p>
        <p className="text-muted-foreground mt-1 leading-relaxed">
          {copy.scopeLead} The guide price in your booking summary updates as you go.
        </p>
      </div>

      {availableAddons.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-1">{copy.dutiesTitle}</h3>
          <p className="text-sm text-muted-foreground mb-3">{copy.dutiesSubtitle}</p>
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
            ? copy.visitLengthHint
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
              !canIncreaseDuration(
                serviceDetails.durationHours,
                serviceTime,
                category,
                serviceDetails.serviceType
              )
            }
          >
            <Plus className="h-4 w-4" />
          </Button>
          {canAdjustHours && recommendedHours !== serviceDetails.durationHours && (
            <button
              type="button"
              onClick={() => applySuggestedHours(recommendedHours)}
              className="text-sm font-semibold text-primary hover:underline"
            >
              Suggested {recommendedHours}h
            </button>
          )}
        </div>
        <div className="flex items-start gap-2.5 mt-4 rounded-xl border border-primary/20 bg-primary/5 px-4 py-3">
          <Lightbulb className="h-4 w-4 shrink-0 mt-0.5 text-primary" />
          <p className="text-sm text-foreground/80 leading-relaxed">
            {getDurationHelperText(category, serviceDetails.durationHours)}
          </p>
        </div>
        {serviceTime && serviceDate && (
          <ScheduleFeasibilityNotice
            category={category}
            serviceType={serviceDetails.serviceType}
            serviceDate={serviceDate}
            serviceTime={serviceTime}
            durationHours={serviceDetails.durationHours}
            className="mt-4"
          />
        )}
      </div>

      <div>
        <label htmlFor={`${copy.idPrefix}-notes`} className="text-sm font-medium mb-2 block">
          {copy.notesLabel}
        </label>
        <Textarea
          id={`${copy.idPrefix}-notes`}
          placeholder={copy.notesPlaceholder}
          value={description}
          onChange={(e) => onDescriptionChange(e.target.value)}
          rows={3}
          className="rounded-xl resize-none"
        />
      </div>

      <BookingStepFooter
        onBack={() => onStepChange("plan")}
        primaryLabel={copy.workerCta}
        onPrimary={onFindWorker}
        primaryDisabled={!canChooseWorker}
      />
    </div>
  );
}
