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
import { BookingStepShell } from '@/components/booking/booking-step-shell'
import { BookingSummaryPanel } from '@/components/booking/booking-summary-panel'
import { BookingPaymentTotals } from '@/components/booking/booking-payment-totals'
import { AirbnbBookingFlow } from '@/components/booking/airbnb-booking-flow'
import { AirbnbBookingSummary } from '@/components/booking/airbnb-booking-summary'
import { CleaningBookingFlow } from '@/components/booking/cleaning-booking-flow'
import { HousekeepingBookingFlow } from '@/components/booking/housekeeping-booking-flow'
import { CookingBookingFlow } from '@/components/booking/cooking-booking-flow'
import { HandymanBookingFlow } from '@/components/booking/handyman-booking-flow'
import { NannyBookingFlow } from '@/components/booking/nanny-booking-flow'
import { TaskServiceBookingFlow } from '@/components/booking/task-service-booking-flow'
import { ServiceBookingSummary } from '@/components/booking/service-booking-summary'
import type { ServiceFlowStep, LocationCoords } from '@/lib/booking/shared-flow'
import { getBookingPageTitle } from '@/lib/booking/shared-flow'
import {
  CONFIRM_BOOKING_INTRO,
  CONFIRM_BOOKING_STEP_LABEL,
  getWorkerSelectionHeading,
  resolveServiceDetailsForWorker,
  resolveServiceDetailsFromSearchParams,
} from '@/lib/booking/worker-deep-link'
import {
  clearBookingDraft,
  draftMatchesReturnUrl,
  loadBookingDraft,
  saveBookingDraft,
} from '@/lib/booking/draft-persistence'
import {
  appendPhotoUrlsToDescription,
  uploadBookingJobPhotos,
} from '@/components/booking/booking-job-photos'
import { skillsForServiceCategory } from '@/lib/workers/skills'
import { customerCoordsForSorting, sortWorkersByProximity } from '@/lib/workers/proximity'
import { workerMeetsHandymanVerification } from '@/lib/workers/handyman-skills'
import { plumbingRequiresAdminReview } from '@/lib/services/handyman-plumbing'
import { ServiceTypePicker } from '@/components/booking/service-type-picker'
import {
  categoryKeyToDbSlug,
  defaultBetweenGuestServiceDetails,
  defaultServiceDetails,
  isAirbnbCleaningType,
  normalizeServiceType,
  sanitizeAddons,
  getServiceType,
  paramToCategoryKey,
  type ServiceCategoryKey,
  type ServiceDetails,
} from '@/lib/services/catalog'
import {
  resolveFunnelParam,
  suggestPrice,
} from '@/lib/services/utils'
import type { PublicWorkerProfile, WorkerCategory } from '@/types'

function guidePriceHint(details: ServiceDetails): string {
  if (isAirbnbCleaningType(details.serviceType)) {
    return "Based on property size, visit length, linen, and add-ons. You pay the total below via Airtel Money after the clean.";
  }
  if (details.category === "nanny") {
    return "Based on children, visit length, and add-ons. You pay the total below via Airtel Money after the visit.";
  }
  if (details.category === "cooking") {
    return "Based on meal type, dishes, and visit length. You pay the total below via Airtel Money after the visit.";
  }
  if (details.category === "housekeeping") {
    return "Based on visit length, duties, and schedule. You pay the total below via Airtel Money after the visit.";
  }
  if (details.category === "laundry") {
    return "Based on load size, visit length, and add-ons. You pay the total below via Airtel Money after the visit.";
  }
  if (details.category === "garden") {
    return "Based on yard size, visit length, and add-ons. You pay the total below via Airtel Money after the visit.";
  }
  if (details.category === "handyman") {
    return "Based on repair type, visit length, parts, and add-ons. You pay the total below via Airtel Money after the visit.";
  }
  return "Based on home size, visit length, and add-ons. You pay the total below via Airtel Money after the clean.";
}

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
  location_lat?: number | null
  location_lng?: number | null
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
  handyman: 'house-cleaning',
}

