import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ClipboardList } from 'lucide-react'

async function getAuditLogs() {
  const { createServerSupabaseClient } = await import('@/lib/supabase-server')
  const supabase = createServerSupabaseClient()

  const { data: logs } = await supabase
    .from('audit_logs')
    .select('*, admin:admin_id(phone)')
    .order('created_at', { ascending: false })
    .limit(50)

  return logs || []
}

export default async function AdminAuditPage() {
  const logs = await getAuditLogs()

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Audit Logs</h1>

      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-2 font-medium">Action</th>
                  <th className="text-left py-3 px-2 font-medium">Entity</th>
                  <th className="text-left py-3 px-2 font-medium">Admin</th>
                  <th className="text-left py-3 px-2 font-medium">Date</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log: any) => (
                  <tr key={log.id} className="border-b hover:bg-surface">
                    <td className="py-3 px-2">{log.action.replace(/_/g, ' ')}</td>
                    <td className="py-3 px-2 text-muted-foreground">
                      {log.entity_type}:{log.entity_id.slice(0, 8)}...
                    </td>
                    <td className="py-3 px-2 text-muted-foreground">
                      {log.admin?.phone || 'System'}
                    </td>
                    <td className="py-3 px-2 text-muted-foreground">
                      {new Date(log.created_at).toLocaleString()}
                    </td>
                  </tr>
                ))}
                {logs.length === 0 && (
                  <tr>
                    <td colSpan={4} className="text-center py-8 text-muted-foreground">
                      <ClipboardList className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      No audit logs yet
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