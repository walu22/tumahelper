import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Briefcase, Plus } from 'lucide-react'
import Link from 'next/link'

async function getEmployerJobs() {
  const { createServerSupabaseClient } = await import('@/lib/supabase-server')
  const supabase = createServerSupabaseClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  const { data: jobs } = await supabase
    .from('job_posts')
    .select('*')
    .eq('employer_id', user.id)
    .order('created_at', { ascending: false })

  return jobs || []
}

export default async function EmployerJobsPage() {
  const jobs = await getEmployerJobs()

  return (
    <div className="min-h-screen">
      <Header />
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">My Jobs</h1>
            <p className="text-muted-foreground">Manage your job listings</p>
          </div>
          <Link href="/employer/jobs/new">
            <Button><Plus className="h-4 w-4 mr-2" /> Post a Job</Button>
          </Link>
        </div>

        {jobs.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            <Briefcase className="h-10 w-10 mx-auto mb-3 text-muted-foreground/50" />
            <p>No job posts yet</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {jobs.map((job: any) => (
              <Card key={job.id}>
                <CardContent className="p-4 flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold">{job.title}</h3>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span className="capitalize">{job.category.replace('_', ' ')}</span>
                      <span>&middot;</span>
                      <span className="capitalize">{job.employment_type.replace('_', ' ')}</span>
                      <span>&middot;</span>
                      <span>{job.location}</span>
                    </div>
                  </div>
                  <Badge>{job.status}</Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  )
}