import Image from "next/image";
import Link from "next/link";
import { ArrowRight, MapPin, Shield, Star } from "lucide-react";
import {
  buildWorkerSpotlightBookUrl,
  getWorkerSkillLabels,
  getWorkerSpotlightStatusLine,
  getWorkerStartingPriceLabel,
} from "@/lib/landing/worker-card";
import type { PublicWorkerProfile } from "@/types";

function categoryLabel(category: PublicWorkerProfile["category"]) {
  return category === "nanny" ? "Nanny" : "House cleaner";
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

function formatSalaryRange(min?: number | null, max?: number | null) {
  if (!min) return "Salary negotiable";
  const minVal = min / 100;
  if (!max || min === max) {
    return `ZMW ${minVal.toLocaleString()}/mo`;
  }
  const maxVal = max / 100;
  return `ZMW ${minVal.toLocaleString()} - ${maxVal.toLocaleString()}/mo`;
}

export function LandingWorkerCard({
  worker,
  featured = false,
  variant = "directory",
}: {
  worker: PublicWorkerProfile;
  featured?: boolean;
  variant?: "directory" | "spotlight";
}) {
  const hasRating = worker.average_rating > 0;
  const verificationLabel = verificationPillLabel(worker.verification_level);
  const isAvailable = worker.availability_status === "available";
  const isSpotlight = variant === "spotlight";
  const skillLabels = getWorkerSkillLabels(worker, isSpotlight ? 4 : 0);
  const photoSize = isSpotlight ? "h-20 w-20" : "h-16 w-16";
  const imageSizes = isSpotlight ? "80px" : "64px";
  const startingPrice = isSpotlight ? getWorkerStartingPriceLabel(worker) : null;
  const spotlightStatus = isSpotlight ? getWorkerSpotlightStatusLine(worker) : null;
  const href = isSpotlight ? buildWorkerSpotlightBookUrl(worker) : `/workers/${worker.id}`;

  return (
    <Link
      href={href}
      className={`group flex h-full flex-col rounded-3xl border bg-card transition-all hover:border-primary/40 hover:shadow-lg ${
        isSpotlight ? "p-6 md:p-7" : "p-5"
      } ${featured ? "border-primary/30 ring-4 ring-primary/5" : "border-border"}`}
    >
      <div className="flex items-start gap-4">
        <div
          className={`relative ${photoSize} shrink-0 overflow-hidden rounded-2xl bg-primary/10 border border-primary/5 shadow-inner`}
        >
          {worker.profile_photo_url ? (
            <Image
              src={worker.profile_photo_url}
              alt={worker.full_name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes={imageSizes}
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center font-display text-xl font-semibold text-primary">
              {worker.full_name.charAt(0)}
            </div>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <h3
              className={`font-display font-bold leading-tight group-hover:text-primary transition-colors truncate ${
                isSpotlight ? "text-xl" : "text-lg"
              }`}
            >
              {worker.full_name}
            </h3>
            {featured && (
              <span className="shrink-0 rounded-full bg-primary/10 px-2.5 py-0.5 text-[9px] font-extrabold uppercase tracking-widest text-primary">
                Featured
              </span>
            )}
          </div>
          <p className="mt-1 flex items-center gap-1 text-sm text-muted-foreground font-medium">
            <MapPin className="h-3.5 w-3.5 shrink-0 text-primary/70" />
            <span className="truncate">{worker.area}, Lusaka</span>
          </p>
          {isSpotlight && spotlightStatus && (
            <p className="mt-2 text-sm font-semibold text-foreground">{spotlightStatus}</p>
          )}
          {isSpotlight && startingPrice && (
            <p className="mt-1 text-sm font-semibold text-primary">{startingPrice}</p>
          )}
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2 items-center">
        {isSpotlight ? (
          skillLabels.map((label) => (
            <span
              key={label}
              className="inline-flex items-center rounded-full bg-surface px-3 py-1 text-xs font-semibold text-foreground border border-border/50"
            >
              {label}
            </span>
          ))
        ) : (
          <span className="inline-flex items-center rounded-full bg-surface px-3 py-1 text-xs font-bold text-foreground border border-border/50">
            {categoryLabel(worker.category)}
          </span>
        )}

        <span className="inline-flex items-center rounded-full bg-primary/5 px-3 py-1 text-xs font-bold text-primary border border-primary/10">
          {worker.experience_years} yrs exp
        </span>

        {hasRating ? (
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-3 py-1 text-xs font-bold text-amber-700 border border-amber-100">
            <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
            {worker.average_rating.toFixed(1)}
            {worker.total_reviews > 0 && (
              <span className="font-semibold text-amber-600/80">({worker.total_reviews})</span>
            )}
          </span>
        ) : verificationLabel ? (
          <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700 border border-blue-100">
            <Shield className="h-3 w-3 text-blue-500" />
            {verificationLabel}
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700 border border-blue-100">
            <Shield className="h-3 w-3 text-blue-500" />
            NRC verified
          </span>
        )}
      </div>

      {worker.bio && (
        <p
          className={`mt-4 text-muted-foreground text-sm leading-relaxed group-hover:text-foreground/80 transition-colors ${
            isSpotlight ? "line-clamp-1" : "line-clamp-2"
          }`}
        >
          {worker.bio}
        </p>
      )}

      {!isSpotlight && (
        <div className="mt-4 pt-3 border-t border-border/50 flex items-center justify-between text-xs text-muted-foreground font-semibold">
          <span>Expected salary</span>
          <span className="text-foreground font-extrabold text-sm text-primary">
            {formatSalaryRange(worker.expected_salary_min, worker.expected_salary_max)}
          </span>
        </div>
      )}

      <div className="mt-auto flex items-center justify-between pt-4 text-sm">
        <span
          className={`inline-flex items-center gap-1.5 font-semibold capitalize ${
            isAvailable ? "text-emerald-600" : "text-muted-foreground"
          }`}
        >
          <span
            className={`h-2 w-2 rounded-full ${
              isAvailable ? "bg-emerald-500 animate-pulse" : "bg-muted-foreground/40"
            }`}
          />
          {isAvailable ? "Available now" : availabilityLabel(worker.availability_status)}
        </span>
        <span className="inline-flex items-center gap-1 text-xs font-bold text-primary group-hover:text-primary-hover transition-colors">
          {isSpotlight ? "Book now" : "View profile"}
          <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
        </span>
      </div>
    </Link>
  );
}
