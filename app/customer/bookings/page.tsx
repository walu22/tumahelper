import { Button } from '@/components/ui/button'
import { CustomerDashboardBookingItem } from '@/components/customer/customer-dashboard-booking-item'
import { attachBookAgainHrefs } from '@/lib/bookings/book-again-enrich'
import { createAuthenticatedServerClient } from '@/lib/supabase-server'
import { getCurrentUser } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { CalendarCheck } from 'lucide-react'
import Link from 'next/link'

async function BookingsList({ statusFilter }: { statusFilter?: string }) {
  const user = await getCurrentUser()
  if (!user) redirect('/login?redirect=/customer/bookings')

  const supabase = createAuthenticatedServerClient()
  let query = supabase
    .from('bookings')
    .select(`
      id,
      booking_code,
      status,
      service_date,
      service_time,
      location_address,
      amount,
      platform_fee,
      payment_status,
      worker_id,
      category_id,
      service_details,
      worker:worker_id(full_name)
    `)
    .eq('customer_id', user.id)
    .order('created_at', { ascending: false })

  if (statusFilter === 'upcoming') {
    query = query.in('status', ['pending', 'accepted', 'in_progress'])
  } else if (statusFilter === 'completed') {
    query = query.eq('status', 'completed')
  } else if (statusFilter === 'cancelled') {
    query = query.in('status', ['cancelled', 'declined'])
  }

  const { data: bookingRows } = await query

  if (!bookingRows || bookingRows.length === 0) {
    return (
      <div className="text-center py-16 text-muted-foreground">
        <CalendarCheck className="h-10 w-10 mx-auto mb-3 text-muted-foreground/50" />
        <p>No bookings yet</p>
        <p className="text-sm">Book a nanny or cleaner to get started</p>
      </div>
    )
  }

  const normalized = bookingRows.map((b) => ({
    ...b,
    worker: Array.isArray(b.worker) ? b.worker[0] : b.worker,
  }))

  const bookings = await attachBookAgainHrefs(supabase, normalized)

  return (
    <div className="grid gap-4">
      {bookings.map((booking) => (
        <CustomerDashboardBookingItem
          key={booking.id}
          booking={booking}
          bookAgainHref={booking.bookAgainHref}
        />
      ))}
    </div>
  )
}

export default async function CustomerBookingsPage({
  searchParams,
}: {
  searchParams: { status?: string }
}) {
  const filter = searchParams.status || 'all'
  const tabs = [
    { key: 'all', label: 'All' },
    { key: 'upcoming', label: 'Upcoming' },
    { key: 'completed', label: 'Completed' },
    { key: 'cancelled', label: 'Cancelled' },
  ]

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-2">My Bookings</h1>
      <p className="text-muted-foreground mb-8">Track all your service bookings</p>

      <div className="flex gap-2 mb-6">
        {tabs.map((tab) => (
          <Link key={tab.key} href={tab.key === 'all' ? '/customer/bookings' : `/customer/bookings?status=${tab.key}`}>
            <Button variant={filter === tab.key ? 'default' : 'outline'} size="sm">
              {tab.label}
            </Button>
          </Link>
        ))}
      </div>

      {filter === 'all' ? (
        <BookingsList />
      ) : (
        <BookingsList statusFilter={filter} />
      )}
    </div>
  )
}
