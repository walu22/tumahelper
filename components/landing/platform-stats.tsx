import { PLATFORM_STATS } from "@/lib/landing/content";

export function PlatformStats() {
  return (
    <section className="py-14 md:py-16 px-4 sm:px-6 lg:px-8 bg-surface border-b border-border">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
          {PLATFORM_STATS.map((stat) => (
            <div key={stat.label} className="text-center lg:text-left">
              <p className="font-display text-4xl md:text-5xl font-semibold text-foreground tracking-tight">
                {stat.value}
              </p>
              <p className="font-semibold text-foreground mt-2 text-sm">{stat.label}</p>
              <p className="text-xs text-muted-foreground mt-1">{stat.sub}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
