'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { FileText, CheckCircle, XCircle, Eye } from 'lucide-react'
import { supabaseClient as supabase } from '@/lib/supabase-client'
import { toast } from 'sonner'

export default function AdminDocumentsPage() {
  const [documents, setDocuments] = useState<any[]>([])
  const [rejectReasons, setRejectReasons] = useState<Record<string, string>>({})
  const [showReject, setShowReject] = useState<Record<string, boolean>>({})

  useEffect(() => {
    supabase
      .from('verification_documents')
      .select('*, worker:worker_id(full_name)')
      .order('created_at', { ascending: false })
      .then(({ data }) => setDocuments(data || []))
  }, [])

  const handleApprove = async (id: string) => {
    const res = await fetch(`/api/admin/documents/${id}/approve`, { method: 'POST' })
    const json = await res.json()
    if (json.success) { toast.success('Document approved'); window.location.reload() }
    else toast.error(json.error)
  }

  const handleReject = async (id: string) => {
    const res = await fetch(`/api/admin/documents/${id}/reject`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reason: rejectReasons[id] || 'Not approved' }),
    })
    const json = await res.json()
    if (json.success) { toast.success('Document rejected'); window.location.reload() }
    else toast.error(json.error)
  }

  return (
    <div>
      <Card>
        <CardHeader><CardTitle>All Documents</CardTitle></CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-2 font-medium">Worker</th>
                  <th className="text-left py-3 px-2 font-medium">Type</th>
                  <th className="text-left py-3 px-2 font-medium">Uploaded</th>
                  <th className="text-left py-3 px-2 font-medium">Status</th>
                  <th className="text-left py-3 px-2 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {documents.map((doc: any) => (
                  <tr key={doc.id} className="border-b hover:bg-surface hover:bg-muted">
                    <td className="py-3 px-2 font-medium">{doc.worker?.full_name || 'Unknown'}</td>
                    <td className="py-3 px-2 capitalize text-muted-foreground">{doc.document_type.replace(/_/g, ' ')}</td>
                    <td className="py-3 px-2 text-muted-foreground">{new Date(doc.created_at).toLocaleDateString()}</td>
                    <td className="py-3 px-2">
                      <Badge variant={doc.status === 'approved' ? 'success' : doc.status === 'rejected' ? 'destructive' : 'warning'}>{doc.status}</Badge>
                    </td>
                    <td className="py-3 px-2">
                      {doc.status !== 'approved' && doc.status !== 'rejected' ? (
                        <div className="flex gap-1">
                          <Button variant="ghost" size="sm" className="text-green-600" onClick={() => handleApprove(doc.id)}>
                            <CheckCircle className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="text-red-600" onClick={() => setShowReject({ ...showReject, [doc.id]: !showReject[doc.id] })}>
                            <XCircle className="h-4 w-4" />
                          </Button>
                        </div>
                      ) : null}
                      {showReject[doc.id] && (
                        <div className="flex gap-1 mt-1">
                          <input
                            className="w-24 text-xs border rounded px-1 py-0.5"
                            placeholder="Reason..."
                            value={rejectReasons[doc.id] || ''}
                            onChange={(e) => setRejectReasons({ ...rejectReasons, [doc.id]: e.target.value })}
                          />
                          <Button size="sm" variant="destructive" onClick={() => handleReject(doc.id)}>Reject</Button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
                {documents.length === 0 && (
                  <tr><td colSpan={5} className="text-center py-8 text-muted-foreground"><FileText className="h-8 w-8 mx-auto mb-2 opacity-50" />No documents uploaded yet</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}