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
    : "⚠️  Does NOT match demo dev customer — log in as the owner above"
);

const { error: badJoinError } = await supabase
  .from("bookings")
  .select("id, worker:worker_id(full_name, profile_photo_url, phone)")
  .eq("id", bookingId)
  .maybeSingle();

console.log(
  badJoinError
    ? `\n❌ Old broken query still fails: ${badJoinError.message}`
    : "\n✅ Old worker join query unexpectedly succeeded"
);

console.log("\nNext steps:");
console.log("1. git pull origin cursor/fix-booking-detail-a8cb");
console.log("2. Restart npm run dev");
console.log("3. Log in as the customer who owns this booking");
console.log(`4. Open http://localhost:3000/customer/bookings/${bookingId}`);
