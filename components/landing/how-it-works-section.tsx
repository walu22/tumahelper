import Link from "next/link";
import { CalendarCheck, Search, Star } from "lucide-react";
import { SectionHeader } from "./section-header";

const steps = [
  {
    icon: Search,
    step: "01",
    title: "Choose your service",
    description: "Pick cleaning, childcare, laundry, or full-time help — and filter by Lusaka area.",
    href: "/workers",
    cta: "Browse services",
  },
  {
    icon: CalendarCheck,
    step: "02",
    title: "Pick a verified worker",
    description: "Compare trust scores, reviews, and verification badges before you book.",
    href: "/workers",
    cta: "View profiles",
  },
  {
    icon: Star,
    step: "03",
    title: "Book and review",
    description: "Confirm your booking, get the help you need, and leave a review to build trust.",
    href: "/register",
    cta: "Get started",
  },
];

export function HowItWorksSection() {
  return (
    <section className="py-20 px-4 bg-white">
      <div className="max-w-6xl mx-auto">
        <SectionHeader
          eyebrow="How it works"
          title="Book trusted help in 3 simple steps."
          description="From first search to finished job — designed to be fast, clear, and safe."
        />

        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step) => (
            <div
              key={step.title}
              className="relative rounded-2xl border border-gray-100 bg-gray-50/50 p-8"
            >
              <p className="text-4xl font-bold text-primary/15 absolute top-6 right-6">
                {step.step}
              </p>
              <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
                <step.icon className="h-7 w-7 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
              <p className="text-muted-foreground leading-relaxed mb-5">{step.description}</p>
              <Link href={step.href} className="text-primary font-medium text-sm hover:underline">
                {step.cta} →
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
