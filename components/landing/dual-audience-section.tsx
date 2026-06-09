import Link from "next/link";
import {
  BadgeCheck,
  Calendar,
  Heart,
  Shield,
  Star,
  TrendingUp,
  Wallet,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionHeader } from "./section-header";

const householdBenefits = [
  { icon: Shield, text: "NRC-verified profiles with reference checks" },
  { icon: Star, text: "Trust scores and reviews from real families" },
  { icon: Calendar, text: "Book one-off help or hire full-time staff" },
  { icon: Heart, text: "Free replacement support if a match isn't right" },
];

const workerBenefits = [
  { icon: BadgeCheck, text: "Build a verified profile that stands out" },
  { icon: Calendar, text: "Choose your schedule and preferred areas" },
  { icon: TrendingUp, text: "Earn reputation through ratings and jobs" },
  { icon: Wallet, text: "Access bookings and full-time job opportunities" },
];

export function DualAudienceSection() {
  return (
    <section className="py-20 px-4 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <SectionHeader
          eyebrow="Built for Lusaka"
          title="Peace of mind for families. Dignified work for helpers."
          description="TumaHelper connects households with verified domestic workers — giving families trusted help and giving workers a fair, professional way to find work."
        />

        <div className="grid lg:grid-cols-2 gap-6">
          <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary mb-3">
              For families
            </p>
            <h3 className="text-2xl font-bold mb-6">Find help you can trust</h3>
            <ul className="space-y-4 mb-8">
              {householdBenefits.map((item) => (
                <li key={item.text} className="flex items-start gap-3 text-muted-foreground">
                  <div className="mt-0.5 rounded-lg bg-primary/10 p-2">
                    <item.icon className="h-4 w-4 text-primary" />
                  </div>
                  <span className="leading-relaxed">{item.text}</span>
                </li>
              ))}
            </ul>
            <Link href="/workers">
              <Button className="w-full sm:w-auto">Find a worker</Button>
            </Link>
          </div>

          <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary mb-3">
              For workers
            </p>
            <h3 className="text-2xl font-bold mb-6">Grow your career with dignity</h3>
            <ul className="space-y-4 mb-8">
              {workerBenefits.map((item) => (
                <li key={item.text} className="flex items-start gap-3 text-muted-foreground">
                  <div className="mt-0.5 rounded-lg bg-primary/10 p-2">
                    <item.icon className="h-4 w-4 text-primary" />
                  </div>
                  <span className="leading-relaxed">{item.text}</span>
                </li>
              ))}
            </ul>
            <Link href="/onboarding/worker">
              <Button variant="outline" className="w-full sm:w-auto">
                Apply as a provider
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
