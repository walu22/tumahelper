import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  CalendarCheck,
  HeartHandshake,
  MessageCircle,
} from "lucide-react";
import {
  GET_HELP_HREF,
  HOW_IT_WORKS_HERO_IMAGE,
  HOW_IT_WORKS_STEP_BADGE_COLORS,
  PERMANENT_HIRE_SECTION_ID,
  PERMANENT_HIRE_WHATSAPP_MESSAGE,
  PERMANENT_PLACEMENT_ROLES,
  PERMANENT_PLACEMENT_STEPS,
  PLATFORM_BOOKING_STEPS,
  PLATFORM_OFFERINGS_INTRO,
} from "@/lib/landing/content";
import { cn } from "@/lib/utils";

const PERMANENT_STEP_ICONS = [CalendarCheck, HeartHandshake, ArrowRight] as const;

const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "260970000000";
const permanentHireWhatsappHref = `https://wa.me/${whatsappNumber.replace(/\D/g, "")}?text=${encodeURIComponent(
  PERMANENT_HIRE_WHATSAPP_MESSAGE
)}`;

export function PlatformOfferings() {
  return (
    <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 bg-background border-t border-border">
      <div className="max-w-7xl mx-auto">
        <div className="max-w-2xl mx-auto text-center mb-10 md:mb-12">
          <p className="text-sm font-semibold text-primary mb-3 tracking-wide">
            {PLATFORM_OFFERINGS_INTRO.eyebrow}
          </p>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-balance mb-4">
            {PLATFORM_OFFERINGS_INTRO.headline}
          </h2>
          <p className="text-muted-foreground leading-relaxed text-lg">
            {PLATFORM_OFFERINGS_INTRO.subtitle}
          </p>
        </div>

        <div className="relative overflow-hidden rounded-3xl bg-muted min-h-[22rem] md:min-h-[28rem] mb-10">
          <Image
            src={HOW_IT_WORKS_HERO_IMAGE}
            alt="Home help booking"
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

        <div
          id={PERMANENT_HIRE_SECTION_ID}
          className="rounded-3xl border border-border bg-surface p-8 md:p-10 scroll-mt-24"
        >
          <div className="max-w-2xl mx-auto text-center mb-8">
            <p className="text-sm font-semibold text-primary mb-3 tracking-wide">
              Permanent placements
            </p>
            <h3 className="font-display text-xl md:text-2xl font-semibold mb-3">
              Need a full-time nanny or housekeeper?
            </h3>
            <p className="text-muted-foreground leading-relaxed">
              Many families book the same helper a few times, then hire full-time. We can also help
              you find a live-in nanny or housekeeper directly.
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

          <div className="grid md:grid-cols-3 gap-4 mb-8">
            {PERMANENT_PLACEMENT_STEPS.map((step, index) => {
              const Icon = PERMANENT_STEP_ICONS[index];
              return (
                <div key={step.title} className="flex gap-4 rounded-2xl border border-border bg-card p-5">
                  <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">{step.title}</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">{step.body}</p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="max-w-lg mx-auto rounded-2xl border border-border bg-card p-6 space-y-3">
            <p className="text-sm text-muted-foreground text-center leading-relaxed">
              Tell us your area in Lusaka, live-in or live-out, and what role you need. We will help
              you find a match.
            </p>
            <a
              href={permanentHireWhatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full rounded-full bg-primary text-primary-foreground py-3.5 text-sm font-semibold hover:opacity-95 transition-opacity"
            >
              <MessageCircle className="h-4 w-4" />
              Chat on WhatsApp
            </a>
            <Link
              href={GET_HELP_HREF}
              className="flex items-center justify-center w-full rounded-full border border-border py-3.5 text-sm font-semibold hover:bg-surface transition-colors"
            >
              Or book a visit first
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
