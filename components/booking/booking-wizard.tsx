'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { supabaseClient } from '@/lib/supabase-client'
import { formatCurrency } from '@/lib/utils'
import { toast } from 'sonner'
import {
  Search,
  MapPin,
  Users,
  Home,
  Star,
  Shield,
  ChevronRight,
  ChevronLeft,
  Loader2,
} from 'lucide-react'
import { ServiceConfigPanel } from '@/components/services/service-config-panel'
import { ServiceSummary } from '@/components/services/service-summary'
import {
  categorySlugToKey,
  defaultServiceDetails,
  paramToCategoryKey,
  type ServiceDetails,
} from '@/lib/services/catalog'
import {
  formatServiceSummary,
  parseServiceDetailsFromParams,
  suggestPrice,
} from '@/lib/services/utils'

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

const categoryParamToSlug: Record<string, string> = {
  nanny: 'nanny-services',
  cleaning: 'house-cleaning',
  'house-cleaner': 'house-cleaning',
}

function mapApiWorker(w: Record<string, unknown>): WorkerSummary {
  return {
    id: w.id as string,
    user_id: w.user_id as string,
    full_name: w.full_name as string,
    city: w.city as string,
    area: w.area as string,
    category: w.category as string,
    profile_photo_url: (w.profile_photo_url as string | null) ?? null,
    average_rating: (w.average_rating as number) ?? 0,
    total_reviews: (w.total_reviews as number) ?? 0,
    trust_score: (w.trust_score as number) ?? 0,
    verification_level: (w.verification_level as string) ?? 'none',
    experience_years: (w.experience_years as number) ?? 0,
    availability_status: (w.availability_status as string) ?? 'available',
  }
}

function getInitialStep(categoryParam: string | null, workerProfileId: string | null) {
  if (workerProfileId) return 4
  if (categoryParam && paramToCategoryKey(categoryParam)) return 2
  return 1
}

