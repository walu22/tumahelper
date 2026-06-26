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

type BookingRow = {
  id: string;
  booking_code: string;
  customer_id: string | null;
  worker_id: string | null;
  category_id: string | null;
  status: string;
  payment_status: string;
  service_date: string;
  service_time: string;
  location_address: string;
  description: string | null;
  amount: number;
  platform_fee: number;
  worker_earnings: number;
  payment_method?: string | null;
  payment_proof_url?: string | null;
  customer_rating?: number | null;
  customer_review?: string | null;
  cancellation_reason?: string | null;
  created_at: string;
  updated_at: string;
  service_details?: Record<string, unknown> | null;
};

const BOOKING_SELECT_FALLBACK =
  "id, booking_code, customer_id, worker_id, category_id, status, payment_status, service_date, service_time, location_address, description, amount, platform_fee, worker_earnings, payment_method, payment_proof_url, customer_rating, customer_review, cancellation_reason, created_at, updated_at";

function isUuid(value: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    value
  );
}

async function fetchBookingRow(
  supabase: NonNullable<ReturnType<typeof getAdminSupabaseClient>>,
  id: string
): Promise<BookingRow | null> {
  const attempts: string[] = [`${BOOKING_SELECT_FALLBACK}, service_details`, BOOKING_SELECT_FALLBACK, "*"];

  for (const columns of attempts) {
    let request = supabase.from("bookings").select(columns);

    if (isUuid(id)) {
      request = request.eq("id", id);
    } else {
      request = request.eq("booking_code", id);
    }

    const { data, error } = await request.maybeSingle();
    if (!error && data && typeof data === "object" && "id" in data) {
      return data as BookingRow;
    }
  }

  return null;
}

async function fetchCustomer(
  supabase: NonNullable<ReturnType<typeof getAdminSupabaseClient>>,
  customerId: string
) {
  const withName = await supabase
    .from("users")
    .select("id, phone, full_name")
    .eq("id", customerId)
    .maybeSingle();

  if (!withName.error && withName.data) {
    return {
      id: withName.data.id,
      phone: withName.data.phone ?? null,
      full_name: withName.data.full_name ?? null,
    };
  }

  const basic = await supabase
    .from("users")
    .select("id, phone")
    .eq("id", customerId)
    .maybeSingle();

  if (basic.data) {
    return {
      id: basic.data.id,
      phone: basic.data.phone ?? null,
      full_name: null,
    };
  }

  return null;
}

export async function getAdminBookingDetail(id: string): Promise<AdminBookingDetail | null> {
  const supabase = getAdminSupabaseClient();
  if (!supabase || !id?.trim()) return null;

  const booking = await fetchBookingRow(supabase, id.trim());
  if (!booking) return null;

  const bookingId = booking.id;

  const [customer, workerDisplay, categoryResult, paymentsResult, disputesResult] =
    await Promise.all([
      booking.customer_id ? fetchCustomer(supabase, booking.customer_id) : Promise.resolve(null),
      fetchWorkerDisplay(supabase, booking.worker_id),
      booking.category_id
        ? supabase
            .from("service_categories")
            .select("name, slug")
            .eq("id", booking.category_id)
            .maybeSingle()
        : Promise.resolve({ data: null, error: null }),
      supabase
        .from("payments")
        .select("id, payment_code, amount, status, created_at")
        .eq("booking_id", bookingId)
        .order("created_at", { ascending: false }),
      supabase
        .from("disputes")
        .select("id, dispute_type, status, created_at")
        .eq("booking_id", bookingId)
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
    payment_method: booking.payment_method ?? null,
    payment_proof_url: booking.payment_proof_url ?? null,
    customer_rating: booking.customer_rating ?? null,
    customer_review: booking.customer_review ?? null,
    cancellation_reason: booking.cancellation_reason ?? null,
    created_at: booking.created_at,
    updated_at: booking.updated_at,
    service_details: booking.service_details ?? null,
    customer,
    worker: workerDisplay,
    category: categoryResult.data,
    payments: (paymentsResult.data ?? []) as AdminBookingPayment[],
    disputes: (disputesResult.data ?? []) as AdminBookingDispute[],
  };
}
