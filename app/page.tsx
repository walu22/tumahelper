import { getServerClient } from "@/lib/supabase";
import { LandingHero } from "@/components/landing/hero";
import { PlatformOfferings } from "@/components/landing/platform-offerings";
import { SweepStarsSection } from "@/components/landing/sweep-stars";
import { TrustSection } from "@/components/landing/trust-section";
import { LandingFaqCta } from "@/components/landing/landing-faq-cta";
import { WORKERS_SPOTLIGHT_LIMIT } from "@/lib/landing/content";
import { getSpotlightReviewQuotes } from "@/lib/landing/spotlight-reviews";
import { PUBLIC_WORKER_AVAILABILITY, WORKER_STUB_AREA } from "@/lib/workers/public-listing";
import type { PublicWorkerProfile } from "@/types";

export default async function HomePage() {
  let featuredWorkers: PublicWorkerProfile[] | null = null;
  let spotlightReviewQuotes: Record<string, string> = {};

  try {
    const supabase = getServerClient();

    const { data: featured } = await supabase
      .from("worker_profiles")
      .select("*")
      .eq("is_featured", true)
      .eq("availability_status", PUBLIC_WORKER_AVAILABILITY)
      .neq("area", WORKER_STUB_AREA)
      .order("trust_score", { ascending: false })
      .limit(WORKERS_SPOTLIGHT_LIMIT);

    if (featured?.length) {
      featuredWorkers = featured as PublicWorkerProfile[];
    } else {
      const { data } = await supabase
        .from("worker_profiles")
        .select("*")
        .eq("availability_status", PUBLIC_WORKER_AVAILABILITY)
        .neq("area", WORKER_STUB_AREA)
        .order("trust_score", { ascending: false })
        .limit(WORKERS_SPOTLIGHT_LIMIT);
      featuredWorkers = (data as PublicWorkerProfile[] | null) ?? null;
    }

    if (featuredWorkers?.length) {
      spotlightReviewQuotes = await getSpotlightReviewQuotes(supabase, featuredWorkers);
    }
  } catch {}

  return (
    <div className="overflow-x-hidden bg-background">
      <LandingHero />
      <SweepStarsSection
        workers={featuredWorkers}
        reviewQuotes={spotlightReviewQuotes}
      />
      <PlatformOfferings />
      <TrustSection />
      <LandingFaqCta />
    </div>
  );
}
