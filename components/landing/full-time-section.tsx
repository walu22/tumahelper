import Link from "next/link";
import { FULL_TIME_ROLES } from "@/lib/landing/content";

export function FullTimeSection() {
  return (
    <section className="py-16 md:py-20 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="font-display text-3xl md:text-4xl font-semibold text-balance">
            Find the best full-time help.
          </h2>
          <p className="text-muted-foreground mt-4 leading-relaxed">
            Long-term placements matched to your household within 48 hours.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-5">
          {FULL_TIME_ROLES.map((role, i) => {
            const variants = ["sweep-card-green", "sweep-card-pink", "sweep-card-teal"];
            return (
              <Link
                key={role.title}
                href={role.href}
                className={`group rounded-3xl border border-border p-8 hover:shadow-md transition-all ${variants[i]}`}
              >
                <h3 className="font-display text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                  {role.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {role.description}
                </p>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
