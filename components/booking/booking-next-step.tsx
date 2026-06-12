import type { BookingNextStep } from "@/lib/bookings/display-labels";
import { cn } from "@/lib/utils";

const toneStyles: Record<BookingNextStep["tone"], string> = {
  action: "border-amber-200 bg-amber-50 text-amber-950",
  info: "border-sky-200 bg-sky-50 text-sky-950",
  success: "border-emerald-200 bg-emerald-50 text-emerald-950",
  muted: "border-border bg-surface text-muted-foreground",
};

export function BookingNextStepBanner({ step }: { step: BookingNextStep | null }) {
  if (!step) return null;

  return (
    <div className={cn("rounded-xl border px-4 py-3", toneStyles[step.tone])}>
      <p className="font-semibold text-sm">{step.title}</p>
      <p className="text-sm mt-1 opacity-90 leading-relaxed">{step.description}</p>
    </div>
  );
}
