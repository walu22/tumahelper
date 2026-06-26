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
