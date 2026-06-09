import Link from "next/link";
import { POPULAR_SERVICES } from "@/lib/landing/content";

export function PopularServices() {
  return (
    <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 bg-white border-t border-border">
      <div className="max-w-3xl mx-auto">
        <h2 className="font-display text-3xl md:text-4xl font-bold text-center mb-12">
          Choose the service you need
        </h2>

        <div className="divide-y divide-border">
          {POPULAR_SERVICES.map((service, i) => (
            <Link
              key={`${service.title}-${i}`}
              href={`/${service.slug}`}
              className="group block py-6 first:pt-0 last:pb-0 hover:pl-2 transition-all"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="font-display text-lg md:text-xl font-semibold group-hover:text-primary transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed max-w-lg">
                    {service.description}
                  </p>
                </div>
                <span className="text-sm font-semibold text-primary shrink-0 mt-1">
                  {service.price}
                </span>
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center mt-10">
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
