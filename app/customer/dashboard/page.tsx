import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { BookingCard } from '@/components/booking/booking-card'
import { Plus, Calendar, Clock, Star } from 'lucide-react'
import Link from 'next/link'
import { getCurrentUser } from '@/lib/auth'
import { createServerSupabaseClient } from '@/lib/supabase-server'

export default async function CustomerDashboard() {
  const supabase = createServerSupabaseClient()
  const user = await getCurrentUser()

  let upcoming = 0
  let completed = 0
  let avgRating = '0.0'
  let recentBookings: any[] = []

  if (user) {
    const { data: bookings } = await supabase
      .from('bookings')
      .select('*')
      .eq('customer_id', user.id)
      .order('created_at', { ascending: false })

    if (bookings) {
      upcoming = bookings.filter(b => ['pending', 'accepted'].includes(b.status)).length
      completed = bookings.filter(b => b.status === 'completed').length
      recentBookings = bookings.slice(0, 5)
    }

    const { data: reviews } = await supabase
      .from('reviews')
      .select('overall_rating')
      .eq('reviewer_id', user.id)

    if (reviews && reviews.length > 0) {
      const sum = reviews.reduce((s, r) => s + r.overall_rating, 0)
      avgRating = (sum / reviews.length).toFixed(1)
    }
  }

  return (
    <div className="min-h-screen">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">My Dashboard</h1>
            <p className="text-muted-foreground">Manage your bookings and find trusted providers</p>
          </div>
          <Link href="/customer/book">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Booking
            </Button>
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardContent className="p-6 flex items-center gap-4">
              <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                <Calendar className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{upcoming}</p>
                <p className="text-sm text-muted-foreground">Upcoming</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 flex items-center gap-4">
              <div className="h-10 w-10 bg-green-100 rounded-full flex items-center justify-center">
                <Clock className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{completed}</p>
                <p className="text-sm text-muted-foreground">Completed</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 flex items-center gap-4">
              <div className="h-10 w-10 bg-yellow-100 rounded-full flex items-center justify-center">
                <Star className="h-5 w-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{avgRating}</p>
                <p className="text-sm text-muted-foreground">Avg Rating Given</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Recent Bookings</CardTitle>
          </CardHeader>
          <CardContent>
            {recentBookings.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <p>No bookings yet. Make your first booking!</p>
                <Link href="/customer/book">
                  <Button variant="outline" className="mt-4">Book a Provider</Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {recentBookings.map((booking) => (
                  <BookingCard key={booking.id} booking={booking} role="customer" />
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}