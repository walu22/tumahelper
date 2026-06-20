'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { toast } from 'sonner'
import Link from 'next/link'
import { User, Phone, MapPin, Briefcase, Globe, Award, Upload, CheckCircle, Loader2, Save } from 'lucide-react'
import { WORKER_SKILLS_BY_CATEGORY } from '@/lib/workers/skills'
import type { WorkerCategory } from '@/types'

const EMPLOYMENT_TYPES = ['full_time', 'part_time', 'live_in', 'live_out', 'contract'] as const
const EMPLOYMENT_LABELS: Record<string, string> = {
  full_time: 'Full Time',
  part_time: 'Part Time',
  live_in: 'Live In',
  live_out: 'Live Out',
  contract: 'Contract',
}

const AVAILABILITY_OPTIONS = [
  { value: 'available', label: 'Available for new jobs' },
  { value: 'busy', label: 'Busy (not taking new jobs)' },
]

export default function WorkerProfilePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const [form, setForm] = useState({
    fullName: '',
    city: 'Lusaka',
    area: '',
    category: '' as 'nanny' | 'house_cleaner' | '',
    bio: '',
    experienceYears: 0,
    languages: '',
    skills: '',
    employmentTypes: [] as string[],
    availabilityStatus: 'available',
    expectedSalaryMin: '',
    expectedSalaryMax: '',
    dateOfBirth: '',
    gender: '' as string,
  })

  useEffect(() => {
    async function loadProfile() {
      try {
        const res = await fetch('/api/workers/me/profile')
        const json = await res.json()
        if (json.success && json.data) {
          const p = json.data
          setForm({
            fullName: p.full_name || '',
            city: p.city || 'Lusaka',
            area: p.area || '',
            category: p.category || '',
            bio: p.bio || '',
            experienceYears: p.experience_years || 0,
            languages: (p.languages || []).join(', '),
            skills: (p.skills || []).join(', '),
            employmentTypes: p.employment_types || [],
            availabilityStatus: p.availability_status || 'available',
            expectedSalaryMin: p.expected_salary_min ? String(p.expected_salary_min / 100) : '',
            expectedSalaryMax: p.expected_salary_max ? String(p.expected_salary_max / 100) : '',
            dateOfBirth: p.date_of_birth || '',
            gender: p.gender || '',
          })
        }
      } catch {
        // new profile, form stays empty
      } finally {
        setLoading(false)
      }
    }
    loadProfile()
  }, [])

  function toggleEmploymentType(type: string) {
    setForm((prev) => ({
      ...prev,
      employmentTypes: prev.employmentTypes.includes(type)
        ? prev.employmentTypes.filter((t) => t !== type)
        : [...prev.employmentTypes, type],
    }))
  }

  function parseSkills(value: string) {
    return value.split(',').map((skill) => skill.trim()).filter(Boolean)
  }

  function toggleSkill(skill: string) {
    setForm((prev) => {
      const current = parseSkills(prev.skills)
      const next = current.includes(skill)
        ? current.filter((item) => item !== skill)
        : [...current, skill]
      return { ...prev, skills: next.join(', ') }
    })
  }

  async function handleSave() {
    if (!form.fullName || !form.area || !form.category) {
      toast.error('Please fill in your name, area, and category')
      return
    }
    if (form.employmentTypes.length === 0) {
      toast.error('Select at least one employment type')
      return
    }
    if (parseSkills(form.skills).length === 0) {
      toast.error('Select at least one skill')
      return
    }

    setSaving(true)
    try {
      const body = {
        fullName: form.fullName,
        city: form.city,
        area: form.area,
        category: form.category,
        bio: form.bio || undefined,
        experienceYears: form.experienceYears,
        languages: form.languages.split(',').map((s) => s.trim()).filter(Boolean),
        skills: parseSkills(form.skills),
        employmentTypes: form.employmentTypes,
        availabilityStatus: form.availabilityStatus,
        expectedSalaryMin: form.expectedSalaryMin ? Math.round(parseFloat(form.expectedSalaryMin) * 100) : undefined,
        expectedSalaryMax: form.expectedSalaryMax ? Math.round(parseFloat(form.expectedSalaryMax) * 100) : undefined,
        dateOfBirth: form.dateOfBirth || undefined,
        gender: form.gender || undefined,
      }

      const res = await fetch('/api/workers/me/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })

      const json = await res.json()

      if (!json.success) {
        throw new Error(json.error?.message || 'Failed to save profile')
      }

      toast.success('Profile saved successfully!')
      router.refresh()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="min-h-screen">

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold mb-2">My Profile</h1>
        <p className="text-muted-foreground mb-8">Complete your profile to get more bookings</p>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" /> Basic Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Full Name</label>
                  <Input
                    value={form.fullName}
                    onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                    placeholder="Your full name"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Area in Lusaka</label>
                  <Input
                    value={form.area}
                    onChange={(e) => setForm({ ...form, area: e.target.value })}
                    placeholder="e.g. Kabulonga, Woodlands"
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">Category</label>
                <div className="grid md:grid-cols-2 gap-3">
                  <button
                    className={`p-4 rounded-lg border-2 text-left transition-colors ${
                      form.category === 'nanny' ? 'border-primary bg-primary/5' : 'hover:border-primary/50'
                    }`}
                    onClick={() => setForm({ ...form, category: 'nanny' })}
                  >
                    <Briefcase className="h-5 w-5 text-primary mb-1" />
                    <span className="font-medium block">Nanny</span>
                    <span className="text-xs text-muted-foreground">Childcare services</span>
                  </button>
                  <button
                    className={`p-4 rounded-lg border-2 text-left transition-colors ${
                      form.category === 'house_cleaner' ? 'border-primary bg-primary/5' : 'hover:border-primary/50'
                    }`}
                    onClick={() => setForm({ ...form, category: 'house_cleaner' })}
                  >
                    <Briefcase className="h-5 w-5 text-primary mb-1" />
                    <span className="font-medium block">House Cleaner</span>
                    <span className="text-xs text-muted-foreground">Cleaning services</span>
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" /> About You
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-1.5 block">Bio</label>
                <Textarea
                  value={form.bio}
                  onChange={(e) => setForm({ ...form, bio: e.target.value })}
                  placeholder="Tell customers about yourself, your experience, and what makes you great..."
                  rows={4}
                />
                <p className="text-xs text-muted-foreground mt-1">Maximum 500 characters</p>
              </div>
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Years of Experience</label>
                  <Input
                    type="number"
                    min="0"
                    max="50"
                    value={form.experienceYears}
                    onChange={(e) => setForm({ ...form, experienceYears: parseInt(e.target.value) || 0 })}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Date of Birth</label>
                  <Input
                    type="date"
                    value={form.dateOfBirth}
                    onChange={(e) => setForm({ ...form, dateOfBirth: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Gender</label>
                  <select
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    value={form.gender}
                    onChange={(e) => setForm({ ...form, gender: e.target.value })}
                  >
                    <option value="">Prefer not to say</option>
                    <option value="female">Female</option>
                    <option value="male">Male</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">Languages Spoken</label>
                <Input
                  value={form.languages}
                  onChange={(e) => setForm({ ...form, languages: e.target.value })}
                  placeholder="e.g. English, Bemba, Nyanja"
                />
                <p className="text-xs text-muted-foreground mt-1">Separate with commas</p>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Skills</label>
                {form.category ? (
                  <div className="flex flex-wrap gap-2">
                    {WORKER_SKILLS_BY_CATEGORY[form.category as WorkerCategory].map((skill) => (
                      <button
                        key={skill}
                        type="button"
                        onClick={() => toggleSkill(skill)}
                        className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                          parseSkills(form.skills).includes(skill)
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-surface text-foreground border border-border'
                        }`}
                      >
                        {skill.replace(/_/g, ' ')}
                      </button>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    Choose nanny or house cleaning above to select your skills.
                  </p>
                )}
                <p className="text-xs text-muted-foreground mt-2">
                  Pick the services you can do. Customers are matched based on these skills.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="h-5 w-5" /> Employment Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Employment Types</label>
                <div className="flex flex-wrap gap-2">
                  {EMPLOYMENT_TYPES.map((type) => (
                    <button
                      key={type}
                      onClick={() => toggleEmploymentType(type)}
                      className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
                        form.employmentTypes.includes(type)
                          ? 'bg-primary text-white border-primary'
                          : 'bg-background hover:border-primary/50'
                      }`}
                    >
                      {EMPLOYMENT_LABELS[type]}
                    </button>
                  ))}
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Expected Salary Min (ZMW/day)</label>
                  <Input
                    type="number"
                    min="0"
                    value={form.expectedSalaryMin}
                    onChange={(e) => setForm({ ...form, expectedSalaryMin: e.target.value })}
                    placeholder="e.g. 200"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Expected Salary Max (ZMW/day)</label>
                  <Input
                    type="number"
                    min="0"
                    value={form.expectedSalaryMax}
                    onChange={(e) => setForm({ ...form, expectedSalaryMax: e.target.value })}
                    placeholder="e.g. 500"
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Availability</label>
                <div className="space-y-2">
                  {AVAILABILITY_OPTIONS.map((opt) => (
                    <label
                      key={opt.value}
                      className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                        form.availabilityStatus === opt.value ? 'border-primary bg-primary/5' : 'hover:border-primary/50'
                      }`}
                    >
                      <input
                        type="radio"
                        name="availability"
                        value={opt.value}
                        checked={form.availabilityStatus === opt.value}
                        onChange={(e) => setForm({ ...form, availabilityStatus: e.target.value })}
                        className="h-4 w-4 text-primary"
                      />
                      <span className="text-sm">{opt.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5" /> Verification
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-green-600" />
                    <span className="text-sm font-medium">Phone Verified</span>
                  </div>
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </div>
                <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Upload className="h-4 w-4 text-yellow-600" />
                    <span className="text-sm font-medium">NRC Documents</span>
                  </div>
                  <Badge variant="warning">Pending</Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-surface rounded-lg">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">References</span>
                  </div>
                  <Badge variant="outline">Not Started</Badge>
                </div>
              </div>
              <Link href="/worker/profile/verify">
                <Button variant="outline" className="w-full mt-4">
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Documents to Get Verified
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Button className="w-full" size="lg" onClick={handleSave} disabled={saving}>
            {saving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Profile
              </>
            )}
          </Button>
        </div>
      </main>
    </div>
  )
}
