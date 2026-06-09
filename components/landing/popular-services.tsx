import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { FULL_TIME_ROLES, POPULAR_SERVICES } from "@/lib/landing/content";

export function PopularServices() {
  return (
    <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10">
          <div>
            <h2 className="font-display text-3xl md:text-4xl font-semibold">
              Choose the service you need
            </h2>
            <p className="text-muted-foreground mt-2">Popular projects across Lusaka</p>
          </div>
          <Link href="/workers" className="text-sm font-semibold text-primary hover:underline inline-flex items-center gap-1">
            See all services
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-16">
          {POPULAR_SERVICES.map((service, i) => (
            <Link
              key={`${service.title}-${i}`}
              href={`/${service.slug}`}
              className="group flex items-start justify-between gap-4 rounded-2xl border border-border bg-white p-6 hover:border-primary/30 hover:shadow-sm transition-all"
            >
              <div>
                <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                  {service.title}
                </h3>
                <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                  {service.description}
                </p>
                <p className="text-sm font-semibold text-primary mt-3">{service.price}</p>
              </div>
              <ArrowUpRight className="h-4 w-4 text-muted-foreground shrink-0 mt-1 group-hover:text-primary" />
            </Link>
          ))}
        </div>

        {/* SweepSouth full-time roles */}
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-accent mb-3">
            Placements
          </p>
          <h3 className="font-display text-2xl md:text-3xl font-semibold mb-8">
            Find the best full-time help.
          </h3>
          <div className="grid md:grid-cols-3 gap-4">
            {FULL_TIME_ROLES.map((role) => (
              <Link
                key={role.title}
                href={role.href}
                className="group rounded-2xl bg-forest text-cream p-8 hover:bg-forest/95 transition-colors"
              >
                <h4 className="font-display text-xl font-semibold mb-2 group-hover:text-accent transition-colors">
                  {role.title}
                </h4>
                <p className="text-sm text-cream/70 leading-relaxed">{role.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
