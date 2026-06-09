import Link from "next/link";
import { HeartHandshake, Search, Star } from "lucide-react";
import { SectionHeader } from "./section-header";

const steps = [
  {
    icon: Search,
    title: "Browse & filter",
    description: "Search verified workers by category, area, availability, and trust score.",
  },
  {
    icon: HeartHandshake,
    title: "Book with confidence",
    description: "Every worker is ID-verified, reference-checked, and rated by real customers.",
  },
  {
    icon: Star,
    title: "Rate & build trust",
    description: "Share feedback after each booking to help great workers stand out.",
  },
];

export function HowItWorksSection() {
  return (
    <section className="py-20 px-4 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <SectionHeader
          eyebrow="How it works"
          title="Getting help at home has never been easier."
        />

        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div key={step.title} className="relative text-center">
              <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
                <step.icon className="h-8 w-8 text-primary" />
              </div>
              <p className="text-sm font-semibold text-primary mb-2">Step {index + 1}</p>
              <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{step.description}</p>
            </div>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link href="/workers" className="text-primary font-medium hover:underline">
            Start browsing workers →
          </Link>
        </div>
      </div>
    </section>
  );
}
