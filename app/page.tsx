import { getServerClient } from "@/lib/supabase";
import { LandingHero } from "@/components/landing/hero";
import { PlatformOfferings } from "@/components/landing/platform-offerings";
import { EaseTagline } from "@/components/landing/ease-tagline";
import { FullTimeSection } from "@/components/landing/full-time-section";
import { TrustHubSection } from "@/components/landing/trust-hub-section";
import { SweepStarsSection } from "@/components/landing/sweep-stars";
import { PopularServices } from "@/components/landing/popular-services";
import { HappinessPledge } from "@/components/landing/happiness-pledge";
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
      <EaseTagline />
      <FullTimeSection />
      <TrustHubSection />
      <SweepStarsSection workers={featuredWorkers} />
      <PopularServices />
      <HappinessPledge />
      <WorkerRecruitment />
      <LandingFaqCta />
    </div>
  );
}
