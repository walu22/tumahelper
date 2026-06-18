import type { ReactNode } from "react";
import { MobileCollapsibleSummary } from "@/components/booking/mobile-collapsible-summary";

interface BookingStepShellProps {
  summary?: ReactNode;
  children: ReactNode;
  layout?: "sidebar" | "stacked";
  summarySide?: "left" | "right";
}

/** Sidebar summary on md+ screens; stacked above content on small screens. */
export function BookingStepShell({
  summary,
  children,
  layout = "sidebar",
  summarySide = "left",
}: BookingStepShellProps) {
  if (layout === "stacked" || !summary) {
    return <div className="space-y-6">{children}</div>;
  }

  const summaryDesktop =
    summarySide === "right" ? (
      <>
        <div className="min-w-0">{children}</div>
        <div className="hidden md:block md:sticky md:top-8">{summary}</div>
      </>
    ) : (
      <>
        <div className="hidden md:block md:sticky md:top-8">{summary}</div>
        <div className="min-w-0">{children}</div>
      </>
    );

  const gridCols =
    summarySide === "right"
      ? "md:grid-cols-[1fr_minmax(280px,300px)]"
      : "md:grid-cols-[minmax(280px,300px)_1fr]";

  return (
    <div className={`md:grid ${gridCols} gap-6 items-start`}>
      <MobileCollapsibleSummary>{summary}</MobileCollapsibleSummary>
      {summaryDesktop}
    </div>
  );
}
