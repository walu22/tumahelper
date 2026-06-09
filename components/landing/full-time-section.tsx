import Link from "next/link";
import { Baby, HeartHandshake, Home } from "lucide-react";
import { SectionHeader } from "./section-header";

const roles = [
  {
    icon: Home,
    title: "Full-time Housekeeper",
    description: "Reliable daily cleaning, laundry, and household management.",
    href: "/jobs?category=housekeeper",
  },
  {
    icon: Baby,
    title: "Full-time Nanny",
    description: "Dedicated childcare for families who need ongoing support.",
    href: "/jobs?category=nanny",
  },
  {
    icon: HeartHandshake,
    title: "Live-in Domestic Worker",
    description: "Long-term help with flexible duties tailored to your home.",
    href: "/jobs",
  },
];

export function FullTimeSection() {
  return (
    <section className="py-20 px-4 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <SectionHeader
          eyebrow="Placements"
          title="Find the best full-time help."
          description="Getting your home in order has never been easier. Post a role and connect with vetted candidates."
        />

        <div className="grid md:grid-cols-3 gap-6">
          {roles.map((role) => (
            <Link
              key={role.title}
              href={role.href}
              className="group rounded-2xl bg-white border border-gray-100 p-8 shadow-sm hover:shadow-lg transition-all"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-5 group-hover:bg-primary/15 transition-colors">
                <role.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">{role.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{role.description}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
