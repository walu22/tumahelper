import { getAdminSupabaseClient } from "@/lib/admin/supabase";

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

export async function getAdminBookingsList(): Promise<AdminBookingRow[]> {
  const supabase = getAdminSupabaseClient();
  if (!supabase) return [];

  try {
    const { data } = await supabase
      .from("bookings")
      .select(
        "id, booking_code, service_date, service_time, amount, status, payment_status, location_address, created_at"
      )
      .order("created_at", { ascending: false });

    return (data ?? []) as AdminBookingRow[];
  } catch {
    return [];
  }
}

export async function getAdminWorkersList(): Promise<AdminWorkerRow[]> {
  const supabase = getAdminSupabaseClient();
  if (!supabase) return [];

  try {
    const { data } = await supabase
      .from("worker_profiles")
      .select(
        "id, full_name, category, area, city, verification_level, verification_status, trust_score, availability_status, created_at"
      )
      .order("created_at", { ascending: false });

    return (data ?? []) as AdminWorkerRow[];
  } catch {
    return [];
  }
}

export async function getAdminPaymentsList(): Promise<AdminPaymentRow[]> {
  const supabase = getAdminSupabaseClient();
  if (!supabase) return [];

  try {
    const { data } = await supabase
      .from("payments")
      .select(
        "id, payment_code, booking_id, payment_type, amount, platform_fee, status, created_at, payer:payer_id(phone), payee:payee_id(phone)"
      )
      .order("created_at", { ascending: false });

    return (data ?? []) as AdminPaymentRow[];
  } catch {
    return [];
  }
}

export async function getAdminDocumentsList(): Promise<AdminDocumentRow[]> {
  const supabase = getAdminSupabaseClient();
  if (!supabase) return [];

  try {
    const { data } = await supabase
      .from("verification_documents")
      .select("id, document_type, status, created_at, file_url, worker:worker_id(full_name)")
      .order("created_at", { ascending: false });

    return (data ?? []) as AdminDocumentRow[];
  } catch {
    return [];
  }
}

export async function getAdminDisputesList(): Promise<AdminDisputeRow[]> {
  const supabase = getAdminSupabaseClient();
  if (!supabase) return [];

  try {
    const { data } = await supabase
      .from("disputes")
      .select("id, dispute_type, description, status, resolution_action, created_at")
      .order("created_at", { ascending: false });

    return (data ?? []) as AdminDisputeRow[];
  } catch {
    return [];
  }
}
