import Link from "next/link";
import { ArrowRight, Shield, Smartphone } from "lucide-react";

export function TrustHubSection() {
  return (
    <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 bg-surface">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-primary mb-3">
              Trust Hub
            </p>
            <h2 className="font-display text-3xl md:text-4xl font-semibold text-balance mb-5">
              Manage your domestic worker with confidence.
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-8 max-w-lg">
              With Trust Hub, every worker is verified before they join. You see trust
              scores, reviews, and reference checks — plus tools to book, pay, and
              manage help from one place.
            </p>
            <Link
              href="/workers"
              className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
            >
              Explore verified workers
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
                  <p className="font-semibold">Trust Hub</p>
                  <p className="text-xs text-muted-foreground">Your household dashboard</p>
                </div>
              </div>

              <ul className="space-y-4">
                {[
                  "NRC identity verification on every worker",
                  "Reference checks before profiles go live",
                  "Trust scores updated after every job",
                  "Book, track, and review in one app",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm">
                    <Shield className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              <Link
                href="/register"
                className="mt-8 flex items-center justify-center rounded-2xl bg-primary text-primary-foreground py-3.5 text-sm font-semibold hover:opacity-95 transition-opacity"
              >
                Get started free
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
