import { Suspense } from 'react'
import { redirect } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import { getCurrentUser } from '@/lib/auth'
import { BookingWizard } from '@/components/booking/booking-wizard'

export default async function BookPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect('/login?redirect=/customer/book')
  }

  if (user.role !== 'customer') {
    redirect('/dashboard')
  }

  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      }
    >
      <BookingWizard />
    </Suspense>
  )
}
