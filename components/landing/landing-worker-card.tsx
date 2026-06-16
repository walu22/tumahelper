import Image from "next/image";
import Link from "next/link";
import { ArrowRight, MapPin, Shield, Star } from "lucide-react";
import type { PublicWorkerProfile } from "@/types";

function categoryLabel(category: PublicWorkerProfile["category"]) {
  return category === "nanny" ? "Nanny" : "House cleaning";
}

function verificationPillLabel(level: string): string | null {
  switch (level) {
    case "bronze":
      return "Phone verified";
    case "silver":
      return "NRC verified";
    case "gold":
      return "Gold verified";
    case "platinum":
      return "Police cleared";
    default:
      return null;
  }
}

function availabilityLabel(status: PublicWorkerProfile["availability_status"]) {
  return status.replace(/_/g, " ");
}

export function LandingWorkerCard({
  worker,
  featured = false,
}: {
  worker: PublicWorkerProfile;
  featured?: boolean;
}) {
  const hasRating = worker.average_rating > 0;
  const verificationLabel = verificationPillLabel(worker.verification_level);
  const isAvailable = worker.availability_status === "available";

  return (
    <Link
      href={`/workers/${worker.id}`}
      className={`group flex h-full flex-col rounded-3xl border bg-white p-5 transition-all hover:border-primary/30 hover:shadow-md ${
        featured ? "border-primary/25 ring-2 ring-primary/10" : "border-border"
      }`}
    >
      <div className="flex items-start gap-4">
        <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-2xl bg-primary/10">
          {worker.profile_photo_url ? (
            <Image
              src={worker.profile_photo_url}
              alt={worker.full_name}
              fill
              className="object-cover"
              sizes="64px"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center font-display text-xl font-semibold text-primary">
              {worker.full_name.charAt(0)}
            </div>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-display text-lg font-semibold leading-tight group-hover:text-primary transition-colors truncate">
              {worker.full_name}
            </h3>
            {featured && (
              <span className="shrink-0 rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-primary">
                Featured
              </span>
            )}
          </div>
          <p className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
            <MapPin className="h-3.5 w-3.5 shrink-0" />
            <span className="truncate">
              {worker.area}, Lusaka
            </span>
          </p>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <span className="inline-flex items-center rounded-full bg-surface px-3 py-1 text-xs font-semibold text-foreground">
          {categoryLabel(worker.category)}
        </span>

        {hasRating ? (
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
            <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
            {worker.average_rating.toFixed(1)}
            {worker.total_reviews > 0 && (
              <span className="font-medium text-amber-600/80">
                · {worker.total_reviews} review{worker.total_reviews === 1 ? "" : "s"}
              </span>
            )}
          </span>
        ) : verificationLabel ? (
          <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
            <Shield className="h-3 w-3" />
            {verificationLabel}
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
            <Shield className="h-3 w-3" />
            NRC verified
          </span>
        )}
      </div>

      <div className="mt-auto flex items-center justify-between pt-4 text-sm">
        <span
          className={`inline-flex items-center gap-1.5 font-medium capitalize ${
            isAvailable ? "text-emerald-600" : "text-muted-foreground"
          }`}
        >
          <span
            className={`h-2 w-2 rounded-full ${
              isAvailable ? "bg-emerald-500" : "bg-muted-foreground/40"
            }`}
          />
          {isAvailable ? "Available now" : availabilityLabel(worker.availability_status)}
        </span>
        <span className="inline-flex items-center gap-1 font-semibold text-primary opacity-0 transition-opacity group-hover:opacity-100">
          View profile
          <ArrowRight className="h-3.5 w-3.5" />
        </span>
      </div>
    </Link>
  );
}
