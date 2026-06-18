"use client";

import { Calendar, MapPin, Sparkles, Timer } from "lucide-react";
import type { ServiceDetails } from "@/lib/services/catalog";
import { suggestPrice } from "@/lib/services/utils";
import {
  formatTurnoverCadence,
  formatWhenPreference,
  type AirbnbFlowStep,
} from "@/lib/booking/airbnb-flow";
import { AirbnbScopeTeaser } from "@/components/booking/airbnb-scope-teaser";
import { formatBookingTime } from "@/lib/booking/time-slots";

interface AirbnbBookingSummaryProps {
  step: AirbnbFlowStep;
  locationAddress: string;
  details: ServiceDetails;
  serviceDate?: string;
  serviceTime?: string;
  showEstimate?: boolean;
}

function formatDateLabel(isoDate: string): string {
  if (!isoDate) return "";
  const d = new Date(`${isoDate}T12:00:00`);
  return d.toLocaleDateString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
}

export function AirbnbBookingSummary({
  step,
  locationAddress,
  details,
  serviceDate = "",
  serviceTime = "",
  showEstimate = false,
}: AirbnbBookingSummaryProps) {
  const price = suggestPrice(details);
  const hasWhere = locationAddress.length >= 5;
  const hasWhen = !!(serviceDate && serviceTime);
  const cadence = formatTurnoverCadence(details.frequency);
  const whenLabel = formatWhenPreference(details.whenPreference);

  return (
    <aside className="rounded-2xl border border-border bg-card overflow-hidden">
      <div className="px-5 py-4 border-b border-border bg-surface/60">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
          Your booking
        </p>
      </div>

      <div className="px-5 py-4 space-y-4">
        {hasWhere && (
          <div className="text-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1">
              Property
            </p>
            <p className="flex items-start gap-2 text-foreground leading-snug">
              <MapPin className="h-4 w-4 text-primary shrink-0 mt-0.5" />
              {locationAddress}
            </p>
          </div>
        )}

        <div className="text-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1">
            Service
          </p>
          <p className="font-medium text-foreground">Airbnb cleaning</p>
        </div>

        {(step === "plan" || step === "scope") && (
          <div className="text-sm space-y-2">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1">
                How often
              </p>
              <p className="text-foreground">{cadence}</p>
            </div>
            {whenLabel && (
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1">
                  Timing
                </p>
                <p className="text-foreground">{whenLabel}</p>
              </div>
            )}
          </div>
        )}

        {step === "scope" && hasWhen && (
          <div className="text-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1">
              Arrival
            </p>
            <p className="flex items-start gap-2 text-foreground">
              <Calendar className="h-4 w-4 text-primary shrink-0 mt-0.5" />
              <span>
                {formatDateLabel(serviceDate)} at {formatBookingTime(serviceTime)}
              </span>
            </p>
          </div>
        )}

        {showEstimate && (
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl border border-border bg-surface/50 px-3 py-3 text-center">
              <p className="text-xs text-muted-foreground mb-1">Visit length</p>
              <p className="font-display text-2xl font-bold text-foreground">
                {details.durationHours}h
              </p>
            </div>
            <div className="rounded-xl border border-primary/20 bg-primary/5 px-3 py-3 text-center">
              <p className="text-xs text-muted-foreground mb-1">Guide price</p>
              <p className="font-display text-2xl font-bold text-primary">K{price.typical}</p>
            </div>
          </div>
        )}

        {step === "plan" && <AirbnbScopeTeaser embedded />}

        {step === "scope" && showEstimate && (
          <p className="text-xs text-muted-foreground flex items-center gap-1.5">
            <Timer className="h-3.5 w-3.5 shrink-0" />
            Typical range K{price.min} to K{price.max}. Final fee agreed with your cleaner.
          </p>
        )}

        {step === "address" && !hasWhere && (
          <p className="text-sm text-muted-foreground flex items-start gap-2">
            <Sparkles className="h-4 w-4 text-primary shrink-0 mt-0.5" />
            Add your property address to see matched cleaners nearby.
          </p>
        )}
      </div>
    </aside>
  );
}
