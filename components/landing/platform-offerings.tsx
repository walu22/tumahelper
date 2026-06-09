import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { PLATFORM_OFFERINGS, PERMANENT_PLACEMENT_ROLES } from "@/lib/landing/content";

const cardStyles = {
  green: "sweep-card-green border-primary/15",
  pink: "sweep-card-pink border-sweep-pink/20",
  teal: "sweep-card-teal border-sweep-teal/25",
} as const;

export function PlatformOfferings() {
  return (
    <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 bg-white border-t border-border">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-primary mb-4">
            What we do
          </p>
          <h2 className="font-display text-3xl md:text-[2.75rem] font-bold text-balance leading-tight">
            Nannies and house cleaners, verified for Lusaka homes.
          </h2>
          <p className="text-muted-foreground mt-5 leading-relaxed text-lg">
            Book for a single visit or set up regular help — then hire permanently
            when you find the right person.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-5 mb-16">
          {PLATFORM_OFFERINGS.map((item) => (
            <Link
              key={item.title}
              href={item.href}
              className={`group rounded-3xl border p-8 md:p-10 hover:shadow-lg transition-all ${cardStyles[item.variant]}`}
            >
              <div className="flex items-start justify-between mb-5">
                <h3 className="font-display text-2xl md:text-3xl font-bold group-hover:text-primary transition-colors">
                  {item.title}
                </h3>
                <ArrowUpRight className="h-6 w-6 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
              </div>
              <p className="text-muted-foreground leading-relaxed">{item.description}</p>
            </Link>
          ))}
        </div>

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
                className="rounded-2xl border border-border bg-white p-5 text-center"
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
