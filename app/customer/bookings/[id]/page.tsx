import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { BookingTimeline } from '@/components/booking-timeline'
import { CancelBookingButton } from '@/components/booking/cancel-booking-button'
import { BookingReviewSection } from '@/components/booking/booking-review-section'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import { getCurrentUser } from '@/lib/auth'
import { formatDate, formatTime, formatCurrency } from '@/utils/formatters'
import Link from 'next/link'
import { ArrowLeft, MapPin, Calendar, Clock, FileText, User } from 'lucide-react'
import type { BookingStatus } from '@/types'

const statusStyles: Record<BookingStatus, 'success' | 'warning' | 'destructive' | 'default' | 'secondary' | 'info' | 'outline'> = {
  pending: 'warning',
  accepted: 'info',
  declined: 'destructive',
  in_progress: 'info',
  completed: 'success',
  cancelled: 'destructive',
  disputed: 'destructive',
  no_show: 'destructive',
}

const statusLabels: Record<BookingStatus, string> = {
  pending: 'Pending',
  accepted: 'Accepted',
  declined: 'Declined',
  in_progress: 'In Progress',
  completed: 'Completed',
  cancelled: 'Cancelled',
  disputed: 'Disputed',
  no_show: 'No Show',
}

interface BookingWithRelations {
  id: string
  booking_code: string
  customer_id: string
  status: BookingStatus
  service_date: string
  service_time: string
  location_address: string
  description: string | null
  amount: number
  platform_fee: number
  worker_earnings: number
  customer_rating: number | null
  customer_review: string | null
  cancellation_reason: string | null
  created_at: string
  worker: { full_name: string | null; profile_photo_url: string | null; phone: string | null }
  category: { name: string } | null
}

export default async function CustomerBookingDetailPage({
  params,
}: {
  params: { id: string }
}) {
  const supabase = createServerSupabaseClient()
  const user = await getCurrentUser()

  if (!user) return null

  const { data: booking } = await supabase
    .from('bookings')
    .select(`
      *,
      worker:worker_id(full_name, profile_photo_url, phone),
      category:category_id(name)
    `)
    .eq('id', params.id)
    .single<BookingWithRelations>()

  if (!booking || booking.customer_id !== user.id) {
    return null
  }

  const canCancel = ['pending', 'accepted'].includes(booking.status)

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link
          href="/customer/bookings"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Bookings
        </Link>

        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-1 space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-start justify-between">
                <div>
                  <CardTitle className="text-xl">
                    Booking #{booking.booking_code}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    Booked on {formatDate(booking.created_at)}
                  </p>
                </div>
                <Badge variant={statusStyles[booking.status]}>
                  {statusLabels[booking.status]}
                </Badge>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-start gap-3">
                    <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Service Date</p>
                      <p className="text-sm text-muted-foreground">{formatDate(booking.service_date)}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Clock className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Service Time</p>
                      <p className="text-sm text-muted-foreground">{formatTime(booking.service_time)}</p>
                    </div>
                  </div>
                  {booking.category && (
                    <div className="flex items-start gap-3">
                      <FileText className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="text-sm font-medium">Service Type</p>
                        <p className="text-sm text-muted-foreground capitalize">{booking.category.name.replace('_', ' ')}</p>
                      </div>
                    </div>
                  )}
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Location</p>
                      <p className="text-sm text-muted-foreground">{booking.location_address}</p>
                    </div>
                  </div>
                </div>

                {booking.description && (
                  <div>
                    <p className="text-sm font-medium mb-1">Notes</p>
                    <p className="text-sm text-muted-foreground">{booking.description}</p>
                  </div>
                )}

                <div className="border-t pt-4">
                  <p className="text-sm font-medium mb-2">Payment Summary</p>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Service Fee</span>
                      <span>{formatCurrency(booking.amount)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Platform Fee</span>
                      <span>{formatCurrency(booking.platform_fee)}</span>
                    </div>
                    <div className="flex justify-between font-medium border-t pt-1">
                      <span>Total</span>
                      <span>{formatCurrency(booking.amount + booking.platform_fee)}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Booking Timeline</CardTitle>
              </CardHeader>
              <CardContent>
                <BookingTimeline currentStatus={booking.status} />
              </CardContent>
            </Card>

            {booking.status === 'completed' && (
              <BookingReviewSection
                bookingId={booking.id}
                workerName={booking.worker?.full_name || 'Worker'}
                existingRating={booking.customer_rating}
                existingReview={booking.customer_review}
              />
            )}
          </div>

          <div className="w-full lg:w-80 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Worker</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                    {booking.worker?.profile_photo_url ? (
                      <img
                        src={booking.worker.profile_photo_url}
                        alt={booking.worker.full_name || ''}
                        className="h-12 w-12 rounded-full object-cover"
                      />
                    ) : (
                      <User className="h-6 w-6 text-primary" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium">{booking.worker?.full_name || 'Unknown Worker'}</p>
                    {booking.worker?.phone && (
                      <p className="text-sm text-muted-foreground">{booking.worker.phone}</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {canCancel && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <CancelBookingButton bookingId={booking.id} />
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
