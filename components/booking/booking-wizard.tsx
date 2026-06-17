'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { supabaseClient } from '@/lib/supabase-client'
import { toast } from 'sonner'
import {
  Search,
  MapPin,
  Star,
  Shield,
  ChevronRight,
  ChevronLeft,
  Loader2,
} from 'lucide-react'
import { ServiceConfigPanel } from '@/components/services/service-config-panel'
import { BookingStepShell } from '@/components/booking/booking-step-shell'
import { BookingSummaryPanel } from '@/components/booking/booking-summary-panel'
import { BookingPaymentTotals } from '@/components/booking/booking-payment-totals'
import { BookingScheduleFields } from '@/components/booking/booking-schedule-fields'
import { ServiceTypePicker } from '@/components/booking/service-type-picker'
import {
  categoryKeyToDbSlug,
  categorySlugToKey,
  defaultServiceDetails,
  getServiceType,
  paramToCategoryKey,
  type ServiceCategoryKey,
  type ServiceDetails,
} from '@/lib/services/catalog'
import {
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

function initServiceDetailsFromParams(
  searchParams: URLSearchParams,
  categoryParam: string | null,
  funnelParam: string | null,
  workerProfileId: string | null
): ServiceDetails | null {
  if (workerProfileId) return null

  const key = resolveCategoryFromParams(categoryParam, funnelParam)
  if (!key) return null

  const parsed = parseServiceDetailsFromParams(searchParams)
  const funnel = resolveFunnelParam(funnelParam)
  let details = parsed ?? defaultServiceDetails(key)
  if (funnel?.type) details = { ...details, serviceType: funnel.type }

  const typeOption = getServiceType(key, details.serviceType)
  if (typeOption) details.durationHours = typeOption.defaultHours

  return details
}

function workerCategorySlug(category: ServiceCategoryKey) {
  return category === 'nanny' ? 'nanny' : 'house_cleaner'
}

function buildBookingDescription(
  description: string,
  serviceType: string | undefined,
  guestCheckoutTime: string,
  nextCheckIn: string
) {
  const parts: string[] = []
  if (description.trim()) parts.push(description.trim())
  if (serviceType === 'airbnb') {
    if (guestCheckoutTime) {
      parts.push(`Guest check-out: ${guestCheckoutTime}`)
    }
    if (nextCheckIn.trim()) {
      parts.push(`Next check-in: ${nextCheckIn.trim()}`)
    }
  }
  return parts.length > 0 ? parts.join('\n') : undefined
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
  const [serviceDetails, setServiceDetails] = useState<ServiceDetails | null>(() =>
    initServiceDetailsFromParams(searchParams, categoryParam, funnelParam, workerProfileId)
  )
  const [workers, setWorkers] = useState<WorkerSummary[]>([])
  const [workersLoading, setWorkersLoading] = useState(false)
  const [selectedWorker, setSelectedWorker] = useState<WorkerSummary | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  const [serviceDate, setServiceDate] = useState('')
  const [serviceTime, setServiceTime] = useState('')
  const [locationAddress, setLocationAddress] = useState('')
  const [description, setDescription] = useState('')
  const [guestCheckoutTime, setGuestCheckoutTime] = useState('')
  const [nextCheckIn, setNextCheckIn] = useState('')
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
    : serviceDetails
      ? workerCategorySlug(serviceDetails.category)
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
        if (!res.success) {
          toast.error(res.error?.message || 'Could not load workers')
          setWorkers([])
          return
        }
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
      .catch(() => {
        toast.error('Could not load workers')
        setWorkers([])
      })
      .finally(() => setWorkersLoading(false))
  }, [categorySlug, workerProfileId])

  useEffect(() => {
    if (!serviceDetails || categories.length === 0) return

    const slug = categoryKeyToDbSlug(serviceDetails.category)
    const cat = categories.find((c) => c.slug === slug)
    if (cat && cat.id !== selectedCategory?.id) {
      setSelectedCategory(cat)
    }
  }, [serviceDetails, categories, selectedCategory])

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
        const slug = categoryKeyToDbSlug(w.category === 'nanny' ? 'nanny' : 'cleaning')
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

  const selectServiceType = useCallback(
    (categoryKey: ServiceCategoryKey, serviceTypeId: string) => {
      const typeOption = getServiceType(categoryKey, serviceTypeId)
      const details = defaultServiceDetails(categoryKey)
      details.serviceType = serviceTypeId
      if (typeOption) details.durationHours = typeOption.defaultHours

      const cat = categories.find((c) => c.slug === categoryKeyToDbSlug(categoryKey))
      setServiceDetails(details)
      if (cat) setSelectedCategory(cat)
      goToStep(STEP.DETAILS)
    },
    [categories, goToStep]
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
    if (!serviceDetails) {
      toast.error('Please configure your service')
      goToStep(STEP.DETAILS)
      return
    }
    if (!selectedCategory) {
      toast.error('Service categories are still loading. Please try again in a moment.')
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
          description: buildBookingDescription(
            description,
            serviceDetails.serviceType,
            guestCheckoutTime,
            nextCheckIn
          ),
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
          <h1 className="text-3xl font-bold mb-2">
            {step === STEP.PICK ? 'What do you need?' : 'Book a service'}
          </h1>
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
              <ServiceTypePicker onSelect={selectServiceType} />
            </CardContent>
          </Card>
        )}

        {step === STEP.DETAILS && serviceDetails && (
          <BookingStepShell
            summary={
              summaryProps ? <BookingSummaryPanel {...summaryProps} /> : undefined
            }
          >
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
                        Set your service, then when and where.
                      </p>
                    </div>

                    <ServiceConfigPanel
                      category={serviceDetails.category}
                      value={serviceDetails}
                      onChange={setServiceDetails}
                      showPriceHint={false}
                    />

                    <BookingScheduleFields
                      serviceDate={serviceDate}
                      serviceTime={serviceTime}
                      locationAddress={locationAddress}
                      description={description}
                      guestCheckoutTime={guestCheckoutTime}
                      nextCheckIn={nextCheckIn}
                      onDateChange={setServiceDate}
                      onTimeChange={setServiceTime}
                      onAddressChange={setLocationAddress}
                      onDescriptionChange={setDescription}
                      onGuestCheckoutTimeChange={setGuestCheckoutTime}
                      onNextCheckInChange={setNextCheckIn}
                      category={serviceDetails.category}
                      serviceType={serviceDetails.serviceType}
                    />

                    {!canProceedDetails && (
                      <p className="text-sm text-muted-foreground text-center">
                        {!hasScheduleDetails
                          ? 'Choose a date, start time, and address to continue.'
                          : 'Select an age range for each child to continue.'}
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
          </BookingStepShell>
        )}

        {step === STEP.WORKER && (
          <BookingStepShell
            summary={
              summaryProps ? <BookingSummaryPanel {...summaryProps} /> : undefined
            }
          >
            <Card>
              <CardContent className="p-6 space-y-4">
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
          </BookingStepShell>
        )}

        {step === STEP.PAYMENT && serviceDetails && (
          <BookingStepShell
            summary={
              summaryProps ? (
                <BookingSummaryPanel {...summaryProps} hidePriceEstimate />
              ) : undefined
            }
          >
            <Card>
              <CardContent className="p-6 space-y-6">
                <div>
                  <h2 className="text-xl font-semibold">Confirm & pay</h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    Set your fee and confirm the booking.
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
                        guestCheckoutTime={guestCheckoutTime}
                        nextCheckIn={nextCheckIn}
                        onDateChange={setServiceDate}
                        onTimeChange={setServiceTime}
                        onAddressChange={setLocationAddress}
                        onDescriptionChange={setDescription}
                        onGuestCheckoutTimeChange={setGuestCheckoutTime}
                        onNextCheckInChange={setNextCheckIn}
                        category={serviceDetails.category}
                        serviceType={serviceDetails.serviceType}
                        compact
                      />
                    )}

                    <div className="space-y-2">
                      <label htmlFor="service-fee" className="text-sm font-medium">
                        Service fee (ZMW)
                      </label>
                      <Input
                        id="service-fee"
                        type="number"
                        min="1"
                        step="1"
                        placeholder="e.g. 500"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="text-lg h-12"
                      />
                      <p className="text-xs text-muted-foreground">
                        Suggested K{suggestPrice(serviceDetails).typical} based on your scope.
                      </p>
                    </div>

                    {amount && parseFloat(amount) >= 1 && (
                      <BookingPaymentTotals
                        amountInCents={amountInCents}
                        platformFee={platformFee}
                        totalCents={totalCents}
                      />
                    )}

                    <div className="flex flex-col-reverse sm:flex-row sm:justify-between pt-2 gap-3">
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
          </BookingStepShell>
        )}
      </main>
    </div>
  )
}
