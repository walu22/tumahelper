'use client'

import { useState } from 'react'

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
      const res = await fetch('/api/auth/dev-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ phone }),
      })

      const data = await res.json()
      if (!data.success) {
        setStatus(`Login failed: ${data.error}`)
        return
      }

      window.location.href = data.data.redirect || '/dashboard'
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
