import Image from "next/image";
import Link from "next/link";
import { CategoryScroller } from "./category-scroller";

export function LandingHero() {
  return (
    <section className="relative overflow-hidden bg-white sweep-circles">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-8 md:pt-20 md:pb-12">
        {/* SweepSouth: centred headline + dual CTAs */}
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="font-display text-[2.75rem] sm:text-5xl lg:text-[3.5rem] font-bold leading-[1.05] text-balance text-foreground mb-6">
            All the help your home needs.
          </h1>

          <p className="text-lg text-muted-foreground leading-relaxed mb-10 max-w-xl mx-auto">
            Whether you need a quick clean or full-time help, TumaHelper connects
            you with reliable professionals you can trust.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-14">
            <Link
              href="/jobs"
              className="inline-flex items-center justify-center rounded-full bg-primary px-10 py-4 text-sm font-semibold text-primary-foreground hover:opacity-95 transition-opacity w-full sm:w-auto"
            >
              Find full-time help
            </Link>
            <Link
              href="/onboarding/worker"
              className="inline-flex items-center justify-center rounded-full border-2 border-foreground/10 px-10 py-4 text-sm font-semibold hover:bg-surface transition-colors w-full sm:w-auto"
            >
              Are you a worker? Apply now
            </Link>
          </div>
        </div>

        {/* Hero image — full width like SweepSouth lifestyle photography */}
        <div className="relative max-w-5xl mx-auto mb-12">
          <div className="relative aspect-[21/9] sm:aspect-[2.4/1] rounded-[2rem] overflow-hidden shadow-xl">
            <Image
              src="/images/hero-home.jpg"
              alt="Happy home in Lusaka"
              fill
              priority
              className="object-cover"
              sizes="(max-width: 1280px) 100vw, 1024px"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
          </div>
        </div>

        {/* Service category row */}
        <CategoryScroller />
      </div>
    </section>
  );
}
