'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { supabaseClient as supabase } from '@/lib/supabase-client'
import Link from 'next/link'

export default function NewJobPage() {
  const router = useRouter()
  const [form, setForm] = useState({
    title: '',
    category: '',
    location: '',
    city: 'Lusaka',
    salaryMin: '',
    salaryMax: '',
    employmentType: '',
    description: '',
    requirements: '',
    benefits: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const { data: { user } } = await supabase.auth.getUser()

    if (user) {
      const salaryMin = form.salaryMin ? parseInt(form.salaryMin) * 100 : null
      const salaryMax = form.salaryMax ? parseInt(form.salaryMax) * 100 : null
      const placementFee = salaryMax ? Math.round(salaryMax * 0.1) : 20000

      await supabase.from('job_posts').insert({
        employer_id: user.id,
        title: form.title,
        category: form.category,
        location: form.location,
        city: form.city,
        salary_min: salaryMin,
        salary_max: salaryMax,
        employment_type: form.employmentType,
        description: form.description,
        requirements: form.requirements,
        benefits: form.benefits,
        placement_fee: placementFee,
        status: 'open',
      })

      router.push('/employer/dashboard')
    }
  }

  return (
    <div className="min-h-screen">
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link href="/employer/dashboard" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="h-4 w-4" /> Back to dashboard
        </Link>
        <h1 className="text-3xl font-bold mb-8">Post a Job</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Job Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-1.5 block">Job Title</label>
                <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="e.g. Full-Time Nanny for 2 Children" required />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <button type="button" className={`p-3 rounded-lg border-2 text-center ${form.category === 'nanny' ? 'border-primary bg-primary/5' : ''}`} onClick={() => setForm({ ...form, category: 'nanny' })}>
                  <span className="font-medium text-sm">Nanny</span>
                </button>
                <button type="button" className={`p-3 rounded-lg border-2 text-center ${form.category === 'house_cleaner' ? 'border-primary bg-primary/5' : ''}`} onClick={() => setForm({ ...form, category: 'house_cleaner' })}>
                  <span className="font-medium text-sm">House Cleaner</span>
                </button>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Employment Type</label>
                  <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={form.employmentType} onChange={(e) => setForm({ ...form, employmentType: e.target.value })}>
                    <option value="">Select...</option>
                    <option value="full_time">Full Time</option>
                    <option value="part_time">Part Time</option>
                    <option value="live_in">Live In</option>
                    <option value="contract">Contract</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Location</label>
                  <Input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} placeholder="e.g. Kabulonga, Lusaka" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Salary Min (ZMW)</label>
                  <Input type="number" value={form.salaryMin} onChange={(e) => setForm({ ...form, salaryMin: e.target.value })} placeholder="e.g. 2000" />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Salary Max (ZMW)</label>
                  <Input type="number" value={form.salaryMax} onChange={(e) => setForm({ ...form, salaryMax: e.target.value })} placeholder="e.g. 3500" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Description</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-1.5 block">Job Description</label>
                <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={5} placeholder="Describe the role, duties, and what you're looking for..." required />
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">Requirements</label>
                <Textarea value={form.requirements} onChange={(e) => setForm({ ...form, requirements: e.target.value })} rows={3} placeholder="Experience, certifications, skills needed..." />
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">Benefits</label>
                <Textarea value={form.benefits} onChange={(e) => setForm({ ...form, benefits: e.target.value })} rows={3} placeholder="Accommodation, meals, transport allowance..." />
              </div>
            </CardContent>
          </Card>

          <Button type="submit" size="lg" className="w-full">Post Job</Button>
        </form>
      </main>
    </div>
  )
}