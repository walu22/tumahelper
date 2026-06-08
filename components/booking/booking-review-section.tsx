"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { StarRating } from "@/components/StarRating";

interface BookingReviewSectionProps {
  bookingId: string;
  workerName: string;
  existingRating: number | null;
  existingReview: string | null;
}

export function BookingReviewSection({
  bookingId,
  workerName,
  existingRating,
  existingReview,
}: BookingReviewSectionProps) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  if (existingRating || submitted) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Your Review</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <StarRating value={existingRating || rating} readOnly size="sm" />
          {(existingReview || comment) && (
            <p className="text-sm text-muted-foreground">{existingReview || comment}</p>
          )}
        </CardContent>
      </Card>
    );
  }

  const handleSubmit = async () => {
    if (rating === 0) return;
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`/api/bookings/${bookingId}/review`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          overallRating: rating,
          comment: comment || undefined,
        }),
      });

      const data = await res.json();

      if (!data.success) {
        setError(data.error?.message || "Failed to submit review");
        return;
      }

      setSubmitted(true);
      window.location.reload();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Rate {workerName}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-sm font-medium mb-2">Overall Rating</p>
          <StarRating value={rating} onChange={setRating} size="md" />
        </div>
        <div>
          <p className="text-sm font-medium mb-2">Comment (optional)</p>
          <Textarea
            placeholder="Share your experience..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={3}
          />
        </div>
        {error && <p className="text-sm text-destructive">{error}</p>}
        <Button onClick={handleSubmit} disabled={loading || rating === 0}>
          {loading ? "Submitting..." : "Submit Review"}
        </Button>
      </CardContent>
    </Card>
  );
}
