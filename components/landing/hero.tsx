import Link from "next/link";
import { Shield, Star, MapPin } from "lucide-react";
import { CategoryScroller } from "./category-scroller";
import { LogoMark } from "@/components/brand/logo";

const TRUST_POINTS = [
  { icon: Shield, label: "NRC verified workers" },
  { icon: Star, label: "Real reviews" },
  { icon: MapPin, label: "Across Lusaka" },
];

export function LandingHero() {
  return (
    <section className="relative bg-background sweep-circles">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-10 md:pt-20 md:pb-16">
        <div className="text-center max-w-3xl mx-auto">
          <div className="flex justify-center mb-6 md:hidden">
            <LogoMark size={56} />
          </div>
          <p className="text-sm font-semibold text-primary mb-4 tracking-wide">
            Trusted home help in Lusaka
          </p>
          <h1 className="font-display text-[2.75rem] sm:text-5xl lg:text-[3.5rem] font-bold leading-[1.05] text-balance text-foreground mb-4">
            Book verified home help.
          </h1>
          <p className="text-muted-foreground text-lg mb-10 max-w-xl mx-auto">
            Nannies, cleaning, housekeeping, cooking, laundry, garden help, and short-stay
            turnover cleaning. One-off or regular visits, with a path to permanent hire when
            you&apos;re ready.
          </p>
        </div>

        <div id="choose-service" className="mb-10 scroll-mt-24">
          <CategoryScroller />
        </div>

        <div className="text-center max-w-3xl mx-auto">
          <p className="mb-6 text-sm text-muted-foreground">
            Need someone permanently?{" "}
            <Link href="/hire" className="font-semibold text-primary hover:underline">
              Get in touch
            </Link>
          </p>

          <p className="mb-8 text-sm text-muted-foreground">
            Are you a worker?{" "}
            <Link
              href="/register?role=worker"
              className="font-semibold text-primary hover:underline"
            >
              Apply now
            </Link>
          </p>

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
