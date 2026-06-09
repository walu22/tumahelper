import Link from "next/link";
import { Star } from "lucide-react";
import { SWEEP_STARS } from "@/lib/landing/content";
import type { PublicWorkerProfile } from "@/types";

const PLACEHOLDER = SWEEP_STARS;

export function SweepStarsSection({ workers }: { workers: PublicWorkerProfile[] | null }) {
  const stars =
    workers && workers.length >= 3
      ? workers.slice(0, 3).map((w, i) => ({
          name: w.full_name,
          category: w.category.replace(/_/g, " "),
          area: w.area,
          quote:
            PLACEHOLDER[i]?.quote ||
            "Experienced, vetted, and ready to help with your home.",
          rating: w.average_rating,
          href: `/workers/${w.id}`,
        }))
      : PLACEHOLDER;

  return (
    <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-accent mb-3">
            Top rated
          </p>
          <h2 className="font-display text-3xl md:text-4xl font-semibold text-balance">
            Meet some of your TumaHelper stars.
          </h2>
          <p className="text-muted-foreground mt-4 leading-relaxed">
            Experienced, vetted, and rated — ready to take care of your home.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {stars.map((star) => (
            <Link
              key={star.name}
              href={star.href}
              className="group rounded-2xl border border-border bg-white overflow-hidden hover:shadow-lg hover:border-primary/20 transition-all"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-semibold uppercase tracking-wide text-primary bg-primary/10 px-2.5 py-1 rounded-full capitalize">
                    {star.category}
                  </span>
                  <div className="flex items-center gap-1 text-sm">
                    <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                    <span className="font-semibold">
                      {typeof star.rating === "number" ? star.rating.toFixed(1) : star.rating}
                    </span>
                  </div>
                </div>
                <h3 className="font-display text-xl font-semibold group-hover:text-primary transition-colors">
                  {star.name}
                </h3>
                <p className="text-xs text-muted-foreground mt-1 mb-4">{star.area}, Lusaka</p>
                <blockquote className="text-sm text-muted-foreground italic leading-relaxed border-l-2 border-primary/30 pl-4">
                  &ldquo;{star.quote}&rdquo;
                </blockquote>
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link
            href="/workers"
            className="text-sm font-semibold text-primary hover:underline"
          >
            View all workers →
          </Link>
        </div>
      </div>
    </section>
  );
}
