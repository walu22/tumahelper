export function bookingStatusVariant(status: string) {
  if (status === "completed") return "success" as const;
  if (status === "cancelled" || status === "declined" || status === "no_show") {
    return "destructive" as const;
  }
  if (status === "pending") return "warning" as const;
  return "info" as const;
}

export function paymentStatusVariant(status: string) {
  if (status === "confirmed" || status === "paid") return "success" as const;
  if (status === "refunded") return "destructive" as const;
  return "warning" as const;
}

export function workerAvailabilityVariant(status: string) {
  if (status === "available") return "success" as const;
  if (status === "busy") return "warning" as const;
  return "secondary" as const;
}

export function paymentRecordStatusVariant(status: string) {
  if (status === "confirmed") return "success" as const;
  if (status === "paid") return "warning" as const;
  if (status === "failed" || status === "refunded") return "destructive" as const;
  return "info" as const;
}

export function documentStatusVariant(status: string) {
  if (status === "approved") return "success" as const;
  if (status === "rejected") return "destructive" as const;
  return "warning" as const;
}

export function disputeStatusVariant(status: string) {
  if (status === "resolved") return "success" as const;
  if (status === "rejected" || status === "escalated") return "destructive" as const;
  if (status === "under_review") return "info" as const;
  return "warning" as const;
}

export function formatAdminLabel(value: string) {
  return value.replaceAll("_", " ");
}
