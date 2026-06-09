import Image from "next/image";
import Link from "next/link";
import { Star, ArrowRight } from "lucide-react";
import type { PublicWorkerProfile } from "@/types";

export function SweepStarsSection({ workers }: { workers: PublicWorkerProfile[] | null }) {
  const featured = workers?.slice(0, 3) ?? [];

  if (featured.length === 0) {
    return (
      <section className="py-16 md:py-20 px-4 sm:px-6 lg:px-8 bg-surface">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="font-display text-3xl font-bold mb-4">
            Verified workers joining every week
          </h2>
          <p className="text-muted-foreground leading-relaxed mb-8">
            We&apos;re building Lusaka&apos;s most trusted domestic worker network.
            Browse available profiles or be among the first families to book.
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
    <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 bg-surface sweep-circles">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-balance">
            Top-rated workers in Lusaka
          </h2>
          <p className="text-muted-foreground mt-5 leading-relaxed">
            Real profiles, verified and ready to help — book directly from their page.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {featured.map((w) => (
            <Link
              key={w.id}
              href={`/workers/${w.id}`}
              className="group bg-white rounded-3xl overflow-hidden border border-border hover:shadow-xl transition-all"
            >
              <div className="relative aspect-[4/3] bg-muted">
                {w.profile_photo_url ? (
                  <Image
                    src={w.profile_photo_url}
                    alt={w.full_name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-4xl font-bold text-muted-foreground/30">
                    {w.full_name.charAt(0)}
                  </div>
                )}
                <div className="absolute top-4 left-4">
                  <span className="text-xs font-bold uppercase tracking-wide bg-white/95 text-primary px-3 py-1 rounded-full capitalize">
                    {w.category === "nanny" ? "Childcare" : "Cleaning"}
                  </span>
                </div>
              </div>

              <div className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-display text-xl font-bold group-hover:text-primary transition-colors">
                    {w.full_name}
                  </h3>
                  {w.average_rating > 0 && (
                    <span className="flex items-center gap-1 text-sm font-semibold">
                      <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                      {w.average_rating.toFixed(1)}
                    </span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">{w.area}, Lusaka</p>
                <p className="text-sm text-primary font-medium mt-3">
                  Trust score {w.trust_score} · {w.experience_years} yrs exp
                </p>
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link href="/workers" className="text-sm font-semibold text-primary hover:underline">
            View all workers →
          </Link>
        </div>
      </div>
    </section>
  );
}
