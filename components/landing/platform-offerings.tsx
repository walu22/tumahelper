import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { PLATFORM_OFFERINGS } from "@/lib/landing/content";

export function PlatformOfferings() {
  return (
    <section className="py-16 md:py-20 px-4 sm:px-6 lg:px-8 bg-white border-b border-border">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-accent mb-3">
            What we offer
          </p>
          <h2 className="font-display text-3xl md:text-4xl font-semibold text-balance">
            More than just a home services platform.
          </h2>
          <p className="text-muted-foreground mt-4 leading-relaxed">
            From quick bookings to long-term placements — one trusted place for Lusaka households.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {PLATFORM_OFFERINGS.map((item) => (
            <Link
              key={item.title}
              href={item.href}
              className="group rounded-2xl border border-border p-8 hover:border-primary/30 hover:shadow-md transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <h3 className="font-display text-2xl font-semibold group-hover:text-primary transition-colors">
                  {item.title}
                </h3>
                <ArrowUpRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
              <p className="text-muted-foreground text-sm leading-relaxed">{item.description}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
