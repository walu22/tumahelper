import Image from "next/image";
import Link from "next/link";
import { Star, ArrowRight, User, ShieldCheck } from "lucide-react";
import type { PublicWorkerProfile } from "@/types";

function categoryLabel(category: PublicWorkerProfile["category"]) {
  return category === "nanny" ? "Nanny" : "Cleaning";
}

function WorkerListRow({ worker }: { worker: PublicWorkerProfile }) {
  return (
    <Link
      href={`/workers/${worker.id}`}
      className="group flex items-center gap-4 rounded-2xl border border-border bg-white px-4 py-3.5 hover:border-primary/30 hover:bg-primary/[0.02] transition-colors"
    >
      <div className="relative h-11 w-11 shrink-0 rounded-full bg-muted overflow-hidden">
        {worker.profile_photo_url ? (
          <Image
            src={worker.profile_photo_url}
            alt={worker.full_name}
            fill
            className="object-cover"
            sizes="44px"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-sm font-semibold text-muted-foreground">
            {worker.full_name.charAt(0)}
          </div>
        )}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
          <p className="font-semibold truncate group-hover:text-primary transition-colors">
            {worker.full_name}
          </p>
          <span className="text-xs font-medium text-muted-foreground">
            {worker.area}, Lusaka
          </span>
        </div>
        <p className="text-sm text-muted-foreground mt-0.5">
          {categoryLabel(worker.category)}
          {worker.experience_years > 0 && ` · ${worker.experience_years} yrs exp`}
          {worker.trust_score > 0 && ` · Trust ${worker.trust_score}`}
        </p>
      </div>

      <div className="shrink-0 text-right">
        {worker.average_rating > 0 ? (
          <span className="inline-flex items-center gap-1 text-sm font-semibold">
            <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
            {worker.average_rating.toFixed(1)}
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 text-xs font-medium text-primary">
            <ShieldCheck className="h-3.5 w-3.5" />
            Verified
          </span>
        )}
        <p className="text-xs text-emerald-600 font-medium mt-0.5 capitalize">
          {worker.availability_status.replace("_", " ")}
        </p>
      </div>
    </Link>
  );
}

export function SweepStarsSection({
  workers,
  availableCount,
}: {
  workers: PublicWorkerProfile[] | null;
  availableCount?: number | null;
}) {
  const listed = workers?.slice(0, 5) ?? [];
  const count = availableCount ?? listed.length;

  if (listed.length === 0) {
    return (
      <section className="py-16 md:py-20 px-4 sm:px-6 lg:px-8 bg-surface">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="font-display text-3xl font-bold mb-4">
            Verified workers joining every week
          </h2>
          <p className="text-muted-foreground leading-relaxed mb-8">
            We&apos;re building Lusaka&apos;s most trusted domestic worker network.
            Book a service and we&apos;ll match you with someone verified, or browse
            profiles as more helpers join.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/customer/book"
              className="inline-flex items-center gap-2 rounded-full bg-primary px-8 py-3.5 text-sm font-semibold text-primary-foreground hover:opacity-95"
            >
              Book a service
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/workers"
              className="inline-flex items-center gap-2 rounded-full border border-border px-8 py-3.5 text-sm font-semibold hover:bg-white transition-colors"
            >
              Browse workers
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 md:py-20 px-4 sm:px-6 lg:px-8 bg-surface">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-balance">
            Verified helpers in Lusaka
          </h2>
          <p className="text-muted-foreground mt-4 leading-relaxed">
            Book by service and choose your worker in the next step, or browse profiles
            first if you prefer.
          </p>
        </div>

        {count > 0 && (
          <div className="flex flex-wrap items-center justify-center gap-6 mb-8 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-2">
              <User className="h-4 w-4 text-primary" />
              <strong className="text-foreground font-semibold">{count}</strong> available now
            </span>
            <span className="inline-flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-primary" />
              NRC verified profiles
            </span>
            {listed.some((w) => w.average_rating > 0) && (
              <span className="inline-flex items-center gap-2">
                <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                Rated by families
              </span>
            )}
          </div>
        )}

        <ul className="space-y-2 mb-8">
          {listed.map((worker) => (
            <li key={worker.id}>
              <WorkerListRow worker={worker} />
            </li>
          ))}
        </ul>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/customer/book"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-8 py-3.5 text-sm font-semibold text-primary-foreground hover:opacity-95 w-full sm:w-auto"
          >
            Book a service
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/workers"
            className="inline-flex items-center justify-center gap-2 text-sm font-semibold text-primary hover:underline"
          >
            View all workers
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
