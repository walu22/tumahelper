"use client";

import { Calendar, MapPin, Sparkles, Timer } from "lucide-react";
import type { ServiceDetails } from "@/lib/services/catalog";
import { suggestDuration, suggestPrice, getServiceScopeRows } from "@/lib/services/utils";
import {
  formatTurnoverCadence,
  formatWhenPreference,
  type AirbnbFlowStep,
} from "@/lib/booking/airbnb-flow";
import { AirbnbScopeTeaser } from "@/components/booking/airbnb-scope-teaser";
import { ServiceScopeDetails } from "@/components/booking/service-scope-details";
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
  const recommendedHours = suggestDuration(details);
  const hasWhere = locationAddress.length >= 5;
  const hasWhen = !!(serviceDate && serviceTime);
  const cadence = formatTurnoverCadence(details.frequency);
  const whenLabel = formatWhenPreference(details.whenPreference);
  const scopeRows = getServiceScopeRows(details).filter((row) => row.label !== "Frequency");

  return (
    <aside className="rounded-2xl border border-border bg-card overflow-hidden">
      <div className="px-5 py-4 border-b border-border bg-surface/60">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
          Your booking
        </p>
      </div>

      <div className="px-5 py-4 space-y-4">
        {showEstimate && (
          <div className="rounded-xl bg-primary text-primary-foreground px-4 py-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] opacity-90 mb-2">
              Guide price
            </p>
            <p className="font-display text-3xl font-bold tabular-nums leading-none">
              K{price.typical}
            </p>
            <p className="text-sm opacity-90 mt-2 tabular-nums">
              K{price.min} to K{price.max} typical range
            </p>
            <p className="text-sm opacity-90 mt-2 flex items-center gap-1.5">
              <Timer className="h-3.5 w-3.5 shrink-0" />
              <span className="tabular-nums">
                {details.durationHours} hour{details.durationHours === 1 ? "" : "s"}
                {recommendedHours !== details.durationHours &&
                  ` · ${recommendedHours}h suggested`}
              </span>
            </p>
            <p className="text-xs opacity-80 mt-2 leading-relaxed">
              Updates as you change size, linen, and add-ons. Confirm at this price when you book.
            </p>
          </div>
        )}

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
          <p className="font-medium text-foreground">Short-stay cleaning</p>
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

        {(step === "plan" || step === "scope") && hasWhen && (
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

        {step === "scope" && scopeRows.length > 0 && (
          <div className="pt-1 border-t border-border/80">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">
              Clean scope
            </p>
            <ServiceScopeDetails rows={scopeRows} />
          </div>
        )}

        {step === "plan" && <AirbnbScopeTeaser embedded />}

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
