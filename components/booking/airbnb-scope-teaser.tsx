"use client";

import { useState } from "react";
import { Check, X } from "lucide-react";
import {
  AIRBNB_SCOPE_NOT_INCLUDED,
  AIRBNB_SCOPE_PITCH,
  AIRBNB_SCOPE_SECTIONS,
} from "@/lib/services/airbnb-scope";
import { SlideOverPanel } from "@/components/booking/slide-over-panel";

export function AirbnbScopeTeaser() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="rounded-2xl border border-border bg-surface/40 p-5 sm:p-6">
        <p className="text-sm font-semibold text-foreground mb-2">
          What&apos;s included in your clean?
        </p>
        <p className="text-sm text-muted-foreground leading-relaxed">{AIRBNB_SCOPE_PITCH}</p>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="mt-3 text-sm font-semibold text-primary hover:underline underline-offset-2"
        >
          Tell me more
        </button>
      </div>

      <SlideOverPanel
        open={open}
        onClose={() => setOpen(false)}
        title="What's included in your clean?"
      >
        <div className="space-y-8">
          {AIRBNB_SCOPE_SECTIONS.map((section) => (
            <section key={section.id}>
              <h3 className="text-xs font-bold uppercase tracking-[0.18em] text-primary mb-2">
                {section.title}
              </h3>
              {section.subtitle && (
                <p className="text-sm text-muted-foreground mb-3 leading-relaxed">
                  {section.subtitle}
                </p>
              )}
              <ul className="space-y-2">
                {section.items.map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-sm text-foreground">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    <span className="leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </section>
          ))}

          <section className="rounded-xl border border-border bg-surface/50 p-4">
            <h3 className="text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground mb-3">
              Not included
            </h3>
            <ul className="space-y-2">
              {AIRBNB_SCOPE_NOT_INCLUDED.map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                  <X className="mt-0.5 h-4 w-4 shrink-0" />
                  <span className="leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </SlideOverPanel>
    </>
  );
}
