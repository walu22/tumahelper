import { Star } from "lucide-react";
import { FALLBACK_REVIEWS } from "@/lib/landing/content";

interface Review {
  id: string;
  comment: string | null;
  overall_rating: number;
  reviewer?: { full_name?: string | null } | null;
  reviewee?: { full_name?: string | null } | null;
}

export function StoriesSection({ reviews }: { reviews: Review[] | null }) {
  const items =
    reviews && reviews.length > 0
      ? reviews.map((r, i) => ({
          id: r.id,
          quote: r.comment || "",
          author: r.reviewer?.full_name || "Customer",
          role: r.reviewee?.full_name ? `re ${r.reviewee.full_name}` : "Lusaka",
          rating: r.overall_rating,
          featured: i === 0,
        }))
      : FALLBACK_REVIEWS.map((r) => ({ ...r, featured: r.id === "r1" }));

  const featured = items[0];
  const rest = items.slice(1);

  return (
    <section className="py-24 md:py-32 px-4 sm:px-6 lg:px-8 bg-surface">
      <div className="max-w-7xl mx-auto">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-accent mb-4 text-center">
          Stories
        </p>
        <h2 className="font-display text-4xl md:text-5xl font-semibold text-center text-balance mb-16 max-w-2xl mx-auto">
          Real families. Real workers. Real peace of mind.
        </h2>

        {featured ? (
          <blockquote className="relative bg-forest text-cream rounded-[2rem] p-10 md:p-14 mb-8 max-w-4xl mx-auto text-center">
            <div className="flex justify-center gap-1 mb-6">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${
                    i < featured.rating ? "fill-accent text-accent" : "text-cream/20"
                  }`}
                />
              ))}
            </div>
            <p className="font-display text-2xl md:text-3xl font-medium leading-snug text-balance mb-8">
              &ldquo;{featured.quote}&rdquo;
            </p>
            <footer>
              <p className="font-semibold">{featured.author}</p>
              <p className="text-sm text-cream/60 mt-1">{featured.role}</p>
            </footer>
          </blockquote>
        ) : null}

        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {rest.map((item) => (
            <blockquote
              key={item.id}
              className="bg-white rounded-3xl border border-border p-8"
            >
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-3.5 w-3.5 ${
                      i < item.rating ? "fill-amber-400 text-amber-400" : "text-border"
                    }`}
                  />
                ))}
              </div>
              <p className="text-foreground leading-relaxed mb-4">&ldquo;{item.quote}&rdquo;</p>
              <footer className="text-sm">
                <span className="font-semibold">{item.author}</span>
                <span className="text-muted-foreground"> · {item.role}</span>
              </footer>
            </blockquote>
          ))}
        </div>

        {(!reviews || reviews.length === 0) ? (
          <p className="text-center text-xs text-muted-foreground mt-8">
            Sample stories — real reviews appear as the community grows.
          </p>
        ) : null}
      </div>
    </section>
  );
}
