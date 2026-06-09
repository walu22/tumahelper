import Image from "next/image";
import Link from "next/link";
import { SWEEP_STARS } from "@/lib/landing/content";
import type { PublicWorkerProfile } from "@/types";

const PLACEHOLDER = SWEEP_STARS;

export function SweepStarsSection({ workers }: { workers: PublicWorkerProfile[] | null }) {
  const stars =
    workers && workers.length >= 3
      ? workers.slice(0, 3).map((w, i) => ({
          name: w.full_name,
          category: w.category === "nanny" ? "Childcare" : "Indoor",
          area: w.area,
          quote:
            PLACEHOLDER[i]?.quote ||
            "Experienced, vetted, and ready to help with your home.",
          rating: w.average_rating,
          href: `/workers/${w.id}`,
          photo: w.profile_photo_url || PLACEHOLDER[i]?.photo,
          date: PLACEHOLDER[i]?.date || "Recently",
        }))
      : PLACEHOLDER;

  return (
    <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 bg-surface sweep-circles">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-balance">
            Meet some of your TumaHelper stars.
          </h2>
          <p className="text-muted-foreground mt-5 leading-relaxed">
            From laundry to dishes — they&apos;re experienced, vetted and rated,
            ready to take care of your home.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {stars.map((star) => (
            <Link
              key={star.name}
              href={star.href}
              className="group bg-white rounded-3xl overflow-hidden border border-border hover:shadow-xl transition-all"
            >
              <div className="relative aspect-[4/3] bg-muted">
                {star.photo ? (
                  <Image
                    src={star.photo}
                    alt={star.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-4xl font-bold text-muted-foreground/30">
                    {star.name.charAt(0)}
                  </div>
                )}
                <div className="absolute top-4 left-4 flex gap-2">
                  <span className="text-xs font-bold uppercase tracking-wide bg-white/95 text-primary px-3 py-1 rounded-full">
                    {star.category}
                  </span>
                </div>
              </div>

              <div className="p-6">
                <p className="text-xs text-muted-foreground mb-2">{star.date}</p>
                <h3 className="font-display text-xl font-bold group-hover:text-primary transition-colors">
                  {star.name}
                </h3>
                <blockquote className="text-sm text-muted-foreground italic leading-relaxed mt-3">
                  &ldquo;{star.quote}&rdquo;
                </blockquote>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
