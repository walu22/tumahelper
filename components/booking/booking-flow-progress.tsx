"use client";

import type { ServiceFlowStep } from "@/lib/booking/shared-flow";
import { cn } from "@/lib/utils";

interface BookingFlowProgressProps {
  steps: { id: ServiceFlowStep; label: string }[];
  current: ServiceFlowStep;
}

export function BookingFlowProgress({ steps, current }: BookingFlowProgressProps) {
  const currentIndex = Math.max(0, steps.findIndex((s) => s.id === current));
  const currentStep = steps[currentIndex];

  return (
    <div className="mb-6">
      <div className="md:hidden space-y-2">
        <p className="text-sm text-muted-foreground">
          Step {currentIndex + 1} of {steps.length}
          <span className="text-foreground font-medium"> · {currentStep?.label}</span>
        </p>
        <div className="h-1.5 rounded-full bg-muted overflow-hidden">
          <div
            className="h-full rounded-full bg-primary transition-all duration-300"
            style={{ width: `${((currentIndex + 1) / steps.length) * 100}%` }}
          />
        </div>
      </div>

      <div className="hidden md:flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
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
    </div>
  );
}
