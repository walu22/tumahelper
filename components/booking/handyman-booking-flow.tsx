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
import { HandymanTypeTabs } from "@/components/booking/handyman-type-tabs";
import { PlumbingJobClassifier } from "@/components/booking/plumbing-job-classifier";
import {
  formatVisitCadence,
  formatWhenPreference,
  getFlowSteps,
  type ServiceFlowStep,
} from "@/lib/booking/shared-flow";
import { HANDYMAN_SCOPE_DISCLAIMER } from "@/lib/services/handyman-types";
import {
  isPlumbingService,
  plumbingRequiresAdminReview,
  plumbingSkipsWorkerSelection,
  plumbingBookingModeDescription,
  plumbingBookingModeLabel,
  type PartsAvailable,
  type PlumberBuyParts,
} from "@/lib/services/handyman-plumbing";
import {
  DURATION_OPTIONS,
  getAvailableAddons,
  getServiceType,
  sanitizeAddons,
  type ServiceDetails,
} from "@/lib/services/catalog";
import { suggestDuration } from "@/lib/services/utils";
import {
  canIncreaseDuration,
  canProceedWithSchedule,
  stepBookingDuration,
  resolveDurationForSchedule,
  syncDetailsWithSchedule,
} from "@/lib/booking/schedule-duration";
import { ScheduleFeasibilityNotice } from "@/components/booking/schedule-feasibility-notice";
import { BookingJobPhotos } from "@/components/booking/booking-job-photos";

interface HandymanBookingFlowProps {
  step: ServiceFlowStep;
  onStepChange: (step: ServiceFlowStep) => void;
  streetAddress: string;
  unitAddress: string;
  onStreetAddressChange: (value: string) => void;
  onUnitAddressChange: (value: string) => void;
  locationAddress: string;
  onLocationConfirm: (fullAddress: string, coords?: import("@/lib/booking/shared-flow").LocationCoords) => void;
  serviceDetails: ServiceDetails;
  onServiceDetailsChange: (details: ServiceDetails) => void;
  serviceDate: string;
  serviceTime: string;
  description: string;
  onDateChange: (value: string) => void;
  onTimeChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onFindWorker: () => void;
  onSubmitReviewRequest?: () => void;
  lockServiceType?: boolean;
  jobPhotoFiles?: File[];
  onJobPhotoFilesChange?: (files: File[]) => void;
}

const JOB_NOTES_PLACEHOLDER =
  "What needs to be fixed? Is it broken, loose, leaking, or not working? How long has the issue been there? Are replacement parts already available? Include access notes and add photos below if you have them.";

