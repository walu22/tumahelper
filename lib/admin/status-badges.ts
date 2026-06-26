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

export function formatAdminLabel(value: string) {
  return value.replaceAll("_", " ");
}
