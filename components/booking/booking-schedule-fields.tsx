"use client";

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
}: BookingScheduleFieldsProps) {
  const today = minDate ?? new Date().toISOString().split("T")[0];

  return (
    <div className="space-y-5 pt-2 border-t border-border">
      <div>
        <h3 className="text-sm font-semibold mb-1">When &amp; where</h3>
        <p className="text-sm text-muted-foreground">
          Pick a date and time, and tell us where in Lusaka the visit will happen.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="service-date" className="text-sm font-medium mb-1.5 block">
            Date
          </label>
          <Input
            id="service-date"
            type="date"
            value={serviceDate}
            onChange={(e) => onDateChange(e.target.value)}
            min={today}
          />
        </div>
        <div>
          <label htmlFor="service-time" className="text-sm font-medium mb-1.5 block">
            Time
          </label>
          <Input
            id="service-time"
            type="time"
            value={serviceTime}
            onChange={(e) => onTimeChange(e.target.value)}
          />
        </div>
      </div>

      <div>
        <label htmlFor="service-address" className="text-sm font-medium mb-1.5 block">
          Address in Lusaka
        </label>
        <Input
          id="service-address"
          placeholder="e.g. Plot 12, Kabulonga"
          value={locationAddress}
          onChange={(e) => onAddressChange(e.target.value)}
        />
      </div>

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
        />
      </div>
    </div>
  );
}
