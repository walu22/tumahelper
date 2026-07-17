import { NextRequest } from "next/server";
import { getAdminClient } from "@/lib/supabase";
import { createAuthenticatedRouteHandlerClient } from "@/lib/supabase-server";
import { requireAuth, requireRole, successResponse, errorResponse } from "@/lib/auth";
import { bookingSchema } from "@/lib/validations";
import { generateBookingCode, calculatePlatformFee, calculateWorkerEarnings } from "@/lib/utils";

export async function POST(request: NextRequest) {
  try {
    const user = await requireRole("customer");
    const body = await request.json();
    const validated = bookingSchema.parse(body);

    const adminClient = getAdminClient();
    const adminReview =
      validated.requiresAdminReview ||
      validated.serviceDetails?.requiresAdminReview === true;

    if (!adminReview) {
      if (!validated.workerId) {
        return errorResponse("WORKER_REQUIRED", "Worker is required for this booking", 400);
      }

      const { data: worker } = await adminClient
        .from("worker_profiles")
        .select("user_id, availability_status, verification_level")
        .eq("user_id", validated.workerId)
        .single();

      if (!worker) {
        return errorResponse("WORKER_NOT_FOUND", "Worker not found", 404);
      }

      if (worker.availability_status !== "available") {
        return errorResponse("WORKER_UNAVAILABLE", "Worker is not available", 400);
      }

      const { data: category } = await adminClient
        .from("service_categories")
        .select("requires_verification")
        .eq("id", validated.categoryId)
        .single();

      const verificationLevels = ["none", "bronze", "silver", "gold", "platinum"];
      const workerLevel = verificationLevels.indexOf(worker.verification_level);
      const requiredLevel = verificationLevels.indexOf(category?.requires_verification || "bronze");

      if (workerLevel < requiredLevel) {
        return errorResponse(
          "INSUFFICIENT_VERIFICATION",
          "Worker does not meet minimum verification",
          400
        );
      }
    }

    const platformFee = calculatePlatformFee(validated.amount);
    const workerEarnings = calculateWorkerEarnings(validated.amount);

    const { data: booking, error } = await adminClient
      .from("bookings")
      .insert({
        booking_code: generateBookingCode(),
        customer_id: user.id,
        worker_id: validated.workerId ?? null,
        category_id: validated.categoryId,
        status: "pending",
        service_date: validated.serviceDate,
        service_time: validated.serviceTime,
        location_address: validated.locationAddress,
        location_lat: validated.locationLat,
        location_lng: validated.locationLng,
        description: validated.description,
        service_details: validated.serviceDetails ?? null,
        amount: validated.amount,
        platform_fee: platformFee,
        worker_earnings: workerEarnings,
      })
      .select()
      .single();

    if (error) {
      return errorResponse("CREATE_FAILED", error.message, 500);
    }

    if (validated.workerId) {
      await adminClient.from("notifications").insert({
        user_id: validated.workerId,
        type: "booking_request",
        title: "New Booking Request",
        message: `You have a new booking request for ${validated.serviceDate}`,
        data: { bookingId: booking.id },
      });
    }

    if (adminReview) {
      const { data: admins } = await adminClient.from("users").select("id").eq("role", "admin");
      if (admins?.length) {
        await adminClient.from("notifications").insert(
          admins.map((admin) => ({
            user_id: admin.id,
            type: "booking_review",
            title: "Specialist booking needs review",
            message: `A plumbing request needs admin review for ${validated.serviceDate}.`,
            data: { bookingId: booking.id },
          }))
        );
      }
    }

    return successResponse(booking);
  } catch (error) {
    if (error instanceof Error && error.name === "ZodError") {
      return errorResponse("VALIDATION_ERROR", "Invalid booking data", 400);
    }
    if (error instanceof Error && error.message === "Unauthorized") {
      return errorResponse("UNAUTHORIZED", "Please sign in to book", 401);
    }
    if (error instanceof Error && error.message === "Forbidden") {
      return errorResponse("FORBIDDEN", "Only customer accounts can create bookings", 403);
    }
    return errorResponse("INTERNAL_ERROR", "Failed to create booking", 500);
  }
}

export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth();
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");

    const supabase = createAuthenticatedRouteHandlerClient();
    let query = supabase.from("bookings").select(`
      *,
      worker:worker_id(full_name, profile_photo_url),
      customer:customer_id(full_name),
      category:category_id(name)
    `);

    if (user.role === "customer") {
      query = query.eq("customer_id", user.id);
    } else if (user.role === "worker") {
      query = query.eq("worker_id", user.id);
    } else if (user.role !== "admin") {
      return errorResponse("FORBIDDEN", "Insufficient permissions", 403);
    }

    if (status) query = query.eq("status", status);

    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const { data, error, count } = await query
      .order("created_at", { ascending: false })
      .range(from, to);

    if (error) {
      return errorResponse("FETCH_FAILED", error.message, 500);
    }

    return successResponse(data || [], {
      page,
      per_page: limit,
      total: count || 0,
      total_pages: Math.ceil((count || 0) / limit),
    });
   } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return errorResponse("UNAUTHORIZED", "Not authenticated", 401);
    }
    return errorResponse("INTERNAL_ERROR", "Failed to fetch bookings", 500);
  }
