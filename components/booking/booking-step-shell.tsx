import type { ReactNode } from "react";

interface BookingStepShellProps {
  summary?: ReactNode;
  children: ReactNode;
}

/** Sidebar summary on desktop; same summary once above the card on mobile. */
export function BookingStepShell({ summary, children }: BookingStepShellProps) {
  return (
    <div className="lg:grid lg:grid-cols-[minmax(260px,280px)_1fr] gap-6 items-start">
      {summary && (
        <>
          <div className="hidden lg:block lg:sticky lg:top-8">{summary}</div>
          <div className="lg:hidden">{summary}</div>
        </>
      )}
      {children}
    </div>
  );
}
