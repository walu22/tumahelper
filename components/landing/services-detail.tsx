import { PricingFeaturedVisits } from "@/components/landing/pricing-featured-visits";
import { PRICING_SECTION_ID } from "@/lib/landing/content";

export function ServicesDetailSection() {
  return (
    <section
      id={PRICING_SECTION_ID}
      className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 bg-surface border-t border-border scroll-mt-24"
    >
      <div className="max-w-7xl mx-auto">
        <PricingFeaturedVisits />
      </div>
    </section>
  );
}