/** 0 = pick service (optional prelude), 1 = Details, 2 = Worker, 3 = Confirm booking */
const STEP = { PICK: 0, DETAILS: 1, WORKER: 2, PAYMENT: 3 } as const

const PROGRESS_STEPS = [
  { num: STEP.DETAILS, label: 'Details' },
  { num: STEP.WORKER, label: 'Worker' },
  { num: STEP.PAYMENT, label: CONFIRM_BOOKING_STEP_LABEL },
]

function mapApiWorkerProfile(w: Record<string, unknown>): PublicWorkerProfile {
  return {
    id: w.id as string,
    user_id: w.user_id as string,
    full_name: w.full_name as string,
    city: w.city as string,
    area: w.area as string,
    bio: (w.bio as string | null) ?? null,
    experience_years: (w.experience_years as number) ?? 0,
    category: w.category as WorkerCategory,
    subcategory: (w.subcategory as string | null) ?? null,
    profile_photo_url: (w.profile_photo_url as string | null) ?? null,
    trust_score: (w.trust_score as number) ?? 0,
    trust_score_label: (w.trust_score_label as string) ?? '',
    trust_score_color: (w.trust_score_color as string) ?? '',
    is_provisional: (w.is_provisional as boolean) ?? false,
    verification_level: (w.verification_level as PublicWorkerProfile['verification_level']) ?? 'none',
    average_rating: (w.average_rating as number) ?? 0,
    total_jobs_completed: (w.total_jobs_completed as number) ?? 0,
    total_reviews: (w.total_reviews as number) ?? 0,
    languages: (w.languages as string[]) ?? [],
    skills: (w.skills as string[]) ?? [],
    employment_types: (w.employment_types as PublicWorkerProfile['employment_types']) ?? [],
    availability_status:
      (w.availability_status as PublicWorkerProfile['availability_status']) ?? 'available',
    expected_salary_min: (w.expected_salary_min as number | null) ?? null,
    expected_salary_max: (w.expected_salary_max as number | null) ?? null,
    is_featured: (w.is_featured as boolean) ?? false,
  }
}

