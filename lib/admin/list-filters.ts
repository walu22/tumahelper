import type { AdminListFilter } from "@/components/admin/admin-list-toolbar";
import { formatAdminLabel } from "@/lib/admin/status-badges";

function options(values: string[]) {
  return values.map((value) => ({
    value,
    label: formatAdminLabel(value),
  }));
}

export const BOOKING_STATUS_FILTER: AdminListFilter = {
  param: "status",
  label: "Status",
  options: options([
    "pending",
    "accepted",
    "declined",
    "in_progress",
    "completed",
    "cancelled",
    "disputed",
    "no_show",
  ]),
};

export const BOOKING_PAYMENT_STATUS_FILTER: AdminListFilter = {
  param: "payment_status",
  label: "Payment",
  options: options(["pending", "paid", "confirmed", "refunded"]),
};

export const WORKER_VERIFICATION_STATUS_FILTER: AdminListFilter = {
  param: "verification_status",
  label: "Verification",
  options: options(["pending", "approved", "rejected"]),
};

export const PAYMENT_STATUS_FILTER: AdminListFilter = {
  param: "status",
  label: "Status",
  options: options(["pending", "paid", "confirmed", "failed", "refunded"]),
};

export const DOCUMENT_STATUS_FILTER: AdminListFilter = {
  param: "status",
  label: "Status",
  options: options(["submitted", "under_review", "approved", "rejected"]),
};

export const DISPUTE_STATUS_FILTER: AdminListFilter = {
  param: "status",
  label: "Status",
  options: options(["open", "under_review", "resolved", "rejected", "escalated"]),
};

export const AUDIT_ENTITY_TYPE_FILTER: AdminListFilter = {
  param: "entity_type",
  label: "Entity",
  options: options(["worker", "booking", "payment", "document", "dispute", "user"]),
};
