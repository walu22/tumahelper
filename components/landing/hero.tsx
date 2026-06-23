import Link from "next/link";
import { CategoryScroller } from "./category-scroller";
import { HeroServiceSearch } from "./hero-service-search";
import { LogoMark } from "@/components/brand/logo";
import { HERO_INTRO, PERMANENT_HIRE_HREF } from "@/lib/landing/content";

export function LandingHero() {
  return (
    <section className="relative bg-background sweep-circles">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-10 md:pt-20 md:pb-16">
        <div className="text-center max-w-3xl mx-auto">
          <div className="flex justify-center mb-6 md:hidden">
            <LogoMark size={56} />
          </div>
          <p className="text-sm font-semibold text-primary mb-4 tracking-wide">
            {HERO_INTRO.eyebrow}
          </p>
          <h1 className="font-hero text-[2.75rem] sm:text-6xl lg:text-[4.25rem] font-bold leading-[1.05] tracking-tight text-balance text-foreground mb-6">
            <span className="block">{HERO_INTRO.headlineLine1}</span>
            <span className="block">{HERO_INTRO.headlineLine2}</span>
          </h1>
          <p className="text-muted-foreground leading-relaxed mb-8 max-w-2xl mx-auto">
            {HERO_INTRO.founderNote}
          </p>
          <HeroServiceSearch />
        </div>

        <div id="choose-service" className="mb-10 scroll-mt-24">
          <CategoryScroller />
        </div>

        <div className="text-center max-w-3xl mx-auto">
          <p className="mb-6 text-sm text-muted-foreground">
            {HERO_INTRO.trustLine}
          </p>

          <p className="mb-4 text-sm text-muted-foreground">
            Need someone full-time?{" "}
            <Link href={PERMANENT_HIRE_HREF} className="font-semibold text-primary hover:underline">
              WhatsApp us
            </Link>
          </p>

          <p className="text-sm text-muted-foreground">
            Are you a worker?{" "}
            <Link
              href="/register?role=worker"
              className="font-semibold text-primary hover:underline"
            >
              Apply here
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
