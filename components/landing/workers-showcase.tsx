import Link from "next/link";
import { ArrowUpRight, Star } from "lucide-react";
import { WorkerCard } from "@/components/worker-card";
import type { PublicWorkerProfile } from "@/types";

const PLACEHOLDER_WORKERS = [
  { name: "Sarah Mulenga", role: "Housekeeper", area: "Kabulonga", score: 92, rating: 4.9 },
  { name: "Mary Phiri", role: "Nanny", area: "Woodlands", score: 88, rating: 4.8 },
  { name: "Grace Banda", role: "Cleaner", area: "Roma", score: 85, rating: 4.7 },
];

export function WorkersShowcase({ workers }: { workers: PublicWorkerProfile[] | null }) {
  const hasLive = workers && workers.length > 0;

  return (
    <section className="py-24 md:py-32 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-14">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-accent mb-4">
              Top rated
            </p>
            <h2 className="font-display text-4xl md:text-5xl font-semibold">
              Meet your helpers.
            </h2>
          </div>
          <Link
            href="/workers"
            className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline"
          >
            Browse all profiles
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>

        {hasLive ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {workers!.slice(0, 4).map((worker) => (
              <WorkerCard key={worker.id} worker={worker} />
            ))}
          </div>
        ) : (
          <div className="grid sm:grid-cols-3 gap-5">
            {PLACEHOLDER_WORKERS.map((w) => (
              <Link
                key={w.name}
                href="/workers"
                className="group rounded-3xl border border-border bg-white p-6 hover:shadow-lg hover:border-primary/20 transition-all"
              >
                <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center font-display text-xl font-semibold text-primary mb-4">
                  {w.name.charAt(0)}
                </div>
                <h3 className="font-display text-xl font-semibold group-hover:text-primary transition-colors">
                  {w.name}
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {w.role} · {w.area}
                </p>
                <div className="flex items-center gap-3 mt-4 text-sm">
                  <span className="font-semibold text-primary">{w.score} trust</span>
                  <span className="flex items-center gap-1 text-muted-foreground">
                    <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                    {w.rating}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
