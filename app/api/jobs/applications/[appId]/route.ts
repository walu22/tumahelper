import { NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import { requireUser } from '@/lib/auth'
import { createAuditLog } from '@/lib/auth'

export async function PATCH(
  request: Request,
  { params }: { params: { appId: string } }
) {
  const supabase = createServerSupabaseClient()

  try {
    const user = await requireUser()

    const { data: employer } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single()

    if (employer?.role !== 'employer') {
      return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 })
    }

    const { data: application } = await supabase
      .from('job_applications')
      .select('job_id')
      .eq('id', params.appId)
      .single()

    if (!application) {
      return NextResponse.json({ success: false, error: 'Application not found' }, { status: 404 })
    }

    const { data: job } = await supabase
      .from('job_posts')
      .select('employer_id')
      .eq('id', application.job_id)
      .single()

    if (!job || job.employer_id !== user.id) {
      return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 })
    }

    const { status, interviewDate, interviewLocation, notes } = await request.json()

    const validTransitions = ['shortlisted', 'interview_scheduled', 'offered', 'hired', 'rejected', 'withdrawn']
    if (!validTransitions.includes(status)) {
      return NextResponse.json({ success: false, error: 'Invalid status transition' }, { status: 400 })
    }

    const updateData: any = { status, updated_at: new Date().toISOString() }
    if (interviewDate) updateData.interview_date = interviewDate
    if (interviewLocation) updateData.interview_location = interviewLocation
    if (notes) updateData.interview_notes = notes
    if (status === 'hired') updateData.hired_at = new Date().toISOString()

    const { error } = await supabase
      .from('job_applications')
      .update(updateData)
      .eq('id', params.appId)

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }

    if (status === 'hired') {
      await supabase
        .from('job_posts')
        .update({ status: 'filled', updated_at: new Date().toISOString() })
        .eq('id', application.job_id)
    }

    await createAuditLog({
      action: `application_${status}`,
      entityType: 'job_application',
      entityId: params.appId,
      adminId: user.id,
      newValue: { job_id: application.job_id, status },
    })

    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 401 })
  }
}