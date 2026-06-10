import Link from "next/link";
import { ArrowRight, CheckCircle2, Shield } from "lucide-react";
import { SAFETY_SIGNALS } from "@/lib/landing/content";

export function TrustSection() {
  return (
    <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 bg-surface border-t border-border">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-primary mb-3">
              Trust first
            </p>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-balance mb-5">
              Know who&apos;s coming through your gate.
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-8">
              In Lusaka, hiring domestic help often means word-of-mouth and hope.
              TumaHelper adds NRC checks, reference calls, trust scores, and reviews,
              so you can book with confidence, not guesswork.
            </p>
            <Link
              href="/workers"
              className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
            >
              Browse verified workers
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="rounded-3xl border border-border bg-white p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Shield className="h-5 w-5 text-primary" />
              </div>
              <p className="font-semibold">Safety &amp; security</p>
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
