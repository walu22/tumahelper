'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { BarChart3, TrendingUp, Users, CalendarCheck, DollarSign } from 'lucide-react'
import { supabaseClient as supabase } from '@/lib/supabase-client'

export default function AdminAnalyticsPage() {
  const [stats, setStats] = useState({ activeWorkers: 0, monthlyBookings: 0, revenue: 0, growth: '+0%' })

  useEffect(() => {
    async function fetchData() {
      const now = new Date()
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()
      const prevMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString()

      const { count: workerCount } = await supabase.from('worker_profiles').select('*', { count: 'exact', head: true }).eq('availability_status', 'available')
      const { data: monthBookings } = await supabase.from('bookings').select('platform_fee').gte('created_at', monthStart)
      const { count: prevCount } = await supabase.from('bookings').select('*', { count: 'exact', head: true }).gte('created_at', prevMonthStart).lt('created_at', monthStart)

      const revenue = (monthBookings || []).reduce((s, b) => s + (b.platform_fee || 0), 0)
      const currentCount = monthBookings?.length || 0
      const growth = prevCount && prevCount > 0 ? `+${Math.round((currentCount - prevCount) / prevCount * 100)}%` : '+0%'

      setStats({ activeWorkers: workerCount || 0, monthlyBookings: currentCount, revenue, growth })
    }
    fetchData()
  }, [])

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Analytics</h1>
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                <Users className="h-5 w-5 text-blue-600 dark:text-blue-300" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Active Workers</p>
                <p className="text-xl font-bold">{stats.activeWorkers}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                <CalendarCheck className="h-5 w-5 text-green-600 dark:text-green-300" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">This Month</p>
                <p className="text-xl font-bold">{stats.monthlyBookings}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-yellow-100 dark:bg-yellow-900 rounded-full flex items-center justify-center">
                <DollarSign className="h-5 w-5 text-yellow-600 dark:text-yellow-300" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Revenue (ZMW)</p>
                <p className="text-xl font-bold">{(stats.revenue / 100).toFixed(2)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-purple-600 dark:text-purple-300" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Growth</p>
                <p className="text-xl font-bold">{stats.growth}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader><CardTitle>Revenue Summary</CardTitle></CardHeader>
        <CardContent className="flex items-center justify-center h-48 text-muted-foreground">
          <BarChart3 className="h-8 w-8 mr-2" />
          <span>Chart placeholder. Integrate with Recharts.</span>
        </CardContent>
      </Card>
    </div>
  )
}