import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import { requireAdmin } from '@/lib/auth'

export async function GET(request: NextRequest) {
  const supabase = createServerSupabaseClient()
  const { searchParams } = new URL(request.url)

  try {
    await requireAdmin()

    const period = searchParams.get('period') || 'month'

    let dateFilter: string
    const now = new Date()

    switch (period) {
      case 'day':
        dateFilter = now.toISOString().split('T')[0]
        break
      case 'week': {
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
        dateFilter = weekAgo.toISOString()
        break
      }
      case 'month':
      default: {
        const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
        dateFilter = monthAgo.toISOString()
        break
      }
    }

    const { data: bookings } = await supabase
      .from('bookings')
      .select('amount, platform_fee, status')
      .gte('created_at', dateFilter)

    const { count: workerCount } = await supabase
      .from('worker_profiles')
      .select('*', { count: 'exact', head: true })

    const { count: customerCount } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true })
      .eq('role', 'customer')
      .eq('status', 'active')

    const { count: bookingCount } = await supabase
      .from('bookings')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', dateFilter)

    const totalRevenue = (bookings || []).reduce((sum, b) => sum + (b.platform_fee || 0), 0)
    const completedBookings = (bookings || []).filter(b => b.status === 'completed').length

    return NextResponse.json({
      success: true,
      data: {
        period,
        workerCount: workerCount || 0,
        customerCount: customerCount || 0,
        bookingCount: bookingCount || 0,
        completedBookings,
        totalRevenue,
        averageBookingValue: bookingCount && bookingCount > 0
          ? Math.round(totalRevenue / bookingCount)
          : 0,
      },
    })
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: error.message === 'Forbidden' ? 403 : 500 }
    )
  }
}