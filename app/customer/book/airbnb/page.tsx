import { Suspense } from 'react'
import { Loader2 } from 'lucide-react'
import { BookingWizard } from '@/components/booking/booking-wizard'

export const dynamic = 'force-dynamic'

export default function AirbnbBookPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      }
    >
      <BookingWizard airbnbEntry />
    </Suspense>
  )
}
