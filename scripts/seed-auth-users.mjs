// Run with: node scripts/seed-auth-users.mjs
// Creates/updates auth.users entries for seed data with email + password

import { createClient } from '@supabase/supabase-js'
import { readFileSync, existsSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

const envPath = join(__dirname, '..', '.env.local')
if (!existsSync(envPath)) {
  console.error('.env.local not found.')
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

const ACCOUNTS = [
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
  { phone: '+260976666666', role: 'customer' },
  { phone: '+260977777777', role: 'customer' },
  { phone: '+260978888888', role: 'customer' },
  { phone: '+260970000004', role: 'customer' },
  { phone: '+260970000005', role: 'customer' },
  { phone: '+260970000001', role: 'admin' },
]

async function main() {
  for (const { phone, role } of ACCOUNTS) {
    const { data: user } = await supabase.from('users').select('id, email').eq('phone', phone).single()
    if (!user) {
      console.log(`  SKIP ${phone}: not in public.users table`)
      continue
    }

    const email = `${role}@tumahelper.dev`

    // Update email in public.users
    await supabase.from('users').update({ email }).eq('id', user.id)

    // Update or create auth user with email + password
    const { data: authUser } = await supabase.auth.admin.getUserById(user.id)
    if (authUser?.user) {
      const { error } = await supabase.auth.admin.updateUserById(user.id, {
        email,
        password: 'dev123',
        email_confirm: true,
        phone_confirm: true,
      })
      if (error) console.error(`  ${phone} UPDATE FAILED: ${error.message}`)
      else console.log(`  ${phone} → ${email} / dev123 (updated)`)
    } else {
      const { error } = await supabase.auth.admin.createUser({
        id: user.id,
        phone,
        email,
        password: 'dev123',
        email_confirm: true,
        phone_confirm: true,
      })
      if (error) console.error(`  ${phone} CREATE FAILED: ${error.message}`)
      else console.log(`  ${phone} → ${email} / dev123 (created)`)
    }
  }
}

console.log('Setting up auth users with email + password...')
await main()
console.log('\nDone! Login at http://localhost:3000/login')
console.log('  admin@tumahelper.dev / dev123')
console.log('  worker@tumahelper.dev / dev123')
console.log('  customer@tumahelper.dev / dev123')
