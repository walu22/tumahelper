"use client";

import { Calendar, Clock, MapPin, User, Timer } from "lucide-react";
import { getServiceType } from "@/lib/services/catalog";
import type { ServiceDetails } from "@/lib/services/catalog";
import { getServiceScopeRows, suggestPrice } from "@/lib/services/utils";
import { ServiceScopeDetails } from "@/components/booking/service-scope-details";
import { formatBookingTime, formatEstimatedEnd } from "@/lib/booking/time-slots";
import { formatCurrency } from "@/lib/utils";
import { AirbnbScopeTeaser } from "@/components/booking/airbnb-scope-teaser";

interface BookingSummaryPanelProps {
  details: ServiceDetails;
  categoryName?: string;
  serviceDate?: string;
  serviceTime?: string;
  locationAddress?: string;
  workerName?: string;
  amount?: string;
  hidePriceEstimate?: boolean;
  emphasizeEstimate?: boolean;
  summaryTitle?: string;
  showAirbnbScopeTeaser?: boolean;
  className?: string;
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

export function BookingSummaryPanel({
  details,
  categoryName,
  serviceDate = "",
  serviceTime = "",
  locationAddress = "",
  workerName,
  amount,
  hidePriceEstimate = false,
  emphasizeEstimate = false,
  summaryTitle = "Your booking",
  showAirbnbScopeTeaser = false,
  className = "",
}: BookingSummaryPanelProps) {
  const type = getServiceType(details.category, details.serviceType);
  const price = suggestPrice(details);
  const scopeRows = getServiceScopeRows(details);
  const hasWhen = !!(serviceDate && serviceTime);
  const hasWhere = locationAddress.length >= 5;

  return (
    <aside className={`rounded-2xl border border-border bg-card overflow-hidden ${className}`}>
      <div className="px-5 py-4 border-b border-border bg-surface/60">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground mb-1">
          {summaryTitle}
        </p>
        <p className="font-display text-lg font-bold leading-snug">
          {type?.label ?? categoryName ?? "Service"}
        </p>
      </div>

      <div className="px-5 py-4 space-y-4">
        {!hidePriceEstimate && emphasizeEstimate && (
          <div className="rounded-xl bg-primary text-primary-foreground px-4 py-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] opacity-90 mb-2">
              Live estimate
            </p>
            <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <p className="font-display text-2xl font-bold leading-none">
                K{price.min} to K{price.max}
              </p>
            </div>
            <p className="text-sm opacity-90 mt-2 flex items-center gap-1.5">
              <Timer className="h-3.5 w-3.5 shrink-0" />
              Est. {details.durationHours} hour{details.durationHours === 1 ? "" : "s"}. Confirm
              at this guide price when you book.
            </p>
          </div>
        )}

        {scopeRows.length > 0 && <ServiceScopeDetails rows={scopeRows} />}

        {(hasWhere || hasWhen || workerName) && (
          <div className="space-y-3 pt-1 border-t border-border/80">
            {hasWhere && (
              <div className="flex items-start gap-2.5 text-sm">
                <MapPin className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                <span className="text-foreground leading-snug">{locationAddress}</span>
              </div>
            )}

            {hasWhen && (
              <div className="flex items-start gap-2.5 text-sm">
                <Calendar className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                <div className="leading-snug">
                  <p className="font-medium text-foreground">{formatDateLabel(serviceDate)}</p>
                  <p className="text-muted-foreground flex items-center gap-1 mt-0.5">
                    <Clock className="h-3.5 w-3.5" />
                    {formatBookingTime(serviceTime)}
                  </p>
                  <p className="text-muted-foreground text-xs mt-1">
                    Est. finish ~{formatEstimatedEnd(serviceTime, details.durationHours)}
                  </p>
                </div>
              </div>
            )}

            {workerName && (
              <div className="flex items-center gap-2.5 text-sm">
                <User className="h-4 w-4 text-primary shrink-0" />
                <span className="font-medium text-foreground">{workerName}</span>
              </div>
            )}
          </div>
        )}

        {!hidePriceEstimate && !emphasizeEstimate && (
          <div className="rounded-xl bg-primary/5 border border-primary/15 px-4 py-3 text-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-primary mb-1">
              Guide price
            </p>
            <p className="font-semibold text-foreground">
              K{price.min} to K{price.max}
            </p>
            {amount && parseFloat(amount) >= 1 && (
              <p className="text-muted-foreground mt-1">
                Confirmed at:{" "}
                <span className="font-semibold text-foreground">
                  {formatCurrency(Math.round(parseFloat(amount) * 100))}
                </span>
              </p>
            )}
          </div>
        )}
        {showAirbnbScopeTeaser && <AirbnbScopeTeaser embedded />}
      </div>
    </aside>
  );
}
