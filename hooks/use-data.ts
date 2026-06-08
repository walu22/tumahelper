'use client'

import { useEffect, useState } from 'react'
import { supabaseClient as supabase } from '@/lib/supabase-client'

interface Booking {
  id: string
  booking_code: string
  status: string
  service_date: string
  service_time: string
  location_address: string
  amount: number
  platform_fee: number
  payment_status: string
}

export function useBookings(role: 'customer' | 'worker', userId?: string) {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!userId) return

    const fetchBookings = async () => {
      const field = role === 'customer' ? 'customer_id' : 'worker_id'
      const { data } = await supabase
        .from('bookings')
        .select('*')
        .eq(field, userId)
        .order('created_at', { ascending: false })

      setBookings(data || [])
      setLoading(false)
    }

    fetchBookings()
  }, [role, userId])

  return { bookings, loading }
}

export function useWorkerProfile(userId?: string) {
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!userId) return

    const fetchProfile = async () => {
      const { data } = await supabase
        .from('worker_profiles')
        .select('*')
        .eq('user_id', userId)
        .single()

      setProfile(data)
      setLoading(false)
    }

    fetchProfile()
  }, [userId])

  return { profile, loading }
}

export function useNotifications(userId?: string) {
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    if (!userId) return

    const fetchCount = async () => {
      const { count } = await supabase
        .from('notifications')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .eq('is_read', false)

      setUnreadCount(count || 0)
    }

    fetchCount()
    const interval = setInterval(fetchCount, 30000)
    return () => clearInterval(interval)
  }, [userId])

  return { unreadCount }
}