import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { VerificationBadge } from '@/components/verification/verification-badge'
import { Users, Shield, CheckCircle, XCircle } from 'lucide-react'
import Link from 'next/link'

async function getWorkers() {
  const { createServerSupabaseClient } = await import('@/lib/supabase-server')
  const supabase = createServerSupabaseClient()

  const { data: workers } = await supabase
    .from('worker_profiles')
    .select('*')
    .order('created_at', { ascending: false })

  return workers || []
}

export default async function AdminWorkersPage() {
  const workers = await getWorkers()

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>All Workers ({workers.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-2 font-medium">Name</th>
                  <th className="text-left py-3 px-2 font-medium">Category</th>
                  <th className="text-left py-3 px-2 font-medium">Location</th>
                  <th className="text-left py-3 px-2 font-medium">Verification</th>
                  <th className="text-left py-3 px-2 font-medium">Trust Score</th>
                  <th className="text-left py-3 px-2 font-medium">Status</th>
                  <th className="text-left py-3 px-2 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {workers.map((worker: any) => (
                  <tr key={worker.id} className="border-b hover:bg-surface">
                    <td className="py-3 px-2 font-medium">{worker.full_name}</td>
                    <td className="py-3 px-2 capitalize">{worker.category.replace('_', ' ')}</td>
                    <td className="py-3 px-2 text-muted-foreground">{worker.area}, {worker.city}</td>
                    <td className="py-3 px-2">
                      <VerificationBadge level={worker.verification_level || 'none'} size="sm" />
                    </td>
                    <td className="py-3 px-2">
                      <span className={`font-mono font-bold ${
                        worker.trust_score >= 80 ? 'text-green-600' :
                        worker.trust_score >= 60 ? 'text-yellow-600' :
                        worker.trust_score >= 40 ? 'text-orange-600' : 'text-red-600'
                      }`}>
                        {worker.trust_score}
                      </span>
                    </td>
                    <td className="py-3 px-2">
                      <Badge variant={worker.availability_status === 'available' ? 'success' : 'secondary'}>
                        {worker.availability_status?.replace('_', ' ')}
                      </Badge>
                    </td>
                    <td className="py-3 px-2">
                      <div className="flex gap-1">
                        <Link href={`/admin/workers/${worker.id}`}>
                          <Button variant="ghost" size="sm">
                            <Shield className="h-4 w-4" />
                          </Button>
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
                {workers.length === 0 && (
                  <tr>
                    <td colSpan={7} className="text-center py-8 text-muted-foreground">
                      <Users className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      No workers registered yet
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}