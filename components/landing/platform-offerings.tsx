import Link from "next/link";
import {
  ArrowRight,
  CalendarCheck,
  HeartHandshake,
  MessageCircle,
} from "lucide-react";
import {
  GET_HELP_HREF,
  HOW_IT_WORKS_STEP_BADGE_COLORS,
  PERMANENT_HIRE_SECTION_ID,
  PERMANENT_HIRE_WHATSAPP_MESSAGE,
  PERMANENT_PLACEMENT_ROLES,
  PERMANENT_PLACEMENT_STEPS,
  PLATFORM_BOOKING_STEPS,
  PLATFORM_OFFERINGS_INTRO,
  PRICING_SECTION_HREF,
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

        <div className="max-w-xl mx-auto rounded-3xl border border-border bg-card p-6 sm:p-8 md:p-10 mb-10">
          <ol className="space-y-5 sm:space-y-6">
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

        <p className="text-center text-sm text-muted-foreground mb-14">
          Want typical prices first?{" "}
          <Link href={PRICING_SECTION_HREF} className="font-semibold text-primary hover:underline">
            See typical Lusaka prices
          </Link>
        </p>

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
