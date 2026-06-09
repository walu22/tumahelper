import { getAdminClient } from "@/lib/supabase";
import { normalizeEmail } from "@/lib/auth/config";

export async function findUserByEmail(email: string) {
  const admin = getAdminClient();
  const { data } = await admin
    .from("users")
    .select("id, role, email, phone")
    .eq("email", normalizeEmail(email))
    .maybeSingle();

  return data;
}

export async function ensureAuthUser(params: {
  email: string;
  password: string;
  role?: string;
  phone?: string;
}) {
  const admin = getAdminClient();
  const email = normalizeEmail(params.email);

  const user =
    (params.phone
      ? (
          await admin
            .from("users")
            .select("id, role, email, phone")
            .eq("phone", params.phone)
            .maybeSingle()
        ).data
      : null) ?? (await findUserByEmail(email));

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

  const { data: existing } = await admin.auth.admin.getUserById(user.id);

  if (!existing?.user) {
    const { error } = await admin.auth.admin.createUser({ id: user.id, ...authPayload });
    if (error) throw new Error(error.message);
  } else {
    const { error } = await admin.auth.admin.updateUserById(user.id, authPayload);
    if (error) throw new Error(error.message);
  }

  await admin.from("users").update({ email }).eq("id", user.id);
  return user;
}
