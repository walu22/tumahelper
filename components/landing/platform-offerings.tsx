import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { PLATFORM_OFFERINGS } from "@/lib/landing/content";

const cardStyles = {
  green: "sweep-card-green border-primary/15",
  pink: "sweep-card-pink border-sweep-pink/20",
  teal: "sweep-card-teal border-sweep-teal/25",
} as const;

export function PlatformOfferings() {
  return (
    <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-primary mb-4">
            What we offer
          </p>
          <h2 className="font-display text-3xl md:text-[2.75rem] font-bold text-balance leading-tight">
            More than just a home services platform.
          </h2>
          <p className="text-muted-foreground mt-5 leading-relaxed text-lg">
            Whether you need a quick clean, or full-time help, TumaHelper connects
            you with reliable professionals you can trust.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-5">
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
      </div>
    </section>
  );
}
