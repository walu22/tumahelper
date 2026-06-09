import Link from "next/link";
import { POPULAR_SERVICES } from "@/lib/landing/content";
import { ServiceIcon } from "@/components/brand/service-icons";

export function PopularServices() {
  return (
    <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 bg-white border-t border-border">
      <div className="max-w-7xl mx-auto">
        <h2 className="font-display text-3xl md:text-4xl font-bold text-center mb-12 md:mb-16">
          Choose the service you need
        </h2>

        {/* SweepSouth-style icon grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {POPULAR_SERVICES.map((service, i) => (
            <Link
              key={`${service.title}-${i}`}
              href={`/${service.slug}`}
              className="group flex gap-4 rounded-3xl border border-border bg-white p-5 md:p-6 hover:border-primary/25 hover:shadow-lg transition-all"
            >
              <div className="shrink-0 transition-transform group-hover:scale-105">
                <ServiceIcon name={service.icon} className="h-16 w-16 md:h-[4.5rem] md:w-[4.5rem]" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-display text-base md:text-lg font-semibold group-hover:text-primary transition-colors leading-snug">
                    {service.title}
                  </h3>
                  <span className="text-xs font-semibold text-primary shrink-0 mt-0.5">
                    {service.price}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed">
                  {service.description}
                </p>
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link
            href="/customer/book"
            className="inline-flex items-center justify-center rounded-full bg-primary px-8 py-3.5 text-sm font-semibold text-primary-foreground hover:opacity-95 transition-opacity"
          >
            Book a service
          </Link>
        </div>
      </div>
    </section>
  );
}
