"use client";

import { useState, useEffect, type ReactNode } from "react";
import { ChevronUp, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MobileStickySummaryProps {
  children: ReactNode;
  totalPrice?: number;
}

export function MobileStickySummary({ children, totalPrice }: MobileStickySummaryProps) {
  const [open, setOpen] = useState(false);

  // Prevent background scrolling when open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!totalPrice) {
    // Fallback if price isn't calculated yet or step doesn't support it
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
            <X className="h-4 w-4 shrink-0 text-muted-foreground" />
          ) : (
            <ChevronUp className="h-4 w-4 shrink-0 text-muted-foreground" />
          )}
        </button>
        {open && <div className="mt-3">{children}</div>}
      </div>
    );
  }

  return (
    <div className="md:hidden">
      {/* Spacer to prevent content from hiding behind the sticky footer */}
      <div className="h-20" aria-hidden="true" />

      {/* Backdrop */}
      {open && (
        <div 
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm transition-opacity"
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sticky Bottom Bar / Drawer */}
      <div 
        className="fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border shadow-[0_-8px_30px_rgba(0,0,0,0.12)] flex flex-col"
      >
        <div 
          className="flex items-center justify-between px-5 py-4 bg-surface/60 cursor-pointer" 
          onClick={() => setOpen(!open)}
        >
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-0.5">
              Estimated Total
            </p>
            <p className="font-display font-bold text-xl tabular-nums">
              K{totalPrice}
            </p>
          </div>
          <Button variant="outline" size="sm" className="rounded-full pointer-events-none">
            {open ? "Close" : "View Details"}
            {open ? <X className="ml-2 h-4 w-4" /> : <ChevronUp className="ml-2 h-4 w-4" />}
          </Button>
        </div>

        {/* Drawer Content */}
        <div 
          className={`overflow-y-auto transition-all duration-300 ease-in-out ${
            open ? "max-h-[60vh] opacity-100 p-5 pt-2" : "max-h-0 opacity-0 overflow-hidden"
          }`}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
