"use client";

import { useMemo } from "react";
import { Clock } from "lucide-react";
import type { ServiceCategoryKey } from "@/lib/services/catalog";
import { getScheduleFeasibility } from "@/lib/booking/time-slots";
import { useScheduleClock } from "@/lib/booking/use-schedule-clock";
import { cn } from "@/lib/utils";

interface ScheduleFeasibilityNoticeProps {
  category: ServiceCategoryKey;
  serviceType: string;
  serviceDate: string;
  serviceTime: string;
  durationHours: number;
  className?: string;
}

export function ScheduleFeasibilityNotice({
  category,
  serviceType,
  serviceDate,
  serviceTime,
  durationHours,
  className,
}: ScheduleFeasibilityNoticeProps) {
  const scheduleNow = useScheduleClock();
  const feasibility = useMemo(
    () =>
      getScheduleFeasibility({
        startTime: serviceTime,
        durationHours,
        category,
        serviceType,
        serviceDate,
        now: scheduleNow,
      }),
    [serviceTime, durationHours, category, serviceType, serviceDate, scheduleNow]
  );

  if (!serviceTime || !durationHours || !serviceDate) return null;

  return (
    <div
      className={cn(
        "rounded-xl border px-4 py-3 text-sm space-y-1",
        feasibility.valid
          ? "border-border bg-surface/40"
          : "border-amber-500/40 bg-amber-500/5",
        className
      )}
    >
      <p className="flex items-center gap-2 font-medium text-foreground">
        <Clock className="h-4 w-4 text-primary shrink-0" />
        Estimated finish: ~{feasibility.endTimeLabel}
      </p>
      <p className="text-muted-foreground leading-relaxed">
        Standard visit hours: {feasibility.serviceWindowLabel}.
        {durationHours >= 6 &&
          feasibility.latestStartLabel &&
          ` ${durationHours}-hour visits should start by ${feasibility.latestStartLabel}.`}
      </p>
      {!feasibility.valid && feasibility.message && (
        <p className="text-amber-800 leading-relaxed">{feasibility.message}</p>
      )}
    </div>
  );
}
