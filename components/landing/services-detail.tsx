import { SERVICE_CATALOG, type ServiceCategoryKey } from "@/lib/services/catalog";
import { ServiceCategoryPanel } from "@/components/landing/service-category-panel";

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
            Two ways we help your home.
          </h2>
          <p className="text-muted-foreground mt-5 leading-relaxed text-lg">
            Start with house cleaning or childcare, then pick a specific service type
            when you&apos;re ready, or book straight away and fine-tune on the next step.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {ORDER.map((key) => (
            <ServiceCategoryPanel key={key} entry={SERVICE_CATALOG[key]} />
          ))}
        </div>
      </div>
    </section>
  );
}
