"use client";

import { useMemo, useState } from "react";
import { AlertTriangle } from "lucide-react";
import { AirbnbOptionCard } from "@/components/booking/airbnb-option-card";
import { BookingStepFooter } from "@/components/booking/booking-step-footer";
import { ServiceScopeTeaser } from "@/components/booking/service-scope-teaser";
import type { ServiceDetails } from "@/lib/services/catalog";
import {
  PLUMBING_JOB_TYPES,
  PLUMBING_SPECIALIST_NOTE,
  applyPlumbingJobToDetails,
  plumbingBookingModeDescription,
  plumbingBookingModeLabel,
  resolvePlumbingJob,
} from "@/lib/services/handyman-plumbing";

interface PlumbingJobClassifierProps {
  serviceDetails: ServiceDetails;
  onServiceDetailsChange: (details: ServiceDetails) => void;
  onBack: () => void;
  onContinue: () => void;
}

export function PlumbingJobClassifier({
  serviceDetails,
  onServiceDetailsChange,
  onBack,
  onContinue,
}: PlumbingJobClassifierProps) {
  const [selectedJobId, setSelectedJobId] = useState(serviceDetails.plumbingJobType ?? "");
  const [activeLeak, setActiveLeak] = useState<boolean | null>(
    serviceDetails.activeLeak ?? null
  );
  const [waterShutoffAvailable, setWaterShutoffAvailable] = useState<boolean | null>(
    serviceDetails.waterShutoffAvailable ?? null
  );

  const selectedJob = useMemo(
    () =>
      resolvePlumbingJob(selectedJobId, {
        activeLeak: activeLeak ?? undefined,
        waterShutoffAvailable: waterShutoffAvailable ?? undefined,
      }),
    [selectedJobId, activeLeak, waterShutoffAvailable]
  );

  const needsLeakFollowUp =
    selectedJob?.followUpQuestions?.includes("active_leak") && activeLeak === null;
  const needsShutoffFollowUp =
    selectedJob?.followUpQuestions?.includes("water_shutoff") &&
    activeLeak === true &&
    waterShutoffAvailable === null;

  const canContinue =
    !!selectedJob &&
    !selectedJob.blocked &&
    !needsLeakFollowUp &&
    !needsShutoffFollowUp;

  function selectJob(jobId: string) {
    setSelectedJobId(jobId);
    setActiveLeak(null);
    setWaterShutoffAvailable(null);
    onServiceDetailsChange(applyPlumbingJobToDetails(serviceDetails, jobId));
  }

  function commitFollowUp(patch: {
    activeLeak?: boolean;
    waterShutoffAvailable?: boolean;
  }) {
    const nextActiveLeak = patch.activeLeak ?? activeLeak ?? undefined;
    const nextShutoff = patch.waterShutoffAvailable ?? waterShutoffAvailable ?? undefined;
    if (patch.activeLeak !== undefined) setActiveLeak(patch.activeLeak);
    if (patch.waterShutoffAvailable !== undefined) {
      setWaterShutoffAvailable(patch.waterShutoffAvailable);
    }
    if (!selectedJobId) return;
    onServiceDetailsChange(
      applyPlumbingJobToDetails(serviceDetails, selectedJobId, {
        activeLeak: nextActiveLeak,
        waterShutoffAvailable: nextShutoff,
      })
    );
  }

  return (
    <div className="space-y-8">
      <ServiceScopeTeaser category="handyman" serviceType="plumbing" />

      <div className="rounded-2xl border border-amber-200/80 bg-amber-50/80 dark:bg-amber-950/20 dark:border-amber-900/40 px-4 py-3 text-sm text-muted-foreground leading-relaxed">
        {PLUMBING_SPECIALIST_NOTE}
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-1">What plumbing help do you need?</h2>
        <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
          Choose the closest match. We will route your job to the right plumber or specialist.
        </p>
        <div className="grid sm:grid-cols-2 gap-3">
          {PLUMBING_JOB_TYPES.map((job) => (
            <AirbnbOptionCard
              key={job.id}
              selected={selectedJobId === job.id}
              onClick={() => selectJob(job.id)}
              title={job.label}
            />
          ))}
        </div>
      </div>

      {selectedJob?.followUpQuestions?.includes("active_leak") && (
        <div>
          <h3 className="text-base font-semibold mb-2">Is water actively leaking?</h3>
          <div className="grid sm:grid-cols-2 gap-3">
            <AirbnbOptionCard
              selected={activeLeak === true}
              onClick={() => commitFollowUp({ activeLeak: true })}
              title="Yes, water is leaking now"
            />
            <AirbnbOptionCard
              selected={activeLeak === false}
              onClick={() =>
                commitFollowUp({ activeLeak: false, waterShutoffAvailable: undefined })
              }
              title="No, or only when taps are on"
            />
          </div>
        </div>
      )}

      {selectedJob?.followUpQuestions?.includes("water_shutoff") && activeLeak === true && (
        <div>
          <h3 className="text-base font-semibold mb-2">Can the water be turned off?</h3>
          <div className="grid sm:grid-cols-2 gap-3">
            <AirbnbOptionCard
              selected={waterShutoffAvailable === true}
              onClick={() => commitFollowUp({ waterShutoffAvailable: true })}
              title="Yes, I can isolate it"
            />
            <AirbnbOptionCard
              selected={waterShutoffAvailable === false}
              onClick={() => commitFollowUp({ waterShutoffAvailable: false })}
              title="No, water keeps flowing"
            />
          </div>
        </div>
      )}

      {selectedJob && !selectedJob.blocked && (
        <div className="rounded-2xl border border-border bg-surface/40 px-4 py-4 space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            {plumbingBookingModeLabel(selectedJob.effectiveBookingMode)}
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {plumbingBookingModeDescription(selectedJob.effectiveBookingMode)}
          </p>
          {selectedJob.effectiveRequiresAdminReview && (
            <p className="text-sm text-muted-foreground leading-relaxed">
              TumaHelper will review your request before matching a specialist.
            </p>
          )}
        </div>
      )}

      {selectedJob?.blocked && (
        <div className="rounded-2xl border border-destructive/40 bg-destructive/5 px-4 py-4 flex gap-3">
          <AlertTriangle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-semibold text-foreground">Emergency plumbing unavailable</p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {selectedJob.blockedReason}
            </p>
          </div>
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
