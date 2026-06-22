import Image from "next/image";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import {
  HOW_IT_WORKS_HERO_IMAGE,
  HOW_IT_WORKS_STEP_BADGE_COLORS,
  PLATFORM_BOOKING_STEPS,
  PLATFORM_OFFERINGS_INTRO,
  PLATFORM_TRUST_BAR,
  PERMANENT_PLACEMENT_ROLES,
  PRICING_SECTION_HREF,
} from "@/lib/landing/content";
import { cn } from "@/lib/utils";

export function PlatformOfferings() {
  return (
    <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 bg-background border-t border-border">
      <div className="max-w-7xl mx-auto">
        <div className="relative overflow-hidden rounded-3xl bg-muted min-h-[22rem] md:min-h-[28rem]">
          <Image
            src={HOW_IT_WORKS_HERO_IMAGE}
            alt="Person booking home help in a modern kitchen"
            fill
            className="object-cover object-[70%_center] md:object-right"
            sizes="(max-width: 768px) 100vw, 1280px"
          />
          <div
            className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/40 to-transparent md:from-background/70 md:via-background/20 md:to-transparent"
            aria-hidden
          />

          <div className="relative z-10 flex items-center min-h-[22rem] md:min-h-[28rem] p-5 sm:p-8 md:p-10 lg:p-12">
            <div className="w-full max-w-md rounded-2xl bg-card shadow-xl border border-border/60 p-6 sm:p-8 md:p-10">
              <span className="inline-block rounded-md bg-primary px-3 py-1.5 text-sm font-semibold text-primary-foreground">
                {PLATFORM_OFFERINGS_INTRO.eyebrow}
              </span>

              <ol className="mt-6 sm:mt-8 space-y-5 sm:space-y-6">
                {PLATFORM_BOOKING_STEPS.map((step, index) => (
                  <li key={step.description} className="flex items-start gap-4">
                    <span
                      className={cn(
                        "flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-base font-bold",
                        HOW_IT_WORKS_STEP_BADGE_COLORS[index]
                      )}
                    >
                      {index + 1}
                    </span>
                    <p className="pt-1.5 text-base sm:text-lg text-foreground leading-snug">
                      {step.description}
                    </p>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 mt-10 mb-6 py-5 px-6 rounded-2xl border border-border bg-surface/50 text-sm text-muted-foreground max-w-3xl mx-auto">
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
            See typical Lusaka prices
          </Link>
        </p>

        <div className="rounded-3xl border border-border bg-surface p-8 md:p-10">
          <div className="max-w-2xl mx-auto text-center mb-8">
            <h3 className="font-display text-xl md:text-2xl font-semibold mb-3">
              Need someone permanently?
            </h3>
            <p className="text-muted-foreground leading-relaxed">
              Many families book a worker several times, then hire full-time. We can also help you
              find a live-in nanny or housekeeper directly.
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
