import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, FileText, CalendarCheck, CreditCard, AlertTriangle } from 'lucide-react'

export default function AdminDashboard() {
  const stats = [
    { label: 'Total Workers', value: '5', icon: Users, color: 'bg-blue-500' },
    { label: 'Pending Documents', value: '2', icon: FileText, color: 'bg-yellow-500' },
    { label: 'Active Bookings', value: '3', icon: CalendarCheck, color: 'bg-green-500' },
    { label: 'Pending Payments', value: '1', icon: CreditCard, color: 'bg-purple-500' },
    { label: 'Open Disputes', value: '0', icon: AlertTriangle, color: 'bg-red-500' },
  ]

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