export function BookingWizard() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const workerProfileId = searchParams.get('worker')
  const categoryParam = searchParams.get('category')
  const preselectedWorkerRef = useRef<string | null>(null)
  const urlInitDone = useRef(false)
  const pricePrefilled = useRef(false)

  const [step, setStep] = useState(() => getInitialStep(categoryParam, workerProfileId))
  const [submitting, setSubmitting] = useState(false)
  const [deepLinkLoading, setDeepLinkLoading] = useState(!!workerProfileId)

  const [categories, setCategories] = useState<Category[]>([])
  const [categoriesLoading, setCategoriesLoading] = useState(true)

  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)
  const [serviceDetails, setServiceDetails] = useState<ServiceDetails | null>(null)
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

  const categorySlug = selectedCategory
    ? categoryWorkerSlug[selectedCategory.slug] || selectedCategory.slug
    : ''

  useEffect(() => {
    if (!categorySlug) {
      setWorkers([])
      return
    }
    setWorkersLoading(true)

    fetch(`/api/workers?category=${categorySlug}&available=true`)
      .then((r) => r.json())
      .then((res) => {
        const list: WorkerSummary[] = res.data || []
        setWorkers(list)
        const preId = preselectedWorkerRef.current
        if (preId) {
          const found = list.find((w) => w.user_id === preId)
          if (found) setSelectedWorker(found)
          preselectedWorkerRef.current = null
        } else if (!workerProfileId) {
          setSelectedWorker(null)
        }
      })
      .catch(() => setWorkers([]))
      .finally(() => setWorkersLoading(false))
  }, [categorySlug, workerProfileId])

  useEffect(() => {
    if (urlInitDone.current || workerProfileId || !categoryParam || categories.length === 0) return
    const slug = categoryParamToSlug[categoryParam]
    if (!slug) return
    const cat = categories.find((c) => c.slug === slug)
    if (!cat) return

    const parsed = parseServiceDetailsFromParams(searchParams)
    const key = paramToCategoryKey(categoryParam)!
    setSelectedCategory(cat)
    setServiceDetails(parsed ?? defaultServiceDetails(key))
    setStep(2)
    urlInitDone.current = true
  }, [categoryParam, categories, workerProfileId, searchParams])

  useEffect(() => {
    if (urlInitDone.current || !workerProfileId || categoriesLoading || categories.length === 0) return

    setDeepLinkLoading(true)
    fetch(`/api/workers/${workerProfileId}`)
      .then((r) => r.json())
      .then((res) => {
        if (!res.success || !res.data) {
          toast.error('Worker not found')
          setStep(3)
          return
        }
        const w = mapApiWorker(res.data)
        const slug = w.category === 'nanny' ? 'nanny-services' : 'house-cleaning'
        const cat = categories.find((c) => c.slug === slug)
        const key = categorySlugToKey(slug)!
        const parsed = parseServiceDetailsFromParams(searchParams)
        if (cat) setSelectedCategory(cat)
        setServiceDetails(parsed ?? defaultServiceDetails(key))
        preselectedWorkerRef.current = w.user_id
        setSelectedWorker(w)
        setStep(4)
        urlInitDone.current = true
      })
      .catch(() => {
        toast.error('Could not load worker')
        setStep(3)
      })
      .finally(() => setDeepLinkLoading(false))
  }, [workerProfileId, categories, categoriesLoading, searchParams])

  useEffect(() => {
    if (step === 4 && serviceDetails && !amount && !pricePrefilled.current) {
      const { typical } = suggestPrice(serviceDetails)
      setAmount(String(typical))
      pricePrefilled.current = true
    }
  }, [step, serviceDetails, amount])

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

  const selectCategory = useCallback(
    (cat: Category) => {
      const key = categorySlugToKey(cat.slug)
      if (!key) return
      setSelectedCategory(cat)
      setServiceDetails(defaultServiceDetails(key))
      goToStep(2)
    },
    [goToStep]
  )

  const selectWorker = useCallback(
    (worker: WorkerSummary) => {
      setSelectedWorker(worker)
      goToStep(4)
    },
    [goToStep]
  )

  const canProceedStep4 =
    !!selectedWorker &&
    !!serviceDetails &&
    !!serviceDate &&
    !!serviceTime &&
    locationAddress.length >= 5 &&
    !!amount &&
    parseFloat(amount) >= 1

  const amountInCents = Math.round(parseFloat(amount || '0') * 100)
  const platformFee = Math.round(amountInCents * 0.1)
  const totalCents = amountInCents + platformFee

  async function handleSubmit() {
    if (!selectedCategory || !serviceDetails) {
      toast.error('Please configure your service')
      goToStep(2)
      return
    }
    if (!selectedWorker) {
      toast.error('Please choose a worker')
      goToStep(3)
      return
    }
    if (!serviceDate || !serviceTime || locationAddress.length < 5 || !amount) {
      toast.error('Please fill in date, time, location, and fee')
      return
    }

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
          serviceDetails,
          amount: amountInCents,
        }),
      })

      const data = await res.json()

      if (!res.ok || !data.success) {
        throw new Error(data.error?.message || 'Failed to create booking')
      }

      toast.success('Booking created. Complete payment on the next screen')
      router.push(`/customer/bookings/${data.data.id}`)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setSubmitting(false)
    }
  }

  const steps = [
    { num: 1, label: 'Service' },
    { num: 2, label: 'Details' },
    { num: 3, label: 'Worker' },
    { num: 4, label: 'Schedule' },
  ]

  const today = new Date().toISOString().split('T')[0]

  return (
    <div className="min-h-screen">
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Book a Service</h1>
          <div className="flex items-center gap-2 mt-4 overflow-x-auto pb-1">
            {steps.map((s) => (
              <div key={s.num} className="flex items-center gap-2 shrink-0">
                <div
                  className={`h-8 w-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    s.num === step
                      ? 'bg-primary text-white'
                      : s.num < step
                        ? 'bg-primary/20 text-primary'
                        : 'bg-gray-100 text-muted-foreground'
                  }`}
                >
                  {s.num}
                </div>
                <span
                  className={`text-sm ${s.num === step ? 'font-medium' : 'text-muted-foreground'}`}
                >
                  {s.label}
                </span>
                {s.num < 4 && <div className="h-0.5 w-6 bg-gray-200" />}
              </div>
            ))}
          </div>
        </div>

        <Card>
          <CardContent className="p-6">
            {step === 1 && (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold mb-4">What do you need?</h2>
                {categoriesLoading ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                  </div>
                ) : (
                  categories.map((cat) => {
                    const Icon = cat.icon === 'baby' ? Users : cat.icon === 'home' ? Home : MapPin
                    return (
                      <button
                        key={cat.id}
                        onClick={() => selectCategory(cat)}
                        className="w-full p-6 border-2 rounded-lg transition-colors text-left flex items-center gap-4 hover:border-primary hover:bg-primary/5"
                      >
                        <div className="h-12 w-12 rounded-full flex items-center justify-center bg-primary/10 text-primary">
                          <Icon className="h-6 w-6" />
                        </div>
                        <div>
                          <h3 className="font-semibold">{cat.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            {cat.slug.includes('nanny')
                              ? 'Babysitting, after-school, newborn care & more'
                              : 'Standard, deep, or move-in/out cleans'}
                          </p>
                        </div>
                        <ChevronRight className="ml-auto h-5 w-5 text-muted-foreground" />
                      </button>
                    )
                  })
                )}
              </div>
            )}

            {step === 2 && serviceDetails && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold">Configure your visit</h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    {selectedCategory?.name}: choose type, scope, and extras
                  </p>
                </div>

                <ServiceConfigPanel
                  category={serviceDetails.category}
                  value={serviceDetails}
                  onChange={setServiceDetails}
                />

                <div className="flex justify-between pt-2">
                  <Button variant="outline" onClick={() => goToStep(1)}>
                    <ChevronLeft className="mr-2 h-4 w-4" />
                    Back
                  </Button>
                  <Button onClick={() => goToStep(3)}>
                    Choose worker
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4">
                {serviceDetails && (
                  <ServiceSummary details={serviceDetails} />
                )}
                <div className="flex items-center justify-between gap-4 pt-2">
                  <h2 className="text-xl font-semibold">Choose a worker</h2>
                </div>
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
                      ? 'No workers match your search.'
                      : 'No available workers for this service right now.'}
                  </div>
                ) : (
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {filteredWorkers.map((worker) => (
                      <button
                        key={worker.id}
                        onClick={() => selectWorker(worker)}
                        className={`w-full p-4 border-2 rounded-lg transition-colors text-left hover:border-primary/50 ${
                          selectedWorker?.user_id === worker.user_id
                            ? 'border-primary bg-primary/5'
                            : ''
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
                                {worker.average_rating > 0
                                  ? worker.average_rating.toFixed(1)
                                  : 'New'}
                              </span>
                            </div>
                          </div>
                          <ChevronRight className="h-5 w-5 text-muted-foreground shrink-0 mt-1" />
                        </div>
                      </button>
                    ))}
                  </div>
                )}

                <div className="flex justify-start pt-2">
                  <Button variant="outline" onClick={() => goToStep(2)}>
                    <ChevronLeft className="mr-2 h-4 w-4" />
                    Edit details
                  </Button>
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="space-y-6">
                {deepLinkLoading ? (
                  <div className="flex justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : (
                  <>
                    <div>
                      <h2 className="text-xl font-semibold mb-1">Schedule & confirm</h2>
                      <p className="text-sm text-muted-foreground">
                        {selectedWorker
                          ? `Booking ${selectedWorker.full_name}`
                          : 'Choose a worker to continue'}
                      </p>
                    </div>

                    {serviceDetails && <ServiceSummary details={serviceDetails} />}

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium mb-1.5 block">Date</label>
                        <Input
                          type="date"
                          value={serviceDate}
                          onChange={(e) => setServiceDate(e.target.value)}
                          min={today}
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
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-1.5 block">Address in Lusaka</label>
                      <Input
                        placeholder="e.g. Plot 12, Kabulonga"
                        value={locationAddress}
                        onChange={(e) => setLocationAddress(e.target.value)}
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-1.5 block">
                        Service fee (ZMW)
                      </label>
                      <Input
                        type="number"
                        min="1"
                        step="1"
                        placeholder="e.g. 500"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                      />
                      {serviceDetails && (
                        <p className="text-xs text-muted-foreground mt-1">
                          Suggested K{suggestPrice(serviceDetails).typical} based on your scope.
                          Platform fee (10%) added at checkout.
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-1.5 block">
                        Additional notes (optional)
                      </label>
                      <Textarea
                        placeholder="Gate code, access instructions, special requests..."
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows={3}
                      />
                    </div>

                    {selectedWorker && amount && parseFloat(amount) >= 1 && (
                      <div className="rounded-lg bg-gray-50 border p-4 space-y-2 text-sm">
                        <p className="font-medium text-xs text-muted-foreground uppercase tracking-wide">
                          {serviceDetails ? formatServiceSummary(serviceDetails) : 'Booking summary'}
                        </p>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Service fee</span>
                          <span>{formatCurrency(amountInCents)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Platform fee (10%)</span>
                          <span>{formatCurrency(platformFee)}</span>
                        </div>
                        <div className="flex justify-between font-semibold border-t pt-2">
                          <span>Total to pay</span>
                          <span>{formatCurrency(totalCents)}</span>
                        </div>
                      </div>
                    )}

                    <div className="flex justify-between pt-2 gap-3">
                      <Button variant="outline" onClick={() => goToStep(3)}>
                        <ChevronLeft className="mr-2 h-4 w-4" />
                        Change worker
                      </Button>
                      <Button
                        onClick={handleSubmit}
                        disabled={submitting || !canProceedStep4}
                        className="min-w-[10rem]"
                      >
                        {submitting ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Booking...
                          </>
                        ) : (
                          'Confirm booking'
                        )}
                      </Button>
                    </div>
                  </>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
