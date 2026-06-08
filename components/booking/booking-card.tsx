'use client'

import { cn, getStatusBadgeColor } from '@/utils/formatters'
import { formatDate, formatTime, formatCurrency } from '@/utils/formatters'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { CheckCircle, Clock, XCircle, AlertTriangle } from 'lucide-react'

interface BookingCardProps {
  booking: {
    id: string
    booking_code: string
    status: string
    service_date: string
    service_time: string
    location_address: string
    amount: number
    platform_fee: number
    worker_earnings: number
    payment_status: string
    worker_name?: string
    customer_name?: string
  }
  role: 'customer' | 'worker' | 'admin'
}

const statusIcons: Record<string, React.ReactNode> = {
  pending: <Clock className="h-4 w-4 text-yellow-500" />,
  accepted: <CheckCircle className="h-4 w-4 text-blue-500" />,
  in_progress: <AlertTriangle className="h-4 w-4 text-indigo-500" />,
  completed: <CheckCircle className="h-4 w-4 text-green-500" />,
  cancelled: <XCircle className="h-4 w-4 text-gray-500" />,
  disputed: <AlertTriangle className="h-4 w-4 text-orange-500" />,
}

export function BookingCard({ booking, role }: BookingCardProps) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs text-muted-foreground font-mono">
                {booking.booking_code}
              </span>
              <Badge className={cn(getStatusBadgeColor(booking.status), 'text-xs')}>
                {booking.status.replace('_', ' ')}
              </Badge>
            </div>
            {role === 'worker' && booking.customer_name && (
              <p className="text-sm font-medium">{booking.customer_name}</p>
            )}
            {role === 'customer' && booking.worker_name && (
              <p className="text-sm font-medium">{booking.worker_name}</p>
            )}
          </div>
          {statusIcons[booking.status]}
        </div>

        <div className="space-y-1.5 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Clock className="h-3.5 w-3.5" />
            <span>{formatDate(booking.service_date)} at {formatTime(booking.service_time)}</span>
          </div>
          <p className="truncate">{booking.location_address}</p>
        </div>

        <div className="flex items-center justify-between mt-3 pt-3 border-t">
          <div>
            <span className="text-lg font-bold">{formatCurrency(booking.amount)}</span>
            <span className="text-xs text-muted-foreground ml-2">
              Fee: {formatCurrency(booking.platform_fee)}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className={cn(getStatusBadgeColor(booking.payment_status))}>
              {booking.payment_status}
            </Badge>
            <Button variant="outline" size="sm">View</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}