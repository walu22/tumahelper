import { NextResponse } from 'next/server'
import { createAuthenticatedRouteHandlerClient } from '@/lib/supabase-server'
import { requireUser, createNotification } from '@/lib/auth'
import { getAdminClient } from '@/lib/supabase'

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  const supabase = createAuthenticatedRouteHandlerClient()

  try {
    const user = await requireUser()

    const { data: dbUser } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single()

    if (dbUser?.role !== 'customer') {
      return NextResponse.json({ success: false, error: 'Only customers can submit payment proof' }, { status: 403 })
    }

    const formData = await request.formData()
    const screenshot = formData.get('screenshot') as File

    if (!screenshot) {
      return NextResponse.json({ success: false, error: 'Screenshot required' }, { status: 400 })
    }

    const bucket = process.env.SUPABASE_STORAGE_BUCKET || 'worker-documents'
    const filePath = `payments/${params.id}/${Date.now()}-${screenshot.name}`

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(filePath, screenshot)

    if (uploadError) {
      return NextResponse.json({ success: false, error: uploadError.message }, { status: 500 })
    }

    const { data: signedUrlData } = await supabase.storage
      .from(bucket)
      .createSignedUrl(filePath, 60 * 60 * 24 * 365)

    const { data: booking } = await supabase
      .from('bookings')
      .select('amount, worker_id, booking_code')
      .eq('id', params.id)
      .single()

    if (!booking) {
      return NextResponse.json({ success: false, error: 'Booking not found' }, { status: 404 })
    }

    const { error } = await supabase
      .from('bookings')
      .update({
        payment_proof_url: uploadData?.path || '',
        payment_status: 'paid',
        updated_at: new Date().toISOString(),
      })
      .eq('id', params.id)
      .eq('customer_id', user.id)

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }

    await supabase.from('payments').insert({
      payment_code: `PAY-${Date.now().toString(36).toUpperCase()}`,
      booking_id: params.id,
      payer_id: user.id,
      amount: booking.amount,
      platform_fee: Math.round(booking.amount * 0.1),
      payment_type: 'booking',
      payment_method: 'cash',
      payment_proof_url: uploadData?.path || '',
      status: 'pending',
    })

    if (booking.worker_id) {
      await createNotification({
        userId: booking.worker_id,
        type: 'payment_proof_submitted',
        title: 'Payment proof uploaded',
        message: `The customer uploaded payment proof for booking ${booking.booking_code}.`,
        data: { bookingId: params.id },
      })
    }

    const adminClient = getAdminClient()
    const { data: admins } = await adminClient.from('users').select('id').eq('role', 'admin')
    for (const admin of admins ?? []) {
      await createNotification({
        userId: admin.id,
        type: 'payment_review',
        title: 'Payment needs review',
        message: `Review payment proof for booking ${booking.booking_code}.`,
        data: { bookingId: params.id },
      })
    }

    return NextResponse.json({ success: true, data: { signedUrl: signedUrlData?.signedUrl } })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 401 })
  }
}