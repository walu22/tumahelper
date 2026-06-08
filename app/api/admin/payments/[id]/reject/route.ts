import { NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import { requireAdmin } from '@/lib/auth'

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const supabase = createServerSupabaseClient()

  try {
    const admin = await requireAdmin()
    const { reason } = await request.json()

    const { error } = await supabase
      .from('payments')
      .update({
        status: 'failed',
        notes: reason,
      })
      .eq('id', params.id)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: error.message === 'Forbidden' ? 403 : 500 }
    )
  }
}