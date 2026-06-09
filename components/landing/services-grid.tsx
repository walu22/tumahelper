import Link from "next/link";
import { Baby, Clock3, Home, Shirt, Sparkles, Truck } from "lucide-react";
import { SectionHeader } from "./section-header";

export interface ServiceCategory {
  id: string;
  name: string;
  slug: string;
  description: string | null;
}

const fallbackServices = [
  {
    slug: "house-cleaners",
    name: "Indoor Cleaning",
    description: "Top-to-bottom home cleaning, from kitchens and bathrooms to bedrooms.",
    icon: Home,
    meta: "3–8 hours",
  },
  {
    slug: "nannies",
    name: "Nanny & Childcare",
    description: "Babysitting, after-school care, and supervised help around the home.",
    icon: Baby,
    meta: "Flexible hours",
  },
  {
    slug: "house-cleaners",
    name: "Express Cleaning",
    description: "Quick help with tidying, dishes, laundry, and high-priority tasks.",
    icon: Clock3,
    meta: "1–3 hours",
  },
  {
    slug: "house-cleaners",
    name: "Laundry & Ironing",
    description: "Fresh, folded, and ready-to-wear laundry handled by experienced helpers.",
    icon: Shirt,
    meta: "Per load",
  },
  {
    slug: "jobs",
    name: "Moving Clean",
    description: "Essential deep cleaning for move-ins, move-outs, and handovers.",
    icon: Truck,
    meta: "One-off",
  },
  {
    slug: "workers",
    name: "Special Requests",
    description: "Need something specific? Browse verified workers by skill and area.",
    icon: Sparkles,
    meta: "Custom",
  },
];

export function ServicesGrid({ categories }: { categories: ServiceCategory[] | null }) {
  const items =
    categories && categories.length > 0
      ? categories.map((category) => ({
          slug: category.slug,
          name: category.name,
          description: category.description || "Browse trusted professionals in this category.",
          icon: category.slug?.includes("nanny") ? Baby : Home,
          meta: "Available now",
        }))
      : fallbackServices;

  return (
    <section className="py-20 px-4 bg-white">
      <div className="max-w-6xl mx-auto">
        <SectionHeader
          eyebrow="Services"
          title="Choose the service you need."
          description="From quick cleans to full-time placements, find the right help for your home."
        />

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((service) => (
            <Link
              key={`${service.slug}-${service.name}`}
              href={`/${service.slug}`}
              className="group rounded-2xl border border-gray-100 bg-white p-6 shadow-sm hover:shadow-lg hover:border-primary/20 transition-all"
            >
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center">
                  <service.icon className="h-5 w-5 text-primary" />
                </div>
                <span className="text-xs font-medium uppercase tracking-wide text-primary bg-primary/10 px-2.5 py-1 rounded-full">
                  {service.meta}
                </span>
              </div>
              <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">
                {service.name}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{service.description}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
