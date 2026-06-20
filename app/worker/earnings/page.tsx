'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Calendar, DollarSign, ArrowUpRight, Loader2 } from 'lucide-react'
import { formatCurrency } from '@/utils/formatters'
import type { WorkerEarningsSummary } from '@/lib/workers/earnings'

export default function EarningsPage() {
  const [summary, setSummary] = useState<WorkerEarningsSummary | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/workers/me/earnings')
      .then((res) => res.json())
      .then((json) => {
        if (!json.success) {
          throw new Error(json.error || 'Could not load earnings')
        }
        setSummary(json.data)
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : 'Could not load earnings')
      })
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-muted-foreground">
        <Loader2 className="h-5 w-5 animate-spin mr-2" />
        Loading earnings…
      </div>
    )
  }

  if (error || !summary) {
    return (
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold mb-4">Earnings</h1>
        <p className="text-muted-foreground mb-6">{error || 'No earnings data yet.'}</p>
        <Button variant="outline" asChild>
          <Link href="/worker/dashboard">Back to dashboard</Link>
        </Button>
      </main>
    )
  }

  return (
    <div className="min-h-screen">
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold mb-8">Earnings</h1>

        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-green-100 rounded-full flex items-center justify-center">
                  <DollarSign className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Total earnings</p>
                  <p className="text-2xl font-bold">{formatCurrency(summary.totalEarnings)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <Calendar className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">This month</p>
                  <p className="text-2xl font-bold">{formatCurrency(summary.earningsThisMonth)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-purple-100 rounded-full flex items-center justify-center">
                  <ArrowUpRight className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Platform fees paid</p>
                  <p className="text-2xl font-bold">{formatCurrency(summary.totalFees)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Earnings history</CardTitle>
          </CardHeader>
          <CardContent>
            {summary.monthlyHistory.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Completed paid bookings will show up here month by month.
              </p>
            ) : (
              <div className="space-y-4">
                {summary.monthlyHistory.map((item) => (
                  <div
                    key={item.month}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div>
                      <p className="font-medium">{item.label}</p>
                      <p className="text-sm text-muted-foreground">
                        {item.bookings} booking{item.bookings === 1 ? '' : 's'}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">{formatCurrency(item.amount)}</p>
                      <p className="text-xs text-muted-foreground">
                        Fee: {formatCurrency(item.fee)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
