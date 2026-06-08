'use client'

import { useEffect, useState } from 'react'
import { supabaseClient as supabase } from '@/lib/supabase-client'

interface WorkerProfile {
  id: string
  user_id: string
  full_name: string
  city: string
  area: string
  category: string
  bio?: string
  experience_years: number
  trust_score: number
  verification_level: string
  average_rating: number
  total_jobs_completed: number
  availability_status: string
}

export function useWorker(workerId?: string) {
  const [profile, setProfile] = useState<WorkerProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!workerId) {
      setLoading(false)
      return
    }

    async function fetchWorker() {
      const { data, error: fetchError } = await supabase
        .from('worker_profiles')
        .select('*')
        .eq('user_id', workerId)
        .single()

      if (fetchError) {
        setError(fetchError.message)
      } else {
        setProfile(data)
      }
      setLoading(false)
    }

    fetchWorker()
  }, [workerId])

  return { profile, loading, error }
}

export function useCurrentWorkerProfile() {
  const [profile, setProfile] = useState<WorkerProfile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchProfile() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        setLoading(false)
        return
      }

      const { data } = await supabase
        .from('worker_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single()

      setProfile(data)
      setLoading(false)
    }

    fetchProfile()
  }, [])

  return { profile, loading }
}