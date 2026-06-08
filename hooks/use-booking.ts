'use client'

import { useEffect, useState } from 'react'
import { supabaseClient as supabase } from '@/lib/supabase-client'

interface Booking {
  id: string
  booking_code: string
  customer_id: string
  worker_id: string
  status: string
  service_date: string
  service_time: string
  location_address: string
  amount: number
  platform_fee: number
  worker_earnings: number
  payment_status: string
  created_at: string
}

export function useBooking(bookingId?: string) {
  const [booking, setBooking] = useState<Booking | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!bookingId) {
      setLoading(false)
      return
    }

    async function fetchBooking() {
      const { data, error: fetchError } = await supabase
        .from('bookings')
        .select('*')
        .eq('id', bookingId)
        .single()

      if (fetchError) {
        setError(fetchError.message)
      } else {
        setBooking(data)
      }
      setLoading(false)
    }

    fetchBooking()
  }, [bookingId])

  return { booking, loading, error }
}

export function useUserBookings(role: 'customer' | 'worker') {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchBookings() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        setLoading(false)
        return
      }

      const column = role === 'customer' ? 'customer_id' : 'worker_id'

      const { data } = await supabase
        .from('bookings')
        .select('*')
        .eq(column, user.id)
        .order('created_at', { ascending: false })

      setBookings(data || [])
      setLoading(false)
    }

    fetchBookings()
  }, [role])

  return { bookings, loading }
}