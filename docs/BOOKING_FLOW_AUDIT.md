# TumaHelper Booking Flow — Code Details for Audit

> **Purpose:** Technical brief for auditing the customer booking wizard at `/customer/book`.  
> **Repo:** `walu22/tumahelper`  
> **Last updated:** June 2026 (commit `e27ae47` and later on `master`)

---

## Mission

Audit the **customer booking wizard** at `/customer/book`. Map every entry path, trace state transitions, find P0/P1/P2 issues, and assess Lusaka launch readiness.

### Product truths (do not assume otherwise)

- Payment is **not** in the wizard. Step 3 is **confirm guide price only**.
- Airtel Money payment happens on `/customer/bookings/{id}` via `PaymentInstructions`.
- All 7 service categories use **guided sub-flows** (address → plan → scope; plumbing adds classify).
- Auth is required **before worker selection** and **before submit** (not at wizard entry).
- `/customer/book` is **public**; login redirect preserves `?redirect=` back to the same URL.

---

## Architecture

Single orchestrator: `components/booking/booking-wizard.tsx` (~1,150 lines).

```
┌─────────────────────────────────────────────────────────────┐
│  BookingWizard (client component)                           │
├─────────────────────────────────────────────────────────────┤
│  STEP.PICK (0)      → ServiceTypePicker (cold start only)   │
│  STEP.DETAILS (1)   → Guided sub-flow per category          │
│  STEP.WORKER (2)    → Worker list + search                  │
│  STEP.PAYMENT (3)   → Confirm booking (price only)          │
└─────────────────────────────────────────────────────────────┘
```

Progress bar labels (shown from DETAILS onward, hidden during guided sub-steps):

```ts
/** 0 = pick service (optional prelude), 1 = Details, 2 = Worker, 3 = Confirm booking */
const STEP = { PICK: 0, DETAILS: 1, WORKER: 2, PAYMENT: 3 } as const

const PROGRESS_STEPS = [
  { num: STEP.DETAILS, label: 'Details' },
  { num: STEP.WORKER, label: 'Worker' },
  { num: STEP.PAYMENT, label: CONFIRM_BOOKING_STEP_LABEL }, // "Confirm booking"
]
```

Internal constant `STEP.PAYMENT` is legacy naming; UI label is **Confirm booking**.

---

## Routes & Entry Points

| Route | Component | Notes |
|-------|-----------|-------|
| `/customer/book` | `<BookingWizard />` | Main wizard |
| `/customer/book/airbnb` | `<BookingWizard airbnbEntry />` | Locked short-stay flow |
| `/book?...` | Redirect | Forwards subset of params → `/customer/book` (`app/book/page.tsx`) |

### URL params read by wizard

| Param | Purpose |
|-------|---------|
| `category` | `nanny`, `cleaning`, `housekeeping`, `cooking`, `laundry`, `garden`, `handyman` |
| `type` | Service type id within category (e.g. `babysitter`, `plumbing`, `guest_checkout`) |
| `funnel` | Marketing alias → resolved via `FUNNEL_ALIASES` in `lib/services/utils.ts` |
| `worker` | Worker **profile** UUID (not `user_id`) |
| `hours`, `bedrooms`, `bathrooms`, `children`, `ages`, `addons`, `frequency` | Pre-fill `ServiceDetails` |

### Redirect rules

- **Bare `?category=X`** without `type`, `funnel`, or `worker` → redirects to homepage hero panel (`/#hero-{category}-panel`). Intentional; covered by e2e (`e2e/book-entry.spec.ts`).
- **Airbnb entry** (`/customer/book/airbnb` with no params) → redirects to `/#hero-short-stay-panel`.

---

## Initial Step Logic

```ts
function getInitialStep(categoryParam, funnelParam, workerProfileId) {
  if (workerProfileId) return STEP.DETAILS
  if (paramToCategoryKey(categoryParam) || resolveFunnelParam(funnelParam)) return STEP.DETAILS
  return STEP.PICK
}
```

- Cold start → `STEP.PICK` ("What do you need?")
- `?category=...&type=...` → skip to `STEP.DETAILS`
- `?worker=...` → starts at `STEP.DETAILS` while worker profile loads

---

## Guided Sub-Flow Routing

`renderGuidedFlow()` in `booking-wizard.tsx`:

| Condition | Component |
|-----------|-----------|
| Airbnb type or `airbnbEntry` | `AirbnbBookingFlow` |
| `nanny` | `NannyBookingFlow` |
| `housekeeping` | `HousekeepingBookingFlow` |
| `cooking` | `CookingBookingFlow` (wraps housekeeping variant) |
| `handyman` | `HandymanBookingFlow` |
| `laundry`, `garden` | `TaskServiceBookingFlow` |
| default residential `cleaning` | `CleaningBookingFlow` |

