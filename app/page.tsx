import { getServerClient } from "@/lib/supabase";
import { HeroSection } from "@/components/landing/hero-section";
import { TrustStatsBar } from "@/components/landing/trust-stats-bar";
import { TrustPlatformSection } from "@/components/landing/trust-platform-section";
import { ProductShowcase } from "@/components/landing/product-showcase";
import { ServicesGrid } from "@/components/landing/services-grid";
import { SocialProofSection } from "@/components/landing/social-proof-section";
import { FaqSection } from "@/components/landing/faq-section";
import { FinalCtaSection } from "@/components/landing/final-cta-section";
import { ContactStrip } from "@/components/landing/contact-strip";
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
      <TrustPlatformSection />
      <ProductShowcase />
      <ServicesGrid categories={categories} />
      <SocialProofSection workers={featuredWorkers} testimonials={testimonials} />
      <FaqSection />
      <FinalCtaSection />
      <ContactStrip />
    </div>
  );
}
