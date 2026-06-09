import Image from "next/image";
import Link from "next/link";
import { ArrowRight, MapPin, ShieldCheck, Star } from "lucide-react";
import { LUSAKA_AREAS, TRUST_STATS } from "@/lib/landing/content";

export function LandingHero() {
  return (
    <section className="relative overflow-hidden bg-background landing-grain">
      <div className="absolute top-0 right-0 w-[55%] h-full bg-gradient-to-l from-primary/[0.06] to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-20 md:pt-20 md:pb-28">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary mb-8">
              <MapPin className="h-3.5 w-3.5" />
              Lusaka&apos;s home help marketplace
            </div>

            <h1 className="font-display text-[2.75rem] sm:text-5xl lg:text-[3.5rem] font-semibold leading-[1.08] text-balance text-foreground mb-6">
              Help at home,{" "}
              <span className="text-primary italic">handled.</span>
            </h1>

            <p className="text-lg text-muted-foreground leading-relaxed mb-8 max-w-md">
              Verified nannies, cleaners, and domestic workers — book for a day
              or hire full-time, without the guesswork.
            </p>

            <form action="/workers" method="get" className="flex flex-col sm:flex-row gap-3 mb-8">
              <div className="relative flex-1">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <select
                  name="area"
                  defaultValue=""
                  className="w-full appearance-none rounded-2xl border border-border bg-white pl-11 pr-4 py-3.5 text-sm font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/25"
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
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-accent px-8 py-3.5 text-sm font-semibold text-accent-foreground shadow-md hover:opacity-95 transition-opacity"
              >
                Find help
                <ArrowRight className="h-4 w-4" />
              </button>
            </form>

            <div className="flex flex-wrap gap-3 mb-10">
              {[
                { href: "/nannies", label: "Nannies" },
                { href: "/house-cleaners", label: "Cleaning" },
                { href: "/jobs", label: "Full-time" },
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="rounded-full border border-border bg-white px-5 py-2 text-sm font-medium hover:border-primary/30 hover:text-primary transition-colors"
                >
                  {item.label}
                </Link>
              ))}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-8 border-t border-border">
              {TRUST_STATS.map((stat) => (
                <div key={stat.label}>
                  <p className="font-display text-xl font-semibold text-foreground">{stat.value}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative lg:pl-4">
            <div className="relative aspect-[4/5] max-h-[560px] rounded-[2rem] overflow-hidden shadow-2xl shadow-forest/10">
              <Image
                src="/images/home-family.jpg"
                alt="Family at home in Lusaka"
                fill
                priority
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>

            <div className="absolute -bottom-4 -left-2 sm:left-4 bg-white rounded-2xl shadow-xl border border-border p-4 max-w-[220px]">
              <div className="flex items-center gap-2 mb-2">
                <ShieldCheck className="h-4 w-4 text-primary" />
                <span className="text-xs font-semibold uppercase tracking-wider text-primary">
                  Verified
                </span>
              </div>
              <p className="font-display font-semibold text-foreground">Sarah Mulenga</p>
              <p className="text-xs text-muted-foreground mb-2">Housekeeper · Kabulonga</p>
              <div className="flex items-center gap-1 text-sm">
                <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                <span className="font-semibold">4.9</span>
                <span className="text-muted-foreground text-xs">· 92 trust score</span>
              </div>
            </div>

            <div className="absolute -top-3 -right-2 sm:right-4 bg-forest text-cream rounded-2xl px-4 py-3 shadow-lg">
              <p className="font-display text-2xl font-semibold">48hr</p>
              <p className="text-xs text-cream/70">Full-time matching</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
