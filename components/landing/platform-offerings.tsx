import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import {
  PLATFORM_BOOKING_STEPS,
  PLATFORM_OFFERINGS_INTRO,
  PLATFORM_TRUST_BAR,
  PERMANENT_PLACEMENT_ROLES,
  PRICING_SECTION_HREF,
} from "@/lib/landing/content";

export function PlatformOfferings() {
  return (
    <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 bg-background border-t border-border">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-primary mb-4">
            {PLATFORM_OFFERINGS_INTRO.eyebrow}
          </p>
          <h2 className="font-display text-3xl md:text-[2.75rem] font-bold text-balance leading-tight">
            {PLATFORM_OFFERINGS_INTRO.headline}
          </h2>
          <p className="text-muted-foreground mt-5 leading-relaxed text-lg">
            {PLATFORM_OFFERINGS_INTRO.subtitle}
          </p>
        </div>

        <ol className="grid md:grid-cols-3 gap-4 md:gap-6 mb-10 max-w-4xl mx-auto">
          {PLATFORM_BOOKING_STEPS.map((step, index) => (
            <li
              key={step.title}
              className="relative rounded-2xl border border-border bg-surface/60 p-5 md:p-6 text-center md:text-left"
            >
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-bold mb-3">
                {index + 1}
              </span>
              <p className="font-semibold text-foreground mb-1">{step.title}</p>
              <p className="text-sm text-muted-foreground leading-relaxed">{step.description}</p>
              {index < PLATFORM_BOOKING_STEPS.length - 1 && (
                <ArrowRight
                  className="hidden md:block absolute top-1/2 -right-4 h-5 w-5 -translate-y-1/2 text-muted-foreground/50"
                  aria-hidden
                />
              )}
            </li>
          ))}
        </ol>

        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 mb-6 py-5 px-6 rounded-2xl border border-border bg-surface/50 text-sm text-muted-foreground max-w-3xl mx-auto">
          {PLATFORM_TRUST_BAR.map((signal) => (
            <span key={signal} className="inline-flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
              {signal}
            </span>
          ))}
          <Link
            href="/workers"
            className="font-semibold text-primary hover:underline whitespace-nowrap"
          >
            Browse workers
          </Link>
        </div>

        <p className="text-center text-sm text-muted-foreground mb-14">
          Want typical prices first?{" "}
          <Link href={PRICING_SECTION_HREF} className="font-semibold text-primary hover:underline">
            See pricing &amp; what&apos;s included
          </Link>
        </p>

        <div className="rounded-3xl border border-border bg-surface p-8 md:p-10">
          <div className="max-w-2xl mx-auto text-center mb-8">
            <h3 className="font-display text-xl md:text-2xl font-semibold mb-3">
              Need someone permanently?
            </h3>
            <p className="text-muted-foreground leading-relaxed">
              Many families book a worker several times, then hire full-time.
              We can also help you find a live-in nanny or housekeeper directly.
            </p>
          </div>
          <div className="grid sm:grid-cols-3 gap-4 mb-8">
            {PERMANENT_PLACEMENT_ROLES.map((role) => (
              <div
                key={role.title}
                className="rounded-2xl border border-border bg-card p-5 text-center"
              >
                <h4 className="font-semibold mb-1.5">{role.title}</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">{role.description}</p>
              </div>
            ))}
          </div>
          <div className="text-center">
            <Link
              href="/hire"
              className="inline-flex items-center justify-center rounded-full bg-primary px-8 py-3.5 text-sm font-semibold text-primary-foreground hover:opacity-95 transition-opacity"
            >
              Request a permanent placement
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
