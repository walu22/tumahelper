#!/usr/bin/env node
/**
 * Diagnose a customer booking detail URL locally.
 * Usage: node scripts/check-booking.mjs 51dadd7a-5793-4339-8a04-fad9f802f00c
 */
import { createClient } from "@supabase/supabase-js";
import fs from "fs";

const bookingId = process.argv[2];
if (!bookingId) {
  console.error("Usage: node scripts/check-booking.mjs <booking-id>");
  process.exit(1);
}

function loadEnv() {
  const merged = {};
  for (const file of [".env", ".env.local"]) {
    if (!fs.existsSync(file)) continue;
    for (const line of fs.readFileSync(file, "utf8").split("\n")) {
      if (!line || line.startsWith("#")) continue;
      const idx = line.indexOf("=");
      if (idx === -1) continue;
      merged[line.slice(0, idx).trim()] = line.slice(idx + 1).trim();
    }
  }
  return merged;
}

const pagePath = "app/customer/bookings/[id]/page.tsx";
const hasCodeFix =
  fs.existsSync(pagePath) &&
  fs.readFileSync(pagePath, "utf8").includes("fetchWorkerDisplay");

const env = loadEnv();
const url = env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceKey || url.includes("example") || serviceKey.includes("your-")) {
  console.log("❌ Real Supabase credentials not found in .env.local");
  console.log("   Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY, then rerun.");
  process.exit(1);
}

const supabase = createClient(url, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const demoCustomerId = "f0000000-0000-0000-0000-000000000001";

const { data: booking, error } = await supabase
  .from("bookings")
  .select("id, booking_code, customer_id, worker_id, status, service_date, service_time, location_address")
  .eq("id", bookingId)
  .maybeSingle();

if (error) {
  console.log("❌ Supabase query failed:", error.message);
  process.exit(1);
}

if (!booking) {
  console.log("❌ Booking not found in Supabase for id:", bookingId);
  process.exit(1);
}

console.log("✅ Booking exists in Supabase");
console.log(JSON.stringify(booking, null, 2));

const { data: customer } = await supabase
  .from("users")
  .select("id, full_name, email, phone")
  .eq("id", booking.customer_id)
  .maybeSingle();

console.log("\nCustomer who owns this booking:");
console.log(customer ?? { id: booking.customer_id, note: "user row not found" });

console.log("\n--- Access check ---");
console.log("Demo dev customer id:", demoCustomerId);
console.log(
  booking.customer_id === demoCustomerId
    ? "✅ Matches demo dev customer (client@tumahelper.dev)"
    : "⚠️  Does NOT match demo dev customer. Log in as the owner above"
);

console.log("\n--- Code fix check (local app) ---");
console.log(
  hasCodeFix
    ? "✅ Your local code has the booking detail fix (fetchWorkerDisplay)"
    : "❌ Your local code is still OLD. Run: git pull origin master"
);

const { error: badJoinError } = await supabase
  .from("bookings")
  .select("id, worker:worker_id(full_name, profile_photo_url, phone)")
  .eq("id", bookingId)
  .maybeSingle();

console.log("\n--- Why the page used to 404 (informational) ---");
console.log(
  badJoinError
    ? `ℹ️  The pre-fix page query fails in Supabase: ${badJoinError.message}`
    : "ℹ️  Old worker join query succeeded (unexpected)"
);
console.log("   This line is normal. The script tests the OLD query on purpose.");
console.log("   It does NOT mean your fix failed.");

console.log("\n--- What to do in the browser ---");
if (!hasCodeFix) {
  console.log("1. git pull origin master");
  console.log("2. Delete cache: Remove-Item -Recurse -Force .next   (PowerShell)");
  console.log("3. Restart: npm run dev");
} else {
  console.log("1. git pull origin master  (get latest auth fix too)");
  console.log("2. Delete cache: Remove-Item -Recurse -Force .next   (PowerShell)");
  console.log("3. Restart: npm run dev");
}
console.log("4. Log in at http://localhost:3000/dev-login as customer");
console.log("   OR /login as client@tumahelper.dev (must be user id f0000000-...)");
console.log(`5. Open http://localhost:3000/customer/bookings/${bookingId}`);
console.log("   You should see Booking #" + booking.booking_code);
console.log("\nIf still 404: your browser session user id may not match customer_id above.");
console.log("Use /dev-login → customer, or sign out and sign in again.");
