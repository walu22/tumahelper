'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { CreditCard, CheckCircle, XCircle } from 'lucide-react'
import { supabaseClient as supabase } from '@/lib/supabase-client'
import { toast } from 'sonner'

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState<any[]>([])

  useEffect(() => {
    supabase
      .from('payments')
      .select('*, payer:payer_id(phone), payee:payee_id(phone)')
      .order('created_at', { ascending: false })
      .then(({ data }) => setPayments(data || []))
  }, [])

  const handleConfirm = async (id: string) => {
    const res = await fetch(`/api/admin/payments/${id}/confirm`, { method: 'PATCH' })
    const json = await res.json()
    if (json.success) { toast.success('Payment confirmed'); window.location.reload() }
    else toast.error(json.error)
  }

  const handleReject = async (id: string) => {
    const res = await fetch(`/api/admin/payments/${id}/reject`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reason: 'Rejected by admin' }),
    })
    const json = await res.json()
    if (json.success) { toast.success('Payment rejected'); window.location.reload() }
    else toast.error(json.error)
  }

  return (
    <div>
      <Card>
        <CardHeader><CardTitle>All Payments</CardTitle></CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-2 font-medium">Code</th>
                  <th className="text-left py-3 px-2 font-medium">Type</th>
                  <th className="text-left py-3 px-2 font-medium">Amount</th>
                  <th className="text-left py-3 px-2 font-medium">Fee</th>
                  <th className="text-left py-3 px-2 font-medium">Status</th>
                  <th className="text-left py-3 px-2 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((payment: any) => (
                  <tr key={payment.id} className="border-b hover:bg-surface hover:bg-muted">
                    <td className="py-3 px-2 font-mono text-xs">{payment.payment_code}</td>
                    <td className="py-3 px-2 capitalize">{payment.payment_type.replace('_', ' ')}</td>
                    <td className="py-3 px-2">ZMW {(payment.amount / 100).toFixed(2)}</td>
                    <td className="py-3 px-2">ZMW {(payment.platform_fee / 100).toFixed(2)}</td>
                    <td className="py-3 px-2">
                      <Badge variant={payment.status === 'confirmed' ? 'success' : payment.status === 'pending' ? 'warning' : 'destructive'}>
                        {payment.status}
                      </Badge>
                    </td>
                    <td className="py-3 px-2">
                      {payment.status === 'pending' && (
                        <div className="flex gap-1">
                          <Button variant="ghost" size="sm" className="text-green-600" onClick={() => handleConfirm(payment.id)}>
                            <CheckCircle className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="text-red-600" onClick={() => handleReject(payment.id)}>
                            <XCircle className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
                {payments.length === 0 && (
                  <tr><td colSpan={6} className="text-center py-8 text-muted-foreground"><CreditCard className="h-8 w-8 mx-auto mb-2 opacity-50" />No payments recorded yet</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}