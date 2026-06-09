"use server";

import { redirect } from "next/navigation";
import { AuthError } from "@/lib/auth/login";
import { signUp } from "@/lib/auth/register";
import type { UserRole } from "@/types";

export async function registerAction(formData: FormData) {
  const role = String(formData.get("role") || "") as UserRole;
  const fullName = String(formData.get("fullName") || "");
  const email = String(formData.get("email") || "");
  const password = String(formData.get("password") || "");
  const phoneRaw = String(formData.get("phone") || "").trim();
  const phone = phoneRaw || undefined;

  if (!["customer", "worker", "employer"].includes(role)) {
    redirect("/register?error=Invalid+role");
  }

  try {
    const result = await signUp({
      email,
      password,
      role: role as "customer" | "worker" | "employer",
      fullName,
      phone,
    });
    redirect(result.redirect);
  } catch (error) {
    const message = error instanceof AuthError ? error.message : "Registration failed";
    const params = new URLSearchParams({
      error: message,
      role,
      email,
      name: fullName,
    });
    redirect(`/register?${params.toString()}`);
  }
}
