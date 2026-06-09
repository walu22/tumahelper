import Link from "next/link";
import { CalendarCheck, ShieldCheck, Users } from "lucide-react";
import { SectionHeader } from "./section-header";

const pillars = [
  {
    icon: CalendarCheck,
    title: "Bookings",
    description:
      "Book one-off or recurring help for cleaning, childcare, laundry, and more.",
    href: "/workers",
    cta: "Browse workers",
  },
  {
    icon: Users,
    title: "Placements",
    description:
      "Find full-time nannies, housekeepers, and domestic workers for your household.",
    href: "/jobs",
    cta: "View open roles",
  },
  {
    icon: ShieldCheck,
    title: "Trust Hub",
    description:
      "Every profile includes verification, trust scores, and reviews from real families.",
    href: "/workers",
    cta: "See verified profiles",
  },
];

export function PlatformPillars() {
  return (
    <section className="py-20 px-4 bg-white">
      <div className="max-w-6xl mx-auto">
        <SectionHeader
          eyebrow="What we offer"
          title="More than just a home services platform."
          description="From quick bookings to long-term placements, TumaHelper gives Lusaka families one trusted place to find help."
        />

        <div className="grid md:grid-cols-3 gap-6">
          {pillars.map((pillar) => (
            <div
              key={pillar.title}
              className="rounded-2xl border border-gray-100 bg-gray-50/70 p-8 hover:shadow-md transition-shadow"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-5">
                <pillar.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">{pillar.title}</h3>
              <p className="text-muted-foreground leading-relaxed mb-5">{pillar.description}</p>
              <Link href={pillar.href} className="text-primary font-medium text-sm hover:underline">
                {pillar.cta} →
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
