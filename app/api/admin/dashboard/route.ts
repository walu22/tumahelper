import { NextRequest } from "next/server";
import { getSupabaseServer } from "@/lib/supabase";
import { requireAdmin, successResponse, errorResponse } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    await requireAdmin();
    const supabase = getSupabaseServer();

    const { count: totalUsers } = await supabase
      .from("users")
      .select("*", { count: "exact", head: true });

    const { count: totalWorkers } = await supabase
      .from("worker_profiles")
      .select("*", { count: "exact", head: true });

    const { count: totalBookings } = await supabase
      .from("bookings")
      .select("*", { count: "exact", head: true });

    const { count: pendingDocuments } = await supabase
      .from("verification_documents")
      .select("*", { count: "exact", head: true })
      .eq("status", "submitted");

    const { count: disputes } = await supabase
      .from("disputes")
      .select("*", { count: "exact", head: true })
      .neq("status", "resolved");

    const { count: pendingPayments } = await supabase
      .from("bookings")
      .select("*", { count: "exact", head: true })
      .eq("payment_status", "paid");

    const { data: recentBookings } = await supabase
      .from("bookings")
      .select("*, customer:customer_id(phone), worker:worker_id(phone)")
      .order("created_at", { ascending: false })
      .limit(5);

    return successResponse({
      stats: {
        total_users: totalUsers,
        total_workers: totalWorkers,
        total_bookings: totalBookings,
        pending_documents: pendingDocuments,
        active_disputes: disputes,
        pending_payments: pendingPayments,
      },
      recentBookings,
    });
  } catch (error: any) {
    return errorResponse("FETCH_ERROR", error.message, 500);
  }
}
