"use client";

import { Calendar, Clock, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  getArrivalChoice,
  getArrivalPeriodGroups,
} from "@/lib/booking/time-slots";
import type { ServiceCategoryKey } from "@/lib/services/catalog";

interface BookingScheduleFieldsProps {
  serviceDate: string;
  serviceTime: string;
  locationAddress: string;
  description: string;
  onDateChange: (value: string) => void;
  onTimeChange: (value: string) => void;
  onAddressChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  minDate?: string;
  compact?: boolean;
  category?: ServiceCategoryKey;
  durationHours?: number;
}

export function BookingScheduleFields({
  serviceDate,
  serviceTime,
  locationAddress,
  description,
  onDateChange,
  onTimeChange,
  onAddressChange,
  onDescriptionChange,
  minDate,
  compact = false,
  category,
  durationHours = 4,
}: BookingScheduleFieldsProps) {
  const today = minDate ?? new Date().toISOString().split("T")[0];
  const periodGroups = getArrivalPeriodGroups(category, durationHours);
  const selectedChoice = serviceTime
    ? getArrivalChoice(serviceTime, category, durationHours)
    : undefined;
  const hasAnySelectable = periodGroups.some((group) =>
    group.choices.some((choice) => choice.selectable)
  );

  return (
    <div
      id="booking-when-where"
      className="rounded-2xl border-2 border-primary/20 bg-primary/5 p-5 space-y-5"
    >
      <div className="flex items-start gap-3">
        <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
          <Calendar className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h3 className="font-semibold">When &amp; where</h3>
          <p className="text-sm text-muted-foreground mt-0.5">
            Pick a date, arrival time, and address in Lusaka.
          </p>
        </div>
      </div>

      <div>
        <label htmlFor="service-date" className="text-sm font-medium mb-1.5 block">
          Date <span className="text-primary">*</span>
        </label>
        <Input
          id="service-date"
          type="date"
          value={serviceDate}
          onChange={(e) => onDateChange(e.target.value)}
          min={today}
          required
          className="bg-white max-w-xs"
        />
      </div>

      <div>
        <div className="flex items-center gap-2 mb-1">
          <Clock className="h-4 w-4 text-primary" />
          <p className="text-sm font-medium">
            Arrival time <span className="text-primary">*</span>
          </p>
        </div>
        <p className="text-xs text-muted-foreground mb-3">
          When should they get to you? Based on your {durationHours}-hour booking.
        </p>

        {!hasAnySelectable ? (
          <p className="text-sm text-amber-800 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
            No arrival times fit a {durationHours}-hour visit before 5 PM (or 9 PM for
            evening). Shorten the duration above, then pick a time.
          </p>
        ) : (
          <div className="space-y-4">
            {periodGroups.map((group) => (
              <div key={group.period}>
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">
                  {group.label}{" "}
                  <span className="font-normal normal-case">({group.hint})</span>
                </p>
                <div className="flex flex-wrap gap-2">
                  {group.choices.map((choice) => (
                    <button
                      key={choice.value}
                      type="button"
                      disabled={!choice.selectable}
                      title={
                        choice.selectable
                          ? `Done by about ${choice.finishLabel}`
                          : `Need an earlier time for ${durationHours} hours`
                      }
                      onClick={() => onTimeChange(choice.value)}
                      className={cn(
                        "rounded-full px-4 py-2 text-sm font-medium border transition-colors min-w-[5.5rem]",
                        !choice.selectable &&
                          "opacity-40 cursor-not-allowed border-border bg-muted/30",
                        choice.selectable &&
                          serviceTime === choice.value &&
                          "border-primary bg-primary text-primary-foreground",
                        choice.selectable &&
                          serviceTime !== choice.value &&
                          "border-border bg-white hover:border-primary/40"
                      )}
                    >
                      {choice.label}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {selectedChoice?.selectable && (
          <p className="text-xs text-muted-foreground mt-3">
            Arrive at{" "}
            <span className="font-medium text-foreground">{selectedChoice.label}</span>
            {" · "}
            done by about{" "}
            <span className="font-medium text-foreground">{selectedChoice.finishLabel}</span>
          </p>
        )}
      </div>

      <div>
        <label htmlFor="service-address" className="text-sm font-medium mb-1.5 block">
          <span className="inline-flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5" />
            Address in Lusaka <span className="text-primary">*</span>
          </span>
        </label>
        <Input
          id="service-address"
          placeholder="e.g. Plot 12, Kabulonga"
          value={locationAddress}
          onChange={(e) => onAddressChange(e.target.value)}
          required
          className="bg-white"
        />
      </div>

      {!compact && (
        <div>
          <label htmlFor="service-notes" className="text-sm font-medium mb-1.5 block">
            Special instructions (optional)
          </label>
          <Textarea
            id="service-notes"
            placeholder="Gate code, access instructions, pets, parking..."
            value={description}
            onChange={(e) => onDescriptionChange(e.target.value)}
            rows={3}
            className="bg-white"
          />
        </div>
      )}
    </div>
  );
}