export function HandymanBookingFlow({
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
  onSubmitReviewRequest,
  lockServiceType = false,
  jobPhotoFiles = [],
  onJobPhotoFilesChange,
}: HandymanBookingFlowProps) {
  const isPlumbing = isPlumbingService(serviceDetails.serviceType);
  const flowSteps = getFlowSteps("handyman", serviceDetails.serviceType);
  const recommendedHours = suggestDuration(serviceDetails);
  const whenPreference = serviceDetails.whenPreference;
  const availableAddons = getAvailableAddons("handyman", serviceDetails.serviceType);
  const isRepeat = serviceDetails.frequency !== "once";
  const repeatCadenceChosen =
    !isRepeat || (serviceDetails.frequency !== "once" && !!serviceDetails.frequency);
  const selectedType = getServiceType("handyman", serviceDetails.serviceType);

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
    const addons = sanitizeAddons("handyman", serviceType, serviceDetails.addons);
    applyDetailsWithSchedule({
      ...serviceDetails,
      serviceType,
      addons,
      durationHours: defaultHours,
    });
  }

  function toggleAddon(id: string) {
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
      "handyman",
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
      "handyman",
      serviceDetails.serviceType,
      serviceDate
    );
    update({ durationHours });
    if (nextTime !== serviceTime) onTimeChange(nextTime);
  }

  function handleTypeChange(typeId: string) {
    const type = getServiceType("handyman", typeId);
    const clearedPlumbing = {
      plumbingJobType: undefined,
      handymanBookingMode: undefined,
      routeToWorkerType: undefined,
      partsAvailable: undefined,
      plumberBuyParts: undefined,
      activeLeak: undefined,
      waterShutoffAvailable: undefined,
      requiresAdminReview: undefined,
    };
    if (type) {
      onServiceDetailsChange({
        ...serviceDetails,
        serviceType: typeId,
        addons: sanitizeAddons("handyman", typeId, serviceDetails.addons),
        durationHours: type.defaultHours,
        ...clearedPlumbing,
      });
    }
  }

  const plumbingClassified = !isPlumbing || !!serviceDetails.plumbingJobType;
  const reviewRequest = isPlumbing && plumbingRequiresAdminReview(serviceDetails);

  const canContinuePlan =
    plumbingClassified &&
    !!whenPreference &&
    repeatCadenceChosen &&
    !!serviceDate &&
    !!serviceTime;
  const canChooseWorker =
    plumbingClassified &&
    !!serviceDate &&
    !!serviceTime &&
    locationAddress.length >= 5 &&
    !!whenPreference &&
    description.trim().length >= 10 &&
    (!isPlumbing || !!serviceDetails.partsAvailable) &&
    (!isPlumbing || !!serviceDetails.plumberBuyParts) &&
    canProceedWithSchedule(
      serviceDate,
      serviceTime,
      serviceDetails.durationHours,
      "handyman",
      serviceDetails.serviceType
    );

  const typePicker =
    !lockServiceType && step === "address" ? (
      <div className="mb-6">
        <HandymanTypeTabs
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
          category="handyman"
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
          idPrefix="handyman"
          streetAddress={streetAddress}
          unitAddress={unitAddress}
          onStreetAddressChange={onStreetAddressChange}
          onUnitAddressChange={onUnitAddressChange}
          onConfirm={onLocationConfirm}
          heading="Where is the repair needed?"
          description="Start typing your home address in Lusaka so we can match verified helpers nearby."
        />
      </div>
    );
  }

  if (step === "classify" && isPlumbing) {
    return (
      <div>
        <BookingFlowProgress steps={flowSteps} current="classify" />
        <PlumbingJobClassifier
          serviceDetails={serviceDetails}
          onServiceDetailsChange={onServiceDetailsChange}
          onBack={() => onStepChange("address")}
          onContinue={() => onStepChange("plan")}
        />
      </div>
    );
  }

  if (step === "plan") {
    return (
      <div>
        <BookingFlowProgress steps={flowSteps} current="plan" />
        <ServiceDetailsCard
          category="handyman"
          serviceType={serviceDetails.serviceType}
          variant="plan"
          className="mb-6"
        />
        <SchedulePlanSection
          category="handyman"
          serviceType={serviceDetails.serviceType}
          serviceDetails={serviceDetails}
          onServiceDetailsChange={onServiceDetailsChange}
          serviceDate={serviceDate}
          serviceTime={serviceTime}
          onDateChange={onDateChange}
          onTimeChange={onTimeChange}
          onBack={() => onStepChange(isPlumbing ? "classify" : "address")}
          onContinue={() => onStepChange("scope")}
          canContinue={canContinuePlan}
          frequencyHeading="How often?"
          frequencyDescription="Most repairs are one-off visits. Choose recurring only for maintenance plans."
          timingHeading="When should the helper arrive?"
        />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <BookingFlowProgress steps={flowSteps} current="scope" />

      <ServiceDetailsCard
        category="handyman"
        serviceType={serviceDetails.serviceType}
        variant="scope"
      />

      {lockServiceType && selectedType && (
        <div className="rounded-xl border border-border bg-card px-4 py-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1">
            Repair type
          </p>
          <p className="font-semibold text-foreground">{selectedType.label}</p>
          {selectedType.pricingHint && (
            <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
              {selectedType.pricingHint}
            </p>
          )}
        </div>
      )}

      {isPlumbing && serviceDetails.handymanBookingMode && (
        <div className="rounded-2xl border border-border bg-card px-4 py-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1">
            {plumbingBookingModeLabel(serviceDetails.handymanBookingMode)}
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {plumbingBookingModeDescription(serviceDetails.handymanBookingMode)}
          </p>
        </div>
      )}

      <div className="rounded-2xl border border-amber-200/80 bg-amber-50/80 dark:bg-amber-950/20 dark:border-amber-900/40 px-4 py-3 text-sm text-muted-foreground leading-relaxed">
        {HANDYMAN_SCOPE_DISCLAIMER}
      </div>

      <div className="rounded-2xl border border-border bg-surface/40 px-4 py-3 text-sm">
        <p className="font-semibold text-foreground">
          {formatVisitCadence(serviceDetails.frequency, { category: "handyman" })}
          {whenPreference ? ` · ${formatWhenPreference(whenPreference)}` : ""}
        </p>
        <p className="text-muted-foreground mt-1 leading-relaxed">
          Describe the job clearly. Photos help your helper bring the right tools and parts.
        </p>
      </div>

      <div>
        <label htmlFor="handyman-job-notes" className="text-sm font-medium mb-2 block">
          What needs to be fixed?
        </label>
        <Textarea
          id="handyman-job-notes"
          placeholder={JOB_NOTES_PLACEHOLDER}
          value={description}
          onChange={(e) => onDescriptionChange(e.target.value)}
          rows={5}
          className="rounded-xl resize-none"
        />
        <p className="text-xs text-muted-foreground mt-2">
          Tip: mention if water is leaking, power is off, parts are on site, or access is difficult.
        </p>
      </div>

      {isPlumbing && onJobPhotoFilesChange && (
        <BookingJobPhotos files={jobPhotoFiles} onChange={onJobPhotoFilesChange} />
      )}

      {isPlumbing && (
        <>
          <div>
            <h3 className="text-lg font-semibold mb-1">Parts available?</h3>
            <p className="text-sm text-muted-foreground mb-3">
              Let us know if replacement parts are already at the property.
            </p>
            <div className="grid sm:grid-cols-3 gap-3">
              {(
                [
                  { id: "yes", label: "Yes" },
                  { id: "no", label: "No" },
                  { id: "not_sure", label: "Not sure" },
                ] as const
              ).map((option) => (
                <AirbnbOptionCard
                  key={option.id}
                  selected={serviceDetails.partsAvailable === option.id}
                  onClick={() => update({ partsAvailable: option.id as PartsAvailable })}
                  title={option.label}
                />
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-1">
              Should the plumber buy parts if needed?
            </h3>
            <div className="grid sm:grid-cols-2 gap-3">
              {(
                [
                  { id: "yes_receipt", label: "Yes, with receipt" },
                  { id: "no_provide", label: "No, I will provide parts" },
                ] as const
              ).map((option) => (
                <AirbnbOptionCard
                  key={option.id}
                  selected={serviceDetails.plumberBuyParts === option.id}
                  onClick={() =>
                    update({ plumberBuyParts: option.id as PlumberBuyParts })
                  }
                  title={option.label}
                />
              ))}
            </div>
          </div>
        </>
      )}

      {availableAddons.length > 0 && !isPlumbing && (
        <div>
          <h3 className="text-lg font-semibold mb-1">Add-ons</h3>
          <p className="text-sm text-muted-foreground mb-3">
            Select anything that applies. Choose inspection only if you are not sure what is wrong.
          </p>
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
          Book between 3 and 8 hours. Home maintenance visits often need a half-day or full day.
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
                "handyman",
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
            category="handyman"
            serviceType={serviceDetails.serviceType}
            serviceDate={serviceDate}
            serviceTime={serviceTime}
            durationHours={serviceDetails.durationHours}
            className="mt-4"
          />
        )}
      </div>

      <BookingStepFooter
        onBack={() => onStepChange("plan")}
        primaryLabel={
          reviewRequest
            ? "Submit for review"
            : plumbingSkipsWorkerSelection(serviceDetails)
              ? "Submit request"
              : "Choose your helper"
        }
        onPrimary={reviewRequest ? (onSubmitReviewRequest ?? onFindWorker) : onFindWorker}
        primaryDisabled={!canChooseWorker}
      />
    </div>
  );
}
