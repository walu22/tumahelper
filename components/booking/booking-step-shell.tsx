import type { ReactNode } from "react";

interface BookingStepShellProps {
  summary?: ReactNode;
  children: ReactNode;
  /** Single column — no sidebar (better for Airbnb property step) */
  layout?: "sidebar" | "stacked";
  /** Desktop sidebar position when layout is sidebar */
  summarySide?: "left" | "right";
}

/** Sidebar summary on desktop; stacked summary above content on mobile unless layout is stacked. */
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
        <div className="hidden lg:block lg:sticky lg:top-8">{summary}</div>
      </>
    ) : (
      <>
        <div className="hidden lg:block lg:sticky lg:top-8">{summary}</div>
        <div className="min-w-0">{children}</div>
      </>
    );

  const gridCols =
    summarySide === "right"
      ? "lg:grid-cols-[1fr_minmax(260px,280px)]"
      : "lg:grid-cols-[minmax(260px,280px)_1fr]";

  return (
    <div className={`lg:grid ${gridCols} gap-6 items-start`}>
      <div className="lg:hidden mb-2">{summary}</div>
      {summaryDesktop}
    </div>
  );
}
