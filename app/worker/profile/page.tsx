'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import Link from 'next/link'
import { User, Phone, MapPin, Briefcase, Globe, Award, Upload, CheckCircle } from 'lucide-react'

export default function WorkerProfilePage() {
  const [form, setForm] = useState({
    fullName: '',
    city: 'Lusaka',
    area: '',
    category: '',
    bio: '',
    experienceYears: 0,
    languages: '',
    skills: '',
  })

  return (
    <div className="min-h-screen">
      <Header />
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
              <div>
                <label className="text-sm font-medium mb-1.5 block">Years of Experience</label>
                <Input
                  type="number"
                  value={form.experienceYears}
                  onChange={(e) => setForm({ ...form, experienceYears: parseInt(e.target.value) || 0 })}
                />
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
                <label className="text-sm font-medium mb-1.5 block">Skills</label>
                <Input
                  value={form.skills}
                  onChange={(e) => setForm({ ...form, skills: e.target.value })}
                  placeholder="e.g. infant care, meal prep, first aid"
                />
                <p className="text-xs text-muted-foreground mt-1">Separate with commas</p>
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
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-gray-600" />
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

          <Button className="w-full" size="lg">Save Profile</Button>
        </div>
      </main>
      <Footer />
    </div>
  )
}