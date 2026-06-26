import { getAdminSupabaseClient } from "@/lib/admin/supabase";
import { fetchWorkerDisplay } from "@/lib/bookings/worker-display";

export type AdminBookingPayment = {
  id: string;
  payment_code: string;
  amount: number;
  status: string;
  created_at: string;
};

export type AdminBookingDispute = {
  id: string;
  dispute_type: string;
  status: string;
  created_at: string;
};

export type AdminBookingDetail = {
  id: string;
  booking_code: string;
  status: string;
  payment_status: string;
  service_date: string;
  service_time: string;
  location_address: string;
  description: string | null;
  amount: number;
  platform_fee: number;
  worker_earnings: number;
  payment_method: string | null;
  payment_proof_url: string | null;
  customer_rating: number | null;
  customer_review: string | null;
  cancellation_reason: string | null;
  created_at: string;
  updated_at: string;
  service_details: Record<string, unknown> | null;
  customer: {
    id: string;
    full_name: string | null;
    phone: string | null;
  } | null;
  worker: {
    profile_id: string | null;
    full_name: string | null;
    phone: string | null;
    availability_status: string | null;
  } | null;
  category: {
    name: string;
    slug: string;
  } | null;
  payments: AdminBookingPayment[];
  disputes: AdminBookingDispute[];
};

export async function getAdminBookingDetail(id: string): Promise<AdminBookingDetail | null> {
  const supabase = getAdminSupabaseClient();
  if (!supabase) return null;

  try {
    const { data: booking } = await supabase
      .from("bookings")
      .select(
        "id, booking_code, customer_id, worker_id, category_id, status, payment_status, service_date, service_time, location_address, description, amount, platform_fee, worker_earnings, payment_method, payment_proof_url, customer_rating, customer_review, cancellation_reason, created_at, updated_at, service_details"
      )
      .eq("id", id)
      .maybeSingle();

    if (!booking) return null;

    const [customerResult, workerDisplay, categoryResult, paymentsResult, disputesResult] =
      await Promise.all([
        booking.customer_id
          ? supabase
              .from("users")
              .select("id, full_name, phone")
              .eq("id", booking.customer_id)
              .maybeSingle()
          : Promise.resolve({ data: null }),
        fetchWorkerDisplay(supabase, booking.worker_id),
        booking.category_id
          ? supabase
              .from("service_categories")
              .select("name, slug")
              .eq("id", booking.category_id)
              .maybeSingle()
          : Promise.resolve({ data: null }),
        supabase
          .from("payments")
          .select("id, payment_code, amount, status, created_at")
          .eq("booking_id", id)
          .order("created_at", { ascending: false }),
        supabase
          .from("disputes")
          .select("id, dispute_type, status, created_at")
          .eq("booking_id", id)
          .order("created_at", { ascending: false }),
      ]);

    return {
      id: booking.id,
      booking_code: booking.booking_code,
      status: booking.status,
      payment_status: booking.payment_status,
      service_date: booking.service_date,
      service_time: booking.service_time,
      location_address: booking.location_address,
      description: booking.description,
      amount: booking.amount,
      platform_fee: booking.platform_fee,
      worker_earnings: booking.worker_earnings,
      payment_method: booking.payment_method,
      payment_proof_url: booking.payment_proof_url,
      customer_rating: booking.customer_rating,
      customer_review: booking.customer_review,
      cancellation_reason: booking.cancellation_reason,
      created_at: booking.created_at,
      updated_at: booking.updated_at,
      service_details: booking.service_details as Record<string, unknown> | null,
      customer: customerResult.data,
      worker: workerDisplay,
      category: categoryResult.data,
      payments: (paymentsResult.data ?? []) as AdminBookingPayment[],
      disputes: (disputesResult.data ?? []) as AdminBookingDispute[],
    };
  } catch {
    return null;
  }
}
