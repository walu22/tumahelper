import { getAdminClient } from "@/lib/supabase";

export const DEV_EMAIL_ROLE_MAP: Record<string, string> = {
  "admin@tumahelper.dev": "admin",
  "worker@tumahelper.dev": "worker",
  "customer@tumahelper.dev": "customer",
  "owner@tumahelper.dev": "admin",
  "provider@tumahelper.dev": "worker",
  "client@tumahelper.dev": "customer",
};

export const ROLE_REDIRECTS: Record<string, string> = {
  customer: "/customer/dashboard",
  worker: "/worker/dashboard",
  employer: "/employer/dashboard",
  admin: "/admin",
};

export function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

export function getDevRole(email: string) {
  return DEV_EMAIL_ROLE_MAP[normalizeEmail(email)] ?? null;
}

export function getDevEmail(role: string, phone?: string) {
  if (phone) {
    return `${phone.replace("+", "")}@tumahelper.dev`;
  }
  return `${role}@tumahelper.dev`;
}

export async function findUserByEmail(email: string) {
  const adminClient = getAdminClient();
  const { data } = await adminClient
    .from("users")
    .select("id, role, email, phone")
    .eq("email", normalizeEmail(email))
    .maybeSingle();

  return data;
}

export async function findDevUser(role: string) {
  const adminClient = getAdminClient();
  const devEmail = getDevEmail(role);

  const { data: byEmail } = await adminClient
    .from("users")
    .select("id, role, email, phone")
    .eq("email", devEmail)
    .maybeSingle();

  if (byEmail) return byEmail;

  const { data: byRole } = await adminClient
    .from("users")
    .select("id, role, email, phone")
    .eq("role", role)
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle();

  return byRole;
}

export async function findDevUserByPhone(phone: string) {
  const adminClient = getAdminClient();
  const { data } = await adminClient
    .from("users")
    .select("id, role, email, phone")
    .eq("phone", phone)
    .maybeSingle();

  return data;
}

export async function ensureDevAuthUser(params: {
  email: string;
  password: string;
  role?: string;
  phone?: string;
}) {
  const adminClient = getAdminClient();
  const email = normalizeEmail(params.email);

  const user =
    (params.phone ? await findDevUserByPhone(params.phone) : null) ??
    (await findUserByEmail(email)) ??
    (params.role ? await findDevUser(params.role) : null);

  if (!user) {
    throw new Error(`No account found for ${email}`);
  }

  const authPayload = {
    email,
    password: params.password,
    email_confirm: true,
    ...(params.phone || user.phone
      ? { phone: params.phone || user.phone, phone_confirm: true }
      : {}),
  };

  const { data: existing } = await adminClient.auth.admin.getUserById(user.id);

  if (!existing?.user) {
    const { error } = await adminClient.auth.admin.createUser({
      id: user.id,
      ...authPayload,
    });
    if (error) throw new Error(error.message);
  } else {
    const { error } = await adminClient.auth.admin.updateUserById(user.id, authPayload);
    if (error) throw new Error(error.message);
  }

  await adminClient.from("users").update({ email }).eq("id", user.id);

  return user;
}
