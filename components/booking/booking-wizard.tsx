'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
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
import { BookingSummaryPanel } from '@/components/booking/booking-summary-panel'
import { BookingScheduleFields } from '@/components/booking/booking-schedule-fields'
import {
  getFirstSelectableSlot,
  getWindowForStartTime,
  isStartTimeValid,
} from '@/lib/booking/time-slots'
import {
  categorySlugToKey,
  defaultServiceDetails,
  paramToCategoryKey,
  type ServiceCategoryKey,
  type ServiceDetails,
} from '@/lib/services/catalog'
import {
  formatServiceSummary,
  parseServiceDetailsFromParams,
  resolveFunnelParam,
  suggestPrice,
  nannyChildAgesComplete,
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

/** 0 = pick service (optional prelude), 1 = Details, 2 = Worker, 3 = Payment */
const STEP = { PICK: 0, DETAILS: 1, WORKER: 2, PAYMENT: 3 } as const

const PROGRESS_STEPS = [
  { num: STEP.DETAILS, label: 'Details' },
  { num: STEP.WORKER, label: 'Worker' },
  { num: STEP.PAYMENT, label: 'Payment' },
]

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

function resolveCategoryFromParams(
  categoryParam: string | null,
  funnelParam: string | null
): ServiceCategoryKey | null {
  const fromCategory = paramToCategoryKey(categoryParam)
  if (fromCategory) return fromCategory
  const funnel = resolveFunnelParam(funnelParam)
  return funnel?.category ?? null
}

function getInitialStep(
  categoryParam: string | null,
  funnelParam: string | null,
  workerProfileId: string | null
) {
  if (workerProfileId) return STEP.DETAILS
  if (resolveCategoryFromParams(categoryParam, funnelParam)) return STEP.DETAILS
  return STEP.PICK
}

export function BookingWizard() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const workerProfileId = searchParams.get('worker')
  const categoryParam = searchParams.get('category')
  const funnelParam = searchParams.get('funnel')
  const preselectedWorkerRef = useRef<string | null>(null)
  const urlInitDone = useRef(false)
  const pricePrefilled = useRef(false)

  const [step, setStep] = useState<number>(() =>
    getInitialStep(categoryParam, funnelParam, workerProfileId)
  )
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
    if (urlInitDone.current || workerProfileId || categories.length === 0) return

    const key = resolveCategoryFromParams(categoryParam, funnelParam)
    if (!key) return

    const slug = key === 'nanny' ? 'nanny-services' : 'house-cleaning'
    const cat = categories.find((c) => c.slug === slug)
    if (!cat) return

    const parsed = parseServiceDetailsFromParams(searchParams)
    const funnel = resolveFunnelParam(funnelParam)
    let details = parsed ?? defaultServiceDetails(key)
    if (funnel?.type) details = { ...details, serviceType: funnel.type }

    setSelectedCategory(cat)
    setServiceDetails(details)
    setStep(STEP.DETAILS)
    urlInitDone.current = true
  }, [categoryParam, funnelParam, categories, workerProfileId, searchParams])

  useEffect(() => {
    if (urlInitDone.current || !workerProfileId || categoriesLoading || categories.length === 0) return

    setDeepLinkLoading(true)
    fetch(`/api/workers/${workerProfileId}`)
      .then((r) => r.json())
      .then((res) => {
        if (!res.success || !res.data) {
          toast.error('Worker not found')
          setStep(STEP.WORKER)
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
        setStep(STEP.DETAILS)
        urlInitDone.current = true
      })
      .catch(() => {
        toast.error('Could not load worker')
        setStep(STEP.WORKER)
      })
      .finally(() => setDeepLinkLoading(false))
  }, [workerProfileId, categories, categoriesLoading, searchParams])

  useEffect(() => {
    if (step === STEP.PAYMENT && serviceDetails && !amount && !pricePrefilled.current) {
      const { typical } = suggestPrice(serviceDetails)
      setAmount(String(typical))
      pricePrefilled.current = true
    }
  }, [step, serviceDetails, amount])

  const durationHours = serviceDetails?.durationHours
  const serviceCategory = serviceDetails?.category

  useEffect(() => {
    if (!serviceTime || durationHours == null || !serviceCategory) return
    if (isStartTimeValid(serviceTime, durationHours, serviceCategory)) return

    const window = getWindowForStartTime(serviceTime, serviceCategory)
    const fallback = window ? getFirstSelectableSlot(window, durationHours) : undefined
    setServiceTime(fallback?.value ?? '')
  }, [durationHours, serviceCategory, serviceTime])

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
      goToStep(STEP.DETAILS)
    },
    [goToStep]
  )

  const selectWorker = useCallback(
    (worker: WorkerSummary) => {
      if (!serviceDate || !serviceTime || locationAddress.length < 5) {
        toast.error('Please choose a date, time, and address first')
        goToStep(STEP.DETAILS)
        return
      }
      setSelectedWorker(worker)
      goToStep(STEP.PAYMENT)
    },
    [goToStep, serviceDate, serviceTime, locationAddress]
  )

  const hasScheduleDetails =
    !!serviceDate && !!serviceTime && locationAddress.length >= 5

  const hasNannyAges =
    !serviceDetails || nannyChildAgesComplete(serviceDetails)

  const canProceedDetails =
    !!serviceDetails && hasScheduleDetails && hasNannyAges

  const canProceedPayment =
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
      goToStep(STEP.DETAILS)
      return
    }
    if (!selectedWorker) {
      toast.error('Please choose a worker')
      goToStep(STEP.WORKER)
      return
    }
    if (!serviceDate || !serviceTime || locationAddress.length < 5 || !amount) {
      toast.error('Please complete your booking details')
      goToStep(STEP.DETAILS)
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

  const summaryProps = serviceDetails
    ? {
        details: serviceDetails,
        categoryName: selectedCategory?.name,
        serviceDate,
        serviceTime,
        locationAddress,
        workerName: selectedWorker?.full_name,
        amount,
      }
    : null

  return (
    <div className="min-h-screen">
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Book a Service</h1>
          {step >= STEP.DETAILS && (
            <div className="flex items-center gap-2 mt-4 overflow-x-auto pb-1">
              {PROGRESS_STEPS.map((s, i) => (
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
                    {i + 1}
                  </div>
                  <span
                    className={`text-sm ${s.num === step ? 'font-medium' : 'text-muted-foreground'}`}
                  >
                    {s.label}
                  </span>
                  {i < PROGRESS_STEPS.length - 1 && <div className="h-0.5 w-6 bg-gray-200" />}
                </div>
              ))}
            </div>
          )}
        </div>

        {step === STEP.PICK && (
          <Card>
            <CardContent className="p-6">
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
            </CardContent>
          </Card>
        )}

        {step === STEP.DETAILS && serviceDetails && (
          <div className="lg:grid lg:grid-cols-[280px_1fr] gap-6 items-start">
            {summaryProps && (
              <>
                <BookingSummaryPanel
                  {...summaryProps}
                  className="hidden lg:block lg:sticky lg:top-8"
                />
                <BookingSummaryPanel {...summaryProps} className="lg:hidden mb-2" />
              </>
            )}

            <Card>
              <CardContent className="p-6 space-y-6">
                {deepLinkLoading ? (
                  <div className="flex justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : (
                  <>
                    <div>
                      <h2 className="text-xl font-semibold">Booking details</h2>
                      <p className="text-sm text-muted-foreground mt-1">
                        {selectedCategory?.name}: pick when and where, then set your scope.
                      </p>
                    </div>

                    <BookingScheduleFields
                      serviceDate={serviceDate}
                      serviceTime={serviceTime}
                      locationAddress={locationAddress}
                      description={description}
                      onDateChange={setServiceDate}
                      onTimeChange={setServiceTime}
                      onAddressChange={setLocationAddress}
                      onDescriptionChange={setDescription}
                      category={serviceDetails.category}
                      durationHours={serviceDetails.durationHours}
                    />

                    <ServiceConfigPanel
                      category={serviceDetails.category}
                      value={serviceDetails}
                      onChange={setServiceDetails}
                      showPriceHint={false}
                    />

                    {!canProceedDetails && (
                      <p className="text-sm text-muted-foreground text-center">
                        {!hasScheduleDetails
                          ? 'Choose a date, time window, and address above to continue.'
                          : 'Select an age range for each child below to continue.'}
                      </p>
                    )}

                    <div className="flex justify-between pt-2 gap-3">
                      <Button
                        variant="outline"
                        onClick={() => goToStep(STEP.PICK)}
                        disabled={!!categoryParam || !!funnelParam}
                      >
                        <ChevronLeft className="mr-2 h-4 w-4" />
                        Back
                      </Button>
                      <Button onClick={() => goToStep(STEP.WORKER)} disabled={!canProceedDetails}>
                        Choose worker
                        <ChevronRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {step === STEP.WORKER && (
          <div className="lg:grid lg:grid-cols-[280px_1fr] gap-6 items-start">
            {summaryProps && (
              <BookingSummaryPanel
                {...summaryProps}
                className="hidden lg:block lg:sticky lg:top-8"
              />
            )}

            <Card>
              <CardContent className="p-6 space-y-4">
                {summaryProps && (
                  <BookingSummaryPanel {...summaryProps} className="lg:hidden" />
                )}

                <h2 className="text-xl font-semibold">Choose a worker</h2>

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
                  <div className="space-y-3 max-h-[28rem] overflow-y-auto">
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

                <div className="flex justify-between pt-2 gap-3">
                  <Button variant="outline" onClick={() => goToStep(STEP.DETAILS)}>
                    <ChevronLeft className="mr-2 h-4 w-4" />
                    Edit details
                  </Button>
                  {selectedWorker && (
                    <Button
                      onClick={() => {
                        if (!hasScheduleDetails) {
                          toast.error('Please choose a date, time, and address first')
                          goToStep(STEP.DETAILS)
                          return
                        }
                        goToStep(STEP.PAYMENT)
                      }}
                    >
                      Continue with {selectedWorker.full_name.split(' ')[0]}
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {step === STEP.PAYMENT && serviceDetails && (
          <div className="lg:grid lg:grid-cols-[280px_1fr] gap-6 items-start">
            {summaryProps && (
              <BookingSummaryPanel
                {...summaryProps}
                className="hidden lg:block lg:sticky lg:top-8"
              />
            )}

            <Card>
              <CardContent className="p-6 space-y-6">
                {summaryProps && (
                  <BookingSummaryPanel {...summaryProps} className="lg:hidden" />
                )}

                <div>
                  <h2 className="text-xl font-semibold mb-1">Confirm & pay</h2>
                  <p className="text-sm text-muted-foreground">
                    {selectedWorker
                      ? `Review your booking with ${selectedWorker.full_name}`
                      : 'Choose a worker to continue'}
                  </p>
                </div>

                {!selectedWorker && (
                  <Button variant="outline" onClick={() => goToStep(STEP.WORKER)}>
                    Choose a worker
                  </Button>
                )}

                {selectedWorker && (
                  <>
                    {!hasScheduleDetails && (
                      <BookingScheduleFields
                        serviceDate={serviceDate}
                        serviceTime={serviceTime}
                        locationAddress={locationAddress}
                        description={description}
                        onDateChange={setServiceDate}
                        onTimeChange={setServiceTime}
                        onAddressChange={setLocationAddress}
                        onDescriptionChange={setDescription}
                        category={serviceDetails.category}
                        durationHours={serviceDetails.durationHours}
                        compact
                      />
                    )}

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
                      <p className="text-xs text-muted-foreground mt-1">
                        Suggested K{suggestPrice(serviceDetails).typical} based on your scope.
                        Platform fee (10%) added at checkout.
                      </p>
                    </div>

                    {amount && parseFloat(amount) >= 1 && (
                      <div className="rounded-lg bg-gray-50 border p-4 space-y-2 text-sm">
                        <p className="font-medium text-xs text-muted-foreground uppercase tracking-wide">
                          {formatServiceSummary(serviceDetails)}
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
                      <Button variant="outline" onClick={() => goToStep(STEP.WORKER)}>
                        <ChevronLeft className="mr-2 h-4 w-4" />
                        Change worker
                      </Button>
                      <Button
                        onClick={handleSubmit}
                        disabled={submitting || !canProceedPayment}
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
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  )
}
