"use server";

import { redirect } from "next/navigation";
import { AuthError, signIn, signOut } from "@/lib/auth/login";

export async function loginAction(formData: FormData) {
  const email = String(formData.get("email") || "");
  const password = String(formData.get("password") || "");
  const redirectTo = String(formData.get("redirect") || "") || null;

  try {
    const result = await signIn({ email, password, redirect: redirectTo });
    redirect(result.redirect);
  } catch (error) {
    const message = error instanceof AuthError ? error.message : "Login failed";
    const params = new URLSearchParams({ error: message, email });
    if (redirectTo) params.set("redirect", redirectTo);
    redirect(`/login?${params.toString()}`);
  }
}

export async function logoutAction() {
  await signOut();
  redirect("/login");
}
