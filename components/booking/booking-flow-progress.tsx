"use client";

import type { ServiceFlowStep } from "@/lib/booking/shared-flow";
import { cn } from "@/lib/utils";

interface BookingFlowProgressProps {
  steps: { id: ServiceFlowStep; label: string }[];
  current: ServiceFlowStep;
}

export function BookingFlowProgress({ steps, current }: BookingFlowProgressProps) {
  const currentIndex = steps.findIndex((s) => s.id === current);

  return (
    <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-1">
      {steps.map((step, index) => (
        <div key={step.id} className="flex items-center gap-2 shrink-0">
          <div
            className={cn(
              "h-7 w-7 rounded-full flex items-center justify-center text-xs font-semibold",
              index === currentIndex
                ? "bg-primary text-primary-foreground"
                : index < currentIndex
                  ? "bg-primary/20 text-primary"
                  : "bg-muted text-muted-foreground"
            )}
          >
            {index + 1}
          </div>
          <span
            className={cn(
              "text-sm",
              index === currentIndex ? "font-medium text-foreground" : "text-muted-foreground"
            )}
          >
            {step.label}
          </span>
          {index < steps.length - 1 && <div className="h-0.5 w-5 bg-muted" />}
        </div>
      ))}
    </div>
  );
}
