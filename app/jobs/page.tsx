import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { formatCurrency } from '@/utils/formatters'
import { MapPin, Briefcase, Clock, Eye } from 'lucide-react'
import Link from 'next/link'

async function getJobs() {
  const { createServerSupabaseClient } = await import('@/lib/supabase-server')
  const supabase = createServerSupabaseClient()

  const { data: jobs } = await supabase
    .from('job_posts')
    .select('*')
    .eq('status', 'open')
    .order('created_at', { ascending: false })

  return jobs || []
}

export default async function JobsPage() {
  const jobs = await getJobs()

  return (
    <div className="min-h-screen">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Job Opportunities</h1>
          <p className="text-muted-foreground">
            Find permanent and long-term positions with Lusaka families
          </p>
        </div>

        <div className="grid gap-4">
          {jobs.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-muted-foreground text-lg">No job posts available right now.</p>
            </div>
          ) : (
            jobs.map((job: any) => (
              <Card key={job.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h2 className="text-lg font-semibold">{job.title}</h2>
                        <Badge variant="secondary" className="capitalize">{job.employment_type.replace('_', ' ')}</Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3.5 w-3.5" /> {job.area || job.city}
                        </span>
                        <span className="flex items-center gap-1 capitalize">
                          <Briefcase className="h-3.5 w-3.5" /> {job.category.replace('_', ' ')}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{job.description}</p>
                      <div className="flex items-center gap-3 text-sm">
                        <span className="font-medium">{formatCurrency(job.salary_min || 0)} - {formatCurrency(job.salary_max || 0)}</span>
                        <span className="flex items-center gap-1 text-muted-foreground">
                          <Eye className="h-3.5 w-3.5" /> {job.views_count} views
                        </span>
                      </div>
                    </div>
                    <Link href={`/jobs/${job.id}`}>
                      <Button variant="outline" size="sm">View Details</Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </main>
    </div>
  )
}