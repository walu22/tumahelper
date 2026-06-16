"use client";

import { Calendar, MapPin } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { getStartTimeOptions } from "@/lib/booking/time-slots";
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
  serviceType?: string;
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
  serviceType,
}: BookingScheduleFieldsProps) {
  const today = minDate ?? new Date().toISOString().split("T")[0];
  const startTimes = getStartTimeOptions(category);

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
        <label htmlFor="service-start-time" className="text-sm font-medium mb-1.5 block">
          Select start time: <span className="text-primary">*</span>
        </label>
        <select
          id="service-start-time"
          className="w-full max-w-xs border border-border rounded-lg px-3 py-2 text-sm bg-white"
          value={serviceTime}
          onChange={(e) => onTimeChange(e.target.value)}
          required
        >
          <option value="">Choose a time</option>
          {startTimes.map((slot) => (
            <option key={slot.value} value={slot.value}>
              {slot.label}
            </option>
          ))}
        </select>
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
            {serviceType === 'airbnb' ? "Turnover instructions & access" : "Special instructions (optional)"}
          </label>
          <Textarea
            id="service-notes"
            placeholder={serviceType === 'airbnb' ? "Check-out time, next check-in time, lockbox code, or specific staging instructions..." : "Gate code, access instructions, pets, parking..."}
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
