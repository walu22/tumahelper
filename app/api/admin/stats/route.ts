import { NextRequest } from "next/server";
import { getAdminClient } from "@/lib/supabase";
import { requireAdmin, successResponse, errorResponse } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    await requireAdmin();
    const adminClient = getAdminClient();

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

    const [
      { count: totalWorkers },
      { count: verifiedWorkers },
      { count: activeCustomers },
      { count: totalBookings },
      { count: activeBookings },
      { count: pendingVerifications },
      { count: pendingPayments },
      { count: openDisputes },
    ] = await Promise.all([
      adminClient.from("worker_profiles").select("*", { count: "exact", head: true }),
      adminClient.from("worker_profiles").select("*", { count: "exact", head: true }).gte("verification_level", "silver"),
      adminClient.from("users").select("*", { count: "exact", head: true }).eq("role", "customer").eq("status", "active"),
      adminClient.from("bookings").select("*", { count: "exact", head: true }),
      adminClient.from("bookings").select("*", { count: "exact", head: true }).in("status", ["pending", "accepted", "in_progress"]),
      adminClient.from("verification_documents").select("*", { count: "exact", head: true }).eq("status", "submitted"),
      adminClient.from("bookings").select("*", { count: "exact", head: true }).eq("payment_status", "paid"),
      adminClient.from("disputes").select("*", { count: "exact", head: true }).eq("status", "open"),
    ]);

    const { data: monthlyPayments } = await adminClient
      .from("payments")
      .select("amount, platform_fee")
      .gte("created_at", startOfMonth)
      .eq("status", "confirmed");

    const revenue = (monthlyPayments || []).reduce((sum, p) => sum + p.platform_fee, 0);

    const { data: trustScores } = await adminClient
      .from("worker_profiles")
      .select("trust_score");

    const avgTrustScore = trustScores && trustScores.length > 0
      ? trustScores.reduce((sum, w) => sum + w.trust_score, 0) / trustScores.length
      : 0;

    return successResponse({
      totalWorkers: totalWorkers || 0,
      verifiedWorkers: verifiedWorkers || 0,
      activeCustomers: activeCustomers || 0,
      totalBookings: totalBookings || 0,
      activeBookings: activeBookings || 0,
      pendingVerifications: pendingVerifications || 0,
      pendingPayments: pendingPayments || 0,
      openDisputes: openDisputes || 0,
      revenueThisMonth: revenue,
      averageTrustScore: Math.round(avgTrustScore),
    });
  } catch (error) {
    return errorResponse("INTERNAL_ERROR", "Failed to fetch dashboard", 500);
  }
}
