import Image from "next/image";
import Link from "next/link";
import { ArrowRight, MapPin } from "lucide-react";
import { CategoryScroller } from "./category-scroller";
import { LUSAKA_AREAS } from "@/lib/landing/content";

export function LandingHero() {
  return (
    <section className="relative overflow-hidden bg-background landing-grain">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-16 md:pt-16 md:pb-24">
        {/* TaskRabbit-style category scroller — primary interaction */}
        <CategoryScroller />

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center mt-10 md:mt-14">
          <div className="max-w-xl">
            {/* SweepSouth-style headline */}
            <h1 className="font-display text-[2.5rem] sm:text-5xl lg:text-[3.25rem] font-semibold leading-[1.08] text-balance text-foreground mb-5">
              All the help your home needs.
            </h1>

            <p className="text-lg text-muted-foreground leading-relaxed mb-8 max-w-md">
              Whether you need a quick clean or full-time help, TumaHelper connects
              Lusaka families with reliable, vetted professionals you can trust.
            </p>

            {/* SweepSouth dual CTAs */}
            <div className="flex flex-col sm:flex-row gap-3 mb-8">
              <Link
                href="/jobs"
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-primary px-8 py-4 text-sm font-semibold text-primary-foreground hover:opacity-95 transition-opacity"
              >
                Find full-time help
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/onboarding/worker"
                className="inline-flex items-center justify-center rounded-2xl border-2 border-foreground/15 px-8 py-4 text-sm font-semibold hover:bg-surface transition-colors"
              >
                Are you a worker? Apply now
              </Link>
            </div>

            {/* Area search */}
            <form action="/workers" method="get" className="flex gap-2">
              <div className="relative flex-1">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <select
                  name="area"
                  defaultValue=""
                  className="w-full appearance-none rounded-xl border border-border bg-white pl-11 pr-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/25"
                >
                  <option value="">All areas in Lusaka</option>
                  {LUSAKA_AREAS.map((area) => (
                    <option key={area} value={area}>
                      {area}
                    </option>
                  ))}
                </select>
              </div>
              <button
                type="submit"
                className="rounded-xl bg-accent px-6 py-3 text-sm font-semibold text-accent-foreground hover:opacity-95 transition-opacity shrink-0"
              >
                Search
              </button>
            </form>
          </div>

          <div className="relative lg:pl-4">
            <div className="relative aspect-[5/4] rounded-[2rem] overflow-hidden shadow-2xl shadow-forest/10">
              <Image
                src="/images/hero-home.jpg"
                alt="Home in Lusaka"
                fill
                priority
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
