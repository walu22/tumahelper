import Link from "next/link";
import { CalendarCheck, PhoneCall, RefreshCw, ScrollText, ShieldCheck, Star, Users } from "lucide-react";

const pillars = [
  {
    icon: CalendarCheck,
    title: "Bookings",
    description: "One-off cleans, childcare, and laundry.",
    href: "/workers",
  },
  {
    icon: Users,
    title: "Placements",
    description: "Full-time nannies, housekeepers, and live-in help.",
    href: "/jobs",
  },
  {
    icon: ShieldCheck,
    title: "Trust Hub",
    description: "Verification, trust scores, and family reviews.",
    href: "/workers",
  },
];

const trustSignals = [
  { icon: Star, label: "Ratings from real families" },
  { icon: PhoneCall, label: "Employer reference checks" },
  { icon: ScrollText, label: "NRC identity verification" },
  { icon: ShieldCheck, label: "Data-driven trust scores" },
];

export function TrustPlatformSection() {
  return (
    <section className="py-16 md:py-20 px-4 bg-surface">
      <div className="max-w-6xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase text-primary mb-3">
            Why TumaHelper
          </p>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">
            Bookings, placements, and trust — in one place.
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-px bg-border rounded-2xl overflow-hidden mb-10">
          {pillars.map((pillar) => (
            <Link
              key={pillar.title}
              href={pillar.href}
              className="bg-white p-8 hover:bg-primary/[0.03] transition-colors group"
            >
              <pillar.icon className="h-7 w-7 text-primary mb-4" />
              <h3 className="font-display text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                {pillar.title}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{pillar.description}</p>
            </Link>
          ))}
        </div>

        <div className="rounded-2xl bg-primary text-primary-foreground p-8 md:p-10 flex flex-col md:flex-row md:items-center gap-6 mb-10">
          <div className="flex gap-4 flex-1">
            <div className="hidden sm:flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/15">
              <RefreshCw className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-semibold uppercase tracking-wider text-green-100 mb-1">
                TumaHelper guarantee
              </p>
              <h3 className="font-display text-xl md:text-2xl font-bold mb-2">
                Not the right match? We&apos;ll help you find a replacement within 48 hours.
              </h3>
              <p className="text-green-50/90 text-sm leading-relaxed max-w-2xl">
                Every worker is vetted before they join. If a booking or placement isn&apos;t working,
                our team helps you find someone better suited to your home.
              </p>
            </div>
          </div>
          <Link
            href="/workers"
            className="inline-flex shrink-0 items-center justify-center rounded-lg bg-white text-primary px-6 py-3 text-sm font-semibold hover:bg-green-50 transition-colors"
          >
            Browse verified workers
          </Link>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {trustSignals.map((signal) => (
            <div key={signal.label} className="flex items-center gap-3">
              <signal.icon className="h-5 w-5 text-primary shrink-0" />
              <span className="text-sm font-medium text-foreground">{signal.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
