import Link from "next/link";
import { PROCESS_STEPS } from "@/lib/landing/content";

export function ProcessSection() {
  return (
    <section className="py-16 md:py-20 px-4 sm:px-6 lg:px-8 bg-surface">
      <div className="max-w-7xl mx-auto">
        <h2 className="font-display text-3xl md:text-4xl font-semibold text-center mb-12">
          How it works
        </h2>

        <div className="grid md:grid-cols-3 gap-8 md:gap-12 mb-10">
          {PROCESS_STEPS.map((step) => (
            <div key={step.step} className="text-center">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground font-display text-xl font-semibold mb-5">
                {step.step}
              </div>
              <h3 className="font-display text-xl font-semibold mb-2">{step.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed max-w-xs mx-auto">
                {step.body}
              </p>
            </div>
          ))}
        </div>

        <div className="text-center">
          <Link
            href="/workers"
            className="inline-flex items-center justify-center rounded-2xl bg-primary px-8 py-4 text-sm font-semibold text-primary-foreground hover:opacity-95 transition-opacity"
          >
            Get help today
          </Link>
        </div>
      </div>
    </section>
  );
}
