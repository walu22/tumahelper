'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { supabaseClient } from '@/lib/supabase-client'
import { formatCurrency } from '@/lib/utils'
import { toast } from 'sonner'
import { Search, MapPin, Clock, Users, Home, Star, Shield, ChevronRight, ChevronLeft, Loader2 } from 'lucide-react'

interface Category {
  id: string
  name: string
  slug: string
  icon: string | null
}

interface WorkerSummary {
  id: string
  user_id: string
  full_name: string
  city: string
  area: string
  category: string
  profile_photo_url: string | null
  average_rating: number
  total_reviews: number
  trust_score: number
  verification_level: string
  experience_years: number
  availability_status: string
}

const categoryWorkerSlug: Record<string, string> = {
  'nanny-services': 'nanny',
  'house-cleaning': 'house_cleaner',
}

export default function BookPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [submitting, setSubmitting] = useState(false)

  const [categories, setCategories] = useState<Category[]>([])
  const [categoriesLoading, setCategoriesLoading] = useState(true)

  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)

  const [workers, setWorkers] = useState<WorkerSummary[]>([])
  const [workersLoading, setWorkersLoading] = useState(false)
  const [selectedWorker, setSelectedWorker] = useState<WorkerSummary | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  const [serviceDate, setServiceDate] = useState('')
  const [serviceTime, setServiceTime] = useState('')
  const [locationAddress, setLocationAddress] = useState('')
  const [description, setDescription] = useState('')
  const [amount, setAmount] = useState('')

  useEffect(() => {
    ;(async () => {
      try {
        const { data } = await supabaseClient
          .from('service_categories')
          .select('id, name, slug, icon')
          .eq('is_active', true)
          .order('sort_order')
        if (data) setCategories(data)
      } catch {
        // ignore
      } finally {
        setCategoriesLoading(false)
      }
    })()
  }, [])

  const categorySlug = selectedCategory ? categoryWorkerSlug[selectedCategory.slug] || selectedCategory.slug : ''

  useEffect(() => {
    if (!categorySlug) {
      setWorkers([])
      return
    }
    setWorkersLoading(true)
    setSelectedWorker(null)

    fetch(`/api/workers?category=${categorySlug}&available=true`)
      .then((r) => r.json())
      .then((res) => {
        setWorkers(res.data || [])
      })
      .catch(() => setWorkers([]))
      .finally(() => setWorkersLoading(false))
  }, [categorySlug])

  const filteredWorkers = workers.filter((w) => {
    if (!searchQuery) return true
    const q = searchQuery.toLowerCase()
    return (
      w.full_name.toLowerCase().includes(q) ||
      w.city.toLowerCase().includes(q) ||
      w.area.toLowerCase().includes(q)
    )
  })

  const goToStep = useCallback((s: number) => {
    setStep(s)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  const canProceedStep1 = !!selectedCategory
  const canProceedStep2 = !!selectedWorker
  const canProceedStep3 = serviceDate && serviceTime && locationAddress.length >= 5 && amount
  const amountInCents = Math.round(parseFloat(amount || '0') * 100)
  const platformFee = Math.round(amountInCents * 0.1)
  const totalCents = amountInCents + platformFee

  async function handleSubmit() {
    if (!selectedCategory || !selectedWorker || !serviceDate || !serviceTime || !locationAddress || !amount) return

    setSubmitting(true)
    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          workerId: selectedWorker.user_id,
          categoryId: selectedCategory.id,
          serviceDate,
          serviceTime,
          locationAddress,
          description: description || undefined,
          amount: amountInCents,
        }),
      })

      const data = await res.json()

      if (!res.ok || !data.success) {
        throw new Error(data.error?.message || 'Failed to create booking')
      }

      toast.success('Booking created successfully!')
      router.push(`/customer/bookings/${data.data.id}`)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setSubmitting(false)
    }
  }

  const steps = [
    { num: 1, label: 'Service' },
    { num: 2, label: 'Worker' },
    { num: 3, label: 'Schedule' },
    { num: 4, label: 'Confirm' },
  ]

  return (
    <div className="min-h-screen">
      <Header />
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Book a Service</h1>
          <div className="flex items-center gap-2 mt-4">
            {steps.map((s) => (
              <div key={s.num} className="flex items-center gap-2">
                <div className={`h-8 w-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  s.num === step ? 'bg-primary text-white' : 
                  s.num < step ? 'bg-primary/20 text-primary' : 'bg-gray-100 text-muted-foreground'
                }`}>
                  {s.num}
                </div>
                <span className={`text-sm ${s.num === step ? 'font-medium' : 'text-muted-foreground'}`}>
                  {s.label}
                </span>
                {s.num < 4 && <div className="h-0.5 w-8 bg-gray-200" />}
              </div>
            ))}
          </div>
        </div>

        <Card>
          <CardContent className="p-6">
            {/* Step 1: Service Category */}
            {step === 1 && (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold mb-4">What service do you need?</h2>
                {categoriesLoading ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                  </div>
                ) : (
                  categories.map((cat) => {
                    const isSelected = selectedCategory?.id === cat.id
                    const Icon = cat.icon === 'baby' ? Users : cat.icon === 'home' ? Home : MapPin
                    return (
                      <button
                        key={cat.id}
                        onClick={() => setSelectedCategory(cat)}
                        className={`w-full p-6 border-2 rounded-lg transition-colors text-left flex items-center gap-4 ${
                          isSelected
                            ? 'border-primary bg-primary/5'
                            : 'hover:border-primary hover:bg-primary/5'
                        }`}
                      >
                        <div className={`h-12 w-12 rounded-full flex items-center justify-center ${
                          isSelected ? 'bg-primary text-white' : 'bg-primary/10 text-primary'
                        }`}>
                          <Icon className="h-6 w-6" />
                        </div>
                        <div>
                          <h3 className="font-semibold">{cat.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            {cat.slug.includes('nanny')
                              ? 'Full-time, part-time, or occasional childcare'
                              : 'Regular, deep clean, or one-time cleaning'}
                          </p>
                        </div>
                        {isSelected && (
                          <div className="ml-auto">
                            <div className="h-6 w-6 rounded-full bg-primary flex items-center justify-center">
                              <ChevronRight className="h-4 w-4 text-white" />
                            </div>
                          </div>
                        )}
                      </button>
                    )
                  })
                )}
                <div className="flex justify-end pt-2">
                  <Button disabled={!canProceedStep1} onClick={() => goToStep(2)}>
                    Next
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}

            {/* Step 2: Worker Selection */}
            {step === 2 && (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold mb-4">Choose a Provider</h2>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    className="pl-9"
                    placeholder="Search by name or area..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>

                {workersLoading ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                  </div>
                ) : filteredWorkers.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    {searchQuery
                      ? 'No providers match your search.'
                      : 'No available providers for this service right now.'}
                  </div>
                ) : (
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {filteredWorkers.map((worker) => {
                      const isSelected = selectedWorker?.user_id === worker.user_id
                      return (
                        <button
                          key={worker.id}
                          onClick={() => setSelectedWorker(worker)}
                          className={`w-full p-4 border-2 rounded-lg transition-colors text-left ${
                            isSelected
                              ? 'border-primary bg-primary/5'
                              : 'hover:border-primary/50'
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <div className="w-12 h-12 rounded-full bg-gray-200 flex-shrink-0 overflow-hidden">
                              {worker.profile_photo_url ? (
                                <img
                                  src={worker.profile_photo_url}
                                  alt={worker.full_name}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-400 font-medium">
                                  {worker.full_name.charAt(0)}
                                </div>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="font-medium truncate">{worker.full_name}</span>
                                {worker.verification_level !== 'none' && (
                                  <Shield className="h-4 w-4 text-green-600 flex-shrink-0" />
                                )}
                              </div>
                              <div className="flex items-center gap-3 text-sm text-muted-foreground mt-1">
                                <span className="flex items-center gap-1">
                                  <MapPin className="h-3 w-3" />
                                  {worker.area}, {worker.city}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Star className="h-3 w-3 text-yellow-500" />
                                  {worker.average_rating > 0 ? worker.average_rating.toFixed(1) : 'New'}
                                </span>
                              </div>
                              <div className="flex items-center gap-2 mt-1.5 text-xs text-muted-foreground">
                                <span>{worker.experience_years} yrs exp</span>
                                <span>&middot;</span>
                                <span>Trust: {worker.trust_score}</span>
                              </div>
                            </div>
                            {isSelected && (
                              <div className="h-5 w-5 rounded-full bg-primary flex items-center justify-center flex-shrink-0 mt-1">
                                <ChevronRight className="h-3 w-3 text-white" />
                              </div>
                            )}
                          </div>
                        </button>
                      )
                    })}
                  </div>
                )}

                <div className="flex justify-between pt-2">
                  <Button variant="outline" onClick={() => goToStep(1)}>
                    <ChevronLeft className="mr-2 h-4 w-4" />
                    Back
                  </Button>
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={() => goToStep(3)}>
                      Skip to Schedule
                    </Button>
                    <Button disabled={!canProceedStep2} onClick={() => goToStep(3)}>
                      Next
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Schedule */}
            {step === 3 && (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold mb-4">When & Where?</h2>
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Date</label>
                  <Input
                    type="date"
                    value={serviceDate}
                    onChange={(e) => setServiceDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Time</label>
                  <Input
                    type="time"
                    value={serviceTime}
                    onChange={(e) => setServiceTime(e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Location</label>
                  <Input
                    placeholder="Enter your address in Lusaka"
                    value={locationAddress}
                    onChange={(e) => setLocationAddress(e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Service Fee (ZMW)</label>
                  <Input
                    type="number"
                    min="1"
                    step="1"
                    placeholder="e.g. 500"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Platform fee of 10% will be added. Enter the amount you&apos;ll pay the provider.
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Notes (optional)</label>
                  <Textarea
                    placeholder="Any special instructions for the provider..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                  />
                </div>

                <div className="flex justify-between pt-2">
                  <Button variant="outline" onClick={() => goToStep(2)}>
                    <ChevronLeft className="mr-2 h-4 w-4" />
                    Back
                  </Button>
                  <Button disabled={!canProceedStep3} onClick={() => goToStep(4)}>
                    Review Booking
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}

            {/* Step 4: Confirm */}
            {step === 4 && (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold mb-4">Confirm Booking</h2>

                <div className="bg-gray-50 rounded-lg p-4 space-y-3 text-sm">
                  <h3 className="font-semibold text-base">Service Details</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <span className="text-muted-foreground">Service</span>
                      <p className="font-medium">{selectedCategory?.name}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Date</span>
                      <p className="font-medium">{serviceDate}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Time</span>
                      <p className="font-medium">{serviceTime}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Location</span>
                      <p className="font-medium truncate">{locationAddress}</p>
                    </div>
                  </div>

                  {selectedWorker && (
                    <>
                      <div className="border-t pt-3">
                        <h3 className="font-semibold text-base mb-2">Provider</h3>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-400 font-medium flex-shrink-0">
                            {selectedWorker.full_name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-medium">{selectedWorker.full_name}</p>
                            <p className="text-muted-foreground text-xs">{selectedWorker.area}, {selectedWorker.city}</p>
                          </div>
                        </div>
                      </div>
                    </>
                  )}

                  {description && (
                    <div className="border-t pt-3">
                      <span className="text-muted-foreground">Notes</span>
                      <p className="font-medium mt-0.5">{description}</p>
                    </div>
                  )}

                  <div className="border-t pt-3">
                    <h3 className="font-semibold text-base mb-2">Payment</h3>
                    <div className="space-y-1">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Service Fee</span>
                        <span>{formatCurrency(amountInCents)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Platform Fee (10%)</span>
                        <span>{formatCurrency(platformFee)}</span>
                      </div>
                      <div className="flex justify-between font-medium border-t pt-1">
                        <span>Total</span>
                        <span>{formatCurrency(totalCents)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between pt-2">
                  <Button variant="outline" onClick={() => goToStep(3)}>
                    <ChevronLeft className="mr-2 h-4 w-4" />
                    Back
                  </Button>
                  <Button onClick={handleSubmit} disabled={submitting}>
                    {submitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Booking...
                      </>
                    ) : (
                      'Confirm Booking'
                    )}
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  )
}
