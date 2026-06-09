import Link from "next/link";
import { Baby, Briefcase, Clock3, Home, Shirt } from "lucide-react";
import { SectionHeader } from "./section-header";

export interface ServiceCategory {
  id: string;
  name: string;
  slug: string;
  description: string | null;
}

const services = [
  {
    slug: "house-cleaners",
    name: "Indoor cleaning",
    description: "Top-to-bottom home cleaning",
    price: "From K250",
    meta: "3–8 hrs",
    icon: Home,
    span: "md:col-span-2",
  },
  {
    slug: "nannies",
    name: "Nanny & childcare",
    description: "Babysitting and supervised home help",
    price: "From K200/day",
    meta: "Flexible",
    icon: Baby,
    span: "",
  },
  {
    slug: "house-cleaners",
    name: "Express clean",
    description: "Quick tidying and priority tasks",
    price: "From K150",
    meta: "1–3 hrs",
    icon: Clock3,
    span: "",
  },
  {
    slug: "house-cleaners",
    name: "Laundry & ironing",
    description: "Fresh, folded, ready to wear",
    price: "From K80",
    meta: "Per load",
    icon: Shirt,
    span: "",
  },
  {
    slug: "jobs",
    name: "Full-time placements",
    description: "Live-in nannies, housekeepers, domestic workers",
    price: "From K800/mo",
    meta: "Permanent",
    icon: Briefcase,
    span: "md:col-span-2",
  },
];

export function ServicesGrid({ categories }: { categories: ServiceCategory[] | null }) {
  const items =
    categories && categories.length >= 3
      ? categories.slice(0, 5).map((cat, i) => ({
          slug: cat.slug,
          name: cat.name,
          description: cat.description || "Browse verified professionals.",
          price: cat.slug?.includes("nanny") ? "From K200/day" : "From K150",
          meta: "Available",
          icon: cat.slug?.includes("nanny") ? Baby : Home,
          span: i === 0 ? "md:col-span-2" : "",
        }))
      : services;

  return (
    <section className="py-16 md:py-20 px-4 bg-white">
      <div className="max-w-6xl mx-auto">
        <SectionHeader
          eyebrow="Services"
          title="What do you need help with?"
          description="Transparent pricing. Verified workers. One-off or full-time."
        />

        <div className="grid md:grid-cols-3 gap-4">
          {items.map((service, index) => (
            <Link
              key={`${service.slug}-${service.name}-${index}`}
              href={`/${service.slug}`}
              className={`group flex flex-col justify-between rounded-2xl border border-border p-6 hover:border-primary/30 hover:shadow-md transition-all ${service.span}`}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <service.icon className="h-6 w-6 text-primary" />
                  <span className="text-xs font-medium text-muted-foreground">{service.meta}</span>
                </div>
                <h3 className="font-display text-lg font-semibold mb-1 group-hover:text-primary transition-colors">
                  {service.name}
                </h3>
                <p className="text-sm text-muted-foreground">{service.description}</p>
              </div>
              <p className="text-sm font-semibold text-primary mt-4">{service.price}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
