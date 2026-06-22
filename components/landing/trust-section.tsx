import Link from "next/link";
import { ArrowRight, CheckCircle2, Shield } from "lucide-react";
import { SAFETY_SIGNALS, TRUST_SECTION_INTRO } from "@/lib/landing/content";

export function TrustSection() {
  return (
    <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 bg-surface border-t border-border">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          <div>
            <p className="text-sm font-semibold text-primary mb-3 tracking-wide">
              {TRUST_SECTION_INTRO.eyebrow}
            </p>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-balance mb-5">
              {TRUST_SECTION_INTRO.headline}
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-8">
              {TRUST_SECTION_INTRO.subtitle}
            </p>
            <Link
              href="/workers"
              className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
            >
              {TRUST_SECTION_INTRO.linkLabel}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="rounded-3xl border border-border bg-card p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Shield className="h-5 w-5 text-primary" />
              </div>
              <p className="font-semibold">What we check</p>
            </div>
            <ul className="space-y-4">
              {SAFETY_SIGNALS.map((signal) => (
                <li key={signal} className="flex items-start gap-3 text-sm">
                  <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <span>{signal}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
