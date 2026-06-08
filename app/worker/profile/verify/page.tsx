'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { VerificationBadge } from '@/components/verification/verification-badge'
import { Upload, Shield, Phone, CheckCircle, ArrowRight } from 'lucide-react'
import Link from 'next/link'

export default function WorkerVerifyPage() {
  const [referees, setReferees] = useState([
    { name: '', phone: '', relationship: '', workPeriod: '' },
    { name: '', phone: '', relationship: '', workPeriod: '' },
  ])

  return (
    <div className="min-h-screen">

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold mb-2">Get Verified</h1>
        <p className="text-muted-foreground mb-8">
          Build trust with customers by completing your verification
        </p>

        <div className="space-y-3 mb-8">
          <div className="flex items-center gap-3 p-4 bg-green-50 rounded-lg border border-green-200">
            <Phone className="h-5 w-5 text-green-600" />
            <div className="flex-1">
              <p className="font-medium text-sm">Phone & Profile</p>
              <p className="text-xs text-green-600">Completed</p>
            </div>
            <CheckCircle className="h-5 w-5 text-green-600" />
          </div>

          <div className="flex items-center gap-3 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
            <Shield className="h-5 w-5 text-yellow-600" />
            <div className="flex-1">
              <p className="font-medium text-sm">ID Verification (NRC)</p>
              <p className="text-xs text-yellow-600">Upload front and back of your NRC</p>
            </div>
            <Button size="sm" variant="outline">
              <Upload className="h-4 w-4 mr-1" /> Upload
            </Button>
          </div>

          <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg border">
            <Shield className="h-5 w-5 text-gray-400" />
            <div className="flex-1">
              <p className="font-medium text-sm">Reference Check</p>
              <p className="text-xs text-muted-foreground">Add 2 references for admin to call</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg border">
            <Shield className="h-5 w-5 text-gray-400" />
            <div className="flex-1">
              <p className="font-medium text-sm">Police Clearance</p>
              <p className="text-xs text-muted-foreground">Upload police clearance certificate</p>
            </div>
          </div>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Current Badge</CardTitle>
            <CardDescription>Your verification level determines which customers can see you</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center p-6">
              <VerificationBadge level="bronze" size="lg" />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
              {[
                { level: 'bronze' as const, label: 'Phone Verified' },
                { level: 'silver' as const, label: 'ID Verified' },
                { level: 'gold' as const, label: 'Reference Checked' },
                { level: 'platinum' as const, label: 'Police Cleared' },
              ].map((badge) => (
                <div key={badge.level} className="text-center p-2">
                  <VerificationBadge level={badge.level} size="sm" showLabel={false} />
                  <p className="text-xs mt-1">{badge.label}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Add References</CardTitle>
            <CardDescription>Add 2 people who can vouch for your work</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {referees.map((ref, i) => (
              <div key={i} className="p-4 border rounded-lg space-y-3">
                <p className="font-medium text-sm">Reference {i + 1}</p>
                <Input
                  placeholder="Full Name"
                  value={ref.name}
                  onChange={(e) => {
                    const newRefs = [...referees]
                    newRefs[i].name = e.target.value
                    setReferees(newRefs)
                  }}
                />
                <Input
                  placeholder="Phone Number (+260...)"
                  value={ref.phone}
                  onChange={(e) => {
                    const newRefs = [...referees]
                    newRefs[i].phone = e.target.value
                    setReferees(newRefs)
                  }}
                />
                <Input
                  placeholder="Relationship (e.g. Former Employer)"
                  value={ref.relationship}
                  onChange={(e) => {
                    const newRefs = [...referees]
                    newRefs[i].relationship = e.target.value
                    setReferees(newRefs)
                  }}
                />
                <Input
                  placeholder="Work Period (e.g. Jan 2022 - Dec 2023)"
                  value={ref.workPeriod}
                  onChange={(e) => {
                    const newRefs = [...referees]
                    newRefs[i].workPeriod = e.target.value
                    setReferees(newRefs)
                  }}
                />
              </div>
            ))}
            <Button className="w-full">
              <Shield className="h-4 w-4 mr-2" />
              Submit for Verification
            </Button>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}