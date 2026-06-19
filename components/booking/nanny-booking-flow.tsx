"use client";

import { Minus, Plus, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { BookingStepFooter } from "@/components/booking/booking-step-footer";
import { AddressStepFields } from "@/components/booking/address-step-fields";
import { BookingFlowProgress } from "@/components/booking/booking-flow-progress";
import { SchedulePlanSection } from "@/components/booking/schedule-plan-section";
import { AirbnbOptionCard } from "@/components/booking/airbnb-option-card";
import { NannyTypeTabs } from "@/components/booking/nanny-type-tabs";
import { ServiceScopeTeaser } from "@/components/booking/service-scope-teaser";
import {
  EMPTY_NANNY_CARE_ANSWERS,
  formatNannyCareAnswers,
  NannyCareQuestions,
  type NannyCareAnswers,
} from "@/components/booking/nanny-care-questions";
import {
  formatVisitCadence,
  formatWhenPreference,
  getFlowSteps,
  type ServiceFlowStep,
} from "@/lib/booking/shared-flow";
import {
  CHILD_AGE_GROUPS,
  DURATION_OPTIONS,
  getAvailableAddons,
  sanitizeAddons,
  getServiceType,
  type ServiceDetails,
} from "@/lib/services/catalog";
import { nannyChildAgesComplete, suggestDuration } from "@/lib/services/utils";
import { useState } from "react";

interface NannyBookingFlowProps {
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

export function NannyBookingFlow({
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
}: NannyBookingFlowProps) {
  const [careAnswers, setCareAnswers] = useState<NannyCareAnswers>(EMPTY_NANNY_CARE_ANSWERS);
  const flowSteps = getFlowSteps("nanny");
  const recommendedHours = suggestDuration(serviceDetails);
  const whenPreference = serviceDetails.whenPreference;
  const availableAddons = getAvailableAddons("nanny", serviceDetails.serviceType);
  const childCount = serviceDetails.children ?? 1;
  const isRepeat = serviceDetails.frequency !== "once";
  const repeatCadenceChosen =
    !isRepeat ||
    (serviceDetails.frequency !== "once" && !!serviceDetails.frequency);
  const selectedType = getServiceType("nanny", serviceDetails.serviceType);

  function update(patch: Partial<ServiceDetails>) {
    onServiceDetailsChange({ ...serviceDetails, ...patch });
  }

  function setServiceType(serviceType: string, defaultHours: number) {
    const addons = sanitizeAddons("nanny", serviceType, serviceDetails.addons);
    const next = { ...serviceDetails, serviceType, addons, durationHours: defaultHours };
    onServiceDetailsChange({ ...next, durationHours: suggestDuration(next) });
  }

  function setChildrenCount(count: number) {
    const ages = (serviceDetails.childAgeGroups ?? []).slice(0, count);
    update({
      children: count,
      childAgeGroups: count === 1 ? ages.slice(0, 1) : ages,
    });
  }

  function setChildAge(index: number, ageId: string) {
    if (childCount === 1) {
      update({ childAgeGroups: ageId ? [ageId] : [] });
      return;
    }
    const ages = Array.from({ length: childCount }, (_, i) => serviceDetails.childAgeGroups?.[i] ?? "");
    ages[index] = ageId;
    update({ childAgeGroups: ages });
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

  function handleFindWorker() {
    const careNotes = formatNannyCareAnswers(careAnswers);
    const combined = [description.trim(), careNotes].filter(Boolean).join("\n\n");
    onDescriptionChange(combined);
    onFindWorker();
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
    !!whenPreference &&
    nannyChildAgesComplete(serviceDetails) &&
    !!careAnswers.emergencyContact.trim();

  function handleCleaningTypeChange(typeId: string) {
    const type = getServiceType("nanny", typeId);
    if (type) setServiceType(typeId, type.defaultHours);
  }

  const nannyTypePicker =
    !lockServiceType && step === "address" ? (
      <div className="mb-6">
        <NannyTypeTabs
          value={serviceDetails.serviceType}
          onChange={handleCleaningTypeChange}
          showDetails
          centered
        />
      </div>
    ) : null;

  const lockedTypeSummary =
    lockServiceType && selectedType && step === "address" ? (
      <div className="mb-6">
        <ServiceScopeTeaser category="nanny" serviceType={serviceDetails.serviceType} />
      </div>
    ) : null;

  if (step === "address") {
    return (
      <div>
        <BookingFlowProgress steps={flowSteps} current="address" />
        {lockedTypeSummary}
        {nannyTypePicker}
        <AddressStepFields
          idPrefix="nanny"
          streetAddress={streetAddress}
          unitAddress={unitAddress}
          onStreetAddressChange={onStreetAddressChange}
          onUnitAddressChange={onUnitAddressChange}
          onConfirm={onLocationConfirm}
          heading="Where do you need care?"
          description="Start typing your home address in Lusaka so we can match nannies nearby."
        />
      </div>
    );
  }

  if (step === "plan") {
    return (
      <div>
        <BookingFlowProgress steps={flowSteps} current="plan" />
        <SchedulePlanSection
          category="nanny"
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
          frequencyDescription="Is this a one-off booking, or regular childcare on a schedule?"
          timingHeading="When should the nanny arrive?"
        />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <BookingFlowProgress steps={flowSteps} current="scope" />

      <div className="rounded-2xl border border-border bg-surface/40 px-4 py-3 text-sm">
        <p className="font-semibold text-foreground">
          {formatVisitCadence(serviceDetails.frequency, {
            category: "nanny",
            serviceType: serviceDetails.serviceType,
          })}
          {whenPreference ? ` · ${formatWhenPreference(whenPreference)}` : ""}
        </p>
        <p className="text-muted-foreground mt-1 leading-relaxed">
          Tell us about your children and what you need. The guide price in your booking summary
          updates as you go.
        </p>
      </div>

      {lockServiceType && selectedType && (
        <div className="rounded-xl border border-border bg-card px-4 py-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1">
            Service
          </p>
          <p className="font-semibold text-foreground">{selectedType.label}</p>
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label htmlFor="nanny-children" className="text-sm font-medium mb-2 block">
            How many children need care?
          </label>
          <select
            id="nanny-children"
            className="h-11 w-full rounded-xl border border-border bg-background px-3 text-sm"
            value={childCount}
            onChange={(e) => setChildrenCount(parseInt(e.target.value, 10))}
          >
            {[1, 2, 3, 4, 5].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </div>

        {childCount === 1 ? (
          <div>
            <label htmlFor="nanny-child-age" className="text-sm font-medium mb-2 block">
              Child&apos;s age range <span className="text-primary">*</span>
            </label>
            <select
              id="nanny-child-age"
              className="h-11 w-full rounded-xl border border-border bg-background px-3 text-sm"
              value={serviceDetails.childAgeGroups?.[0] ?? ""}
              onChange={(e) => setChildAge(0, e.target.value)}
            >
              <option value="">Select age range</option>
              {CHILD_AGE_GROUPS.map(({ id, label }) => (
                <option key={id} value={id}>
                  {label}
                </option>
              ))}
            </select>
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-sm font-medium">What are their ages?</p>
            {Array.from({ length: childCount }, (_, index) => (
              <div key={index}>
                <label
                  htmlFor={`nanny-child-age-${index}`}
                  className="text-xs text-muted-foreground mb-1 block"
                >
                  Child {index + 1}
                </label>
                <select
                  id={`nanny-child-age-${index}`}
                  className="h-11 w-full rounded-xl border border-border bg-background px-3 text-sm"
                  value={serviceDetails.childAgeGroups?.[index] ?? ""}
                  onChange={(e) => setChildAge(index, e.target.value)}
                >
                  <option value="">Select age range</option>
                  {CHILD_AGE_GROUPS.map(({ id, label }) => (
                    <option key={id} value={id}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>
            ))}
          </div>
        )}
      </div>

      <NannyCareQuestions value={careAnswers} onChange={setCareAnswers} />

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
          Book between 3 and 8 hours. We suggest a length based on children and add-ons.
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
        <label htmlFor="nanny-notes" className="text-sm font-medium mb-2 block">
          Additional notes for your nanny
        </label>
        <Textarea
          id="nanny-notes"
          placeholder="Anything else the nanny should know before the visit..."
          value={description}
          onChange={(e) => onDescriptionChange(e.target.value)}
          rows={3}
          className="rounded-xl resize-none"
        />
      </div>

      <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 text-sm flex gap-3">
        <Shield className="h-5 w-5 text-primary shrink-0 mt-0.5" />
        <p className="text-muted-foreground leading-relaxed">
          For your child&apos;s safety, please provide accurate age, health, allergy, and emergency
          contact information. Helpers are only expected to perform duties listed in your booking.
        </p>
      </div>

      <BookingStepFooter
        onBack={() => onStepChange("plan")}
        primaryLabel="Choose your nanny"
        onPrimary={handleFindWorker}
        primaryDisabled={!canChooseWorker}
      />
    </div>
  );
}
