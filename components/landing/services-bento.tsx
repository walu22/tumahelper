import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { SERVICES } from "@/lib/landing/content";

export function ServicesBento() {
  return (
    <section className="py-24 md:py-32 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-14">
          <div className="max-w-xl">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-accent mb-4">
              Services
            </p>
            <h2 className="font-display text-4xl md:text-5xl font-semibold text-balance">
              Whatever your home needs today.
            </h2>
          </div>
          <Link
            href="/workers"
            className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline shrink-0"
          >
            View all services
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 auto-rows-[minmax(180px,auto)]">
          {SERVICES.map((service) => (
            <Link
              key={service.title}
              href={`/${service.slug}`}
              className={`group relative overflow-hidden rounded-3xl min-h-[200px] ${
                service.span.includes("md:col-span-2 md:row-span-2")
                  ? "md:col-span-2 md:row-span-2 min-h-[320px]"
                  : service.span.includes("md:col-span-2")
                    ? "md:col-span-2"
                    : ""
              }`}
            >
              <Image
                src={service.image}
                alt=""
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
              <div
                className={`absolute inset-0 ${
                  service.dark
                    ? "bg-gradient-to-t from-forest/95 via-forest/50 to-forest/20"
                    : "bg-gradient-to-t from-forest/90 via-forest/40 to-transparent"
                }`}
              />
              <div className="absolute inset-0 p-6 md:p-8 flex flex-col justify-end text-cream">
                <p className="text-sm font-semibold text-accent mb-2">{service.price}</p>
                <h3 className="font-display text-2xl md:text-3xl font-semibold mb-2 group-hover:translate-x-0.5 transition-transform">
                  {service.title}
                </h3>
                <p className="text-sm text-cream/80 max-w-sm leading-relaxed">
                  {service.description}
                </p>
              </div>
              <ArrowUpRight className="absolute top-6 right-6 h-5 w-5 text-cream/60 group-hover:text-cream transition-colors" />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
