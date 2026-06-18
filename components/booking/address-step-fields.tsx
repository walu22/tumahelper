"use client";

import { MapPin } from "lucide-react";
import { Input } from "@/components/ui/input";
import { LusakaAddressInput } from "@/components/booking/lusaka-address-input";
import { formatServiceAddress } from "@/lib/booking/shared-flow";

interface AddressStepFieldsProps {
  idPrefix: string;
  streetAddress: string;
  unitAddress: string;
  onStreetAddressChange: (value: string) => void;
  onUnitAddressChange: (value: string) => void;
  onConfirm: (fullAddress: string) => void;
  heading: string;
  description: string;
  streetLabel?: string;
}

export function AddressStepFields({
  idPrefix,
  streetAddress,
  unitAddress,
  onStreetAddressChange,
  onUnitAddressChange,
  onConfirm,
  heading,
  description,
  streetLabel = "Street or plot address",
}: AddressStepFieldsProps) {
  const previewAddress = formatServiceAddress(streetAddress, unitAddress);
  const canPreview = streetAddress.trim().length >= 5;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold">{heading}</h2>
        <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{description}</p>
      </div>

      <div className="space-y-4">
        <div>
          <label htmlFor={`${idPrefix}-street`} className="text-sm font-medium mb-2 block">
            {streetLabel} <span className="text-primary">*</span>
          </label>
          <LusakaAddressInput
            id={`${idPrefix}-street`}
            value={streetAddress}
            onChange={onStreetAddressChange}
            placeholder="e.g. Plot 12, Kabulonga"
            required
          />
        </div>

        <div>
          <label htmlFor={`${idPrefix}-unit`} className="text-sm font-medium mb-2 block">
            Unit or building name (optional)
          </label>
          <Input
            id={`${idPrefix}-unit`}
            placeholder="e.g. Unit 4, Woodlands Apartments"
            value={unitAddress}
            onChange={(e) => onUnitAddressChange(e.target.value)}
            className="h-11 rounded-xl"
          />
        </div>
      </div>

      {canPreview && (
        <button
          type="button"
          onClick={() => onConfirm(previewAddress)}
          className="w-full rounded-2xl border-2 border-primary bg-primary/5 p-4 text-left hover:bg-primary/10 transition-colors"
        >
          <p className="text-xs font-semibold uppercase tracking-wide text-primary mb-2">
            Confirm this address
          </p>
          <p className="flex items-start gap-2 font-medium text-foreground leading-snug">
            <MapPin className="h-4 w-4 text-primary shrink-0 mt-0.5" />
            {previewAddress}
          </p>
          <p className="text-sm text-muted-foreground mt-2">Continue with this location</p>
        </button>
      )}
    </div>
  );
}
