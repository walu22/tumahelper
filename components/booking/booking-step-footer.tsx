"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BookingStepFooterProps {
  backLabel?: string;
  onBack?: () => void;
  backDisabled?: boolean;
  primaryLabel: string;
  onPrimary?: () => void;
  primaryDisabled?: boolean;
  primaryType?: "button" | "submit";
}

/** Stacked full-width CTAs on mobile; side-by-side from sm up. */
export function BookingStepFooter({
  backLabel = "Back",
  onBack,
  backDisabled = false,
  primaryLabel,
  onPrimary,
  primaryDisabled = false,
  primaryType = "button",
}: BookingStepFooterProps) {
  return (
    <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-between sm:items-center">
      {onBack && (
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          disabled={backDisabled}
          className="w-full sm:w-auto min-h-11"
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          {backLabel}
        </Button>
      )}
      <Button
        type={primaryType}
        onClick={onPrimary}
        disabled={primaryDisabled}
        className="w-full sm:w-auto min-h-11 sm:ml-auto"
      >
        {primaryLabel}
        <ChevronRight className="ml-2 h-4 w-4" />
      </Button>
    </div>
  );
}
