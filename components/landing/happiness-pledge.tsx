import { SAFETY_SIGNALS } from "@/lib/landing/content";
import { CheckCircle2 } from "lucide-react";

export function HappinessPledge() {
  return (
    <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
          Safety and security is our top priority.
        </h2>
        <p className="text-muted-foreground leading-relaxed mb-12 max-w-xl mx-auto">
          We connect you to hardworking, trusted individuals who are experienced,
          vetted, rated and dependable.
        </p>

        <ul className="space-y-5 text-left max-w-lg mx-auto">
          {SAFETY_SIGNALS.map((signal) => (
            <li key={signal} className="flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
              <span className="text-foreground">{signal}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
