"use client";

import { Calendar, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { getBookingStartSlots } from "@/lib/booking/time-slots";
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
}: BookingScheduleFieldsProps) {
  const today = minDate ?? new Date().toISOString().split("T")[0];
  const startSlots = getBookingStartSlots(category);

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
        <p className="text-sm font-medium mb-1">
          Start time <span className="text-primary">*</span>
        </p>
        <p className="text-xs text-muted-foreground mb-3">
          {category === "nanny"
            ? "Includes evening slots for babysitting. Visit length is set in your service details below."
            : "Pick a start time. Visit length is set in your service details below."}
        </p>
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
          {startSlots.map((slot) => (
            <button
              key={slot.value}
              type="button"
              onClick={() => onTimeChange(slot.value)}
              className={cn(
                "rounded-xl border-2 px-2 py-2.5 text-sm font-medium transition-colors",
                serviceTime === slot.value
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-white text-foreground hover:border-primary/40"
              )}
            >
              {slot.label}
            </button>
          ))}
        </div>
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
