"use client";

import { Calendar, MapPin } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

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
}: BookingScheduleFieldsProps) {
  const today = minDate ?? new Date().toISOString().split("T")[0];

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

      <div className="grid sm:grid-cols-2 gap-4">
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
            className="bg-white"
          />
        </div>
        <div>
          <label htmlFor="service-time" className="text-sm font-medium mb-1.5 block">
            Time <span className="text-primary">*</span>
          </label>
          <Input
            id="service-time"
            type="time"
            value={serviceTime}
            onChange={(e) => onTimeChange(e.target.value)}
            required
            className="bg-white"
          />
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
