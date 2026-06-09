import Link from "next/link";
import { Star } from "lucide-react";
import { WorkerCard } from "@/components/worker-card";
import { Button } from "@/components/ui/button";
import { SectionHeader } from "./section-header";
import type { PublicWorkerProfile } from "@/types";

interface Review {
  id: string;
  comment: string | null;
  overall_rating: number;
  created_at: string;
  reviewer?: { full_name?: string | null } | null;
  reviewee?: { full_name?: string | null } | null;
}

interface FeaturedHelpersSectionProps {
  workers: PublicWorkerProfile[] | null;
  testimonials: Review[] | null;
}

function HelperSpotlight({
  worker,
  quote,
}: {
  worker: PublicWorkerProfile;
  quote?: string;
}) {
  const categoryLabel = worker.category.replace(/_/g, " ");

  return (
    <div className="rounded-2xl border border-gray-100 bg-white overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <div className="p-6">
        <div className="flex items-center justify-between gap-3 mb-4">
          <span className="text-xs font-semibold uppercase tracking-wide text-primary bg-primary/10 px-2.5 py-1 rounded-full capitalize">
            {categoryLabel}
          </span>
          <div className="flex items-center gap-1 text-sm">
            <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
            <span className="font-medium">{worker.average_rating.toFixed(1)}</span>
          </div>
        </div>

        <Link href={`/workers/${worker.id}`} className="block">
          <h3 className="text-xl font-semibold mb-1">{worker.full_name}</h3>
          <p className="text-sm text-muted-foreground mb-4">
            {worker.area}, {worker.city}
          </p>
        </Link>

        {quote ? (
          <blockquote className="text-sm text-gray-700 italic border-l-2 border-primary/30 pl-4">
            &ldquo;{quote}&rdquo;
          </blockquote>
        ) : (
          <p className="text-sm text-muted-foreground">
            Experienced, vetted, and ready to help with {categoryLabel}.
          </p>
        )}
      </div>
    </div>
  );
}

export function FeaturedHelpersSection({ workers, testimonials }: FeaturedHelpersSectionProps) {
  if (!workers || workers.length === 0) return null;

  const quotesByWorker = new Map<string, string>();
  testimonials?.forEach((review) => {
    const workerName = review.reviewee?.full_name;
    if (workerName && review.comment && !quotesByWorker.has(workerName)) {
      quotesByWorker.set(workerName, review.comment);
    }
  });

  const spotlightWorkers = workers.slice(0, 3);
  const gridWorkers = workers.slice(0, 4);

  return (
    <>
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <SectionHeader
            eyebrow="Trusted helpers"
            title="Meet some of your TumaHelper stars."
            description="Experienced, vetted, and rated — ready to take care of your home."
          />

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {spotlightWorkers.map((worker) => (
              <HelperSpotlight
                key={worker.id}
                worker={worker}
                quote={quotesByWorker.get(worker.full_name)}
              />
            ))}
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {gridWorkers.map((worker) => (
              <WorkerCard key={worker.id} worker={worker} />
            ))}
          </div>

          <div className="text-center mt-10">
            <Link href="/workers">
              <Button variant="outline" size="lg">
                View all workers
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {testimonials && testimonials.length > 0 ? (
        <section className="py-20 px-4 bg-gray-50">
          <div className="max-w-6xl mx-auto">
            <SectionHeader
              eyebrow="Reviews"
              title="What our customers say."
              description="Real reviews from real families in Lusaka."
            />

            <div className="grid md:grid-cols-3 gap-6">
              {testimonials.map((review) => (
                <div key={review.id} className="rounded-2xl bg-white border border-gray-100 p-6 shadow-sm">
                  <div className="flex items-center gap-1 mb-3">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < review.overall_rating
                            ? "text-yellow-400 fill-yellow-400"
                            : "text-gray-200"
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-gray-700 text-sm mb-4 italic leading-relaxed">
                    &ldquo;{review.comment}&rdquo;
                  </p>
                  <div className="pt-3 border-t text-sm">
                    <p className="font-medium">{review.reviewer?.full_name || "Customer"}</p>
                    <p className="text-muted-foreground">
                      reviewed {review.reviewee?.full_name || "worker"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </>
  );
}
