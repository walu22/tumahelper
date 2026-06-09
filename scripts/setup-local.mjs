#!/usr/bin/env node

import { existsSync, readFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import { spawnSync } from "child_process";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const envPath = join(root, ".env.local");

function loadEnv() {
  if (!existsSync(envPath)) {
    console.error("Missing .env.local. Run: cp .env.local.example .env.local");
    process.exit(1);
  }

  return Object.fromEntries(
    readFileSync(envPath, "utf-8")
      .split("\n")
      .filter((line) => line && !line.startsWith("#"))
      .map((line) => line.split("=", 2).map((part) => part.trim()))
      .filter(([key]) => key)
  );
}

function hasRealSupabase(env) {
  const url = env.NEXT_PUBLIC_SUPABASE_URL ?? "";
  const anon = env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";
  const service = env.SUPABASE_SERVICE_ROLE_KEY ?? "";

  return (
    url &&
    anon &&
    service &&
    !url.includes("placeholder") &&
    !url.includes("your-project") &&
    !anon.includes("placeholder") &&
    !service.includes("placeholder")
  );
}

const env = loadEnv();

console.log("TumaHelper local setup\n");

if (!hasRealSupabase(env)) {
  console.log("Supabase credentials are not configured yet.");
  console.log("Local dev auth bypass is enabled automatically in development.");
  console.log("\nTo connect a real Supabase project:");
  console.log("  1. Copy .env.local.example to .env.local");
  console.log("  2. Add your Supabase URL, anon key, and service role key");
  console.log("  3. Run SQL migrations from supabase/migrations/ in Supabase SQL Editor");
  console.log("  4. Run: npm run setup:auth");
  console.log("\nDev login works now without Supabase:");
  console.log("  http://localhost:3000/login");
  console.log("  admin@tumahelper.dev / dev123");
  console.log("  worker@tumahelper.dev / dev123");
  console.log("  customer@tumahelper.dev / dev123");
  process.exit(0);
}

console.log("Supabase credentials detected. Seeding auth users...\n");

const result = spawnSync("node", [join(root, "scripts/seed-auth-users.mjs")], {
  stdio: "inherit",
  cwd: root,
});

if (result.status !== 0) {
  process.exit(result.status ?? 1);
}

console.log("\nSetup complete. Start the app with: npm run dev");
