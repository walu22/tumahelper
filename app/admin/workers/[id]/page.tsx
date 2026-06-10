'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { VerificationBadge } from '@/components/verification/verification-badge'
import { TrustScoreBadge } from '@/components/trust-score/trust-score-badge'
import { TrustScoreBreakdown } from '@/components/trust-score/trust-score-breakdown'
import { MapPin, Star, Briefcase, Shield, XCircle, CheckCircle, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { supabaseClient as supabase } from '@/lib/supabase-client'
import { toast } from 'sonner'

export default function AdminWorkerDetailPage({ params }: { params: { id: string } }) {
  const [profile, setProfile] = useState<any>(null)
  const [rejectionReason, setRejectionReason] = useState('')
  const [showReject, setShowReject] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchWorker() {
      const { data } = await supabase
        .from('worker_profiles')
        .select('*')
        .eq('id', params.id)
        .single()
      setProfile(data)
      setLoading(false)
    }
    fetchWorker()
  }, [params.id])

  const handleApprove = async () => {
    const res = await fetch(`/api/admin/workers/${params.id}/approve`, { method: 'POST' })
    const json = await res.json()
    if (json.success) {
      toast.success(`Worker approved! Level: ${json.data.verificationLevel}`)
      window.location.reload()
    } else {
      toast.error(json.error)
    }
  }

  const handleReject = async () => {
    const res = await fetch(`/api/admin/workers/${params.id}/reject`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reason: rejectionReason }),
    })
    const json = await res.json()
    if (json.success) {
      toast.success('Worker rejected')
      window.location.reload()
    } else {
      toast.error(json.error)
    }
  }

  if (loading) return <div className="p-6 text-center text-muted-foreground">Loading...</div>
  if (!profile) return <div className="p-6 text-center text-muted-foreground">Worker not found</div>

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Link href="/admin/workers">
          <Button variant="ghost" size="sm"><ArrowLeft className="h-4 w-4" /></Button>
        </Link>
        <h1 className="text-2xl font-bold">{profile.full_name}</h1>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-2xl">
                  {profile.full_name.charAt(0)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h2 className="text-xl font-bold">{profile.full_name}</h2>
                    {profile.is_featured && <Badge variant="success">Featured</Badge>}
                  </div>
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <MapPin className="h-3 w-3" /> {profile.area}, {profile.city}
                  </p>
                  <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                    <Briefcase className="h-3 w-3" /> {profile.category.replace('_', ' ')} · {profile.experience_years} years
                  </p>
                </div>
                <VerificationBadge level={profile.verification_level} size="lg" />
              </div>
              {profile.bio && <p className="mt-4 text-sm text-muted-foreground">{profile.bio}</p>}
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Admin Actions</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <div className="flex gap-2">
                <Button onClick={handleApprove} className="flex-1">
                  <CheckCircle className="h-4 w-4 mr-2" /> Approve (Next Level)
                </Button>
                <Button variant="destructive" onClick={() => setShowReject(!showReject)} className="flex-1">
                  <XCircle className="h-4 w-4 mr-2" /> Reject
                </Button>
              </div>
              {showReject && (
                <div className="space-y-2 p-3 border rounded-lg">
                  <Input placeholder="Rejection reason..." value={rejectionReason} onChange={(e) => setRejectionReason(e.target.value)} />
                  <Button variant="destructive" size="sm" onClick={handleReject} disabled={!rejectionReason}>Confirm Reject</Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardContent className="p-6 text-center">
              <TrustScoreBadge score={profile.trust_score} size="lg" />
              <div className="mt-4">
                <TrustScoreBreakdown components={profile.trust_score_components || {
                  identityVerification: 0, jobCompletion: 0, customerRating: 0,
                  punctuality: 0, reliability: 0, complaintHistory: 0, profileCompleteness: 0,
                }} />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">Status</span><Badge>{profile.availability_status}</Badge></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Jobs</span><span>{profile.total_jobs_completed}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Rating</span><span>{profile.average_rating?.toFixed(1) || '0.0'}</span></div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}