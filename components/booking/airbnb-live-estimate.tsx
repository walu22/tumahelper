"use client";

import { Timer } from "lucide-react";
import type { ServiceDetails } from "@/lib/services/catalog";
import { getServiceScopeRows, suggestPrice } from "@/lib/services/utils";
import { ServiceScopeDetails } from "@/components/booking/service-scope-details";

interface AirbnbLiveEstimateProps {
  details: ServiceDetails;
  serviceDate?: string;
  serviceTime?: string;
  locationAddress?: string;
}

export function AirbnbLiveEstimate({
  details,
  serviceDate = "",
  serviceTime = "",
  locationAddress = "",
}: AirbnbLiveEstimateProps) {
  const price = suggestPrice(details);
  const scopeRows = getServiceScopeRows(details);
  const hasSchedule = !!(serviceDate && serviceTime);
  const hasAddress = locationAddress.length >= 5;

  return (
    <div className="rounded-2xl border border-primary/20 bg-card overflow-hidden shadow-sm">
      <div className="bg-primary text-primary-foreground px-5 py-4 sm:px-6 sm:py-5">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] opacity-90 mb-2">
          Live estimate
        </p>
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
          <p className="font-display text-3xl font-bold leading-none">
            K{price.min} – K{price.max}
          </p>
          <p className="text-sm opacity-90 flex items-center gap-1.5">
            <Timer className="h-4 w-4 shrink-0" />
            Est. {details.durationHours} hour{details.durationHours === 1 ? "" : "s"}
          </p>
        </div>
        <p className="text-xs opacity-80 mt-2">
          Agree the final fee with your cleaner after booking.
        </p>
      </div>

      {(scopeRows.length > 0 || hasSchedule || hasAddress) && (
        <div className="px-5 py-4 sm:px-6 space-y-3 border-t border-border bg-surface/40">
          {scopeRows.length > 0 && <ServiceScopeDetails rows={scopeRows} />}
          {hasAddress && (
            <p className="text-sm text-muted-foreground">
              <span className="font-medium text-foreground">Address:</span> {locationAddress}
            </p>
          )}
          {hasSchedule && (
            <p className="text-sm text-muted-foreground">
              <span className="font-medium text-foreground">Scheduled:</span> {serviceDate} at{" "}
              {serviceTime}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
