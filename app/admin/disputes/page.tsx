'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Scale, CheckCircle } from 'lucide-react'
import { supabaseClient as supabase } from '@/lib/supabase-client'
import { toast } from 'sonner'

export default function AdminDisputesPage() {
  const [disputes, setDisputes] = useState<any[]>([])
  const [resolution, setResolution] = useState<Record<string, string>>({})
  const [resolutionAction, setResolutionAction] = useState<Record<string, string>>({})

  useEffect(() => {
    supabase
      .from('disputes')
      .select('*')
      .order('created_at', { ascending: false })
      .then(({ data }) => setDisputes(data || []))
  }, [])

  const handleResolve = async (id: string) => {
    if (!resolution[id] || !resolutionAction[id]) {
      toast.error('Resolution and action required')
      return
    }
    const res = await fetch(`/api/admin/disputes/${id}/resolve`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ resolution: resolution[id], resolutionAction: resolutionAction[id] }),
    })
    const json = await res.json()
    if (json.success) { toast.success('Dispute resolved'); window.location.reload() }
    else toast.error(json.error)
  }

  const actions = ['refund', 'partial_refund', 'worker_suspension', 'account_ban', 'no_action']

  return (
    <div>
      <Card>
        <CardHeader><CardTitle>All Disputes</CardTitle></CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-2 font-medium">Type</th>
                  <th className="text-left py-3 px-2 font-medium">Description</th>
                  <th className="text-left py-3 px-2 font-medium">Status</th>
                  <th className="text-left py-3 px-2 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {disputes.map((dispute: any) => (
                  <tr key={dispute.id} className="border-b hover:bg-surface hover:bg-muted">
                    <td className="py-3 px-2 capitalize">{dispute.dispute_type.replace(/_/g, ' ')}</td>
                    <td className="py-3 px-2 text-muted-foreground max-w-xs truncate">{dispute.description}</td>
                    <td className="py-3 px-2">
                      <Badge variant={dispute.status === 'resolved' ? 'success' : 'warning'}>
                        {dispute.status.replace(/_/g, ' ')}
                      </Badge>
                    </td>
                    <td className="py-3 px-2">
                      {dispute.status === 'open' || dispute.status === 'under_review' ? (
                        <div className="space-y-2">
                          <Input
                            placeholder="Resolution notes..."
                            className="text-xs"
                            value={resolution[dispute.id] || ''}
                            onChange={(e) => setResolution({ ...resolution, [dispute.id]: e.target.value })}
                          />
                          <div className="flex gap-1">
                            <select
                              className="text-xs border rounded px-1 py-0.5"
                              value={resolutionAction[dispute.id] || ''}
                              onChange={(e) => setResolutionAction({ ...resolutionAction, [dispute.id]: e.target.value })}
                            >
                              <option value="">Select action</option>
                              {actions.map((a) => <option key={a} value={a}>{a.replace(/_/g, ' ')}</option>)}
                            </select>
                            <Button size="sm" variant="outline" onClick={() => handleResolve(dispute.id)}>
                              <CheckCircle className="h-3 w-3 mr-1" /> Resolve
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <span className="text-xs text-muted-foreground">{dispute.resolution_action?.replace(/_/g, ' ')}</span>
                      )}
                    </td>
                  </tr>
                ))}
                {disputes.length === 0 && (
                  <tr><td colSpan={4} className="text-center py-8 text-muted-foreground"><Scale className="h-8 w-8 mx-auto mb-2 opacity-50" />No disputes raised</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}