function mapApiWorker(w: Record<string, unknown>): WorkerSummary {
  return {
    id: w.id as string,
    user_id: w.user_id as string,
    full_name: w.full_name as string,
    city: w.city as string,
    area: w.area as string,
    location_lat: w.location_lat != null ? Number(w.location_lat) : null,
    location_lng: w.location_lng != null ? Number(w.location_lng) : null,
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

function initServiceDetailsFromParams(
  searchParams: URLSearchParams,
  categoryParam: string | null,
  funnelParam: string | null,
  workerProfileId: string | null
): ServiceDetails | null {
  const fromParams = resolveServiceDetailsFromSearchParams(
    searchParams,
    categoryParam,
    funnelParam
  )
  if (fromParams) return fromParams
  if (workerProfileId) return null

  return null
}

function getInitialStep(
  categoryParam: string | null,
  funnelParam: string | null,
  workerProfileId: string | null
) {
  if (workerProfileId) return STEP.DETAILS
  if (paramToCategoryKey(categoryParam) || resolveFunnelParam(funnelParam)) return STEP.DETAILS
  return STEP.PICK
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
  if (serviceType && isAirbnbCleaningType(serviceType)) {
    if (guestCheckoutTime) {
      parts.push(`Guest check-out: ${guestCheckoutTime}`)
    }
    if (nextCheckIn.trim()) {
      parts.push(`Next check-in: ${nextCheckIn.trim()}`)
    }
  }
  return parts.length > 0 ? parts.join('\n') : undefined
}

function usesAirbnbBookingFlow(details: ServiceDetails): boolean {
  return details.category === 'cleaning' && isAirbnbCleaningType(details.serviceType)
}

function isLockedAirbnbFlow(
  airbnbEntry: boolean,
  typeParam: string | null,
  funnelParam: string | null
): boolean {
  if (typeParam && isAirbnbCleaningType(normalizeServiceType('cleaning', typeParam))) return true
  if (airbnbEntry && typeParam) return true
  const funnelType = resolveFunnelParam(funnelParam)?.type
  return funnelType ? isAirbnbCleaningType(normalizeServiceType('cleaning', funnelType)) : false
}

function usesGuidedBookingFlow(details: ServiceDetails): boolean {
  return (
    details.category === 'nanny' ||
    details.category === 'cleaning' ||
    details.category === 'housekeeping' ||
    details.category === 'cooking' ||
    details.category === 'laundry' ||
    details.category === 'garden' ||
    details.category === 'handyman'
  )
}

function isServiceTypeLocked(
  typeParam: string | null,
  funnelParam: string | null
): boolean {
  if (typeParam) return true
  return !!resolveFunnelParam(funnelParam)?.type
}

export function BookingWizard({ airbnbEntry = false }: { airbnbEntry?: boolean }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const workerProfileId = searchParams.get('worker')
  const categoryParam = searchParams.get('category')
  const funnelParam = searchParams.get('funnel')
  const typeParam = searchParams.get('type')
  const lockedAirbnb = isLockedAirbnbFlow(airbnbEntry, typeParam, funnelParam)
  const preselectedWorkerRef = useRef<string | null>(null)
  const urlInitDone = useRef(false)
  const draftRestoredRef = useRef(false)

  const [step, setStep] = useState<number>(() => {
    if (airbnbEntry || isLockedAirbnbFlow(airbnbEntry, typeParam, funnelParam)) {
      return STEP.DETAILS
    }
    return getInitialStep(categoryParam, funnelParam, workerProfileId)
  })
  const [submitting, setSubmitting] = useState(false)
  const [deepLinkLoading, setDeepLinkLoading] = useState(!!workerProfileId)

  const [categories, setCategories] = useState<Category[]>([])
  const [categoriesLoading, setCategoriesLoading] = useState(true)

  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)
  const [serviceDetails, setServiceDetails] = useState<ServiceDetails | null>(() => {
    if (airbnbEntry) {
      const normalized = typeParam
        ? normalizeServiceType('cleaning', typeParam)
        : defaultBetweenGuestServiceDetails().serviceType
      return { ...defaultBetweenGuestServiceDetails(), serviceType: normalized }
    }
    return initServiceDetailsFromParams(searchParams, categoryParam, funnelParam, workerProfileId)
  })
  const [workers, setWorkers] = useState<WorkerSummary[]>([])
  const [workersLoading, setWorkersLoading] = useState(false)
  const [selectedWorker, setSelectedWorker] = useState<WorkerSummary | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  const [serviceDate, setServiceDate] = useState('')
  const [serviceTime, setServiceTime] = useState('')
  const [locationAddress, setLocationAddress] = useState('')
  const [locationCoords, setLocationCoords] = useState<LocationCoords | null>(null)
  const [description, setDescription] = useState('')
  const [guestCheckoutTime, setGuestCheckoutTime] = useState('')
  const [nextCheckIn, setNextCheckIn] = useState('')
  const [amount, setAmount] = useState('')
  const [jobPhotoFiles, setJobPhotoFiles] = useState<File[]>([])

  const [serviceSubStep, setServiceSubStep] = useState<ServiceFlowStep>('address')
  const [streetAddress, setStreetAddress] = useState('')
  const [unitAddress, setUnitAddress] = useState('')

  useEffect(() => {
    if (draftRestoredRef.current || typeof window === 'undefined') return

    const draft = loadBookingDraft()
    const pathname = window.location.pathname
    const search = window.location.search

    if (!draft || !draftMatchesReturnUrl(draft, pathname, search)) return

    draftRestoredRef.current = true
    if (draft.serviceDetails) setServiceDetails(draft.serviceDetails)
    setStep(draft.step)
    setServiceSubStep(draft.serviceSubStep)
    setServiceDate(draft.serviceDate)
    setServiceTime(draft.serviceTime)
    setLocationAddress(draft.locationAddress)
    setLocationCoords(draft.locationCoords)
    setStreetAddress(draft.streetAddress)
    setUnitAddress(draft.unitAddress)
    setDescription(draft.description)
    setGuestCheckoutTime(draft.guestCheckoutTime)
    setNextCheckIn(draft.nextCheckIn)
    if (draft.amount) setAmount(draft.amount)
    clearBookingDraft()
  }, [])

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

  const bookingSkills = serviceDetails
    ? skillsForServiceCategory(
        serviceDetails.category,
        serviceDetails.serviceType,
        serviceDetails
      )
    : []

  useEffect(() => {
    if (!categorySlug) {
      setWorkers([])
      return
    }
    setWorkersLoading(true)

    const skillsQuery =
      bookingSkills.length > 0
        ? `&skills=${encodeURIComponent(bookingSkills.join(','))}`
        : ''

    fetch(`/api/workers?category=${categorySlug}&available=true${skillsQuery}`)
      .then((r) => r.json())
      .then((res) => {
        if (!res.success) {
          toast.error(res.error?.message || 'Could not load workers')
          setWorkers([])
          return
        }
        const list: WorkerSummary[] = (res.data || []).filter((worker: WorkerSummary) => {
          if (serviceDetails?.category !== 'handyman') return true
          return workerMeetsHandymanVerification(
            worker.verification_level as 'none' | 'bronze' | 'silver' | 'gold' | 'platinum',
            serviceDetails.serviceType,
            serviceDetails
          )
        })
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
  }, [
    categorySlug,
    workerProfileId,
    bookingSkills.join(','),
    serviceDetails?.category,
    serviceDetails?.serviceType,
    serviceDetails?.plumbingJobType,
    serviceDetails?.routeToWorkerType,
  ])

  useEffect(() => {
    if (!serviceDetails || categories.length === 0) return

    const slug = categoryKeyToDbSlug(serviceDetails.category)
    const cat = categories.find((c) => c.slug === slug)
    if (cat && cat.id !== selectedCategory?.id) {
      setSelectedCategory(cat)
    }
  }, [serviceDetails, categories, selectedCategory])

  useEffect(() => {
    if (airbnbEntry && !typeParam && !funnelParam && !workerProfileId) {
      window.location.assign("/#hero-short-stay-panel")
      return
    }
    if (airbnbEntry || lockedAirbnb || workerProfileId || typeParam || funnelParam) return

    const key = paramToCategoryKey(categoryParam)
    if (!key || serviceDetails?.category === key) return

    setServiceDetails(defaultServiceDetails(key))
    setServiceSubStep('address')
    setStep(STEP.DETAILS)
  }, [
    airbnbEntry,
    lockedAirbnb,
    categoryParam,
    typeParam,
    funnelParam,
    workerProfileId,
    serviceDetails?.category,
  ])

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
        const profile = mapApiWorkerProfile(res.data)
        const details = resolveServiceDetailsForWorker(
          profile,
          searchParams,
          categoryParam,
          funnelParam
        )
        const slug = categoryKeyToDbSlug(details.category)
        const cat = categories.find((c) => c.slug === slug)
        if (cat) setSelectedCategory(cat)
        setServiceDetails(details)
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
  }, [workerProfileId, categories, categoriesLoading, searchParams, categoryParam, funnelParam])

  useEffect(() => {
    if (step !== STEP.PAYMENT || !serviceDetails) return;
    const { typical } = suggestPrice(serviceDetails);
    setAmount(String(typical));
  }, [step, serviceDetails]);

  const customerCoords = customerCoordsForSorting(locationCoords, locationAddress)

  const filteredWorkers = sortWorkersByProximity(
    workers.filter((w) => {
      if (!searchQuery) return true
      const q = searchQuery.toLowerCase()
      return (
        w.full_name.toLowerCase().includes(q) ||
        w.city.toLowerCase().includes(q) ||
        w.area.toLowerCase().includes(q)
      )
    }),
    customerCoords
  )

  const goToStep = useCallback((s: number) => {
    setStep(s)
    if (
      s === STEP.DETAILS &&
      serviceDetails &&
      usesGuidedBookingFlow(serviceDetails) &&
      locationAddress.length >= 5
    ) {
      setServiceSubStep('scope')
    }
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [serviceDetails, locationAddress])

  const ensureSignedInForBooking = useCallback(async () => {
    try {
      const res = await fetch('/api/auth/me')
      if (res.ok) return true
    } catch {
      // fall through to login redirect
    }

    if (typeof window !== 'undefined') {
      saveBookingDraft({
        pathname: window.location.pathname,
        search: window.location.search,
        step,
        serviceSubStep,
        serviceDetails,
        serviceDate,
        serviceTime,
        locationAddress,
        locationCoords,
        streetAddress,
        unitAddress,
        description,
        guestCheckoutTime,
        nextCheckIn,
        amount,
      })
    }

    const returnTo = `${window.location.pathname}${window.location.search}`
    router.push(`/login?redirect=${encodeURIComponent(returnTo)}`)
    toast.message('Sign in to complete your booking')
    return false
  }, [
    router,
    step,
    serviceSubStep,
    serviceDetails,
    serviceDate,
    serviceTime,
    locationAddress,
    locationCoords,
    streetAddress,
    unitAddress,
    description,
    guestCheckoutTime,
    nextCheckIn,
    amount,
  ])

  const selectServiceType = useCallback(
    (categoryKey: ServiceCategoryKey, serviceTypeId: string) => {
      const typeOption = getServiceType(categoryKey, serviceTypeId)
      const details = defaultServiceDetails(categoryKey)
      details.serviceType = serviceTypeId
      details.addons = sanitizeAddons(categoryKey, serviceTypeId, details.addons)
      if (typeOption) details.durationHours = typeOption.defaultHours

      const cat = categories.find((c) => c.slug === categoryKeyToDbSlug(categoryKey))
      setServiceDetails(details)
      if (cat) setSelectedCategory(cat)
      setServiceSubStep('address')
      goToStep(STEP.DETAILS)
    },
    [categories, goToStep]
  )

  const lockServiceType = isServiceTypeLocked(typeParam, funnelParam)
  const guidedFlow = serviceDetails ? usesGuidedBookingFlow(serviceDetails) : false

  const selectWorker = useCallback(
    async (worker: WorkerSummary) => {
      if (!serviceDate || !serviceTime || locationAddress.length < 5) {
        toast.error('Please choose a date, time, and address first')
        goToStep(STEP.DETAILS)
        return
      }
      const signedIn = await ensureSignedInForBooking()
      if (!signedIn) return
      setSelectedWorker(worker)
      goToStep(STEP.PAYMENT)
    },
    [goToStep, serviceDate, serviceTime, locationAddress, ensureSignedInForBooking]
  )

  const hasScheduleDetails =
    !!serviceDate && !!serviceTime && locationAddress.length >= 5

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

  async function handleSubmitReviewRequest() {
    if (!serviceDetails) {
      toast.error('Please configure your service')
      goToStep(STEP.DETAILS)
      return
    }
    if (!plumbingRequiresAdminReview(serviceDetails)) {
      goToStep(STEP.WORKER)
      return
    }
    if (!selectedCategory) {
      toast.error('Service categories are still loading. Please try again in a moment.')
      return
    }
    if (!serviceDate || !serviceTime || locationAddress.length < 5) {
      toast.error('Please complete your booking details')
      goToStep(STEP.DETAILS)
      return
    }

    const signedIn = await ensureSignedInForBooking()
    if (!signedIn) return

    setSubmitting(true)
    try {
      let bookingDescription = buildBookingDescription(
        description,
        serviceDetails.serviceType,
        guestCheckoutTime,
        nextCheckIn
      )

      if (jobPhotoFiles.length > 0) {
        const photoUrls = await uploadBookingJobPhotos(jobPhotoFiles)
        bookingDescription = appendPhotoUrlsToDescription(
          bookingDescription ?? '',
          photoUrls
        )
      }

      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          categoryId: selectedCategory.id,
          serviceDate,
          serviceTime,
          locationAddress,
          locationLat: locationCoords?.lat,
          locationLng: locationCoords?.lng,
          description: bookingDescription,
          serviceDetails,
          amount: 0,
          requiresAdminReview: true,
        }),
      })

      const data = await res.json()

      if (res.status === 401 || data.error?.code === 'UNAUTHORIZED') {
        const returnTo = `${window.location.pathname}${window.location.search}`
        router.push(`/login?redirect=${encodeURIComponent(returnTo)}`)
        toast.message('Sign in to complete your booking')
        return
      }

      if (!res.ok || !data.success) {
        throw new Error(data.error?.message || 'Failed to submit request')
      }

      toast.success('Request submitted. TumaHelper will review and follow up.')
      clearBookingDraft()
      setJobPhotoFiles([])
      router.push(`/customer/bookings/${data.data.id}`)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setSubmitting(false)
    }
  }

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

    const signedIn = await ensureSignedInForBooking()
    if (!signedIn) return

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
          locationLat: locationCoords?.lat,
          locationLng: locationCoords?.lng,
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

      if (res.status === 401 || data.error?.code === 'UNAUTHORIZED') {
        const returnTo = `${window.location.pathname}${window.location.search}`
        router.push(`/login?redirect=${encodeURIComponent(returnTo)}`)
        toast.message('Sign in to complete your booking')
        return
      }

      if (!res.ok || !data.success) {
        throw new Error(data.error?.message || 'Failed to create booking')
      }

      toast.success('Booking created. Complete payment on the next screen')
      clearBookingDraft()
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
        emphasizeEstimate: lockedAirbnb,
        summaryTitle: lockedAirbnb ? 'Booking details' : undefined,
        showAirbnbScopeTeaser: false,
      }
    : null

  const progressSteps = PROGRESS_STEPS
  const showWizardProgress = step >= STEP.DETAILS && !(step === STEP.DETAILS && guidedFlow)

  const bookingTitle =
    step === STEP.PICK
      ? 'What do you need?'
      : serviceDetails
        ? getBookingPageTitle(serviceDetails.category, serviceDetails.serviceType)
        : 'Book a service'

  function renderGuidedSummary() {
    if (!serviceDetails) return null
    if (lockedAirbnb || (serviceDetails && usesAirbnbBookingFlow(serviceDetails))) {
      return (
        <AirbnbBookingSummary
          step={serviceSubStep as 'address' | 'plan' | 'scope'}
          locationAddress={locationAddress}
          details={serviceDetails}
          serviceDate={serviceDate}
          serviceTime={serviceTime}
          showEstimate={serviceSubStep === 'scope'}
        />
      )
    }
    return (
      <ServiceBookingSummary
        step={serviceSubStep}
        locationAddress={locationAddress}
        details={serviceDetails}
        serviceDate={serviceDate}
        serviceTime={serviceTime}
        showEstimate={serviceSubStep === 'scope'}
      />
    )
  }

  function renderGuidedFlow() {
    if (!serviceDetails) return null
    const shared = {
      step: serviceSubStep,
      onStepChange: setServiceSubStep,
      streetAddress,
      unitAddress,
      onStreetAddressChange: setStreetAddress,
      onUnitAddressChange: setUnitAddress,
      locationAddress,
      onLocationConfirm: (full: string, coords?: LocationCoords) => {
        setLocationAddress(full)
        setLocationCoords(coords ?? null)
        if (
          serviceDetails?.category === 'handyman' &&
          serviceDetails.serviceType === 'plumbing'
        ) {
          setServiceSubStep('classify')
        } else {
          setServiceSubStep('plan')
        }
      },
      serviceDetails,
      onServiceDetailsChange: setServiceDetails,
      serviceDate,
      serviceTime,
      description,
      onDateChange: setServiceDate,
      onTimeChange: setServiceTime,
      onDescriptionChange: setDescription,
      guestCheckoutTime,
      nextCheckIn,
      onGuestCheckoutTimeChange: setGuestCheckoutTime,
      onNextCheckInChange: setNextCheckIn,
      jobPhotoFiles,
      onJobPhotoFilesChange: setJobPhotoFiles,
      onFindWorker: () => {
        if (serviceDetails && plumbingRequiresAdminReview(serviceDetails)) {
          void handleSubmitReviewRequest()
          return
        }
        goToStep(STEP.WORKER)
      },
      onSubmitReviewRequest: () => {
        void handleSubmitReviewRequest()
      },
    }

    if (lockedAirbnb || (serviceDetails && usesAirbnbBookingFlow(serviceDetails))) {
      return <AirbnbBookingFlow {...shared} step={serviceSubStep as 'address' | 'plan' | 'scope'} onStepChange={setServiceSubStep as (s: 'address' | 'plan' | 'scope') => void} lockServiceType={lockServiceType} />
    }
    if (serviceDetails.category === 'nanny') {
      return <NannyBookingFlow {...shared} lockServiceType={lockServiceType} />
    }
    if (serviceDetails.category === 'housekeeping') {
      return <HousekeepingBookingFlow {...shared} lockServiceType={lockServiceType} />
    }
    if (serviceDetails.category === 'cooking') {
      return <CookingBookingFlow {...shared} lockServiceType={lockServiceType} />
    }
    if (serviceDetails.category === 'handyman') {
      return <HandymanBookingFlow {...shared} lockServiceType={lockServiceType} />
    }
    if (serviceDetails.category === 'laundry' || serviceDetails.category === 'garden') {
      return (
        <TaskServiceBookingFlow
          {...shared}
          category={serviceDetails.category}
          lockServiceType={lockServiceType}
        />
      )
    }
    return (
      <CleaningBookingFlow
        {...shared}
        lockServiceType={lockServiceType}
      />
    )
  }

  return (
    <div className="min-h-screen">
      <main
        className={`mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 ${
          guidedFlow ? 'max-w-6xl' : 'max-w-5xl'
        }`}
      >
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">{bookingTitle}</h1>
          {showWizardProgress && (
            <>
              <div className="md:hidden mt-4 space-y-2">
                <p className="text-sm text-muted-foreground">
                  Step {progressSteps.findIndex((s) => s.num === step) + 1} of {progressSteps.length}
                  <span className="text-foreground font-medium">
                    {" "}
                    · {progressSteps.find((s) => s.num === step)?.label}
                  </span>
                </p>
                <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full rounded-full bg-primary transition-all duration-300"
                    style={{
                      width: `${((progressSteps.findIndex((s) => s.num === step) + 1) / progressSteps.length) * 100}%`,
                    }}
                  />
                </div>
              </div>
              <div className="hidden md:flex items-center gap-2 mt-4 overflow-x-auto pb-1 scrollbar-hide">
              {progressSteps.map((s, i) => (
                <div key={s.num} className="flex items-center gap-2 shrink-0">
                  <div
                    className={`h-8 w-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      s.num === step
                        ? 'bg-primary text-white'
                        : s.num < step
                          ? 'bg-primary/20 text-primary'
                          : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    {i + 1}
                  </div>
                  <span
                    className={`text-sm ${s.num === step ? 'font-medium' : 'text-muted-foreground'}`}
                  >
                    {s.label}
                  </span>
                  {i < progressSteps.length - 1 && <div className="h-0.5 w-6 bg-muted" />}
                </div>
              ))}
              </div>
            </>
          )}
        </div>

        {step === STEP.PICK && (
          <Card>
            <CardContent className="p-6">
              <ServiceTypePicker onSelect={selectServiceType} />
            </CardContent>
          </Card>
        )}

        {step === STEP.DETAILS && serviceDetails && guidedFlow && (
          <BookingStepShell
            layout="sidebar"
            summary={renderGuidedSummary()}
            summarySide="right"
          >
            <Card>
              <CardContent className="p-6 sm:p-8">
                {deepLinkLoading ? (
                  <div className="flex justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : (
                  renderGuidedFlow()
                )}
              </CardContent>
            </Card>
          </BookingStepShell>
        )}

        {step === STEP.WORKER && (
          <BookingStepShell
            summary={
              guidedFlow && serviceDetails ? (
                lockedAirbnb ? (
                  <AirbnbBookingSummary
                    step="scope"
                    locationAddress={locationAddress}
                    details={serviceDetails}
                    serviceDate={serviceDate}
                    serviceTime={serviceTime}
                    showEstimate
                  />
                ) : (
                  <ServiceBookingSummary
                    step="scope"
                    locationAddress={locationAddress}
                    details={serviceDetails}
                    serviceDate={serviceDate}
                    serviceTime={serviceTime}
                    showEstimate
                  />
                )
              ) : summaryProps ? (
                <BookingSummaryPanel {...summaryProps} />
              ) : undefined
            }
            summarySide={guidedFlow ? 'right' : 'left'}
          >
            <Card>
              <CardContent className="p-6 space-y-4">
                <h2 className="text-xl font-semibold">
                  {serviceDetails
                    ? getWorkerSelectionHeading(
                        serviceDetails.category,
                        serviceDetails.serviceType
                      )
                    : 'Choose your helper'}
                </h2>

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
                          <div className="w-12 h-12 rounded-full bg-muted flex-shrink-0 overflow-hidden">
                            {worker.profile_photo_url ? (
                              <img
                                src={worker.profile_photo_url}
                                alt={worker.full_name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-muted-foreground font-medium">
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

                <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-between sm:items-center">
                  <Button
                    variant="outline"
                    onClick={() => goToStep(STEP.DETAILS)}
                    className="w-full sm:w-auto min-h-11"
                  >
                    <ChevronLeft className="mr-2 h-4 w-4" />
                    Edit details
                  </Button>
                  {selectedWorker && (
                    <Button
                      onClick={async () => {
                        if (!hasScheduleDetails) {
                          toast.error('Please choose a date, time, and address first')
                          goToStep(STEP.DETAILS)
                          return
                        }
                        const signedIn = await ensureSignedInForBooking()
                        if (!signedIn) return
                        goToStep(STEP.PAYMENT)
                      }}
                      className="w-full sm:w-auto min-h-11"
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
              lockedAirbnb ? (
                <AirbnbBookingSummary
                  step="scope"
                  locationAddress={locationAddress}
                  details={serviceDetails}
                  serviceDate={serviceDate}
                  serviceTime={serviceTime}
                  showEstimate
                />
              ) : guidedFlow ? (
                <ServiceBookingSummary
                  step="scope"
                  locationAddress={locationAddress}
                  details={serviceDetails}
                  serviceDate={serviceDate}
                  serviceTime={serviceTime}
                  showEstimate
                />
              ) : summaryProps ? (
                <BookingSummaryPanel {...summaryProps} hidePriceEstimate />
              ) : undefined
            }
            summarySide={guidedFlow || lockedAirbnb ? 'right' : 'left'}
          >
            <Card>
              <CardContent className="p-6 space-y-6">
                <div>
                  <h2 className="text-xl font-semibold">{CONFIRM_BOOKING_INTRO.title}</h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    {CONFIRM_BOOKING_INTRO.subtitle}
                  </p>
                </div>

                {!selectedWorker && (
                  <Button variant="outline" onClick={() => goToStep(STEP.WORKER)}>
                    Choose a worker
                  </Button>
                )}

                {selectedWorker && (
                  <>
                    <div className="space-y-2">
                      <p className="text-sm font-medium">Guide price (ZMW)</p>
                      <div className="rounded-xl border border-border bg-surface/50 px-4 py-3">
                        <p className="font-display text-2xl font-bold tabular-nums text-foreground">
                          K{suggestPrice(serviceDetails).typical}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                          {guidePriceHint(serviceDetails)}
                        </p>
                      </div>
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
