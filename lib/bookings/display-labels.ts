import type { BookingStatus, PaymentStatus } from "@/types";

export function formatPaymentStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    pending: "Payment due",
    paid: "Proof received",
    confirmed: "Payment confirmed",
    failed: "Payment failed",
    refunded: "Refunded",
  };
  return labels[status] ?? status.replace("_", " ");
}

export function paymentStatusBadgeVariant(
  status: string
): "warning" | "info" | "success" | "destructive" | "secondary" {
  if (status === "confirmed") return "success";
  if (status === "paid") return "info";
  if (status === "failed" || status === "refunded") return "destructive";
  return "warning";
}

export interface BookingNextStep {
  title: string;
  description: string;
  tone: "info" | "action" | "success" | "muted";
}

function workerFirstName(name?: string | null) {
  if (!name) return "Your worker";
  return name.split(" ")[0];
}

function isPaid(status: string) {
  return status === "paid" || status === "confirmed";
}

export function getCustomerBookingNextStep(params: {
  status: BookingStatus;
  paymentStatus: string;
  workerName?: string | null;
  hasReview?: boolean;
}): BookingNextStep | null {
  const worker = workerFirstName(params.workerName);

  if (params.status === "cancelled" || params.status === "declined") {
    return {
      title: "Booking closed",
      description:
        params.status === "declined"
          ? "The worker declined this request. You can book another provider."
          : "This booking was cancelled.",
      tone: "muted",
    };
  }

  if (params.status === "pending") {
    if (!isPaid(params.paymentStatus)) {
      return {
        title: `Waiting for ${worker} to accept`,
        description:
          "Your request was sent. Pay via mobile money and upload proof to secure the booking while you wait.",
        tone: "action",
      };
    }
    return {
      title: `Waiting for ${worker} to accept`,
      description: "We've received your payment proof. You'll be notified as soon as the worker responds.",
      tone: "info",
    };
  }

  if (params.status === "accepted") {
    if (!isPaid(params.paymentStatus)) {
      return {
        title: `${worker} accepted your booking`,
        description: "Complete payment before the visit so everything is confirmed on the day.",
        tone: "action",
      };
    }
    return {
      title: "You're all set",
      description: `${worker} will arrive at the scheduled date and time. Save their contact details below.`,
      tone: "success",
    };
  }

  if (params.status === "in_progress") {
    return {
      title: "Visit in progress",
      description: `${worker} has started the job. You'll be able to review once it's marked complete.`,
      tone: "info",
    };
  }

  if (params.status === "completed") {
    if (!params.hasReview) {
      return {
        title: "Job complete",
        description: `How did ${worker} do? Leave a quick review to help other families in Lusaka.`,
        tone: "action",
      };
    }
    return {
      title: "Thanks for your review",
      description: "This booking is fully complete.",
      tone: "success",
    };
  }

  return null;
}

export function getWorkerBookingNextStep(params: {
  status: BookingStatus;
  paymentStatus: PaymentStatus | string;
  customerName?: string | null;
}): BookingNextStep | null {
  const customer = params.customerName?.split(" ")[0] ?? "the customer";

  if (params.status === "cancelled" || params.status === "declined") {
    return {
      title: "Booking closed",
      description:
        params.status === "declined"
          ? "You declined this request."
          : "This booking was cancelled.",
      tone: "muted",
    };
  }

  if (params.status === "pending") {
    return {
      title: "New booking request",
      description: `Accept or decline ${customer}'s request. Respond quickly to keep your trust score strong.`,
      tone: "action",
    };
  }

  if (params.status === "accepted") {
    return {
      title: "Job confirmed",
      description: `Start the job when you arrive at ${customer}'s home on the scheduled day.`,
      tone: "info",
    };
  }

  if (params.status === "in_progress") {
    return {
      title: "Job in progress",
      description: "Mark the job complete when the visit is finished.",
      tone: "action",
    };
  }

  if (params.status === "completed") {
    const paid = isPaid(params.paymentStatus);
    return {
      title: "Job complete",
      description: paid
        ? "Payment is confirmed. Great work — your profile stats will update."
        : "Waiting for customer payment to be confirmed.",
      tone: paid ? "success" : "info",
    };
  }

  return null;
}
