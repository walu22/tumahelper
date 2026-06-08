import { NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import { requireAdmin } from '@/lib/auth'

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const supabase = createServerSupabaseClient()

  try {
    await requireAdmin()

    const { data, error } = await supabase
      .from('worker_profiles')
      .select('*, user:user_id(*)')
      .eq('id', params.id)
      .single()

    if (error || !data) {
      return NextResponse.json(
        { success: false, error: 'Worker not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, data })
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: error.message === 'Forbidden' ? 403 : 500 }
    )
  }
}