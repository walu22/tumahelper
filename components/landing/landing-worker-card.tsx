import Image from "next/image";
import Link from "next/link";
import { ArrowRight, MapPin, Shield, Star } from "lucide-react";
import {
  buildWorkerSpotlightBookUrl,
  getWorkerFirstName,
  getWorkerSpotlightLocationRole,
  getWorkerSpotlightProofLine,
  getWorkerStartingPriceLabel,
  pickSpotlightReviewQuote,
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
  reviewQuote,
}: {
  worker: PublicWorkerProfile;
  featured?: boolean;
  variant?: "directory" | "spotlight";
  reviewQuote?: string | null;
}) {
  const hasRating = worker.average_rating > 0;
  const verificationLabel = verificationPillLabel(worker.verification_level);
  const isAvailable = worker.availability_status === "available";
  const isSpotlight = variant === "spotlight";
  const href = isSpotlight ? buildWorkerSpotlightBookUrl(worker) : `/workers/${worker.id}`;

  if (isSpotlight) {
    const firstName = getWorkerFirstName(worker.full_name);
    const locationRole = getWorkerSpotlightLocationRole(worker);
    const proofLine = getWorkerSpotlightProofLine(worker);
    const quote = pickSpotlightReviewQuote(worker.bio, reviewQuote);

    return (
      <Link
        href={href}
        className="group flex h-full flex-col rounded-2xl border border-border bg-card p-5 transition-all hover:border-primary/40 hover:shadow-md"
      >
        <div className="flex items-start gap-4">
          <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-2xl border border-border bg-primary/10">
            {worker.profile_photo_url ? (
              <Image
                src={worker.profile_photo_url}
                alt={worker.full_name}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="96px"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center font-display text-2xl font-semibold text-primary">
                {worker.full_name.charAt(0)}
              </div>
            )}
          </div>

          <div className="min-w-0 flex-1">
            <h3 className="font-display text-lg font-bold leading-tight transition-colors group-hover:text-primary">
              {worker.full_name}
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">{locationRole}</p>
            {proofLine && (
              <p className="mt-2 text-sm font-medium text-foreground">{proofLine}</p>
            )}
          </div>
        </div>

        {quote && (
          <blockquote className="mt-4 text-sm italic leading-relaxed text-muted-foreground">
            &ldquo;{quote}&rdquo;
          </blockquote>
        )}

        <p className="mt-auto inline-flex items-center gap-1 pt-4 text-sm font-semibold text-primary">
          Book {firstName}
          <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
        </p>
      </Link>
    );
  }

  const photoSize = "h-16 w-16";
  const imageSizes = "64px";
  const startingPrice = getWorkerStartingPriceLabel(worker);

  return (
    <Link
      href={href}
      className={`group flex h-full flex-col rounded-3xl border bg-card p-5 transition-all hover:border-primary/40 hover:shadow-lg ${
        featured ? "border-primary/30 ring-4 ring-primary/5" : "border-border"
      }`}
    >
      <div className="flex items-start gap-4">
        <div
          className={`relative ${photoSize} shrink-0 overflow-hidden rounded-2xl border border-primary/5 bg-primary/10 shadow-inner`}
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
            <h3 className="truncate font-display text-lg font-bold leading-tight transition-colors group-hover:text-primary">
              {worker.full_name}
            </h3>
            {featured && (
              <span className="shrink-0 rounded-full bg-primary/10 px-2.5 py-0.5 text-[9px] font-extrabold uppercase tracking-widest text-primary">
                Featured
              </span>
            )}
          </div>
          <p className="mt-1 flex items-center gap-1 text-sm font-medium text-muted-foreground">
            <MapPin className="h-3.5 w-3.5 shrink-0 text-primary/70" />
            <span className="truncate">{worker.area}, Lusaka</span>
          </p>
          {startingPrice && (
            <p className="mt-1 text-sm font-semibold text-primary">{startingPrice}</p>
          )}
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <span className="inline-flex items-center rounded-full border border-border/50 bg-surface px-3 py-1 text-xs font-bold text-foreground">
          {categoryLabel(worker.category)}
        </span>

        <span className="inline-flex items-center rounded-full border border-border/50 bg-surface px-3 py-1 text-xs font-bold text-foreground">
          {worker.experience_years} yrs exp
        </span>

        {hasRating ? (
          <span className="inline-flex items-center gap-1 rounded-full border border-amber-100 bg-amber-50 px-3 py-1 text-xs font-bold text-amber-700">
            <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
            {worker.average_rating.toFixed(1)}
            {worker.total_reviews > 0 && (
              <span className="font-semibold text-amber-600/80">({worker.total_reviews})</span>
            )}
          </span>
        ) : verificationLabel ? (
          <span className="inline-flex items-center gap-1 rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700">
            <Shield className="h-3 w-3 text-blue-500" />
            {verificationLabel}
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700">
            <Shield className="h-3 w-3 text-blue-500" />
            NRC verified
          </span>
        )}
      </div>

      {worker.bio && (
        <p className="mt-4 line-clamp-2 text-sm leading-relaxed text-muted-foreground transition-colors group-hover:text-foreground/80">
          {worker.bio}
        </p>
      )}

      <div className="mt-4 flex items-center justify-between border-t border-border/50 pt-3 text-xs font-semibold text-muted-foreground">
        <span>Expected salary</span>
        <span className="text-sm font-extrabold text-primary">
          {formatSalaryRange(worker.expected_salary_min, worker.expected_salary_max)}
        </span>
      </div>

      <div className="mt-auto flex items-center justify-between pt-4 text-sm">
        <span
          className={`inline-flex items-center gap-1.5 font-semibold capitalize ${
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
        <span className="inline-flex items-center gap-1 text-xs font-bold text-primary transition-colors group-hover:text-primary-hover">
          View profile
          <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
        </span>
      </div>
    </Link>
  );
}
