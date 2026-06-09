import { NextRequest } from "next/server";
import { errorResponse, successResponse } from "@/lib/auth";
import { registerSchema } from "@/lib/validations";
import { AuthError } from "@/lib/auth/login";
import { signUp } from "@/lib/auth/register";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, role, fullName, phone } = registerSchema.parse(body);

    const result = await signUp({
      email,
      password,
      role,
      fullName,
      phone,
    });

    return successResponse({
      userId: result.userId,
      redirect: result.redirect,
    });
  } catch (error) {
    if (error instanceof Error && error.name === "ZodError") {
      return errorResponse("VALIDATION_ERROR", "Invalid input", 400);
    }
    if (error instanceof AuthError) {
      const status = error.message.includes("already") ? 409 : 400;
      return errorResponse("REGISTER_FAILED", error.message, status);
    }
    return errorResponse("INTERNAL_ERROR", "Registration failed", 500);
  }
}
