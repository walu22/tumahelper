import { getServerClient } from "@/lib/supabase";
import { HeroSection } from "@/components/landing/hero-section";
import { TrustStatsBar } from "@/components/landing/trust-stats-bar";
import { PlatformPillars } from "@/components/landing/platform-pillars";
import { DualAudienceSection } from "@/components/landing/dual-audience-section";
import { HowItWorksSection } from "@/components/landing/how-it-works-section";
import { ServicesGrid } from "@/components/landing/services-grid";
import { FullTimeSection } from "@/components/landing/full-time-section";
import { FeaturedHelpersSection } from "@/components/landing/featured-helpers-section";
import { GuaranteeSection } from "@/components/landing/guarantee-section";
import { TrustSection } from "@/components/landing/trust-section";
import { FaqSection } from "@/components/landing/faq-section";
import { ContactStrip } from "@/components/landing/contact-strip";
import { CustomerCtaSection, ProviderCtaSection } from "@/components/landing/cta-sections";
import type { PublicWorkerProfile } from "@/types";

export default async function HomePage() {
  const supabase = getServerClient();

  let featuredWorkers: PublicWorkerProfile[] | null = null;
  let categories = null;
  let testimonials = null;
  let workerCount: number | null = null;
  let reviewCount: number | null = null;
  let averageRating: number | null = null;

  try {
    const { data } = await supabase
      .from("worker_profiles")
      .select("*")
      .eq("is_featured", true)
      .eq("availability_status", "available")
      .limit(4);
    featuredWorkers = data as PublicWorkerProfile[] | null;
  } catch {}

  try {
    const { count } = await supabase
      .from("worker_profiles")
      .select("*", { count: "exact", head: true })
      .eq("availability_status", "available");
    workerCount = count;
  } catch {}

  try {
    const { data: cat } = await supabase
      .from("service_categories")
      .select("*")
      .eq("is_active", true)
      .order("sort_order");
    categories = cat;
  } catch {}

  try {
    const { data: rv, count } = await supabase
      .from("reviews")
      .select("*, reviewer:reviewer_id(full_name), reviewee:reviewee_id(full_name)", {
        count: "exact",
      })
      .eq("is_visible", true)
      .order("created_at", { ascending: false })
      .limit(3);

    testimonials = rv;
    reviewCount = count;

    if (rv && rv.length > 0) {
      averageRating = rv.reduce((sum, r) => sum + r.overall_rating, 0) / rv.length;
    }
  } catch {}

  return (
    <div>
      <HeroSection />
      <TrustStatsBar
        workerCount={workerCount}
        reviewCount={reviewCount}
        averageRating={averageRating}
      />
      <PlatformPillars />
      <DualAudienceSection />
      <HowItWorksSection />
      <ServicesGrid categories={categories} />
      <FullTimeSection />
      <FeaturedHelpersSection workers={featuredWorkers} testimonials={testimonials} />
      <GuaranteeSection />
      <TrustSection />
      <FaqSection />
      <ProviderCtaSection />
      <CustomerCtaSection />
      <ContactStrip />
    </div>
  );
}
