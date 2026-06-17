"use client";

import { Calendar, Clock, MapPin } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { getStartTimeOptions } from "@/lib/booking/time-slots";
import { LUSAKA_AREAS } from "@/lib/landing/content";
import type { ServiceCategoryKey } from "@/lib/services/catalog";
import { cn } from "@/lib/utils";

interface BookingScheduleFieldsProps {
  serviceDate: string;
  serviceTime: string;
  locationAddress: string;
  description: string;
  guestCheckoutTime?: string;
  nextCheckIn?: string;
  onDateChange: (value: string) => void;
  onTimeChange: (value: string) => void;
  onAddressChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onGuestCheckoutTimeChange?: (value: string) => void;
  onNextCheckInChange?: (value: string) => void;
  minDate?: string;
  compact?: boolean;
  category?: ServiceCategoryKey;
  serviceType?: string;
}

const fieldClass =
  "h-11 w-full rounded-xl border border-border bg-white px-3.5 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:border-primary/40";

function FieldLabel({
  htmlFor,
  children,
  required,
}: {
  htmlFor?: string;
  children: React.ReactNode;
  required?: boolean;
}) {
  return (
    <label htmlFor={htmlFor} className="text-sm font-medium text-foreground mb-2 block">
      {children}
      {required ? <span className="text-primary ml-0.5">*</span> : null}
    </label>
  );
}

export function BookingScheduleFields({
  serviceDate,
  serviceTime,
  locationAddress,
  description,
  guestCheckoutTime = "",
  nextCheckIn = "",
  onDateChange,
  onTimeChange,
  onAddressChange,
  onDescriptionChange,
  onGuestCheckoutTimeChange,
  onNextCheckInChange,
  minDate,
  compact = false,
  category,
  serviceType,
}: BookingScheduleFieldsProps) {
  const today = minDate ?? new Date().toISOString().split("T")[0];
  const startTimes = getStartTimeOptions(category, serviceType);
  const isBetweenGuest = serviceType === "airbnb";

  function appendArea(area: string) {
    if (!locationAddress.trim()) {
      onAddressChange(area);
      return;
    }
    if (locationAddress.toLowerCase().includes(area.toLowerCase())) return;
    onAddressChange(`${locationAddress}, ${area}`);
  }

  return (
    <div
      id="booking-when-where"
      className="rounded-2xl border border-border bg-white shadow-sm overflow-hidden"
    >
      <div className="border-b border-border bg-surface/80 px-5 py-4 sm:px-6">
        <div className="flex items-start gap-3">
          <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
            <Calendar className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">When & where</h3>
            <p className="text-sm text-muted-foreground mt-0.5 leading-relaxed">
              Choose when the clean should happen and where in Lusaka.
            </p>
          </div>
        </div>
      </div>

      <div className="p-5 sm:p-6 space-y-6">
        <section className="space-y-4">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            <Clock className="h-3.5 w-3.5" />
            Schedule
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <FieldLabel htmlFor="service-date" required>
                Date
              </FieldLabel>
              <Input
                id="service-date"
                type="date"
                value={serviceDate}
                onChange={(e) => onDateChange(e.target.value)}
                min={today}
                required
                className={fieldClass}
              />
            </div>

            <div>
              <FieldLabel htmlFor="service-start-time" required>
                Start time
              </FieldLabel>
              <select
                id="service-start-time"
                className={cn(fieldClass, "appearance-none cursor-pointer")}
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
          </div>

          {isBetweenGuest && !compact && (
            <div className="rounded-xl border border-border bg-surface/60 p-4 space-y-4">
              <p className="text-xs font-medium text-muted-foreground">
                Optional — helps the cleaner plan between guest stays
              </p>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <FieldLabel htmlFor="guest-checkout-time">Guest check-out time</FieldLabel>
                  <Input
                    id="guest-checkout-time"
                    type="time"
                    value={guestCheckoutTime}
                    onChange={(e) => onGuestCheckoutTimeChange?.(e.target.value)}
                    className={fieldClass}
                  />
                </div>
                <div>
                  <FieldLabel htmlFor="next-check-in">Next check-in</FieldLabel>
                  <Input
                    id="next-check-in"
                    type="text"
                    value={nextCheckIn}
                    onChange={(e) => onNextCheckInChange?.(e.target.value)}
                    placeholder="e.g. Same day 2:00 PM"
                    className={fieldClass}
                  />
                </div>
              </div>
            </div>
          )}
        </section>

        <section className="space-y-4 pt-2 border-t border-border">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            <MapPin className="h-3.5 w-3.5" />
            Location
          </div>

          <div>
            <FieldLabel htmlFor="service-address" required>
              Address in Lusaka
            </FieldLabel>
            <Input
              id="service-address"
              placeholder="e.g. Plot 12, Kabulonga"
              value={locationAddress}
              onChange={(e) => onAddressChange(e.target.value)}
              required
              className={fieldClass}
            />
          </div>

          {!compact && (
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-2">Popular areas</p>
              <div className="flex flex-wrap gap-2">
                {LUSAKA_AREAS.map((area) => (
                  <button
                    key={area}
                    type="button"
                    onClick={() => appendArea(area)}
                    className="rounded-full border border-border bg-surface px-3 py-1.5 text-xs font-medium text-foreground hover:border-primary/40 hover:bg-primary/5 transition-colors"
                  >
                    {area}
                  </button>
                ))}
              </div>
            </div>
          )}
        </section>

        {!compact && (
          <section className="space-y-3 pt-2 border-t border-border">
            <FieldLabel htmlFor="service-notes">Special instructions (optional)</FieldLabel>
            <Textarea
              id="service-notes"
              placeholder={
                isBetweenGuest
                  ? "Gate code, lockbox, access instructions, linen location..."
                  : "Gate code, access instructions, pets, parking..."
              }
              value={description}
              onChange={(e) => onDescriptionChange(e.target.value)}
              rows={3}
              className="rounded-xl border-border bg-white shadow-sm resize-none"
            />
          </section>
        )}
      </div>
    </div>
  );
}
