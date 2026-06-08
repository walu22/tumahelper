'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { Calendar, Clock, DollarSign, ArrowUpRight } from 'lucide-react'

export default function EarningsPage() {
  const earningsData = [
    { month: 'June 2026', amount: 125000, bookings: 4, fee: 12500 },
    { month: 'May 2026', amount: 87500, bookings: 3, fee: 8750 },
    { month: 'April 2026', amount: 50000, bookings: 2, fee: 5000 },
  ]

  return (
    <div className="min-h-screen">
      <Header />
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
                  <p className="text-xs text-muted-foreground">Total Earnings</p>
                  <p className="text-2xl font-bold">ZMW 2,625</p>
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
                  <p className="text-xs text-muted-foreground">This Month</p>
                  <p className="text-2xl font-bold">ZMW 1,250</p>
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
                  <p className="text-xs text-muted-foreground">Platform Fees Paid</p>
                  <p className="text-2xl font-bold">ZMW 262</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Earnings History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {earningsData.map((item) => (
                <div key={item.month} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-medium">{item.month}</p>
                    <p className="text-sm text-muted-foreground">{item.bookings} bookings</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">ZMW {(item.amount / 100).toFixed(2)}</p>
                    <p className="text-xs text-muted-foreground">Fee: ZMW {(item.fee / 100).toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  )
}