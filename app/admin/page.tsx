import { Card, CardContent } from '@/components/ui/card'
import { Users, FileText, CalendarCheck, CreditCard, AlertTriangle } from 'lucide-react'
import { getSupabaseServer } from '@/lib/supabase'

async function getStats() {
  const supabase = getSupabaseServer()

  const { count: totalWorkers } = await supabase
    .from('worker_profiles')
    .select('*', { count: 'exact', head: true })

  const { count: pendingDocuments } = await supabase
    .from('verification_documents')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'submitted')

  const { count: activeBookings } = await supabase
    .from('bookings')
    .select('*', { count: 'exact', head: true })
    .in('status', ['pending', 'accepted', 'in_progress'])

  const { count: pendingPayments } = await supabase
    .from('payments')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'paid')

  const { count: openDisputes } = await supabase
    .from('disputes')
    .select('*', { count: 'exact', head: true })
    .neq('status', 'resolved')

  return [
    { label: 'Total Workers', value: String(totalWorkers ?? 0), icon: Users, color: 'bg-blue-500' },
    { label: 'Pending Documents', value: String(pendingDocuments ?? 0), icon: FileText, color: 'bg-yellow-500' },
    { label: 'Active Bookings', value: String(activeBookings ?? 0), icon: CalendarCheck, color: 'bg-green-500' },
    { label: 'Pending Payments', value: String(pendingPayments ?? 0), icon: CreditCard, color: 'bg-purple-500' },
    { label: 'Open Disputes', value: String(openDisputes ?? 0), icon: AlertTriangle, color: 'bg-red-500' },
  ]
}

export default async function AdminDashboard() {
  const stats = await getStats()

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
      <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.label}>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className={`h-10 w-10 ${stat.color} rounded-full flex items-center justify-center`}>
                    <Icon className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <p className="text-xs text-muted-foreground">{stat.label}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}