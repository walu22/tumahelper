"use client";

import { BookingStatus } from "@/types";
import { CheckCircle, Clock, XCircle, PlayCircle } from "lucide-react";

interface BookingTimelineProps {
  currentStatus: BookingStatus;
}

const steps: { status: BookingStatus; label: string; icon: React.ReactNode }[] = [
  { status: "pending", label: "Pending", icon: <Clock className="w-5 h-5" /> },
  { status: "accepted", label: "Accepted", icon: <CheckCircle className="w-5 h-5" /> },
  { status: "in_progress", label: "In Progress", icon: <PlayCircle className="w-5 h-5" /> },
  { status: "completed", label: "Completed", icon: <CheckCircle className="w-5 h-5" /> },
];

export function BookingTimeline({ currentStatus }: BookingTimelineProps) {
  const currentIndex = steps.findIndex((s) => s.status === currentStatus);
  
  if (["cancelled", "declined", "disputed"].includes(currentStatus)) {
    return (
      <div className="flex items-center gap-2 p-3 bg-red-50 rounded-lg">
        <XCircle className="w-5 h-5 text-red-500" />
        <span className="text-red-700 font-medium capitalize">
          Booking {currentStatus.replace("_", " ")}
        </span>
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="absolute left-2.5 top-0 bottom-0 w-0.5 bg-muted" />
      <div className="space-y-4">
        {steps.map((step, index) => {
          const isCompleted = index <= currentIndex;
          const isCurrent = index === currentIndex;

          return (
            <div
              key={step.status}
              className={`relative flex items-center gap-3 ${
                isCompleted ? "text-foreground" : "text-muted-foreground"
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full flex items-center justify-center z-10 ${
                  isCompleted
                    ? isCurrent
                      ? "bg-primary text-white"
                      : "bg-green-500 text-white"
                    : "bg-muted"
                }`}
              >
                {step.icon}
              </div>
              <span className={`text-sm ${isCurrent ? "font-semibold" : ""}`}>
                {step.label}
              </span>
              {isCurrent && (
                <span className="text-xs text-primary ml-auto">Current</span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
