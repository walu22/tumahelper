import { ServiceDetailTabs } from "@/components/landing/service-detail-tabs";
import { SERVICES_DETAIL_INTRO } from "@/lib/landing/content";

export function ServicesDetailSection() {
  return (
    <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 bg-surface border-t border-border">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-primary mb-4">
            {SERVICES_DETAIL_INTRO.eyebrow}
          </p>
          <h2 className="font-display text-3xl md:text-[2.75rem] font-bold text-balance leading-tight">
            {SERVICES_DETAIL_INTRO.headline}
          </h2>
          <p className="text-muted-foreground mt-5 leading-relaxed text-lg">
            {SERVICES_DETAIL_INTRO.subtitle}
          </p>
        </div>

        <ServiceDetailTabs />
      </div>
    </section>
  );
}
