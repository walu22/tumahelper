import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { PLATFORM_OFFERINGS, FULL_TIME_ROLES } from "@/lib/landing/content";

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
            One platform for day help and long-term hires.
          </h2>
          <p className="text-muted-foreground mt-5 leading-relaxed text-lg">
            From a quick clean in Woodlands to a live-in nanny in Kabulonga —
            find help you can actually trust.
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

        <div>
          <h3 className="font-display text-xl md:text-2xl font-semibold text-center mb-6">
            Full-time placements
          </h3>
          <div className="grid sm:grid-cols-3 gap-4">
            {FULL_TIME_ROLES.map((role) => (
              <Link
                key={role.title}
                href={role.href}
                className="group rounded-2xl border border-border bg-surface p-6 hover:border-primary/25 hover:shadow-sm transition-all"
              >
                <h4 className="font-semibold group-hover:text-primary transition-colors mb-1.5">
                  {role.title}
                </h4>
                <p className="text-sm text-muted-foreground leading-relaxed">{role.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
