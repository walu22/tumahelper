"use client";

import type { AirbnbFlowStep } from "@/lib/booking/airbnb-flow";
import { AIRBNB_FLOW_STEPS } from "@/lib/booking/airbnb-flow";
import { cn } from "@/lib/utils";

export function AirbnbFlowProgress({ current }: { current: AirbnbFlowStep }) {
  const currentIndex = AIRBNB_FLOW_STEPS.findIndex((s) => s.id === current);

  return (
    <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-1">
      {AIRBNB_FLOW_STEPS.map((step, index) => (
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
          {index < AIRBNB_FLOW_STEPS.length - 1 && (
            <div className="h-0.5 w-5 bg-muted" />
          )}
        </div>
      ))}
    </div>
  );
}
