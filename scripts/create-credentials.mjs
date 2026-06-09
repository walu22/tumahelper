#!/usr/bin/env node
/**
 * Creates fresh login credentials for the three main roles.
 * Run: node scripts/create-credentials.mjs
 */

import { createClient } from "@supabase/supabase-js";
import { randomBytes } from "crypto";
import { readFileSync, existsSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const envPath = join(__dirname, "..", ".env.local");

if (!existsSync(envPath)) {
  console.error(".env.local not found.");
  process.exit(1);
}

const env = Object.fromEntries(
  readFileSync(envPath, "utf-8")
    .split("\n")
    .filter((line) => line && !line.startsWith("#"))
    .map((line) => line.split("=", 2).map((part) => part.trim()))
    .filter(([key]) => key)
);

const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

function makePassword(role) {
  const token = randomBytes(4).toString("hex");
  return `Tuma-${role}-${token}`;
}

const ACCOUNTS = [
  {
    userId: "00000000-0000-0000-0000-000000000001",
    email: "owner@tumahelper.dev",
    role: "admin",
    full_name: "Platform Owner",
    phone: "+260970000001",
  },
  {
    userId: "a0000000-0000-0000-0000-000000000001",
    email: "provider@tumahelper.dev",
    role: "worker",
    full_name: "Sarah Mulenga",
    phone: "+260961111111",
  },
  {
    userId: "f0000000-0000-0000-0000-000000000001",
    email: "client@tumahelper.dev",
    role: "customer",
    full_name: "Demo Customer",
    phone: "+260976666666",
  },
];

async function upsertAuthUser(account, password) {
  const payload = {
    email: account.email,
    password,
    email_confirm: true,
    phone: account.phone,
    phone_confirm: true,
    user_metadata: { role: account.role, full_name: account.full_name },
  };

  const { data: existing, error: lookupError } = await supabase.auth.admin.getUserById(account.userId);

  if (lookupError && !lookupError.message.toLowerCase().includes("not found")) {
    throw new Error(`${account.email}: ${lookupError.message}`);
  }

  if (existing?.user) {
    const { error } = await supabase.auth.admin.updateUserById(account.userId, payload);
    if (error) throw new Error(`${account.email} update failed: ${error.message}`);
  } else {
    const { error } = await supabase.auth.admin.createUser({
      id: account.userId,
      ...payload,
    });
    if (error) throw new Error(`${account.email} create failed: ${error.message}`);
  }

  await supabase
    .from("users")
    .update({ email: account.email, full_name: account.full_name })
    .eq("id", account.userId);
}

async function verifyLogin(email, password) {
  const anon = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
  const { error } = await anon.auth.signInWithPassword({ email, password });
  return !error;
}

console.log("Creating new TumaHelper credentials...\n");

const credentials = [];

for (const account of ACCOUNTS) {
  const password = makePassword(account.role);
  await upsertAuthUser(account, password);
  const ok = await verifyLogin(account.email, password);
  credentials.push({ ...account, password, verified: ok });
  console.log(`${ok ? "✓" : "✗"} ${account.role.padEnd(8)} ${account.email}`);
}

console.log("\n--- Save these credentials ---\n");
for (const item of credentials) {
  console.log(`${item.role.toUpperCase()}`);
  console.log(`  Email:    ${item.email}`);
  console.log(`  Password: ${item.password}`);
  console.log(`  Login:    http://localhost:3000/login\n`);
}

console.log("Dashboard redirects:");
console.log("  admin    → /admin");
console.log("  worker   → /worker/dashboard");
console.log("  customer → /customer/dashboard");
