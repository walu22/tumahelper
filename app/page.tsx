import { getServerClient } from "@/lib/supabase";
import { HeroSection } from "@/components/landing/hero-section";
import { PlatformPillars } from "@/components/landing/platform-pillars";
import { FullTimeSection } from "@/components/landing/full-time-section";
import { HowItWorksSection } from "@/components/landing/how-it-works-section";
import { ServicesGrid } from "@/components/landing/services-grid";
import { FeaturedHelpersSection } from "@/components/landing/featured-helpers-section";
import { TrustSection } from "@/components/landing/trust-section";
import { CustomerCtaSection, ProviderCtaSection } from "@/components/landing/cta-sections";
import type { PublicWorkerProfile } from "@/types";

export default async function HomePage() {
  const supabase = getServerClient();

  let featuredWorkers: PublicWorkerProfile[] | null = null;
  let categories = null;
  let testimonials = null;

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
    const { data } = await supabase
      .from("service_categories")
      .select("*")
      .eq("is_active", true)
      .order("sort_order");
    categories = data;
  } catch {}

  try {
    const { data } = await supabase
      .from("reviews")
      .select("*, reviewer:reviewer_id(full_name), reviewee:reviewee_id(full_name)")
      .eq("is_visible", true)
      .order("created_at", { ascending: false })
      .limit(3);
    testimonials = data;
  } catch {}

  return (
    <div>
      <HeroSection />
      <PlatformPillars />
      <HowItWorksSection />
      <ServicesGrid categories={categories} />
      <FullTimeSection />
      <FeaturedHelpersSection workers={featuredWorkers} testimonials={testimonials} />
      <TrustSection />
      <ProviderCtaSection />
      <CustomerCtaSection />
    </div>
  );
}
