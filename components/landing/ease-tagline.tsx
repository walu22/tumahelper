import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function EaseTagline() {
  return (
    <section className="py-12 md:py-16 px-4 sm:px-6 lg:px-8 bg-primary text-primary-foreground sweep-circles">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-semibold text-balance leading-snug">
          Book a verified worker before the week gets away from you.
        </h2>
        <Link
          href="/customer/book"
          className="inline-flex items-center gap-2 mt-8 rounded-full bg-white text-primary px-8 py-3.5 text-sm font-semibold hover:opacity-95 transition-opacity"
        >
          Start booking
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}
