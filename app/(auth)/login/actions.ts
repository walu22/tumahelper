"use server";

import { redirect } from "next/navigation";
import { authenticateUser } from "@/lib/authenticate-user";
import { isDevAuthBypassEnabled } from "@/lib/dev-auth-bypass";

export async function loginAction(formData: FormData) {
  const email = String(formData.get("email") || "");
  const password = String(formData.get("password") || "");
  const redirectTo = String(formData.get("redirect") || "") || null;

  const result = await authenticateUser({ email, password, redirect: redirectTo });

  if (!result.ok) {
    const params = new URLSearchParams({
      error: result.error,
      email,
    });
    if (redirectTo) params.set("redirect", redirectTo);
    redirect(`/login?${params.toString()}`);
  }

  redirect(result.redirect);
}

export async function quickDevLoginAction(formData: FormData) {
  if (!isDevAuthBypassEnabled()) {
    redirect("/login?error=Dev+login+is+not+enabled");
  }

  const email = String(formData.get("email") || "");
  const redirectTo = String(formData.get("redirect") || "") || null;

  const result = await authenticateUser({
    email,
    password: "dev123",
    redirect: redirectTo,
  });

  if (!result.ok) {
    redirect(`/login?error=${encodeURIComponent(result.error)}`);
  }

  redirect(result.redirect);
}
