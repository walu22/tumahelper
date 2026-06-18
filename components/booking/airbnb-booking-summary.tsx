"use client";

import { MapPin, Sparkles, Timer } from "lucide-react";
import type { ServiceDetails } from "@/lib/services/catalog";
import { suggestPrice } from "@/lib/services/utils";
import type { AirbnbFlowStep } from "@/lib/booking/airbnb-flow";
import { AirbnbScopeTeaser } from "@/components/booking/airbnb-scope-teaser";

interface AirbnbBookingSummaryProps {
  step: AirbnbFlowStep;
  locationAddress: string;
  details: ServiceDetails;
  showEstimate?: boolean;
}

export function AirbnbBookingSummary({
  step,
  locationAddress,
  details,
  showEstimate = false,
}: AirbnbBookingSummaryProps) {
  const price = suggestPrice(details);
  const hasWhere = locationAddress.length >= 5;

  return (
    <aside className="rounded-2xl border border-border bg-card overflow-hidden">
      <div className="px-5 py-4 border-b border-border bg-surface/60">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground mb-1">
          Booking details
        </p>
      </div>

      <div className="px-5 py-4 space-y-4">
        {hasWhere && (
          <div className="text-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1">
              Where
            </p>
            <p className="flex items-start gap-2 text-foreground leading-snug">
              <MapPin className="h-4 w-4 text-primary shrink-0 mt-0.5" />
              {locationAddress}
            </p>
          </div>
        )}

        <div className="text-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1">
            What
          </p>
          <p className="font-medium text-foreground">Between-guest clean</p>
        </div>

        {showEstimate && (
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl border border-border bg-surface/50 px-3 py-3 text-center">
              <p className="text-xs text-muted-foreground mb-1">Est. hours</p>
              <p className="font-display text-2xl font-bold text-foreground">
                {details.durationHours}
              </p>
            </div>
            <div className="rounded-xl border border-primary/20 bg-primary/5 px-3 py-3 text-center">
              <p className="text-xs text-muted-foreground mb-1">Est. price</p>
              <p className="font-display text-2xl font-bold text-primary">K{price.typical}</p>
            </div>
          </div>
        )}

        {step === "plan" && <AirbnbScopeTeaser embedded />}

        {step === "scope" && showEstimate && (
          <p className="text-xs text-muted-foreground flex items-center gap-1.5">
            <Timer className="h-3.5 w-3.5 shrink-0" />
            Range K{price.min} to K{price.max}. Agree the final fee with your cleaner.
          </p>
        )}

        {step === "address" && !hasWhere && (
          <p className="text-sm text-muted-foreground flex items-start gap-2">
            <Sparkles className="h-4 w-4 text-primary shrink-0 mt-0.5" />
            Enter your property address to continue.
          </p>
        )}
      </div>
    </aside>
  );
}
