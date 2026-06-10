"use client";

import { Calendar, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  getBookingTimeWindows,
  getFirstSelectableSlot,
  getStartSlotsForWindow,
  getWindowForStartTime,
  isWindowAvailable,
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
  const timeWindows = getBookingTimeWindows(category);
  const selectedWindow = getWindowForStartTime(serviceTime, category);
  const startSlots = selectedWindow
    ? getStartSlotsForWindow(selectedWindow, durationHours)
    : [];
  const availableSlots = startSlots.filter((slot) => slot.selectable);
  const tooLateSlots = startSlots.filter((slot) => !slot.selectable);

  function selectWindow(windowValue: string) {
    const window = timeWindows.find((w) => w.value === windowValue);
    if (!window || !isWindowAvailable(window, durationHours)) return;
    const first = getFirstSelectableSlot(window, durationHours);
    if (first) onTimeChange(first.value);
  }

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
            Choose when the visit should happen and where in Lusaka.
          </p>
        </div>
      </div>

      <div>
        <label htmlFor="service-date" className="text-sm font-medium mb-1.5 block">
          Select start date: <span className="text-primary">*</span>
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
        <p className="text-sm font-medium mb-1">
          Time window <span className="text-primary">*</span>
        </p>
        <p className="text-xs text-muted-foreground mb-3">
          {category === "nanny"
            ? "Pick the part of day first, then choose an exact start time."
            : "Pick when your cleaner should arrive, then refine the exact start time."}
        </p>
        <div className="grid sm:grid-cols-2 gap-2">
          {timeWindows.map((window) => {
            const available = isWindowAvailable(window, durationHours);
            const isSelected =
              !!serviceTime &&
              getWindowForStartTime(serviceTime, category)?.value === window.value;

            return (
              <button
                key={window.value}
                type="button"
                disabled={!available}
                onClick={() => selectWindow(window.value)}
                className={cn(
                  "rounded-xl border-2 px-3 py-3 text-left transition-colors",
                  !available && "opacity-50 cursor-not-allowed",
                  isSelected
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-white hover:border-primary/40"
                )}
              >
                <p className="text-sm font-semibold">{window.title}</p>
                <p
                  className={cn(
                    "text-xs mt-0.5",
                    isSelected
                      ? "text-primary-foreground/80"
                      : "text-muted-foreground"
                  )}
                >
                  {available
                    ? window.subtitle
                    : `Too short for ${durationHours}h in this window`}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {selectedWindow && (
        <div>
          <label htmlFor="service-start-time" className="text-sm font-medium mb-1.5 block">
            Select start time: <span className="text-primary">*</span>
          </label>
          <select
            id="service-start-time"
            className="w-full max-w-xs border border-border rounded-lg px-3 py-2 text-sm bg-white"
            value={serviceTime}
            onChange={(e) => onTimeChange(e.target.value)}
          >
            {availableSlots.map((slot) => (
              <option key={slot.value} value={slot.value}>
                {slot.label}
              </option>
            ))}
            {tooLateSlots.length > 0 && (
              <optgroup label={`Too late for ${durationHours} hours`}>
                {tooLateSlots.map((slot) => (
                  <option key={slot.value} value={slot.value} disabled>
                    {slot.label}
                  </option>
                ))}
              </optgroup>
            )}
          </select>
          <p className="text-xs text-muted-foreground mt-2">
            Visit ends around{" "}
            <span className="font-medium text-foreground">
              {availableSlots.find((slot) => slot.value === serviceTime)?.endLabel ??
                "—"}
            </span>
            . Longer bookings need an earlier start within the same window.
          </p>
        </div>
      )}

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
