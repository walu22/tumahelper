import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { formatCurrency, formatDate } from '@/utils/formatters'
import { MapPin, Briefcase, Clock, DollarSign, Eye } from 'lucide-react'
import Link from 'next/link'

async function getJob(id: string) {
  const { createServerSupabaseClient } = await import('@/lib/supabase-server')
  const supabase = createServerSupabaseClient()

  const { data: job } = await supabase
    .from('job_posts')
    .select('*')
    .eq('id', id)
    .single()

  return job
}

export default async function JobDetailPage({ params }: { params: { id: string } }) {
  const job = await getJob(params.id)

  if (!job) {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="max-w-3xl mx-auto px-4 py-16 text-center">
          <p className="text-muted-foreground text-lg">Job not found</p>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <Header />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-2">
                  <h1 className="text-2xl font-bold">{job.title}</h1>
                  <Badge variant="success" className="capitalize">{job.employment_type.replace(/_/g, ' ')}</Badge>
                </div>

                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                  <span className="flex items-center gap-1"><MapPin className="h-4 w-4" /> {job.location}</span>
                  <span className="flex items-center gap-1 capitalize"><Briefcase className="h-4 w-4" /> {job.category.replace(/_/g, ' ')}</span>
                  <span className="flex items-center gap-1"><Clock className="h-4 w-4" /> Posted {formatDate(job.created_at)}</span>
                </div>

                <div className="p-4 bg-green-50 rounded-lg mb-6">
                  <div className="flex items-center gap-2 text-lg font-bold text-primary">
                    <DollarSign className="h-5 w-5" />
                    {job.salary_min ? `${formatCurrency(job.salary_min)} - ${formatCurrency(job.salary_max || job.salary_min)}/month` : 'Negotiable'}
                  </div>
                </div>

                <div className="mb-6">
                  <h2 className="font-semibold mb-2">Description</h2>
                  <p className="text-muted-foreground whitespace-pre-wrap">{job.description}</p>
                </div>

                {job.requirements && (
                  <div className="mb-6">
                    <h2 className="font-semibold mb-2">Requirements</h2>
                    <p className="text-muted-foreground whitespace-pre-wrap">{job.requirements}</p>
                  </div>
                )}

                {job.benefits && (
                  <div className="mb-6">
                    <h2 className="font-semibold mb-2">Benefits</h2>
                    <p className="text-muted-foreground whitespace-pre-wrap">{job.benefits}</p>
                  </div>
                )}

                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Eye className="h-4 w-4" />
                  <span>{job.views_count} views &middot; {job.applications_count} applications</span>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4">
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-3">Apply for this job</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Interested in this position? Submit your application.
                </p>
                <Link href={`/api/jobs/${job.id}/apply`}>
                  <Button className="w-full">Apply Now</Button>
                </Link>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-3">Job Details</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Type</span>
                    <span className="capitalize font-medium">{job.employment_type.replace(/_/g, ' ')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Category</span>
                    <span className="capitalize font-medium">{job.category.replace(/_/g, ' ')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Experience</span>
                    <span className="font-medium">{job.required_experience_years}+ years</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Verification</span>
                    <span className="font-medium capitalize">{job.required_verification_level}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <p className="text-sm text-muted-foreground">
                  <span className="font-medium text-foreground">{job.placement_fee ? formatCurrency(job.placement_fee) : 'N/A'}</span>
                  {' '}placement fee
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}