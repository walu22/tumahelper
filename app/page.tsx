import { getServerClient } from "@/lib/supabase";
import { LandingHero } from "@/components/landing/hero";
import { TrustMarquee } from "@/components/landing/trust-marquee";
import { ServicesBento } from "@/components/landing/services-bento";
import { ProcessSection } from "@/components/landing/process";
import { ProductMoment } from "@/components/landing/product-moment";
import { WorkersShowcase } from "@/components/landing/workers-showcase";
import { StoriesSection } from "@/components/landing/stories";
import { LandingFaqCta } from "@/components/landing/landing-faq-cta";
import type { PublicWorkerProfile } from "@/types";

export default async function HomePage() {
  const supabase = getServerClient();

  let featuredWorkers: PublicWorkerProfile[] | null = null;
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
      .from("reviews")
      .select("*, reviewer:reviewer_id(full_name), reviewee:reviewee_id(full_name)")
      .eq("is_visible", true)
      .order("created_at", { ascending: false })
      .limit(3);
    testimonials = data;
  } catch {}

  return (
    <div className="overflow-x-hidden">
      <LandingHero />
      <TrustMarquee />
      <ServicesBento />
      <ProcessSection />
      <ProductMoment />
      <WorkersShowcase workers={featuredWorkers} />
      <StoriesSection reviews={testimonials} />
      <LandingFaqCta />
    </div>
  );
}