Sub-step sequence from `lib/booking/shared-flow.ts` → `getFlowSteps()`:

- Most categories: `address` → `plan` → `scope`
- Plumbing: `address` → **`classify`** → `plan` → `scope`
- Airbnb: `address` (label "Property") → `plan` → `scope`

Shared props passed to all flows: address fields, `serviceDetails`, date/time, description, `onFindWorker`, `onSubmitReviewRequest`.

### `onFindWorker` behavior

- If `plumbingRequiresAdminReview(serviceDetails)` → calls `handleSubmitReviewRequest()` (skips worker step)
- Else → `goToStep(STEP.WORKER)`

---

## Worker Deep-Link Resolution

`lib/booking/worker-deep-link.ts`:

1. **`resolveServiceDetailsFromSearchParams()`** — builds `ServiceDetails` when `category`/`type`/`funnel` present
2. **`resolveServiceDetailsForWorker()`** — URL params first, else `inferWorkerServiceDetails()` from `lib/landing/worker-card.ts`
3. **`getWorkerSelectionHeading()`** — per-category headings ("Choose your gardener", etc.)
4. **`CONFIRM_BOOKING_INTRO`** — confirm step title/subtitle

Worker fetch effect (`booking-wizard.tsx` ~439–473):

```
GET /api/workers/{workerProfileId}
  → resolveServiceDetailsForWorker()
  → setServiceDetails, preselect worker, setStep(DETAILS)
```

Homepage spotlight cards build URLs via `buildWorkerSpotlightBookUrl()` in `lib/landing/worker-card.ts`:

```ts
export function buildWorkerSpotlightBookUrl(worker: PublicWorkerProfile): string {
  return buildBookAgainUrl(worker.id, inferWorkerServiceDetails(worker));
}
```

Produces URLs like `/customer/book?category=garden&type=...&hours=...&worker={profileId}`.

### Skill inference order (`inferWorkerServiceDetails`)

1. Nanny worker → first nanny type
2. First matching skill in `SKILL_TO_CATEGORY` map
3. Fallback → residential cleaning

---

## Wizard State (React)

Key state in `BookingWizard`:

| State | Type | Used for |
|-------|------|----------|
| `step` | `0–3` | Macro wizard step |
| `serviceDetails` | `ServiceDetails \| null` | Category, type, scope |
| `serviceSubStep` | `ServiceFlowStep` | Guided sub-step |
| `selectedCategory` | DB category row | `categoryId` on submit |
| `selectedWorker` | `WorkerSummary` | `workerId` on submit |
| `serviceDate`, `serviceTime` | strings | Schedule |
| `locationAddress`, `locationCoords` | string + `{lat,lng}` | Address (GPS stored, **not used for ranking**) |
| `description` | string | Free text |
| `guestCheckoutTime`, `nextCheckIn` | strings | **Dead UI state** — only appended in `buildBookingDescription` for Airbnb |
| `amount` | string (ZMW) | Guide price; auto-filled on entering confirm step |

---

## Worker Matching

Triggered when `categorySlug` is set:

```
GET /api/workers?category={nanny|house_cleaner}&available=true&skills=...
```

- `workerCategorySlug()`: `nanny` → API `nanny`; everything else → `house_cleaner`
- Skills from `skillsForServiceCategory()` in `lib/workers/skills.ts`
- Nanny: **empty skills filter** (all nannies in category)
- Handyman: extra client filter via `workerMeetsHandymanVerification()`
- Sorted by `trust_score` DESC (API), not distance
- Text search filters by name/city/area client-side

**DB reality:** workers only have `category` of `nanny` or `house_cleaner`. All non-nanny booking categories query `house_cleaner` and filter by skills.

---

## Auth Gates

`ensureSignedInForBooking()` → `GET /api/auth/me`; on failure → `/login?redirect={current URL}`.

Called in:

- `selectWorker()` — before advancing to confirm
- Worker step "Continue with selected worker" button
- `handleSubmit()` and `handleSubmitReviewRequest()`

---

## Submit Paths

### Normal booking — `handleSubmit()`

**Preconditions:** `selectedWorker`, `serviceDate`, `serviceTime`, `locationAddress` (≥5 chars), `amount` (≥1 ZMW)

**POST `/api/bookings`:**

```json
{
  "workerId": "<user_id UUID>",
  "categoryId": "<service_categories.id UUID>",
  "serviceDate": "YYYY-MM-DD",
  "serviceTime": "HH:MM",
  "locationAddress": "...",
  "locationLat": 0.0,
  "locationLng": 0.0,
  "description": "...",
  "serviceDetails": {},
  "amount": 45000
}
```

**Amount is in ngwee/cents:** `amountInCents = parseFloat(amount) * 100`. Platform fee 10% computed client-side for display; server recalculates via `calculatePlatformFee()`.

**Success:** toast + redirect to `/customer/bookings/{id}`.

