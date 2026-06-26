import { getAdminSupabaseClient } from "@/lib/admin/supabase";
import {
  ADMIN_PAGE_SIZE,
  buildListResult,
  emptyListResult,
  getListRange,
  parsePageParam,
  type AdminListResult,
} from "@/lib/admin/list-query";

export type AdminBookingRow = {
  id: string;
  booking_code: string;
  service_date: string;
  service_time: string | null;
  amount: number;
  status: string;
  payment_status: string;
  location_address: string | null;
  created_at: string;
};

export type AdminWorkerRow = {
  id: string;
  full_name: string;
  category: string;
  area: string;
  city: string;
  verification_level: string | null;
  verification_status: string;
  trust_score: number;
  availability_status: string;
  created_at: string;
};

export type AdminPaymentRow = {
  id: string;
  payment_code: string;
  booking_id: string | null;
  payment_type: string;
  amount: number;
  platform_fee: number;
  status: string;
  created_at: string;
  payer?: { phone?: string } | null;
  payee?: { phone?: string } | null;
};

export type AdminDocumentRow = {
  id: string;
  document_type: string;
  status: string;
  created_at: string;
  file_url: string | null;
  worker?: { full_name?: string } | Array<{ full_name?: string }> | null;
};

export type AdminDisputeRow = {
  id: string;
  dispute_type: string;
  description: string;
  status: string;
  resolution_action: string | null;
  created_at: string;
};

export type AdminAuditRow = {
  id: string;
  action: string;
  entity_type: string;
  entity_id: string;
  created_at: string;
  admin?: { phone?: string } | Array<{ phone?: string }> | null;
};

export type AdminBookingsQuery = {
  q?: string;
  status?: string;
  payment_status?: string;
  page?: string;
};

export type AdminWorkersQuery = {
  q?: string;
  verification_status?: string;
  page?: string;
};

export type AdminPaymentsQuery = {
  q?: string;
  status?: string;
  page?: string;
};

export type AdminDocumentsQuery = {
  status?: string;
  page?: string;
};

export type AdminDisputesQuery = {
  status?: string;
  page?: string;
};

export type AdminAuditQuery = {
  q?: string;
  action?: string;
  entity_type?: string;
  page?: string;
};

function sanitizeSearch(value?: string) {
  return value?.trim() ?? "";
}

export async function getAdminBookingsList(
  query: AdminBookingsQuery = {}
): Promise<AdminListResult<AdminBookingRow>> {
  const supabase = getAdminSupabaseClient();
  const page = parsePageParam(query.page);
  if (!supabase) return emptyListResult(page);

  try {
    const { from, to } = getListRange(page);
    let request = supabase
      .from("bookings")
      .select(
        "id, booking_code, service_date, service_time, amount, status, payment_status, location_address, created_at",
        { count: "exact" }
      )
      .order("created_at", { ascending: false })
      .range(from, to);

    const search = sanitizeSearch(query.q);
    if (search) request = request.ilike("booking_code", `%${search}%`);
    if (query.status) request = request.eq("status", query.status);
    if (query.payment_status) request = request.eq("payment_status", query.payment_status);

    const { data, count, error } = await request;
    if (error) return emptyListResult(page);

    return buildListResult((data ?? []) as AdminBookingRow[], count ?? 0, page);
  } catch {
    return emptyListResult(page);
  }
}

export async function getAdminWorkersList(
  query: AdminWorkersQuery = {}
): Promise<AdminListResult<AdminWorkerRow>> {
  const supabase = getAdminSupabaseClient();
  const page = parsePageParam(query.page);
  if (!supabase) return emptyListResult(page);

  try {
    const { from, to } = getListRange(page);
    let request = supabase
      .from("worker_profiles")
      .select(
        "id, full_name, category, area, city, verification_level, verification_status, trust_score, availability_status, created_at",
        { count: "exact" }
      )
      .order("created_at", { ascending: false })
      .range(from, to);

    const search = sanitizeSearch(query.q);
    if (search) request = request.ilike("full_name", `%${search}%`);
    if (query.verification_status) {
      request = request.eq("verification_status", query.verification_status);
    }

    const { data, count, error } = await request;
    if (error) return emptyListResult(page);

    return buildListResult((data ?? []) as AdminWorkerRow[], count ?? 0, page);
  } catch {
    return emptyListResult(page);
  }
}

