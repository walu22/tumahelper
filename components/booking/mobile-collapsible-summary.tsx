"use client";

import { useState, type ReactNode } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

/** Collapses the booking summary on small screens so the form stays above the fold. */
export function MobileCollapsibleSummary({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="md:hidden mb-4">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between rounded-xl border border-border bg-surface/60 px-4 py-3 text-left min-h-11"
        aria-expanded={open}
      >
        <span className="text-sm font-semibold text-foreground">Your booking summary</span>
        {open ? (
          <ChevronUp className="h-4 w-4 shrink-0 text-muted-foreground" />
        ) : (
          <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground" />
        )}
      </button>
      {open && <div className="mt-3">{children}</div>}
    </div>
  );
}
