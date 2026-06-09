import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { SERVICE_CATALOG, type ServiceCategoryKey, defaultServiceDetails } from "@/lib/services/catalog";
import { buildBookUrl } from "@/lib/services/utils";

const ORDER: ServiceCategoryKey[] = ["cleaning", "nanny"];

export function ServicesDetailSection() {
  return (
    <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 bg-surface border-t border-border">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-primary mb-4">
            Services in detail
          </p>
          <h2 className="font-display text-3xl md:text-[2.75rem] font-bold text-balance leading-tight">
            Know exactly what you&apos;re booking.
          </h2>
          <p className="text-muted-foreground mt-5 leading-relaxed text-lg">
            Choose a service type, set your home or family details, and add extras — just like
            you would on SweepSouth, tailored for Lusaka.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {ORDER.map((key) => {
            const entry = SERVICE_CATALOG[key];
            const featured = entry.types[0];
            const bookHref = buildBookUrl(defaultServiceDetails(key));

            return (
              <div
                key={key}
                className="rounded-3xl border border-border bg-white p-8 md:p-10 flex flex-col"
              >
                <h3 className="font-display text-2xl font-bold mb-2">{entry.title}</h3>
                <p className="text-muted-foreground mb-6">{entry.tagline}</p>

                <p className="text-sm font-semibold mb-3">Service types</p>
                <ul className="space-y-3 mb-6">
                  {entry.types.map((type) => (
                    <li key={type.id}>
                      <Link
                        href={buildBookUrl({
                          ...defaultServiceDetails(key),
                          serviceType: type.id,
                          durationHours: type.defaultHours,
                        })}
                        className="group block rounded-xl border border-border p-4 hover:border-primary/40 hover:bg-primary/5 transition-colors"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="font-semibold group-hover:text-primary transition-colors">
                              {type.label}
                            </p>
                            <p className="text-sm text-muted-foreground mt-1">{type.description}</p>
                            <p className="text-xs text-muted-foreground mt-2">
                              Typical: K{type.priceHintMin} – K{type.priceHintMax} · ~
                              {type.defaultHours}h
                            </p>
                          </div>
                          <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary shrink-0 mt-1" />
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>

                <p className="text-sm font-semibold mb-2">
                  Included in {featured.label.toLowerCase()}
                </p>
                <ul className="space-y-1.5 mb-6 flex-1">
                  {featured.included.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                      {item}
                    </li>
                  ))}
                </ul>

                {entry.addons.length > 0 && (
                  <>
                    <p className="text-sm font-semibold mb-2">Optional extras</p>
                    <div className="flex flex-wrap gap-2 mb-8">
                      {entry.addons.map((a) => (
                        <span
                          key={a.id}
                          className="rounded-full bg-surface border border-border px-3 py-1 text-xs font-medium text-muted-foreground"
                        >
                          {a.label}
                        </span>
                      ))}
                    </div>
                  </>
                )}

                <div className="flex flex-col sm:flex-row gap-3 mt-auto">
                  <Link
                    href={bookHref}
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:opacity-95 transition-opacity"
                  >
                    Book {entry.title.toLowerCase()}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                  <Link
                    href={`/services/${key}`}
                    className="inline-flex items-center justify-center rounded-full border border-border px-6 py-3 text-sm font-semibold hover:bg-surface transition-colors"
                  >
                    View all details
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
