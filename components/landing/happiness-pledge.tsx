import { HAPPINESS_PLEDGE, SAFETY_SIGNALS } from "@/lib/landing/content";
import { ShieldCheck } from "lucide-react";

export function HappinessPledge() {
  return (
    <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 bg-surface">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl md:text-4xl font-semibold mb-3">
            Your satisfaction, guaranteed
          </h2>
          <p className="text-muted-foreground">Safety and security is our top priority.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {HAPPINESS_PLEDGE.map((item) => (
            <div key={item.title} className="rounded-2xl bg-white border border-border p-8 text-center">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 mb-4">
                <ShieldCheck className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-display text-lg font-semibold mb-2">{item.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{item.description}</p>
            </div>
          ))}
        </div>

        <ul className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto">
          {SAFETY_SIGNALS.map((signal) => (
            <li
              key={signal}
              className="flex items-start gap-2 text-sm text-muted-foreground"
            >
              <span className="text-primary mt-0.5">✓</span>
              {signal}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
