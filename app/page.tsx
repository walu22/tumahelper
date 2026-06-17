import { getServerClient } from "@/lib/supabase";
import { LandingHero } from "@/components/landing/hero";
import { PlatformOfferings } from "@/components/landing/platform-offerings";
import { ServicesDetailSection } from "@/components/landing/services-detail";
import { SweepStarsSection } from "@/components/landing/sweep-stars";
import { TrustSection } from "@/components/landing/trust-section";
import { WorkerRecruitment } from "@/components/landing/worker-recruitment";
import { LandingFaqCta } from "@/components/landing/landing-faq-cta";
import { PUBLIC_WORKER_AVAILABILITY, WORKER_STUB_AREA } from "@/lib/workers/public-listing";
import type { PublicWorkerProfile } from "@/types";

export default async function HomePage() {
  const supabase = getServerClient();

  let featuredWorkers: PublicWorkerProfile[] | null = null;
  let availableCount: number | null = null;

  try {
    const { count } = await supabase
      .from("worker_profiles")
      .select("*", { count: "exact", head: true })
      .eq("availability_status", PUBLIC_WORKER_AVAILABILITY)
      .neq("area", WORKER_STUB_AREA);
    availableCount = count;

    const { data: featured } = await supabase
      .from("worker_profiles")
      .select("*")
      .eq("is_featured", true)
      .eq("availability_status", PUBLIC_WORKER_AVAILABILITY)
      .neq("area", WORKER_STUB_AREA)
      .order("trust_score", { ascending: false })
      .limit(6);

    if (featured?.length) {
      featuredWorkers = featured as PublicWorkerProfile[];
    } else {
      const { data } = await supabase
        .from("worker_profiles")
        .select("*")
        .eq("availability_status", PUBLIC_WORKER_AVAILABILITY)
        .neq("area", WORKER_STUB_AREA)
        .order("trust_score", { ascending: false })
        .limit(6);
      featuredWorkers = (data as PublicWorkerProfile[] | null) ?? null;
    }
  } catch {}

  return (
    <div className="overflow-x-hidden bg-background">
      <LandingHero />
      <PlatformOfferings />
      <ServicesDetailSection />
      <SweepStarsSection workers={featuredWorkers} availableCount={availableCount} />
      <TrustSection />
      <WorkerRecruitment />
      <LandingFaqCta />
    </div>
  );
}
