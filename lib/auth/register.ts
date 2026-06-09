import { randomUUID } from "crypto";
import { getRouteHandlerClient, getAdminClient } from "@/lib/supabase";
import { phoneSchema } from "@/lib/validations";
import { isDevBypassEnabled } from "./config";
import { AuthError } from "./login";
import { setDevSessionCookie } from "./session";
import type { UserRole } from "@/types";

export interface SignUpParams {
  email: string;
  password: string;
  role: Exclude<UserRole, "admin">;
  fullName: string;
  phone?: string;
}

export interface SignUpResult {
  redirect: string;
  userId: string;
}

async function allocatePhone(
  admin: ReturnType<typeof getAdminClient>,
  provided?: string
): Promise<string> {
  if (provided) {
    const { data: existing } = await admin
      .from("users")
      .select("id")
      .eq("phone", provided)
      .maybeSingle();
    if (existing) {
      throw new AuthError("This phone number is already registered");
    }
    return provided;
  }

  for (let attempt = 0; attempt < 8; attempt++) {
    const suffix = String(Math.floor(1000000 + Math.random() * 9000000));
    const phone = `+26090${suffix}`;
    const { data: existing } = await admin
      .from("users")
      .select("id")
      .eq("phone", phone)
      .maybeSingle();
    if (!existing) return phone;
  }

  throw new AuthError("Could not create account. Please try again.");
}

async function createWorkerStub(
  admin: ReturnType<typeof getAdminClient>,
  userId: string,
  fullName: string
) {
  const { error } = await admin.from("worker_profiles").insert({
    user_id: userId,
    full_name: fullName,
    city: "Lusaka",
    area: "Unknown",
    category: "nanny",
    verification_level: "none",
    verification_status: "not_submitted",
  });

  if (error) {
    throw new AuthError(error.message || "Failed to create worker profile");
  }
}

async function insertUserProfile(
  admin: ReturnType<typeof getAdminClient>,
  params: {
    id: string;
    email: string;
    phone: string;
    role: Exclude<UserRole, "admin">;
    fullName: string;
    phoneVerified: boolean;
  }
) {
  const { error } = await admin.from("users").insert({
    id: params.id,
    email: params.email,
    phone: params.phone,
    role: params.role,
    full_name: params.fullName,
    status: "active",
    phone_verified: params.phoneVerified,
    email_verified: true,
  });

  if (error) {
    if (error.message.includes("duplicate") || error.message.includes("unique")) {
      throw new AuthError("An account with this email or phone already exists");
    }
    throw new AuthError(error.message || "Failed to create account");
  }
}

export async function signUp(params: SignUpParams): Promise<SignUpResult> {
  const email = params.email.trim().toLowerCase();
  const fullName = params.fullName.trim();
  const password = params.password;

  if (!email || !password || !fullName) {
    throw new AuthError("All fields are required");
  }

  if (password.length < 8) {
    throw new AuthError("Password must be at least 8 characters");
  }

  let normalizedPhone: string | undefined;
  if (params.phone?.trim()) {
    try {
      normalizedPhone = phoneSchema.parse(params.phone.trim());
    } catch {
      throw new AuthError("Invalid phone number. Use format +26097XXXXXXX");
    }
  }

  const admin = getAdminClient();

  const { data: existingEmail } = await admin
    .from("users")
    .select("id")
    .eq("email", email)
    .maybeSingle();

  if (existingEmail) {
    throw new AuthError("An account with this email already exists");
  }

  const phone = await allocatePhone(admin, normalizedPhone);

  if (isDevBypassEnabled()) {
    const id = randomUUID();

    await insertUserProfile(admin, {
      id,
      email,
      phone,
      role: params.role,
      fullName,
      phoneVerified: Boolean(normalizedPhone),
    });

    if (params.role === "worker") {
      await createWorkerStub(admin, id, fullName);
    }

    setDevSessionCookie({
      id,
      role: params.role,
      email,
      phone,
      full_name: fullName,
    });

    return { redirect: `/onboarding/${params.role}`, userId: id };
  }

  const { data: authData, error: authError } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { role: params.role, full_name: fullName },
  });

  if (authError || !authData.user) {
    const message = authError?.message || "Failed to create account";
    if (message.toLowerCase().includes("already")) {
      throw new AuthError("An account with this email already exists");
    }
    throw new AuthError(message);
  }

  const userId = authData.user.id;

  try {
    await insertUserProfile(admin, {
      id: userId,
      email,
      phone,
      role: params.role,
      fullName,
      phoneVerified: Boolean(normalizedPhone),
    });

    if (params.role === "worker") {
      await createWorkerStub(admin, userId, fullName);
    }
  } catch (error) {
    await admin.auth.admin.deleteUser(userId);
    throw error;
  }

  const supabase = getRouteHandlerClient();
  const { error: signInError } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (signInError) {
    throw new AuthError(
      "Account created but sign-in failed. Please log in with your new credentials."
    );
  }

  return { redirect: `/onboarding/${params.role}`, userId };
}