### Admin review (specialist plumbing) — `handleSubmitReviewRequest()`

**Preconditions:** `plumbingRequiresAdminReview(serviceDetails) === true`, schedule + address complete, no worker.

```json
{
  "categoryId": "...",
  "serviceDate": "...",
  "serviceTime": "...",
  "locationAddress": "...",
  "serviceDetails": { "requiresAdminReview": true },
  "amount": 50,
  "requiresAdminReview": true
}
```

`amount: 50` is a **placeholder** (50 ngwee = K0.50). Admins notified via `booking_review` notification type.

---

## API Validation

`lib/validations.ts` → `bookingSchema`:

- `workerId` optional only when `requiresAdminReview`
- `amount`: 50–1,000,000 (cents)
- `serviceDetails`: full Zod schema for all 7 categories + plumbing fields

**Gap:** many client-only validations (child ages required, handyman notes min 10 chars, linen selections) are **not** enforced server-side.

`POST /api/bookings` (`app/api/bookings/route.ts`) additionally checks:

- Worker exists and `availability_status === "available"`
- Worker `verification_level` ≥ category `requires_verification`
- Skips worker checks when `adminReview`

---

## Payment After Booking

Wizard step 3 copy (`CONFIRM_BOOKING_INTRO`):

> "Review the guide price below. After you confirm, you will pay on Airtel Money on the next screen."

On `/customer/bookings/{id}`: `components/booking/payment-instructions.tsx`

- Shows Airtel Money number from `getPaymentAccountDetails()`
- Customer uploads proof → `POST /api/bookings/{id}/payment-proof`

`suggestPrice(serviceDetails)` auto-fills `amount` when entering confirm step (`useEffect` on `step === STEP.PAYMENT`).

---

## 10 Scenarios to Trace

| # | Entry URL | Expected path |
|---|-----------|---------------|
| 1 | `/customer/book` | PICK → user picks type → DETAILS guided flow → WORKER → PAYMENT → submit |
| 2 | `/customer/book?category=nanny&type=babysitter` | Skip PICK → NannyBookingFlow → WORKER ("Choose your nanny") → confirm |
| 3 | Homepage worker card URL (`buildWorkerSpotlightBookUrl`) | DETAILS with inferred category from skills, worker preselected, correct heading |
| 4 | `/customer/book?worker={id}` only | Fetch worker → infer category from skills → DETAILS with worker locked in |
| 5 | `/customer/book/airbnb?type=guest_checkout` | AirbnbBookingFlow, locked type, short-stay heading |
| 6 | `/customer/book?category=handyman&type=electrical` | HandymanBookingFlow → skill-filtered workers |
| 7 | `/customer/book?category=handyman&type=plumbing` + standard job (e.g. leaking tap) | Extra classify step → WORKER → plumber skill filter |
| 8 | Plumbing specialist job (`requiresAdminReview: true`) | classify → scope → **submit review** (no worker step) |
| 9 | Logged-out user at worker step | Redirect to login with return URL; **wizard state restored** from `sessionStorage` after auth |
| 10 | `/customer/book?category=cooking` (no type) | Starts guided flow with **default visit type** (no homepage redirect) |

---

## Audit fix status (June 2026)

The following issues from the external audit were **fixed** in commit `86c9522`:

| Severity | Issue | Resolution |
|----------|-------|------------|
| P0 | Worker skill pagination before in-memory filter | `app/api/workers/route.ts` — fetch up to 500 when `skills` set, filter, then paginate |
| P0 | State loss on login redirect | `lib/booking/draft-persistence.ts` — `sessionStorage` save/restore in wizard |
| P0 | Missing server-side validation | `lib/validations.ts` — nanny ages + handyman notes enforced |
| P0 | Admin review amount placeholder | `amount: 0` for admin review; schema allows 0 only when `requiresAdminReview` |
| P1 | No proximity routing | `lib/workers/proximity.ts` — sort by Lusaka suburb distance (area centroids) |
| P1 | Emergency plumbing dead-end | Hide emergency flooding; uncontrollable leaks → specialist review |
| P1 | Missing plumbing photo upload | `BookingJobPhotos` + `/api/uploads/booking-photos` |
| P2 | Dead Airbnb guest time state | Inputs wired in `AirbnbBookingFlow` |
| P2 | Dead `BookingScheduleFields` | Component removed |
| P2 | `ServiceTypePicker` ignores `onSelect` | Cold start uses callback navigation |
| P2 | Bare category redirects | Default service type; stay in wizard |

### Remaining limitations

| Item | Notes |
|------|-------|
| Proximity accuracy | Uses worker `area` suburb centroids, not per-worker GPS |
| `BookingSummaryPanel` | Non-guided path still unreachable (all categories use guided flows) |
| `EMERGENCY_PLUMBING_AVAILABLE` | Still `false` until emergency plumbers onboarded; option hidden from UI |

