import Link from "next/link";
import Image from "next/image";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { WorkerCard } from "@/components/worker-card";
import { FALLBACK_TESTIMONIALS, TRUST_BADGES } from "@/lib/landing/social-proof-fallbacks";
import type { PublicWorkerProfile } from "@/types";

interface Review {
  id: string;
  comment: string | null;
  overall_rating: number;
  reviewer?: { full_name?: string | null } | null;
  reviewee?: { full_name?: string | null } | null;
}

interface SocialProofSectionProps {
  workers: PublicWorkerProfile[] | null;
  testimonials: Review[] | null;
}

export function SocialProofSection({ workers, testimonials }: SocialProofSectionProps) {
  const reviews =
    testimonials && testimonials.length > 0 ? testimonials : FALLBACK_TESTIMONIALS;
  const usingFallbackReviews = !testimonials || testimonials.length === 0;

  return (
    <section className="py-16 md:py-20 px-4 bg-surface">
      <div className="max-w-6xl mx-auto">
        {/* Trust badge strip — always visible */}
        <div className="flex flex-wrap justify-center gap-x-8 gap-y-3 mb-14 pb-14 border-b border-border">
          {TRUST_BADGES.map((badge) => (
            <span
              key={badge}
              className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
            >
              {badge}
            </span>
          ))}
        </div>

        <div className="grid lg:grid-cols-[1fr_1.1fr] gap-12 items-start mb-16">
          <div className="relative aspect-[4/3] rounded-2xl overflow-hidden">
            <Image
              src="/images/home-family.jpg"
              alt="Family at home in Lusaka"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 480px"
            />
          </div>

          <div>
            <p className="text-xs font-semibold tracking-[0.2em] uppercase text-primary mb-3">
              Loved in Lusaka
            </p>
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-8">
              Families and workers trust TumaHelper.
            </h2>

            <div className="space-y-6">
              {reviews.slice(0, 3).map((review) => (
                <blockquote
                  key={review.id}
                  className="border-l-2 border-primary pl-5"
                >
                  <div className="flex items-center gap-1 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-3.5 w-3.5 ${
                          i < review.overall_rating
                            ? "text-amber-400 fill-amber-400"
                            : "text-border"
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-foreground leading-relaxed mb-2">
                    &ldquo;{review.comment}&rdquo;
                  </p>
                  <footer className="text-sm text-muted-foreground">
                    — {review.reviewer?.full_name || "Customer"}
                    {review.reviewee?.full_name ? ` · re ${review.reviewee.full_name}` : ""}
                  </footer>
                </blockquote>
              ))}
            </div>

            {usingFallbackReviews ? (
              <p className="text-xs text-muted-foreground mt-4">
                Sample reviews — real customer stories appear as bookings grow.
              </p>
            ) : null}
          </div>
        </div>

        {workers && workers.length > 0 ? (
          <>
            <div className="flex items-end justify-between gap-4 mb-8">
              <div>
                <h3 className="font-display text-2xl font-bold">Featured helpers</h3>
                <p className="text-muted-foreground text-sm mt-1">
                  Vetted professionals ready to work across Lusaka.
                </p>
              </div>
              <Link href="/workers" className="hidden sm:block text-primary text-sm font-medium hover:underline">
                View all →
              </Link>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {workers.slice(0, 4).map((worker) => (
                <WorkerCard key={worker.id} worker={worker} />
              ))}
            </div>
            <div className="text-center mt-8 sm:hidden">
              <Link href="/workers">
                <Button variant="outline">View all workers</Button>
              </Link>
            </div>
          </>
        ) : (
          <div className="text-center py-8">
            <Link href="/workers">
              <Button size="lg">Browse verified workers</Button>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
