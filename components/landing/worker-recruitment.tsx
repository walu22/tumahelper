import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function WorkerRecruitment() {
  return (
    <section className="py-16 md:py-20 px-4 sm:px-6 lg:px-8 bg-forest text-cream">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-8">
        <div className="max-w-xl">
          <h2 className="font-display text-3xl md:text-4xl font-semibold mb-4">
            Want to work with TumaHelper?
          </h2>
          <p className="text-cream/75 leading-relaxed">
            Become your own boss, choose your own schedule, and work in your preferred
            areas across Lusaka.
          </p>
        </div>
        <Link
          href="/onboarding/worker"
          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-accent px-8 py-4 text-sm font-semibold text-accent-foreground hover:opacity-95 transition-opacity shrink-0"
        >
          Apply now
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}
