import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { CalendarCheck, Eye } from 'lucide-react'

async function getBookings() {
  const { createServerSupabaseClient } = await import('@/lib/supabase-server')
  const supabase = createServerSupabaseClient()

  const { data: bookings } = await supabase
    .from('bookings')
    .select('*')
    .order('created_at', { ascending: false })

  return bookings || []
}

export default async function AdminBookingsPage() {
  const bookings = await getBookings()

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>Booking List</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-2 font-medium">Code</th>
                  <th className="text-left py-3 px-2 font-medium">Date</th>
                  <th className="text-left py-3 px-2 font-medium">Amount</th>
                  <th className="text-left py-3 px-2 font-medium">Status</th>
                  <th className="text-left py-3 px-2 font-medium">Payment</th>
                  <th className="text-left py-3 px-2 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((booking: any) => (
                  <tr key={booking.id} className="border-b hover:bg-surface">
                    <td className="py-3 px-2 font-mono text-xs">{booking.booking_code}</td>
                    <td className="py-3 px-2">{new Date(booking.service_date).toLocaleDateString()}</td>
                    <td className="py-3 px-2">ZMW {(booking.amount / 100).toFixed(2)}</td>
                    <td className="py-3 px-2">
                      <Badge variant={
                        booking.status === 'completed' ? 'success' :
                        booking.status === 'cancelled' ? 'destructive' :
                        booking.status === 'pending' ? 'warning' : 'info'
                      }>
                        {booking.status.replace('_', ' ')}
                      </Badge>
                    </td>
                    <td className="py-3 px-2">
                      <Badge variant={booking.payment_status === 'confirmed' ? 'success' : 'warning'}>
                        {booking.payment_status}
                      </Badge>
                    </td>
                    <td className="py-3 px-2">
                      <Button variant="ghost" size="sm"><Eye className="h-4 w-4" /></Button>
                    </td>
                  </tr>
                ))}
                {bookings.length === 0 && (
                  <tr>
                    <td colSpan={6} className="text-center py-8 text-muted-foreground">
                      <CalendarCheck className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      No bookings yet
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}