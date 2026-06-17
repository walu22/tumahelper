import Link from "next/link";
import { ArrowRight, Star, User, ShieldCheck } from "lucide-react";
import { LandingWorkerCard } from "@/components/landing/landing-worker-card";
import type { PublicWorkerProfile } from "@/types";

export function SweepStarsSection({
  workers,
  availableCount,
}: {
  workers: PublicWorkerProfile[] | null;
  availableCount?: number | null;
}) {
  const listed = workers?.slice(0, 5) ?? [];
  const count = availableCount ?? listed.length;

  if (listed.length === 0) {
    return (
      <section className="py-16 md:py-20 px-4 sm:px-6 lg:px-8 bg-surface">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="font-display text-3xl font-bold mb-4">
            Verified workers joining every week
          </h2>
          <p className="text-muted-foreground leading-relaxed mb-8">
            We&apos;re building Lusaka&apos;s most trusted domestic worker network.
            Book a service and we&apos;ll match you with someone verified, or browse
            profiles as more helpers join.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/customer/book"
              className="inline-flex items-center gap-2 rounded-full bg-primary px-8 py-3.5 text-sm font-semibold text-primary-foreground hover:opacity-95"
            >
              Book a service
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/workers"
              className="inline-flex items-center gap-2 rounded-full border border-border px-8 py-3.5 text-sm font-semibold hover:bg-card transition-colors"
            >
              Find workers
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 md:py-20 px-4 sm:px-6 lg:px-8 bg-surface">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8 md:mb-10">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-balance">
            Verified helpers in Lusaka
          </h2>
          <p className="text-muted-foreground mt-4 leading-relaxed max-w-2xl mx-auto">
            Book by service and choose your worker in the next step, or browse profiles
            first if you prefer.
          </p>
        </div>

        {count > 0 && (
          <div className="flex flex-wrap items-center justify-center gap-6 mb-8 md:mb-10 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-2">
              <User className="h-4 w-4 text-primary" />
              <strong className="text-foreground font-semibold">{count}</strong> available now
            </span>
            <span className="inline-flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-primary" />
              NRC verified profiles
            </span>
            {listed.some((w) => w.average_rating > 0) && (
              <span className="inline-flex items-center gap-2">
                <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                Rated by families
              </span>
            )}
          </div>
        )}

        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mb-8 md:mb-10">
          {listed.map((worker) => (
            <li key={worker.id} className="min-h-[180px]">
              <LandingWorkerCard worker={worker} featured={!!worker.is_featured} />
            </li>
          ))}
        </ul>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/customer/book"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-8 py-3.5 text-sm font-semibold text-primary-foreground hover:opacity-95 w-full sm:w-auto"
          >
            Book a service
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/workers"
            className="inline-flex items-center justify-center gap-2 rounded-full border border-border bg-card px-8 py-3.5 text-sm font-semibold hover:border-primary/30 transition-colors w-full sm:w-auto"
          >
            Find workers
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
