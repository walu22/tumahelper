'use client'

import { useState } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

const ACCOUNTS = [
  { label: 'Worker', phone: '+260961111111' },
  { label: 'Customer', phone: '+260976666666' },
  { label: 'Admin', phone: '+260970000001' },
]

export default function DevLoginPage() {
  const [status, setStatus] = useState('')

  async function login(phone: string) {
    setStatus(`Logging in ${phone}...`)
    try {
      // 1. Call API to ensure auth user exists with email+password
      const setupRes = await fetch('/api/auth/dev-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone }),
      })
      const setup = await setupRes.json()
      if (!setup.success) {
        setStatus(`Setup failed: ${setup.error}`)
        return
      }

      // 2. Sign in client-side with email + password
      const role = setup.data.user.role
      const supabase = createClient(supabaseUrl, supabaseAnonKey)

      const { data, error } = await supabase.auth.signInWithPassword({
        email: `${role}@tumahelper.dev`,
        password: 'dev123',
      })

      if (error) {
        setStatus(`Sign in failed: ${error.message}`)
        return
      }

      // 3. Redirect
      const redirects: Record<string, string> = {
        worker: '/worker/bookings',
        customer: '/customer/bookings',
        admin: '/admin',
      }
      window.location.href = redirects[role] || '/dashboard'
    } catch (err: any) {
      setStatus(`Error: ${err.message}`)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-sm w-full">
        <h1 className="text-xl font-bold mb-4">Dev Login</h1>
        <p className="text-sm text-muted-foreground mb-4">Click a user to log in instantly:</p>
        <div className="space-y-2">
          {ACCOUNTS.map((a) => (
            <button
              key={a.phone}
              onClick={() => login(a.phone)}
              className="w-full text-left block p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
            >
              <span className="font-medium">{a.label}</span>
              <span className="text-xs text-muted-foreground ml-2">{a.phone}</span>
            </button>
          ))}
        </div>
        {status && (
          <div className="mt-4 p-3 bg-blue-50 text-blue-700 rounded-md text-sm">
            {status}
          </div>
        )}
      </div>
    </div>
  )
}
