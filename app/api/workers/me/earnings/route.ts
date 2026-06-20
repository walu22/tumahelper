import { NextResponse } from "next/server";
import { createAuthenticatedRouteHandlerClient } from "@/lib/supabase-server";
import { requireUser } from "@/lib/auth";
import { summarizeWorkerEarnings } from "@/lib/workers/earnings";

export async function GET() {
  const supabase = createAuthenticatedRouteHandlerClient();

  try {
    const user = await requireUser();

    if (user.role !== "worker") {
      return NextResponse.json({ success: false, error: "Workers only" }, { status: 403 });
    }

    const { data: bookings, error } = await supabase
      .from("bookings")
      .select("worker_earnings, amount, platform_fee, service_date, payment_status, status")
      .eq("worker_id", user.id)
      .order("service_date", { ascending: false });

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    const summary = summarizeWorkerEarnings(bookings ?? []);

    return NextResponse.json({ success: true, data: summary });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Unauthorized" },
      { status: 401 }
    );
  }
}
