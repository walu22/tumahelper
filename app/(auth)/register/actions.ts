"use server";

import { redirect } from "next/navigation";
import { AuthError } from "@/lib/auth/login";
import { isNextRedirectError } from "@/lib/auth/redirect-error";
import { signUp } from "@/lib/auth/register";
import type { UserRole } from "@/types";

export async function registerAction(formData: FormData) {
  const role = String(formData.get("role") || "") as UserRole;
  const fullName = String(formData.get("fullName") || "");
  const email = String(formData.get("email") || "");
  const password = String(formData.get("password") || "");
  const phone = String(formData.get("phone") || "").trim();

  if (!["customer", "worker", "employer"].includes(role)) {
    redirect("/register?error=Invalid+role");
  }

  let result;
  try {
    result = await signUp({
      email,
      password,
      role: role as "customer" | "worker" | "employer",
      fullName,
      phone,
    });
  } catch (error) {
    if (isNextRedirectError(error)) throw error;

    const message =
      error instanceof AuthError
        ? error.message
        : error instanceof Error
          ? error.message
          : "Registration failed";
    const params = new URLSearchParams({
      error: message,
      role,
      email,
      name: fullName,
    });
    redirect(`/register?${params.toString()}`);
  }

  redirect(result.redirect);
}
