// Run with: node scripts/seed-auth-users.mjs
// Creates auth.users entries for seed data users so they can log in with OTP

import { createClient } from '@supabase/supabase-js'
import { readFileSync, existsSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

// Load env
const envPath = join(__dirname, '..', '.env.local')
if (!existsSync(envPath)) {
  console.error('.env.local not found. Create it with:')
  console.error('NEXT_PUBLIC_SUPABASE_URL=...')
  console.error('NEXT_PUBLIC_SUPABASE_ANON_KEY=...')
  console.error('SUPABASE_SERVICE_ROLE_KEY=...')
  process.exit(1)
}

const env = Object.fromEntries(
  readFileSync(envPath, 'utf-8')
    .split('\n')
    .filter(Boolean)
    .map((l) => l.split('=', 2).map((s) => s.trim()))
)

const supabase = createClient(
  env.NEXT_PUBLIC_SUPABASE_URL,
  env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { autoRefreshToken: false, persistSession: false } }
)

const TEST_USERS = [
  // Workers
  { phone: '+260961111111', role: 'worker' },
  { phone: '+260962222222', role: 'worker' },
  { phone: '+260963333333', role: 'worker' },
  { phone: '+260964444444', role: 'worker' },
  { phone: '+260965555555', role: 'worker' },
  { phone: '+260966666666', role: 'worker' },
  { phone: '+260967777777', role: 'worker' },
  { phone: '+260968888888', role: 'worker' },
  { phone: '+260969999999', role: 'worker' },
  { phone: '+260960000000', role: 'worker' },
  // Customers
  { phone: '+260976666666', role: 'customer' },
  { phone: '+260977777777', role: 'customer' },
  { phone: '+260978888888', role: 'customer' },
  { phone: '+260970000004', role: 'customer' },
  { phone: '+260970000005', role: 'customer' },
  // Admin
  { phone: '+260970000001', role: 'admin' },
]

async function main() {
  for (const u of TEST_USERS) {
    const { data: existing } = await supabase
      .from('users')
      .select('id')
      .eq('phone', u.phone)
      .single()

    if (!existing) {
      console.log(`  Skipping ${u.phone} — not in public.users table`)
      continue
    }

    // Check if auth user exists
    const { data: authUser } = await supabase.auth.admin.getUserById(existing.id)
    if (authUser?.user) {
      console.log(`  ${u.phone} (${u.role}) — already has auth user`)
      continue
    }

    const { data, error } = await supabase.auth.admin.createUser({
      id: existing.id,
      phone: u.phone,
      phone_confirm: true,
      user_metadata: { role: u.role },
    })

    if (error) {
      console.error(`  ${u.phone} FAILED: ${error.message}`)
    } else {
      console.log(`  ${u.phone} (${u.role}) — auth user created`)
    }
  }
}

console.log('Creating auth users for seed data...')
await main()
console.log('\nDone. Test login numbers:')
console.log('  Worker:   +260961111111')
console.log('  Customer: +260976666666')
console.log('  Admin:    +260970000001')
