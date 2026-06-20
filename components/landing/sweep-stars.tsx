import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { LandingWorkerCard } from "@/components/landing/landing-worker-card";
import {
  WORKERS_SPOTLIGHT_INTRO,
  WORKERS_SPOTLIGHT_LIMIT,
} from "@/lib/landing/content";
import type { PublicWorkerProfile } from "@/types";

function formatAvailabilityLine(
  workers: PublicWorkerProfile[],
  availableCount: number
): string {
  const areas = Array.from(
    new Set(workers.map((worker) => worker.area).filter(Boolean))
  ).slice(0, 3);

  if (areas.length === 0) {
    return `${availableCount} available now · across Lusaka`;
  }

  const areaText =
    availableCount > areas.length ? `${areas.join(", ")} & more` : areas.join(", ");

  return `${availableCount} available now · ${areaText}`;
}

export function SweepStarsSection({
  workers,
  availableCount,
}: {
  workers: PublicWorkerProfile[] | null;
  availableCount?: number | null;
}) {
  const listed = workers?.slice(0, WORKERS_SPOTLIGHT_LIMIT) ?? [];
  const count = availableCount ?? listed.length;

  if (listed.length === 0) {
    return (
      <section className="py-16 md:py-20 px-4 sm:px-6 lg:px-8 bg-surface border-t border-border">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-primary mb-4">
            {WORKERS_SPOTLIGHT_INTRO.eyebrow}
          </p>
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-4 text-balance">
            {WORKERS_SPOTLIGHT_INTRO.emptyHeadline}
          </h2>
          <p className="text-muted-foreground leading-relaxed mb-8">
            {WORKERS_SPOTLIGHT_INTRO.emptySubtitle}
          </p>
          <Link
            href="/workers"
            className="inline-flex items-center gap-2 rounded-full bg-primary px-8 py-3.5 text-sm font-semibold text-primary-foreground hover:opacity-95"
          >
            Browse workers
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 md:py-20 px-4 sm:px-6 lg:px-8 bg-surface border-t border-border">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-6 md:mb-8">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-primary mb-4">
            {WORKERS_SPOTLIGHT_INTRO.eyebrow}
          </p>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-balance">
            {WORKERS_SPOTLIGHT_INTRO.headline}
          </h2>
          <p className="text-muted-foreground mt-4 leading-relaxed max-w-2xl mx-auto">
            {WORKERS_SPOTLIGHT_INTRO.subtitle}
          </p>
        </div>

        {count > 0 && (
          <p className="text-center text-sm text-muted-foreground mb-8 md:mb-10">
            {formatAvailabilityLine(listed, count)}
          </p>
        )}

        <ul className="flex gap-4 overflow-x-auto pb-2 snap-x snap-mandatory scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0 md:grid md:grid-cols-3 md:overflow-visible md:gap-5 mb-10">
          {listed.map((worker) => (
            <li
              key={worker.id}
              className="snap-start shrink-0 w-[min(88vw,22rem)] md:w-auto md:min-w-0 min-h-[220px]"
            >
              <LandingWorkerCard
                worker={worker}
                featured={!!worker.is_featured}
                variant="spotlight"
              />
            </li>
          ))}
        </ul>

        <div className="text-center">
          <Link
            href="/workers"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-8 py-3.5 text-sm font-semibold text-primary-foreground hover:opacity-95"
          >
            Browse all workers
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
