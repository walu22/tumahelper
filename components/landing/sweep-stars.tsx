import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { LandingWorkerCard } from "@/components/landing/landing-worker-card";
import { WORKERS_SPOTLIGHT_INTRO, WORKERS_SPOTLIGHT_LIMIT } from "@/lib/landing/content";
import type { PublicWorkerProfile } from "@/types";

export function SweepStarsSection({
  workers,
  reviewQuotes,
}: {
  workers: PublicWorkerProfile[] | null;
  reviewQuotes?: Record<string, string>;
}) {
  const listed = workers?.slice(0, WORKERS_SPOTLIGHT_LIMIT) ?? [];

  if (listed.length === 0) {
    return (
      <section className="border-t border-border bg-surface px-4 py-16 sm:px-6 md:py-20 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="mb-4 font-display text-3xl font-bold text-balance md:text-4xl">
            {WORKERS_SPOTLIGHT_INTRO.emptyHeadline}
          </h2>
          <p className="mb-8 leading-relaxed text-muted-foreground">
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
    <section className="border-t border-border bg-surface px-4 py-16 sm:px-6 md:py-20 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 text-center md:mb-10">
          <h2 className="font-display text-3xl font-bold text-balance md:text-4xl">
            {WORKERS_SPOTLIGHT_INTRO.headline}
          </h2>
          <p className="mx-auto mt-4 max-w-2xl leading-relaxed text-muted-foreground">
            {WORKERS_SPOTLIGHT_INTRO.subtitle}
          </p>
        </div>

        <ul className="-mx-4 mb-10 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 scrollbar-hide md:mx-0 md:grid md:grid-cols-3 md:gap-5 md:overflow-visible md:px-0">
          {listed.map((worker) => (
            <li
              key={worker.id}
              className="w-[min(88vw,22rem)] shrink-0 snap-start md:w-auto md:min-w-0"
            >
              <LandingWorkerCard
                worker={worker}
                variant="spotlight"
                reviewQuote={reviewQuotes?.[worker.user_id]}
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
