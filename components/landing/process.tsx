import Link from "next/link";
import { Calendar, MapPin, Shield, Star } from "lucide-react";
import { PROCESS_STEPS } from "@/lib/landing/content";

export function ProcessSection() {
  return (
    <section className="py-24 md:py-32 px-4 sm:px-6 lg:px-8 bg-surface">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          <div className="lg:sticky lg:top-24">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-accent mb-4">
              How it works
            </p>
            <h2 className="font-display text-4xl md:text-5xl font-semibold text-balance mb-6">
              From search to booked in minutes.
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed mb-8 max-w-md">
              No endless WhatsApp threads. No guessing who to trust. TumaHelper
              puts verification, reviews, and booking in one place.
            </p>

            <div className="flex flex-wrap gap-4">
              {[
                { icon: Shield, text: "NRC verified" },
                { icon: Star, text: "Rated by families" },
                { icon: Calendar, text: "Book online" },
                { icon: MapPin, text: "Lusaka areas" },
              ].map((item) => (
                <span
                  key={item.text}
                  className="inline-flex items-center gap-2 rounded-full bg-white border border-border px-4 py-2 text-sm font-medium"
                >
                  <item.icon className="h-4 w-4 text-primary" />
                  {item.text}
                </span>
              ))}
            </div>
          </div>

          <div className="space-y-0">
            {PROCESS_STEPS.map((step, index) => (
              <div key={step.step} className="relative flex gap-8 pb-12 last:pb-0">
                {index < PROCESS_STEPS.length - 1 ? (
                  <div className="absolute left-[1.65rem] top-14 bottom-0 w-px bg-border" />
                ) : null}
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-forest text-cream font-display text-lg font-semibold">
                  {step.step}
                </div>
                <div className="pt-2">
                  <h3 className="font-display text-2xl font-semibold mb-2">{step.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{step.body}</p>
                </div>
              </div>
            ))}

            <Link
              href="/workers"
              className="inline-flex mt-10 items-center justify-center rounded-2xl bg-primary px-8 py-4 text-sm font-semibold text-primary-foreground hover:opacity-95 transition-opacity"
            >
              Start browsing workers
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
