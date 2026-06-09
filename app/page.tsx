import { getServerClient } from "@/lib/supabase";
import { LandingHero } from "@/components/landing/hero";
import { TrustMarquee } from "@/components/landing/trust-marquee";
import { PlatformOfferings } from "@/components/landing/platform-offerings";
import { PlatformStats } from "@/components/landing/platform-stats";
import { PopularServices } from "@/components/landing/popular-services";
import { ProcessSection } from "@/components/landing/process";
import { ProductMoment } from "@/components/landing/product-moment";
import { SweepStarsSection } from "@/components/landing/sweep-stars";
import { StoriesSection } from "@/components/landing/stories";
import { HappinessPledge } from "@/components/landing/happiness-pledge";
import { WorkerRecruitment } from "@/components/landing/worker-recruitment";
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
      <PlatformOfferings />
      <PlatformStats />
      <PopularServices />
      <ProcessSection />
      <ProductMoment />
      <SweepStarsSection workers={featuredWorkers} />
      <StoriesSection reviews={testimonials} />
      <HappinessPledge />
      <WorkerRecruitment />
      <LandingFaqCta />
    </div>
  );
}
