import Link from "next/link";
import { ArrowRight, Shield, Smartphone } from "lucide-react";

export function TrustHubSection() {
  return (
    <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 bg-surface">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-primary mb-3">
              Trust first
            </p>
            <h2 className="font-display text-3xl md:text-4xl font-semibold text-balance mb-5">
              Know who&apos;s coming through your gate.
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-8 max-w-lg">
              In Lusaka, hiring domestic help often means word-of-mouth and hope.
              TumaHelper adds NRC checks, reference calls, trust scores, and reviews —
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

          <div className="relative">
            <div className="absolute -inset-4 sweep-card-teal rounded-[2.5rem] opacity-60" />
            <div className="relative bg-white rounded-3xl border border-border shadow-lg p-8 md:p-10">
              <div className="flex items-center gap-3 mb-8">
                <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                  <Smartphone className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="font-semibold">Your booking dashboard</p>
                  <p className="text-xs text-muted-foreground">Track jobs, pay, and reviews</p>
                </div>
              </div>

              <ul className="space-y-4">
                {[
                  "NRC verification before a profile goes live",
                  "Reference checks from previous employers",
                  "Pay with MTN MoMo or Airtel Money",
                  "Rate workers after every completed job",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm">
                    <Shield className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              <Link
                href="/customer/book"
                className="mt-8 flex items-center justify-center rounded-full bg-primary text-primary-foreground py-3.5 text-sm font-semibold hover:opacity-95 transition-opacity"
              >
                Book your first visit
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
