"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight, Check, ChevronDown, X } from "lucide-react";
import type { ServiceCatalogEntry } from "@/lib/services/catalog";
import { defaultServiceDetails } from "@/lib/services/catalog";
import { AIRBNB_CLEAN_BOOK_HREF } from "@/lib/landing/content";
import { buildBookUrl } from "@/lib/services/utils";

export function ServiceCategoryPanel({ entry }: { entry: ServiceCatalogEntry }) {
  const [open, setOpen] = useState(false);
  const bookHref = buildBookUrl(defaultServiceDetails(entry.key));

  return (
    <div className="rounded-3xl border border-border bg-card p-8 md:p-10 flex flex-col">
      <h3 className="font-display text-2xl font-bold mb-2">{entry.title}</h3>
      <p className="text-muted-foreground mb-6 leading-relaxed">{entry.tagline}</p>

      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <Link
          href={bookHref}
          className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:opacity-95 transition-opacity"
        >
          Book {entry.title.toLowerCase()}
          <ArrowRight className="h-4 w-4" />
        </Link>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          className="inline-flex items-center justify-center gap-2 rounded-full border border-border px-6 py-3 text-sm font-semibold hover:bg-surface transition-colors"
        >
          {open ? "Hide service types" : `See ${entry.types.length} service types`}
          <ChevronDown
            className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`}
          />
        </button>
      </div>

      {open && (
        <div className="animate-in fade-in slide-in-from-top-2 duration-200">
          <p className="text-sm font-semibold mb-3 mt-2">Service types</p>
          <ul className="space-y-4 mb-6">
            {entry.types.map((type) => (
              <li key={type.id}>
                <Link
                  href={
                    type.id === "airbnb"
                      ? AIRBNB_CLEAN_BOOK_HREF
                      : buildBookUrl({
                          ...defaultServiceDetails(entry.key),
                          serviceType: type.id,
                          durationHours: type.defaultHours,
                        })
                  }
                  className="group block rounded-xl border border-border p-4 md:p-5 hover:border-primary/40 hover:bg-primary/5 transition-colors"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="font-semibold group-hover:text-primary transition-colors">
                        {type.label}
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">{type.description}</p>
                      <p className="text-xs text-muted-foreground mt-2">
                        Typical: K{type.priceHintMin} – K{type.priceHintMax} · ~{type.defaultHours}h
                      </p>
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary shrink-0 mt-1" />
                  </div>

                  <div className="mt-4 pt-4 border-t border-border/80">
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">
                      What&apos;s included
                    </p>
                    <ul className="space-y-1.5">
                      {type.included.map((item) => (
                        <li
                          key={item}
                          className="flex items-start gap-2 text-sm text-muted-foreground"
                        >
                          <Check className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                    {type.notIncluded && type.notIncluded.length > 0 && (
                      <div className="mt-3">
                        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">
                          Not included
                        </p>
                        <ul className="space-y-1.5">
                          {type.notIncluded.map((item) => (
                            <li
                              key={item}
                              className="flex items-start gap-2 text-sm text-muted-foreground"
                            >
                              <X className="h-3.5 w-3.5 text-muted-foreground/70 shrink-0 mt-0.5" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </Link>
              </li>
            ))}
          </ul>

          {entry.addons.length > 0 && (
            <>
              <p className="text-sm font-semibold mb-1">Optional add-ons</p>
              <p className="text-xs text-muted-foreground mb-2">
                Varies by service type. Add during booking
              </p>
              <div className="flex flex-wrap gap-2">
                {entry.addons.map((a) => (
                  <span
                    key={a.id}
                    className="rounded-full bg-surface border border-border px-3 py-1 text-xs font-medium text-muted-foreground"
                  >
                    {a.label}
                  </span>
                ))}
              </div>
            </>
          )}
        </div>
      )}

      <Link
        href={`/services/${entry.key}`}
        className="text-sm font-medium text-primary hover:underline mt-auto pt-6 inline-flex items-center gap-1 w-fit"
      >
        Full service guide
        <ArrowRight className="h-3.5 w-3.5" />
      </Link>
    </div>
  );
}
