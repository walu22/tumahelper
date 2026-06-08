import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { WorkerCard } from '@/components/worker/worker-card'
import { Users } from 'lucide-react'

async function getCandidates() {
  const { createServerSupabaseClient } = await import('@/lib/supabase-server')
  const supabase = createServerSupabaseClient()

  const { data: workers } = await supabase
    .from('worker_profiles')
    .select('*')
    .eq('availability_status', 'available')
    .order('trust_score', { ascending: false })
    .limit(20)

  return workers || []
}

export default async function CandidatesPage() {
  const workers = await getCandidates()

  return (
    <div className="min-h-screen">
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold mb-2">Find Candidates</h1>
        <p className="text-muted-foreground mb-8">Browse workers available for permanent hiring</p>

        {workers.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            <Users className="h-10 w-10 mx-auto mb-3 text-muted-foreground/50" />
            <p>No candidates available right now</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {workers.map((worker: any) => (
              <WorkerCard key={worker.id} worker={worker} />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}