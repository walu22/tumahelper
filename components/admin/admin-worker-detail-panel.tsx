"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Briefcase,
  Calendar,
  CheckCircle,
  MapPin,
  Shield,
  Star,
  XCircle,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { TrustScoreBadge } from "@/components/trust-score/trust-score-badge";
import { TrustScoreBreakdown } from "@/components/trust-score/trust-score-breakdown";
import { VerificationBadge } from "@/components/verification/verification-badge";
import type { AdminWorkerDetail } from "@/lib/admin/worker-detail-data";
import { formatAdminLabel, workerAvailabilityVariant } from "@/lib/admin/status-badges";
import { formatDate } from "@/lib/utils";
import { toast } from "sonner";

const VERIFICATION_LEVELS = ["none", "bronze", "silver", "gold", "platinum"] as const;

function getNextVerificationLevel(current: string) {
  const index = VERIFICATION_LEVELS.indexOf(current as (typeof VERIFICATION_LEVELS)[number]);
  const safeIndex = index < 0 ? 0 : index;
  const nextIndex = Math.min(safeIndex + 1, VERIFICATION_LEVELS.length - 1);
  const nextLevel = VERIFICATION_LEVELS[nextIndex];
  return nextLevel === "none" ? "bronze" : nextLevel;
}

const EMPTY_TRUST_COMPONENTS = {
  identityVerification: 0,
  jobCompletion: 0,
  customerRating: 0,
  punctuality: 0,
  reliability: 0,
  complaintHistory: 0,
  profileCompleteness: 0,
};

export function AdminWorkerDetailPanel({ worker }: { worker: AdminWorkerDetail }) {
  const router = useRouter();
  const [showReject, setShowReject] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const nextLevel = getNextVerificationLevel(worker.verification_level);
  const atMaxLevel =
    worker.verification_level === "platinum" || nextLevel === worker.verification_level;

  async function handleApprove() {
    if (atMaxLevel) {
      toast.error("Worker is already at the highest verification level");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/admin/workers/${worker.id}/approve`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ verificationLevel: nextLevel }),
      });
      const json = await res.json();

      if (json.success) {
        toast.success(`Worker approved at ${nextLevel} level`);
        router.refresh();
        return;
      }

      toast.error(json.error?.message || json.error || "Failed to approve worker");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleReject() {
    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/admin/workers/${worker.id}/reject`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason: rejectionReason || "Rejected by admin" }),
      });
      const json = await res.json();

      if (json.success) {
        toast.success("Worker verification rejected");
        setShowReject(false);
        setRejectionReason("");
        router.refresh();
        return;
      }

      toast.error(json.error?.message || json.error || "Failed to reject worker");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" className="rounded-full" asChild>
          <Link href="/admin/workers">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div className="min-w-0">
          <p className="text-sm text-muted-foreground">Worker profile</p>
          <h2 className="truncate font-display text-xl font-semibold tracking-tight">
            {worker.full_name}
          </h2>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.7fr)_minmax(280px,1fr)]">
        <div className="space-y-6">
          <Card className="rounded-2xl border-border/70 shadow-sm">
            <CardContent className="p-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-primary/10 text-2xl font-bold text-primary">
                  {worker.full_name.charAt(0)}
                </div>
                <div className="min-w-0 flex-1 space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-lg font-semibold">{worker.full_name}</h3>
                    {worker.is_featured ? <Badge variant="success">Featured</Badge> : null}
                    <Badge variant={workerAvailabilityVariant(worker.availability_status)}>
                      {formatAdminLabel(worker.availability_status)}
                    </Badge>
                  </div>
                  <p className="flex items-center gap-1 text-sm text-muted-foreground">
                    <MapPin className="h-3.5 w-3.5" />
                    {worker.area}, {worker.city}
                  </p>
                  <p className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Briefcase className="h-3.5 w-3.5" />
                    {formatAdminLabel(worker.category)}
                    {worker.subcategory ? ` · ${formatAdminLabel(worker.subcategory)}` : ""}
                    {" · "}
                    {worker.experience_years} years experience
                  </p>
                  <p className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Calendar className="h-3.5 w-3.5" />
                    Joined {formatDate(worker.created_at)}
                  </p>
                </div>
                <VerificationBadge level={worker.verification_level || "none"} size="lg" />
              </div>
              {worker.bio ? (
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{worker.bio}</p>
              ) : null}
            </CardContent>
          </Card>

          <Card className="rounded-2xl border-border/70 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Shield className="h-4 w-4" />
                Verification actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="rounded-xl border border-border/60 bg-muted/30 px-3 py-2 text-sm text-muted-foreground">
                Current status:{" "}
                <span className="font-medium text-foreground">
                  {formatAdminLabel(worker.verification_status)}
                </span>
                {atMaxLevel ? (
                  <span> · Already at platinum level</span>
                ) : (
                  <span>
                    {" "}
                    · Next approval sets level to{" "}
                    <span className="font-medium capitalize text-foreground">{nextLevel}</span>
                  </span>
                )}
              </div>
              <div className="flex flex-col gap-2 sm:flex-row">
                <Button
                  onClick={handleApprove}
                  disabled={isSubmitting || atMaxLevel}
                  className="flex-1"
                >
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Approve to {nextLevel}
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => setShowReject((open) => !open)}
                  disabled={isSubmitting}
                  className="flex-1"
                >
                  <XCircle className="mr-2 h-4 w-4" />
                  Reject
                </Button>
              </div>
              {showReject ? (
                <div className="space-y-2 rounded-xl border border-border/60 p-3">
                  <Input
                    placeholder="Optional rejection note for your records..."
                    value={rejectionReason}
                    onChange={(event) => setRejectionReason(event.target.value)}
                  />
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={handleReject}
                    disabled={isSubmitting}
                  >
                    Confirm reject
                  </Button>
                </div>
              ) : null}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="rounded-2xl border-border/70 shadow-sm">
            <CardContent className="p-6 text-center">
              <TrustScoreBadge score={worker.trust_score} size="lg" />
              <div className="mt-4 text-left">
                <TrustScoreBreakdown
                  components={{
                    ...EMPTY_TRUST_COMPONENTS,
                    ...(worker.trust_score_components ?? {}),
                  }}
                />
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border-border/70 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Performance</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Jobs completed</span>
                <span className="font-medium">{worker.total_jobs_completed}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Reviews</span>
                <span className="font-medium">{worker.total_reviews}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1 text-muted-foreground">
                  <Star className="h-3.5 w-3.5" />
                  Average rating
                </span>
                <span className="font-medium">{worker.average_rating?.toFixed(1) || "0.0"}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Verification</span>
                <Badge variant="secondary">{formatAdminLabel(worker.verification_status)}</Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
