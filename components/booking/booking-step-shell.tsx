import type { ReactNode } from "react";
import { MobileStickySummary } from "@/components/booking/mobile-sticky-summary";

interface BookingStepShellProps {
  summary?: ReactNode;
  children: ReactNode;
  layout?: "sidebar" | "stacked";
  summarySide?: "left" | "right";
  totalPrice?: number;
}

/** Sidebar summary on md+ screens; stacked above content on small screens. */
export function BookingStepShell({
  summary,
  children,
  layout = "sidebar",
  summarySide = "left",
  totalPrice,
}: BookingStepShellProps) {
  if (layout === "stacked" || !summary) {
    return <div className="space-y-6 pb-24 md:pb-0">{children}</div>;
  }

  const summaryDesktop =
    summarySide === "right" ? (
      <>
        <div className="min-w-0 pb-24 md:pb-0">{children}</div>
        <div className="hidden md:block md:sticky md:top-8">{summary}</div>
      </>
    ) : (
      <>
        <div className="hidden md:block md:sticky md:top-8">{summary}</div>
        <div className="min-w-0 pb-24 md:pb-0">{children}</div>
      </>
    );

  const gridCols =
    summarySide === "right"
      ? "md:grid-cols-[1fr_minmax(280px,300px)]"
      : "md:grid-cols-[minmax(280px,300px)_1fr]";

  return (
    <div className={`md:grid ${gridCols} gap-6 items-start relative`}>
      <MobileStickySummary totalPrice={totalPrice}>{summary}</MobileStickySummary>
      {summaryDesktop}
    </div>
  );
}
