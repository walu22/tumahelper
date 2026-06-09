import Link from "next/link";
import { ArrowRight, Shield, Star, MapPin } from "lucide-react";
import { CategoryScroller } from "./category-scroller";
import { LogoMark } from "@/components/brand/logo";

const TRUST_POINTS = [
  { icon: Shield, label: "NRC verified workers" },
  { icon: Star, label: "Real reviews" },
  { icon: MapPin, label: "Across Lusaka" },
];

export function LandingHero() {
  return (
    <section className="relative overflow-hidden bg-white sweep-circles">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-10 md:pt-20 md:pb-16">
        <div className="text-center max-w-3xl mx-auto">
          <div className="flex justify-center mb-6 md:hidden">
            <LogoMark size={56} />
          </div>
          <p className="text-sm font-semibold text-primary mb-4 tracking-wide">
            Trusted home help in Lusaka
          </p>
          <h1 className="font-display text-[2.75rem] sm:text-5xl lg:text-[3.5rem] font-bold leading-[1.05] text-balance text-foreground mb-10">
            Vetted nannies &amp; cleaners, booked in minutes.
          </h1>
        </div>

        {/* Service icons first — primary action */}
        <div className="mb-10">
          <CategoryScroller />
        </div>

        <div className="text-center max-w-3xl mx-auto">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-8">
            <Link
              href="/customer/book"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-10 py-4 text-sm font-semibold text-primary-foreground hover:opacity-95 transition-opacity w-full sm:w-auto"
            >
              Book help today
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/jobs"
              className="inline-flex items-center justify-center rounded-full border-2 border-foreground/10 px-10 py-4 text-sm font-semibold hover:bg-surface transition-colors w-full sm:w-auto"
            >
              Hire full-time
            </Link>
          </div>

          <ul className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
            {TRUST_POINTS.map(({ icon: Icon, label }) => (
              <li key={label} className="flex items-center gap-2">
                <Icon className="h-4 w-4 text-primary" />
                {label}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
