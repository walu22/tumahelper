import type { BookingStatus } from "@/types";

/** Allowed booking status transitions (from → to[]). */
export const BOOKING_STATUS_TRANSITIONS: Record<BookingStatus, BookingStatus[]> = {
  pending: ["accepted", "declined", "cancelled"],
  accepted: ["in_progress", "cancelled"],
  in_progress: ["completed", "cancelled"],
  completed: [],
  cancelled: [],
  declined: [],
  disputed: [],
  no_show: [],
};

const WORKER_ACTION_STATUSES: BookingStatus[] = [
  "accepted",
  "declined",
  "in_progress",
  "completed",
];

export function canTransitionBookingStatus(
  from: BookingStatus,
  to: BookingStatus
): boolean {
  return (BOOKING_STATUS_TRANSITIONS[from] ?? []).includes(to);
}

export function workerMaySetStatus(status: BookingStatus): boolean {
  return WORKER_ACTION_STATUSES.includes(status);
}

export function customerMaySetStatus(status: BookingStatus): boolean {
  return status === "cancelled";
}

export function assertBookingStatusTransition(
  from: BookingStatus,
  to: BookingStatus,
  actor: "customer" | "worker" | "admin"
): { ok: true } | { ok: false; code: string; message: string } {
  if (!canTransitionBookingStatus(from, to)) {
    return {
      ok: false,
      code: "INVALID_TRANSITION",
      message: `Cannot transition from ${from} to ${to}`,
    };
  }

  if (actor === "admin") {
    return { ok: true };
  }

  if (actor === "worker" && !workerMaySetStatus(to)) {
    return {
      ok: false,
      code: "FORBIDDEN",
      message: "Worker cannot perform this action",
    };
  }

  if (actor === "customer" && !customerMaySetStatus(to)) {
    return {
      ok: false,
      code: "FORBIDDEN",
      message: "Customer can only cancel bookings",
    };
  }

  return { ok: true };
}