---

## Known Issues / Backlog (historical — see fix status above)

> **Historical snapshot** — most items below were resolved in `86c9522`. See **Audit fix status** above.

| ID | Issue | Location |
|----|-------|----------|
| ~~Dead state~~ | ~~`guestCheckoutTime`, `nextCheckIn`~~ | Fixed in `airbnb-booking-flow.tsx` |
| ~~Dead code~~ | ~~`BookingScheduleFields`~~ | Removed |
| ~~Plumbing photos~~ | ~~No upload UI~~ | `booking-job-photos.tsx` |
| ~~Emergency plumbing~~ | ~~Dead-end block~~ | Specialist routing + hidden option |
| ~~No proximity~~ | ~~Trust-only sort~~ | `lib/workers/proximity.ts` |
| ~~Admin review amount~~ | ~~Hardcoded 50 ngwee~~ | Uses `amount: 0` |
| ~~Bare category redirects~~ | ~~Homepage bounce~~ | Default type in wizard |
| ~~Client-only validation~~ | ~~Not in Zod~~ | `lib/validations.ts` |
| ~~ServiceTypePicker~~ | ~~Link-only navigation~~ | `onSelect` callback |

### Discussed — partially addressed

- **D:** Area-aware worker list — **done** via suburb proximity sort (centroid-based)
- **E:** Airbnb guest times — **done**
- **F:** Plumbing photo upload — **done**
- **G:** Dead code cleanup — **partial** (`BookingScheduleFields` removed; `BookingSummaryPanel` non-guided path remains unreachable)

---

## Key File Index

```
app/customer/book/page.tsx              # <BookingWizard />
app/customer/book/airbnb/page.tsx       # <BookingWizard airbnbEntry />
app/book/page.tsx                       # redirect to /customer/book
app/api/bookings/route.ts               # POST create booking
app/api/workers/route.ts                # GET list workers
app/api/workers/[id]/route.ts           # GET single worker (deep link)

components/booking/booking-wizard.tsx       # orchestrator
components/booking/*-booking-flow.tsx       # per-category guided flows
components/booking/plumbing-job-classifier.tsx
components/booking/payment-instructions.tsx   # post-booking payment
components/booking/service-type-picker.tsx    # cold start pills

lib/booking/shared-flow.ts              # sub-step definitions
lib/booking/worker-deep-link.ts         # deep link + headings + confirm copy
lib/booking/worker-deep-link.test.ts
lib/landing/worker-card.ts              # skill inference + spotlight URLs
lib/services/catalog.ts                 # ServiceDetails, types, defaults
lib/services/utils.ts                   # suggestPrice, buildBookUrl, funnel aliases
lib/services/handyman-plumbing.ts         # plumbing routing + admin review
lib/workers/skills.ts                   # worker skill matching
lib/validations.ts                      # bookingSchema, serviceDetailsSchema
lib/bookings/book-again.ts              # buildBookAgainUrl

e2e/book-entry.spec.ts                  # entry point smoke tests
```

**Tests:** unit tests in `lib/booking/worker-deep-link.test.ts`, `lib/landing/worker-card.test.ts`; e2e in `e2e/book-entry.spec.ts`.

---

## Copy-Paste Auditor Prompt

```
You are auditing the TumaHelper customer booking flow (Next.js app, repo: walu22/tumahelper).

Focus: /customer/book wizard — all entry paths, state machine, worker matching, submit, and post-booking payment.

Read these files first:
- components/booking/booking-wizard.tsx (orchestrator)
- lib/booking/worker-deep-link.ts (deep links)
- lib/booking/shared-flow.ts (sub-steps)
- lib/services/utils.ts (URL building, pricing)
- lib/services/handyman-plumbing.ts (plumbing admin review)
- app/api/bookings/route.ts (server validation)
- lib/validations.ts (Zod schemas)

Trace these 10 scenarios and document actual step order, API calls, and failure modes:
1. Cold start /customer/book
2. /customer/book?category=nanny&type=babysitter
3. Homepage worker spotlight card URL (?worker= + inferred category)
4. /customer/book?worker={id} only
5. /customer/book/airbnb?type=guest_checkout
6. Handyman electrical
7. Plumbing standard (leaking tap)
8. Plumbing specialist (admin review, no worker)
9. Logged-out user selecting worker
10. /customer/book?category=cooking (bare category redirect)

Product constraints:
- Wizard step 3 is "Confirm booking" (guide price only), NOT payment
- Payment is Airtel Money on /customer/bookings/{id} after submit
- Auth required before worker select and submit, not at wizard entry
- Bare ?category= without type/funnel/worker redirects to homepage hero

Deliver: P0/P1/P2 issues, launch readiness opinion for Lusaka, and specific file:line fixes.
```
