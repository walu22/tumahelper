import { createAuthenticatedServerClient } from '@/lib/supabase-server'
import { getCurrentUser } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { formatDate, formatCurrency } from '@/lib/utils'
import { formatTime } from '@/utils/formatters'
import { Briefcase, MapPin, Clock } from 'lucide-react'
import Link from 'next/link'

const statusLabels: Record<string, string> = {
  pending: 'Pending',
  accepted: 'Accepted',
  in_progress: 'In Progress',
  completed: 'Completed',
  cancelled: 'Cancelled',
  declined: 'Declined',
}

const statusVariants: Record<string, 'warning' | 'info' | 'success' | 'destructive' | 'secondary'> = {
  pending: 'warning',
  accepted: 'info',
  in_progress: 'info',
  completed: 'success',
  cancelled: 'destructive',
  declined: 'destructive',
}

async function BookingsList({ statusFilter }: { statusFilter?: string }) {
  const user = await getCurrentUser()
  if (!user) return null

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
      worker_earnings,
      payment_status,
      customer:customer_id(full_name)
    `)
    .eq('worker_id', user.id)
    .order('created_at', { ascending: false })

  if (statusFilter === 'upcoming') {
    query = query.in('status', ['pending', 'accepted', 'in_progress'])
  } else if (statusFilter === 'completed') {
    query = query.eq('status', 'completed')
  } else if (statusFilter === 'cancelled') {
    query = query.in('status', ['cancelled', 'declined'])
  }

  const { data: bookings } = await query

  if (!bookings || bookings.length === 0) {
    return (
      <div className="text-center py-16 text-muted-foreground">
        <Briefcase className="h-10 w-10 mx-auto mb-3 text-muted-foreground/50" />
        <p>No bookings assigned yet</p>
        <p className="text-sm">Complete your profile and set availability to get hired</p>
      </div>
    )
  }

  return (
    <div className="grid gap-4">
      {bookings.map((booking: any) => (
        <Link key={booking.id} href={`/worker/bookings/${booking.id}`}>
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs text-muted-foreground font-mono">{booking.booking_code}</span>
                    <Badge variant={statusVariants[booking.status] || 'secondary'} className="text-xs">
                      {statusLabels[booking.status] || booking.status.replace('_', ' ')}
                    </Badge>
                  </div>
                  {booking.customer?.full_name && (
                    <p className="text-sm font-medium flex items-center gap-1">
                      {booking.customer.full_name}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-1.5 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Clock className="h-3.5 w-3.5" />
                  <span>{formatDate(booking.service_date)} at {formatTime(booking.service_time)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-3.5 w-3.5" />
                  <span className="truncate">{booking.location_address}</span>
                </div>
              </div>

              <div className="flex items-center justify-between mt-3 pt-3 border-t">
                <span className="text-lg font-bold">{formatCurrency(booking.amount)}</span>
                <Badge variant="outline" className="text-xs">
                  {booking.payment_status === 'confirmed' ? 'Paid' : 'Pending'}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  )
}

export default async function WorkerBookingsPage({
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
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">My Jobs</h1>
      <p className="text-muted-foreground mb-8">Manage your assigned bookings</p>

      <div className="flex gap-2 mb-6">
        {tabs.map((tab) => (
          <Link key={tab.key} href={tab.key === 'all' ? '/worker/bookings' : `/worker/bookings?status=${tab.key}`}>
            <Button variant={filter === tab.key ? 'default' : 'outline'} size="sm">
              {tab.label}
            </Button>
          </Link>
        ))}
      </div>

      {filter === 'all' ? <BookingsList /> : <BookingsList statusFilter={filter} />}
    </div>
  )
}
