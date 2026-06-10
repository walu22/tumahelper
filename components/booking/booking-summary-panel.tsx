"use client";

import { MapPin, Calendar, Clock } from "lucide-react";
import { getServiceType } from "@/lib/services/catalog";
import type { ServiceDetails } from "@/lib/services/catalog";
import { formatServiceSummary, suggestPrice } from "@/lib/services/utils";
import { formatBookingTime } from "@/lib/booking/time-slots";
import { formatCurrency } from "@/lib/utils";

interface BookingSummaryPanelProps {
  details: ServiceDetails;
  categoryName?: string;
  serviceDate?: string;
  serviceTime?: string;
  locationAddress?: string;
  workerName?: string;
  amount?: string;
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

function formatTimeLabel(time: string): string {
  if (!time) return "";
  return formatBookingTime(time);
}

export function BookingSummaryPanel({
  details,
  categoryName,
  serviceDate = "",
  serviceTime = "",
  locationAddress = "",
  workerName,
  amount,
  className = "",
}: BookingSummaryPanelProps) {
  const type = getServiceType(details.category, details.serviceType);
  const price = suggestPrice(details);
  const hasWhen = !!(serviceDate && serviceTime);
  const hasWhere = locationAddress.length >= 5;

  return (
    <aside
      className={`rounded-2xl border border-border bg-white p-5 space-y-4 ${className}`}
    >
      <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
        Booking details
      </h3>

      <div className="space-y-3 text-sm">
        <div>
          <p className="text-xs font-medium text-muted-foreground mb-0.5">What</p>
          <p className="font-semibold">{type?.label ?? categoryName ?? "Service"}</p>
          <p className="text-muted-foreground mt-0.5">{formatServiceSummary(details)}</p>
        </div>

        {hasWhere && (
          <div>
            <p className="text-xs font-medium text-muted-foreground mb-0.5">Where</p>
            <p className="flex items-start gap-1.5 text-muted-foreground">
              <MapPin className="h-3.5 w-3.5 shrink-0 mt-0.5" />
              {locationAddress}
            </p>
          </div>
        )}

        {hasWhen && (
          <div>
            <p className="text-xs font-medium text-muted-foreground mb-0.5">When</p>
            <p className="flex items-center gap-3 text-muted-foreground">
              <span className="flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" />
                {formatDateLabel(serviceDate)}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />
                {formatTimeLabel(serviceTime)}
              </span>
            </p>
          </div>
        )}

        {workerName && (
          <div>
            <p className="text-xs font-medium text-muted-foreground mb-0.5">Worker</p>
            <p className="font-medium">{workerName}</p>
          </div>
        )}
      </div>

      <div className="rounded-xl bg-primary/5 border border-primary/15 p-3 text-sm">
        <p className="font-semibold text-primary text-xs uppercase tracking-wide mb-1">
          Typical price
        </p>
        <p className="text-muted-foreground">
          K{price.min} – K{price.max}
          {amount && parseFloat(amount) >= 1 && (
            <span className="block mt-1 font-semibold text-foreground">
              Agreed fee: {formatCurrency(Math.round(parseFloat(amount) * 100))}
            </span>
          )}
        </p>
      </div>
    </aside>
  );
}
