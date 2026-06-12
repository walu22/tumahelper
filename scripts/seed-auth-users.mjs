// Run with: npm run setup:auth
// Creates/updates auth.users for the three primary dev login accounts.

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

/** Must match lib/auth/config.ts LOGIN_ACCOUNTS */
const PRIMARY_ACCOUNTS = [
  {
    id: '00000000-0000-0000-0000-000000000001',
    email: 'owner@tumahelper.dev',
    phone: '+260970000001',
    role: 'admin',
    full_name: 'Platform Owner',
  },
  {
    id: 'a0000000-0000-0000-0000-000000000001',
    email: 'provider@tumahelper.dev',
    phone: '+260961111111',
    role: 'worker',
    full_name: 'Sarah Mulenga',
  },
  {
    id: 'f0000000-0000-0000-0000-000000000001',
    email: 'client@tumahelper.dev',
    phone: '+260976666666',
    role: 'customer',
    full_name: 'Demo Customer',
  },
]

const PASSWORD = 'dev123'

async function upsertAccount(account) {
  const { data: user } = await supabase
    .from('users')
    .select('id')
    .eq('id', account.id)
    .maybeSingle()

  if (!user) {
    console.log(`  SKIP ${account.email}: user id not in public.users (run migrations/seed SQL first)`)
    return
  }

  await supabase
    .from('users')
    .update({ email: account.email, full_name: account.full_name })
    .eq('id', account.id)

  const { data: authUser } = await supabase.auth.admin.getUserById(account.id)
  const payload = {
    email: account.email,
    password: PASSWORD,
    email_confirm: true,
    phone: account.phone,
    phone_confirm: true,
  }

  if (authUser?.user) {
    const { error } = await supabase.auth.admin.updateUserById(account.id, payload)
    if (error) console.error(`  ${account.email} UPDATE FAILED: ${error.message}`)
    else console.log(`  ${account.email} / ${PASSWORD} (updated)`)
  } else {
    const { error } = await supabase.auth.admin.createUser({
      id: account.id,
      ...payload,
    })
    if (error) console.error(`  ${account.email} CREATE FAILED: ${error.message}`)
    else console.log(`  ${account.email} / ${PASSWORD} (created)`)
  }
}

console.log('Setting up primary dev auth accounts...\n')
for (const account of PRIMARY_ACCOUNTS) {
  await upsertAccount(account)
}

console.log('\nDone! Login at http://localhost:3000/login')
console.log('  admin@tumahelper.dev / dev123')
console.log('  worker@tumahelper.dev / dev123   (alias for provider@)')
console.log('  provider@tumahelper.dev / dev123')
console.log('  client@tumahelper.dev / dev123')
console.log('\nOr one-click: http://localhost:3000/dev-login')

console.log('\nVerifying logins...')
const anon = createClient(
  env.NEXT_PUBLIC_SUPABASE_URL,
  env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  { auth: { autoRefreshToken: false, persistSession: false } }
)

for (const account of PRIMARY_ACCOUNTS) {
  const { error } = await anon.auth.signInWithPassword({
    email: account.email,
    password: PASSWORD,
  })
  console.log(`  ${error ? '✗' : '✓'} ${account.email}${error ? ` — ${error.message}` : ''}`)
}
