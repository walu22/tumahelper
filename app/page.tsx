import { getServerClient } from "@/lib/supabase";
import { LandingHero } from "@/components/landing/hero";
import { PlatformOfferings } from "@/components/landing/platform-offerings";
import { ServicesDetailSection } from "@/components/landing/services-detail";
import { SweepStarsSection } from "@/components/landing/sweep-stars";
import { TrustSection } from "@/components/landing/trust-section";
import { WorkerRecruitment } from "@/components/landing/worker-recruitment";
import { LandingFaqCta } from "@/components/landing/landing-faq-cta";
import type { PublicWorkerProfile } from "@/types";

export default async function HomePage() {
  const supabase = getServerClient();

  let featuredWorkers: PublicWorkerProfile[] | null = null;

  try {
    const { data } = await supabase
      .from("worker_profiles")
      .select("*")
      .eq("is_featured", true)
      .eq("availability_status", "available")
      .limit(4);
    featuredWorkers = data as PublicWorkerProfile[] | null;
  } catch {}

  return (
    <div className="overflow-x-hidden bg-white">
      <LandingHero />
      <PlatformOfferings />
      <ServicesDetailSection />
      <SweepStarsSection workers={featuredWorkers} />
      <TrustSection />
      <WorkerRecruitment />
      <LandingFaqCta />
    </div>
  );
}