export async function getAdminPaymentsList(
  query: AdminPaymentsQuery = {}
): Promise<AdminListResult<AdminPaymentRow>> {
  const supabase = getAdminSupabaseClient();
  const page = parsePageParam(query.page);
  if (!supabase) return emptyListResult(page);

  try {
    const { from, to } = getListRange(page);
    let request = supabase
      .from("payments")
      .select(
        "id, payment_code, booking_id, payment_type, amount, platform_fee, status, created_at, payer:payer_id(phone), payee:payee_id(phone)",
        { count: "exact" }
      )
      .order("created_at", { ascending: false })
      .range(from, to);

    const search = sanitizeSearch(query.q);
    if (search) request = request.ilike("payment_code", `%${search}%`);
    if (query.status) request = request.eq("status", query.status);

    const { data, count, error } = await request;
    if (error) return emptyListResult(page);

    return buildListResult((data ?? []) as AdminPaymentRow[], count ?? 0, page);
  } catch {
    return emptyListResult(page);
  }
}

export async function getAdminDocumentsList(
  query: AdminDocumentsQuery = {}
): Promise<AdminListResult<AdminDocumentRow>> {
  const supabase = getAdminSupabaseClient();
  const page = parsePageParam(query.page);
  if (!supabase) return emptyListResult(page);

  try {
    const { from, to } = getListRange(page);
    let request = supabase
      .from("verification_documents")
      .select("id, document_type, status, created_at, file_url, worker:worker_id(full_name)", {
        count: "exact",
      })
      .order("created_at", { ascending: false })
      .range(from, to);

    if (query.status) request = request.eq("status", query.status);

    const { data, count, error } = await request;
    if (error) return emptyListResult(page);

    return buildListResult((data ?? []) as AdminDocumentRow[], count ?? 0, page);
  } catch {
    return emptyListResult(page);
  }
}

export async function getAdminDisputesList(
  query: AdminDisputesQuery = {}
): Promise<AdminListResult<AdminDisputeRow>> {
  const supabase = getAdminSupabaseClient();
  const page = parsePageParam(query.page);
  if (!supabase) return emptyListResult(page);

  try {
    const { from, to } = getListRange(page);
    let request = supabase
      .from("disputes")
      .select("id, dispute_type, description, status, resolution_action, created_at", {
        count: "exact",
      })
      .order("created_at", { ascending: false })
      .range(from, to);

    if (query.status) request = request.eq("status", query.status);

    const { data, count, error } = await request;
    if (error) return emptyListResult(page);

    return buildListResult((data ?? []) as AdminDisputeRow[], count ?? 0, page);
  } catch {
    return emptyListResult(page);
  }
}

export async function getAdminAuditList(
  query: AdminAuditQuery = {}
): Promise<AdminListResult<AdminAuditRow>> {
  const supabase = getAdminSupabaseClient();
  const page = parsePageParam(query.page);
  if (!supabase) return emptyListResult(page);

  try {
    const { from, to } = getListRange(page);
    let request = supabase
      .from("audit_logs")
      .select("id, action, entity_type, entity_id, created_at, admin:admin_id(phone)", {
        count: "exact",
      })
      .order("created_at", { ascending: false })
      .range(from, to);

    const search = sanitizeSearch(query.q);
    if (search) {
      request = request.or(
        `action.ilike.%${search}%,entity_type.ilike.%${search}%,entity_id.ilike.%${search}%`
      );
    }
    if (query.action) request = request.eq("action", query.action);
    if (query.entity_type) request = request.eq("entity_type", query.entity_type);

    const { data, count, error } = await request;
    if (error) return emptyListResult(page);

    return buildListResult((data ?? []) as AdminAuditRow[], count ?? 0, page);
  } catch {
    return emptyListResult(page);
  }
}
