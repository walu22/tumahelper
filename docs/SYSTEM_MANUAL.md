# TumaHelper System Manual

**Version:** 0.1.0 (MVP)  
**Last updated:** June 2026  
**Repository:** `walu22/tumahelper`  
**Production branch:** `master` (mirrored on `main`)

This manual documents the TumaHelper platform as implemented today: what it does, how users move through it, how data is stored, and how developers operate it.

---

## Table of contents

1. [Introduction](#1-introduction)
2. [Product overview](#2-product-overview)
3. [User roles and journeys](#3-user-roles-and-journeys)
4. [Public website and landing page](#4-public-website-and-landing-page)
5. [Booking system](#5-booking-system)
6. [Service catalog and pricing](#6-service-catalog-and-pricing)
7. [Payments](#7-payments)
8. [Worker verification and trust](#8-worker-verification-and-trust)
9. [Permanent hire and job board](#9-permanent-hire-and-job-board)
10. [Admin operations](#10-admin-operations)
11. [Technical architecture](#11-technical-architecture)
12. [Database reference](#12-database-reference)
13. [API reference](#13-api-reference)
14. [Environment and configuration](#14-environment-and-configuration)
15. [Local development](#15-local-development)
16. [Testing](#16-testing)
17. [Deployment](#17-deployment)
18. [Appendix](#18-appendix)

---

## 1. Introduction

### 1.1 What TumaHelper is

TumaHelper is a **home-help marketplace for Lusaka, Zambia**. It connects households with verified domestic workers for:

- On-demand visits (cleaning, nannies, housekeeping, cooking, laundry, garden work, short-stay turnover cleaning)
- Recurring help with the same worker
- A path to **permanent hire** (full-time nanny, live-in housekeeper, etc.)

The platform is **not the employer** of workers. Workers are independent service providers; TumaHelper provides discovery, booking, verification, payments coordination, reviews, and trust scores.

### 1.2 Primary market

- **City:** Lusaka, Zambia
- **Currency:** Zambian Kwacha (ZMW), stored internally in **ngwee** (1 ZMW = 100 ngwee)
- **Areas served:** Kabulonga, Woodlands, Roma, Meanwood, Ibex Hill, Chelstone, Kalundu, Longacres, and surrounding suburbs (see `lib/landing/content.ts` → `LUSAKA_AREAS`)

### 1.3 Core value propositions

| Pillar | What we deliver |
|--------|-----------------|
| **Trust** | NRC identity checks, reference verification, trust scores, reviews |
| **Clarity** | Service catalog with inclusions, typical prices, and booking scope |
| **Convenience** | Book from homepage, choose a worker, pay via Airtel Money |
| **Growth path** | Book first → build trust → hire permanently |

### 1.4 Related documentation

| Document | Purpose |
|----------|---------|
| `README.md` | Quick start, deployment checklist |
| `docs/TEST_STRATEGY.md` | How we test |
| `docs/TEST_CASES.md` | Full test case catalog (100+ cases) |
| `app/privacy/page.tsx` | Privacy Policy (content in `lib/legal/privacy-content.ts`) |
| `app/terms/page.tsx` | Terms of Service (content in `lib/legal/terms-content.ts`) |

---

## 2. Product overview

### 2.1 High-level system diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                        PUBLIC WEBSITE                            │
│  Homepage · /workers · /hire · /jobs · /services · legal pages  │
└────────────────────────────┬────────────────────────────────────┘
                             │
         ┌───────────────────┼───────────────────┐
         ▼                   ▼                   ▼
   ┌──────────┐        ┌──────────┐        ┌──────────┐
   │ Customer │        │  Worker  │        │ Employer │
   │ dashboard│        │ dashboard│        │ dashboard│
   └────┬─────┘        └────┬─────┘        └────┬─────┘
        │                   │                   │
        └───────────────────┼───────────────────┘
                            ▼
              ┌─────────────────────────┐
              │   Next.js API routes    │
              │   app/api/*             │
              └────────────┬────────────┘
                           ▼
              ┌─────────────────────────┐
              │   Supabase PostgreSQL   │
              │   + Storage + Auth      │
              └─────────────────────────┘
                            ▲
              ┌────────────┴────────────┐
              │      Admin console        │
              │      /admin/*             │
              └───────────────────────────┘
```

### 2.2 Money flows

**On-demand booking**

1. Customer agrees a service fee with the chosen worker (shown in booking wizard).
2. Customer pays **service fee + 10% platform fee** (e.g. K400 service → K440 total).
3. Platform records: `amount` (worker service fee), `platform_fee` (10%), `worker_earnings` (amount − platform fee).
4. Customer uploads Airtel Money proof; admin confirms payment.

**Permanent placement**

- Employers post jobs with salary range.
- On hire, a **placement fee** of 10% of monthly salary applies (min K200, max K1,000) — see `lib/utils.ts` → `calculatePlacementFee`.

### 2.3 Tech stack summary

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 14 (App Router), React 18, TypeScript |
| Styling | Tailwind CSS, shadcn/ui, Lucide icons |
| Backend | Next.js Route Handlers (`app/api/`) |
| Database | Supabase PostgreSQL |
| Auth | Supabase Auth (email/password + phone OTP) |
| File storage | Supabase Storage (`worker-documents`, payment proofs) |
| SMS | Africa's Talking (primary), Twilio (backup) |
| Hosting | Vercel |
| Unit tests | Vitest |
| E2E tests | Playwright |

---

## 3. User roles and journeys

### 3.1 Roles

| Role | Code | Default home | Purpose |
|------|------|--------------|---------|
| Customer | `customer` | `/customer/dashboard` | Book and manage home-help visits |
| Worker | `worker` | `/worker/dashboard` | Accept jobs, manage profile, earn |
| Employer | `employer` | `/employer/dashboard` | Post permanent jobs, hire workers |
| Admin | `admin` | `/admin` | Verify workers, confirm payments, resolve disputes |

User account statuses: `pending`, `active`, `suspended`, `rejected`.

### 3.2 Registration and onboarding

**Register** (`/register`)

1. User chooses role: Customer, Worker, or Employer.
2. Provides: full name, email, phone (+260), password (≥ 8 characters).
3. API: `POST /api/auth/register` → creates `users` row and role-specific stub profile.
4. Redirect to onboarding.

**Onboarding paths**

| Role | URL | What they complete |
|------|-----|-------------------|
| Customer | `/onboarding/customer` | City and area in Lusaka |
| Worker | `/onboarding/worker` | Identity, location, skills, bio, photo (3-step form) |
| Employer | `/onboarding/employer` | Company name and location |

Workers start with `verification_status: not_submitted` and `availability_status: not_available` until verified.

### 3.3 Authentication

**Production paths**

- Email + password login (`POST /api/auth/login`)
- Phone OTP via Supabase SMS (`POST /api/auth/otp/request`, `POST /api/auth/otp/verify`)

**Development bypass** (`DEV_AUTH_BYPASS=true`)

- Cookie-based session: `tumahelper-dev-session`
- Quick login page: `/dev-login`
- Dev password: `dev123`

| Role | Dev email | Dev phone |
|------|-----------|-----------|
| Admin | `admin@tumahelper.dev` | +260970000001 |
| Worker | `worker@tumahelper.dev` | +260961111111 |
| Customer | `client@tumahelper.dev` | +260976666666 |
| Employer | `employer@tumahelper.dev` | — |

**Session resolution:** `middleware.ts` + `lib/auth/session.ts`  
**Current user API:** `GET /api/auth/me`

### 3.4 Route protection (`middleware.ts`)

| Prefix | Access |
|--------|--------|
| `/customer/*` | Logged-in customers (except `/customer/book` — public) |
| `/worker/*` | Logged-in workers |
| `/employer/*` | Logged-in employers |
| `/admin/*` | Logged-in admins only |
| `/onboarding/*` | Logged-in user with matching role |

`/customer/book` is intentionally **public** so visitors can explore the booking wizard; login is required when submitting a booking.

### 3.5 Customer journey (on-demand)

```
Land on homepage
  → Pick service category (hero scroller)
  → Booking wizard (/customer/book)
      Step 1: Service details (address, schedule, scope)
      Step 2: Choose verified worker
      Step 3: Confirm fee and submit
  → Booking created (status: pending)
  → Pay via Airtel Money + upload proof
  → Admin confirms payment
  → Worker accepts → in progress → completed
  → Customer leaves review
  → Trust score updated for worker
```

### 3.6 Worker journey

```
Register as worker
  → Complete onboarding
  → Upload NRC + documents (/worker/profile/verify)
  → Submit references
  → Admin approves verification
  → Set availability to "available"
  → Appear in customer worker search
  → Accept bookings → complete visits
  → View earnings (/worker/earnings)
```

**Searchability gate** (`lib/workers/eligibility.ts`): a worker only appears in booking search when:

- `verification_status === 'approved'`
- Has `full_name`, `area`, `category`, non-empty `skills`, non-empty `employment_types`

### 3.7 Employer journey (permanent hire)

```
Register as employer
  → Post job (/employer/jobs/new)
  → Workers apply via /jobs
  → Review candidates (/employer/candidates)
  → Hire applicant
  → Placement fee recorded
```

Alternative path for families: book a worker several times via on-demand bookings, then contact TumaHelper via `/hire` (WhatsApp) for permanent placement help.

---

## 4. Public website and landing page

Homepage route: `app/page.tsx`

Sections appear in this order:

| # | Section | Component | Purpose |
|---|---------|-----------|---------|
| 1 | **Hero** | `components/landing/hero.tsx` | Headline, 7-category service scroller, trust points, worker apply link |
| 2 | **How it works** | `components/landing/platform-offerings.tsx` | 3-step flow, trust bar, permanent hire teaser, link to pricing |
| 3 | **Typical prices** | `components/landing/services-detail.tsx` + `pricing-featured-visits.tsx` | Tabbed featured visit cards per category (`#pricing`) |
| 4 | **Worker spotlight** | `components/landing/sweep-stars.tsx` | Up to 3 featured/available workers from database |
| 5 | **Trust** | `components/landing/trust-section.tsx` | Safety signals, browse workers CTA |
| 6 | **Worker recruitment** | `components/landing/worker-recruitment.tsx` | Apply as a worker CTA |
| 7 | **FAQ + closing CTA** | `components/landing/landing-faq-cta.tsx` | FAQ accordion, book/browse links, WhatsApp |

### 4.1 Header and footer

**Header** (`components/layout/header.tsx`)

- Desktop: Logo · Find workers · Permanent hire · Theme · Account · **Book a service**
- Mobile: Menu only (Book button removed from header bar; **Book a service** remains inside mobile menu)

**Footer** (`components/layout/footer.tsx`)

- Customer links (book, find workers, service deep links)
- Worker links (apply, dashboard, jobs)
- Contact: `hello@tumahelper.com`, Lusaka
- Legal: `/privacy`, `/terms`

### 4.2 Service categories on homepage

Defined in `lib/landing/content.ts` → `HERO_CATEGORIES`:

| ID | Label | Booking entry |
|----|-------|---------------|
| `nanny` | Nannies | `/#hero-nanny-panel` |
| `cleaning` | Cleaning | `/#hero-cleaning-panel` |
| `housekeeping` | Housekeeping | `/#hero-housekeeping-panel` |
| `cooking` | Cooking & Meals | `/#hero-cooking-panel` |
| `laundry` | Laundry & Ironing | `/#hero-laundry-panel` |
| `garden` | Garden & Yard | `/#hero-garden-panel` |
| `short_stay` | Short-Stay Cleaning | `/#hero-short-stay-panel` |

Each category expands to **visit type pills** that deep-link into `/customer/book` with `category` and `type` query parameters.

### 4.3 Other public pages

| Page | URL | Notes |
|------|-----|-------|
| Browse workers | `/workers` | Filterable directory |
| Worker profile | `/workers/[id]` | Public profile, reviews |
| Permanent hire info | `/hire` | WhatsApp + book-first CTA |
| Job board | `/jobs`, `/jobs/[id]` | Open permanent positions |
| Service guides | `/services/[category]` | Full inclusions per visit type |
| Privacy | `/privacy` | Privacy Policy |
| Terms | `/terms` | Terms of Service |

**Legacy redirects:** `/nannies`, `/house-cleaners`, `/book` → booking flow with category preset.

---

## 5. Booking system

### 5.1 Booking wizard

**Component:** `components/booking/booking-wizard.tsx`  
**Public URL:** `/customer/book`  
**Short-stay entry:** `/customer/book/airbnb`

**Steps**

| Step | Name | What happens |
|------|------|--------------|
| 0 | Pick | "What do you need?" — flat service type list (skipped on deep link) |
| 1 | Details | Address → plan → scope (category-specific sub-flows) |
| 2 | Worker | Search and select verified worker |
| 3 | Payment | Confirm fee, see platform fee, submit booking |

**Details sub-flow** (`lib/booking/shared-flow.ts`): `address` → `plan` → `scope`

**Category-specific flow components**

| Category | Component |
|----------|-----------|
| Nanny | `NannyBookingFlow` |
| Cleaning | `CleaningBookingFlow` |
| Housekeeping | `HousekeepingBookingFlow` |
| Cooking | `CookingBookingFlow` |
| Laundry, Garden | `TaskServiceBookingFlow` |
| Short-stay | `AirbnbBookingFlow` |

### 5.2 Deep linking

Example URL:

```
/customer/book?category=nanny&type=babysitter&worker={uuid}&hours=4&children=2
```

Supported forward params: `worker`, `category`, `type`, `hours`, `bedrooms`, `bathrooms`, `children`, `ages`, `addons`

If `category` is set without `type`, user is redirected to the matching homepage hero panel (e.g. `/#hero-cooking-panel`).

### 5.3 Booking creation API

**Endpoint:** `POST /api/bookings`  
**Actor:** Customer only

**Validations**

- Worker exists and `availability_status: available`
- Worker `verification_level` meets category minimum (default: bronze)
- Amount between K0.50 and K10,000 (50–1,000,000 ngwee)

**Stored fields**

- `booking_code`: format `TH-XXXXX`
- `service_details`: JSONB scope (see migration `007_booking_service_details.sql`)
- `amount`, `platform_fee`, `worker_earnings` in ngwee
- Initial `status: pending`, `payment_status: pending`
- Worker notified via `notifications` table

### 5.4 Booking lifecycle

State machine: `lib/bookings/status-transitions.ts`

```
pending     → accepted | declined | cancelled
accepted    → in_progress | cancelled
in_progress → completed | cancelled
completed   → (terminal)
```

| Actor | Allowed actions |
|-------|-----------------|
| Worker | Accept, decline, start (in_progress), complete |
| Customer | Cancel (pending or accepted) |
| Admin | Any valid transition |

On `completed`: worker trust score is recalculated (`lib/trust-score.ts`).

### 5.5 Worker search API

**Endpoint:** `GET /api/workers`

**Query filters:** `category`, `city`, `area`, `verification`, `minTrust`, `available`, `skills`

**Rules**

- Only `verification_status: approved` workers
- Post-filtered by `isWorkerSearchable()` eligibility gate
- Ordered by `trust_score` DESC, then `is_featured` DESC

---

## 6. Service catalog and pricing

### 6.1 Source of truth

**File:** `lib/services/catalog.ts` → `SERVICE_CATALOG`

Seven frontend categories with visit types, inclusions, exclusions, default hours, and price hints (ZMW).

### 6.2 Categories and example visit types

| Category key | Homepage label | Example visit types |
|--------------|----------------|---------------------|
| `nanny` | Nannies | Day nanny, Babysitter, Infant care, After-school, Weekend nanny |
| `cleaning` | Cleaning | House cleaning, Apartment, Deep clean, Spring clean, Move-in/out, Garage |
| `housekeeping` | Housekeeping | Half-day, Full-day, Weekly, Monthly |
| `cooking` | Cooking & Meals | Lunch, Dinner, Meal prep, Weekly cooking |
| `laundry` | Laundry & Ironing | Wash & fold, Ironing, Bedding, Curtains, Pickup/dropoff |
| `garden` | Garden & Yard | Lawn cutting, Yard sweeping, Hedge trimming, Garden cleanup, Watering |
| Short-stay (`cleaning` catalog subset) | Short-Stay Cleaning | Guest checkout, Same-day turnaround, Deep Airbnb, Linen setup |

Each visit type includes:

- `included[]` — what the visit covers
- `notIncluded[]` — what is out of scope unless add-on
- `defaultHours` — typical duration
- `priceHintMin` / `priceHintMax` — typical ZMW range
- `addons[]` — optional extras with price hints

### 6.3 Price suggestion

**Function:** `suggestPrice()` in `lib/services/utils.ts`

Adjusts base price hints for bedrooms, bathrooms, children, duties, duration, and selected add-ons. Used in the booking wizard; unit-tested in `lib/services/utils.test.ts` (or similar).

### 6.4 Homepage pricing section

**Component:** `components/landing/pricing-featured-visits.tsx`  
**Data:** `lib/landing/pricing-featured.ts`

For each category tab, shows one **featured visit card** with:

- Visit name, hours, price range
- Short description
- Top 5 inclusion bullets
- **Book** CTA (deep link to booking)
- **All visit types →** link to `/services/[category]` or `/customer/book/airbnb`

### 6.5 Database category mapping

Frontend catalog categories map to `service_categories` table slugs:

| Frontend | DB slug |
|----------|---------|
| Nanny services | `nanny-services` |
| House cleaning (and related) | `house-cleaning` |

Worker `worker_profiles.category` is coarser: `nanny` or `house_cleaner` (skills JSON carries finer detail).

---

## 7. Payments

### 7.1 Model

TumaHelper does **not** integrate a live payment gateway. Flow is:

1. Customer transfers money via **Airtel Money** (or agrees cash with worker).
2. Customer uploads payment proof screenshot.
3. Admin reviews and confirms.

### 7.2 Amounts and fees

- All monetary values stored in **ngwee** (integer).
- Display uses `formatCurrency()` in `lib/utils.ts` (÷ 100 for ZMW).
- **Platform fee:** 10% of service amount.
- **Customer pays at booking:** service fee + 10%.
- **Worker receives:** service amount − platform fee (recorded as `worker_earnings`).

### 7.3 Customer payment flow

1. **Wizard step 3:** customer enters service fee; UI shows service fee, platform fee, total.
2. **After booking:** `components/booking/payment-instructions.tsx` shows Airtel number from `lib/payments/config.ts`.
3. **Proof upload:** `POST /api/bookings/[id]/payment-proof`
   - Stores screenshot in Supabase Storage under `payments/{bookingId}/`
   - Sets `payment_status: paid`
   - Creates `payments` row with `status: pending`
   - Notifies worker and admins

### 7.4 Admin payment confirmation

| Action | Endpoint | Result |
|--------|----------|--------|
| Confirm | `PATCH /api/admin/payments/[id]/confirm` | `payment_status: confirmed`, notifications sent |
| Reject | `PATCH /api/admin/payments/[id]/reject` | Customer can re-upload |

### 7.5 Payment environment variables

| Variable | Purpose |
|----------|---------|
| `NEXT_PUBLIC_AIRTEL_MONEY_NUMBER` | Customer-facing Airtel number |
| `NEXT_PUBLIC_PAYMENT_ACCOUNT_NAME` | Optional registered name on account |

Demo mode: number `0970000000` sets `isDemo: true` in payment config.

---

## 8. Worker verification and trust

### 8.1 Verification levels

| Level | Meaning |
|-------|---------|
| `none` | Not verified |
| `bronze` | Phone verified |
| `silver` | NRC / ID verified |
| `gold` | References checked |
| `platinum` | Police clearance approved |

`verification_status` lifecycle: `not_submitted` → `pending` → `approved` | `rejected`

### 8.2 Document types

Stored in `verification_documents`:

`nrc_front`, `nrc_back`, `police_clearance`, `certificate`, `reference_letter`, `address_proof`

- Upload: `POST /api/workers/me/documents` (max 5 MB, JPEG/PNG/PDF)
- Storage bucket: `worker-documents` (private)
- Admin review: `/admin/documents`

### 8.3 NRC security

**File:** `lib/encryption.ts`

- NRC encrypted at rest with AES-256-CBC (`NRC_ENCRYPTION_KEY`, 32 characters)
- SHA-256 hash stored for deduplication lookup

### 8.4 References

**Table:** `worker_references`

Worker submits referee name, phone, relationship, work period. Admin verifies by phone. Statuses: `pending` → `contacted` → `verified` | `unreachable` | `declined`.

### 8.5 Trust score

**Algorithm:** `lib/trust-score.ts` (max 100 points)

| Component | Max points |
|-----------|------------|
| Identity verification | 15 |
| Job completion rate | 20 |
| Customer rating (time-weighted) | 20 |
| Punctuality | 10 |
| Reliability | 15 |
| Complaint history (with decay) | 15 |
| Profile completeness | 5 |

**Labels:** Provisional (new workers), Exceptional, Trusted, Good, Fair, Needs Improvement

**Recalculated when:** booking completed, admin approves verification

### 8.6 Reviews

After completed bookings, customers rate workers. Reviews feed into trust score and appear on `/workers/[id]`.

---

## 9. Permanent hire and job board

### 9.1 `/hire` page

Marketing page for families seeking full-time or live-in help. Primary CTA: WhatsApp (`NEXT_PUBLIC_WHATSAPP_NUMBER`). Secondary: book a visit first.

### 9.2 Job posts

**Tables:** `job_posts`, `job_applications`

| Feature | Path |
|---------|------|
| Post job | `/employer/jobs/new` |
| Manage jobs | `/employer/jobs` |
| Browse jobs (workers) | `/jobs` |
| Job detail | `/jobs/[id]` |
| Review candidates | `/employer/candidates` |

**API**

- `POST /api/jobs` — create job
- `GET /api/jobs` — list open jobs
- `POST /api/jobs/[id]/apply` — worker applies
- `PATCH /api/jobs/[id]/hire` — employer hires applicant

**Placement fee:** 10% of monthly salary, min K200, max K1,000 (`calculatePlacementFee` in `lib/utils.ts`).

---

## 10. Admin operations

**Base URL:** `/admin`  
**Layout:** `components/layout/admin-sidebar.tsx` (no public header/footer)

| Section | Path | Function |
|---------|------|----------|
| Dashboard | `/admin` | Stats: workers, pending docs, bookings, payments, disputes |
| Workers | `/admin/workers`, `/admin/workers/[id]` | Approve/reject verification level |
| Documents | `/admin/documents` | Review NRC, police clearance, etc. |
| Bookings | `/admin/bookings` | All bookings queue |
| Payments | `/admin/payments` | Confirm/reject payment proofs |
| Disputes | `/admin/disputes` | Resolve disputes |
| Audit logs | `/admin/audit` | Admin action history |
| Analytics | `/admin/analytics` | Platform metrics |

**Typical admin workflows**

1. **Verify worker:** review documents → approve references → set verification level → worker becomes searchable.
2. **Confirm payment:** review Airtel screenshot → confirm → worker notified to proceed.
3. **Resolve dispute:** investigate → action: refund, partial_refund, worker_suspension, account_ban, no_action.

All significant admin actions write to `audit_logs`.

---

## 11. Technical architecture

### 11.1 Repository layout

```
/workspace
├── app/                      # Next.js App Router (pages + API)
│   ├── (auth)/               # login, register, onboarding
│   ├── admin/                # admin console
│   ├── customer/             # customer dashboard + book
│   ├── worker/               # worker dashboard
│   ├── employer/             # employer dashboard
│   ├── api/                  # REST-style route handlers
│   ├── privacy/, terms/      # legal pages
│   └── page.tsx              # homepage
├── components/
│   ├── ui/                   # shadcn primitives
│   ├── landing/              # homepage sections
│   ├── booking/              # booking wizard
│   ├── layout/               # header, footer, admin sidebar
│   ├── worker/                 # worker widgets
│   ├── verification/         # badges
│   └── legal/                # legal page layout
├── lib/
│   ├── auth/                 # session, login, register, config
│   ├── services/             # catalog, pricing utils
│   ├── bookings/             # status machine, labels, book-again
│   ├── workers/              # eligibility, earnings, public listing
│   ├── payments/             # Airtel config
│   ├── landing/              # homepage content
│   └── legal/                # privacy + terms content
├── types/index.ts            # shared TypeScript types
├── hooks/                    # client hooks
├── supabase/migrations/      # SQL schema
├── e2e/                      # Playwright tests
├── docs/                     # this manual + test docs
└── middleware.ts             # auth + route guards
```

### 11.2 Key libraries

| Module | Responsibility |
|--------|----------------|
| `lib/services/catalog.ts` | Service definitions, types, add-ons |
| `lib/services/utils.ts` | Price suggestion, URL building, scope |
| `lib/bookings/status-transitions.ts` | Booking state machine |
| `lib/workers/eligibility.ts` | Worker searchability gate |
| `lib/trust-score.ts` | Trust score calculation |
| `lib/encryption.ts` | NRC encryption |
| `lib/validations.ts` | Zod schemas |
| `lib/landing/content.ts` | Homepage copy and constants |

### 11.3 Middleware

`middleware.ts` runs on matched routes, resolves session (dev cookie or Supabase), enforces role-based access, and sets `x-pathname` header for layout decisions (e.g. hiding header on admin).

### 11.4 Notifications

In-app notifications via `notifications` table.  
**API:** `GET /api/notifications`, `PATCH /api/notifications` (mark read)  
**UI:** `components/layout/notification-bell.tsx`

---

## 12. Database reference

Migrations live in `supabase/migrations/` — run in numeric order in the Supabase SQL Editor.

| File | Contents |
|------|----------|
| `001_schema.sql` | Core tables, indexes, triggers |
| `002_rls_policies.sql` | Row Level Security policies |
| `003_seed_data.sql` | Service categories, sample users/workers |
| `004_functions.sql` | `increment_job_applications()` |
| `005_add_user_profile_fields.sql` | `users.city`, `area`, `company_name` |
| `006_seed_more_data.sql` | Additional seed data |
| `007_booking_service_details.sql` | `bookings.service_details JSONB` |
| `008_add_linda_phiri_worker.sql` | Additional worker seed |

### 12.1 Core tables

| Table | Purpose |
|-------|---------|
| `users` | Accounts: phone, email, role, status |
| `worker_profiles` | Worker bio, skills, trust, verification, availability |
| `service_categories` | DB service categories |
| `bookings` | On-demand jobs |
| `verification_documents` | NRC and clearance uploads |
| `worker_references` | Employer references |
| `reviews` | Multi-dimension ratings |
| `job_posts` | Permanent job listings |
| `job_applications` | Applications to jobs |
| `payments` | Payment records |
| `disputes` | Dispute cases |
| `audit_logs` | Admin audit trail |
| `notifications` | In-app notifications |

### 12.2 Row Level Security highlights

- `worker_profiles`: public read; worker edits own; admin manages all
- `bookings`: visible to customer, assigned worker, or admin
- `job_posts`: public read when `status = open`; employer manages own
- `audit_logs`: admin only
- `notifications`: user owns own rows

---

## 13. API reference

All routes under `app/api/`. Typical response shape: `{ success, data, error? }`.

### 13.1 Auth

| Method | Route | Description |
|--------|-------|-------------|
| POST | `/api/auth/register` | Create account |
| POST | `/api/auth/login` | Email/password sign-in |
| POST | `/api/auth/logout` | Sign out |
| GET | `/api/auth/me` | Current user |
| POST | `/api/auth/otp/request` | Send phone OTP |
| POST | `/api/auth/otp/verify` | Verify OTP |
| GET/POST | `/api/auth/dev-login` | Dev bypass login |

### 13.2 Workers

| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/workers` | Search workers (public) |
| GET | `/api/workers/[id]` | Public profile |
| GET | `/api/workers/[id]/reviews` | Reviews |
| GET/POST | `/api/workers/me/profile` | Own profile |
| POST/GET | `/api/workers/me/documents` | Documents |
| POST/GET | `/api/workers/me/references` | References |
| PATCH | `/api/workers/me/availability` | Availability status |
| GET | `/api/workers/me/earnings` | Earnings summary |

### 13.3 Bookings

| Method | Route | Description |
|--------|-------|-------------|
| POST | `/api/bookings` | Create booking |
| GET | `/api/bookings` | List (role-filtered) |
| GET | `/api/bookings/[id]` | Detail |
| PATCH | `/api/bookings/[id]/status` | Status transition |
| POST | `/api/bookings/[id]/cancel` | Cancel |
| POST | `/api/bookings/[id]/review` | Submit review |
| POST | `/api/bookings/[id]/payment-proof` | Upload proof |

### 13.4 Jobs

| Method | Route | Description |
|--------|-------|-------------|
| POST | `/api/jobs` | Create job post |
| GET | `/api/jobs` | List open jobs |
| GET | `/api/jobs/[id]` | Job detail |
| POST | `/api/jobs/[id]/apply` | Apply |
| PATCH | `/api/jobs/[id]/hire` | Hire applicant |

### 13.5 Admin (admin role required)

| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/admin/dashboard` | Dashboard data |
| GET | `/api/admin/stats` | Platform stats |
| GET | `/api/admin/workers` | Worker queue |
| PATCH | `/api/admin/workers/[id]/approve` | Approve worker |
| PATCH | `/api/admin/workers/[id]/reject` | Reject worker |
| GET | `/api/admin/documents` | Document queue |
| PATCH | `/api/admin/documents/[id]/approve` | Approve document |
| PATCH | `/api/admin/documents/[id]/reject` | Reject document |
| GET | `/api/admin/bookings` | All bookings |
| GET | `/api/admin/payments` | Payment queue |
| PATCH | `/api/admin/payments/[id]/confirm` | Confirm payment |
| PATCH | `/api/admin/payments/[id]/reject` | Reject payment |
| GET | `/api/admin/disputes` | Disputes |
| PATCH | `/api/admin/disputes/[id]/resolve` | Resolve dispute |
| GET | `/api/admin/audit-logs` | Audit trail |

### 13.6 Other

| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/notifications` | User notifications |
| PATCH | `/api/notifications` | Mark read |
| GET | `/api/addresses/suggest` | Lusaka address autocomplete |
| PUT | `/api/users/profile` | Update user profile |

---

## 14. Environment and configuration

See `.env.local.example` for the full template.

### 14.1 Required (production)

| Variable | Purpose |
|----------|---------|
| `NEXT_PUBLIC_APP_URL` | Canonical URL (`https://tumahelper.com`) |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | Server-side admin operations (**secret**) |
| `NRC_ENCRYPTION_KEY` | 32-character NRC encryption key |
| `SUPABASE_STORAGE_BUCKET` | Storage bucket name (`worker-documents`) |

### 14.2 SMS (phone OTP)

| Variable | Purpose |
|----------|---------|
| `AFRICAS_TALKING_API_KEY` | Primary SMS provider |
| `AFRICAS_TALKING_USERNAME` | AT username |
| `AFRICAS_TALKING_SENDER_ID` | Sender ID (`TumaHelper`) |
| `TWILIO_*` | Backup SMS (optional) |

### 14.3 Payments and marketing

| Variable | Purpose |
|----------|---------|
| `NEXT_PUBLIC_AIRTEL_MONEY_NUMBER` | Payment number shown to customers |
| `NEXT_PUBLIC_PAYMENT_ACCOUNT_NAME` | Account display name |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | WhatsApp CTAs on `/hire` and FAQ |

### 14.4 Development

| Variable | Purpose |
|----------|---------|
| `DEV_AUTH_BYPASS=true` | Cookie-based dev auth (no Supabase) |
| `ALLOW_DEV_LOGIN=true` | Dev login on preview deployments |
| `PLAYWRIGHT_BASE_URL` | E2E target (default `http://localhost:3002`) |

---

## 15. Local development

### 15.1 Setup

```bash
git clone https://github.com/walu22/tumahelper.git
cd tumahelper
npm install
cp .env.local.example .env.local
# Edit .env.local — set DEV_AUTH_BYPASS=true for quickest start
npm run dev
```

App runs at `http://localhost:3000`.

### 15.2 Supabase setup

1. Create a Supabase project.
2. Run all files in `supabase/migrations/` in order via SQL Editor.
3. Enable Phone Auth provider.
4. Configure Africa's Talking in Supabase SMS settings.
5. Create private storage bucket: `worker-documents`.

### 15.3 Helper scripts

| Command | Script | Purpose |
|---------|--------|---------|
| `npm run setup` | `scripts/setup-local.mjs` | Env check + optional seed |
| `npm run setup:auth` | `scripts/seed-auth-users.mjs` | Seed auth users |
| `npm run setup:credentials` | `scripts/create-credentials.mjs` | Sync dev account credentials |

### 15.4 Dev login

With `DEV_AUTH_BYPASS=true`:

- Visit `/dev-login` for one-click role login
- Or use emails/password `dev123` from section 3.3

---

## 16. Testing

### 16.1 Commands

| Command | What it runs |
|---------|--------------|
| `npm run test:unit` | Vitest unit tests (`lib/**/*.test.ts`) |
| `npm run test:e2e` | Full Playwright suite |
| `npm run test:e2e:smoke` | Smoke tests only (`@smoke` tag) |
| `npm run test:ci` | lint + unit + build + smoke (CI pipeline) |

### 16.2 Test pyramid

| Layer | Tool | Covers |
|-------|------|--------|
| Unit | Vitest | Catalog, pricing, status transitions, eligibility, address search |
| E2E smoke | Playwright | Auth guards, hero categories, booking entry |
| E2E full | Playwright | Golden-path bookings per service, lifecycle, payment proof |
| Manual | `docs/TEST_CASES.md` | Staging with real Supabase and Airtel |

### 16.3 E2E specs (`e2e/`)

| File | Tag | Focus |
|------|-----|-------|
| `auth-access.spec.ts` | @smoke | Role guards |
| `book-entry.spec.ts` | @smoke | Hero → booking deep links |
| `hero-regression.spec.ts` | @smoke | 7 launch categories |
| `service-model-regression.spec.ts` | @smoke | Cleaning vs housekeeping UI |
| `nanny-booking.spec.ts` | P1 | Nanny golden path |
| `cleaning-booking.spec.ts` | P1 | Cleaning golden path |
| `housekeeping-booking.spec.ts` | P1 | Housekeeping golden path |
| `airbnb-booking.spec.ts` | P1 | Short-stay golden path |
| `booking-lifecycle.spec.ts` | P1 | Worker accept/complete |
| `payment-proof.spec.ts` | P1 | Payment proof upload |
| `mobile-layout.spec.ts` | P2 | 375px viewport |

E2E runs dev server on port **3002** with stub Supabase and `DEV_AUTH_BYPASS=true`.

### 16.4 CI

GitHub Actions workflow: `.github/workflows/ci.yml`  
Runs on push/PR to `master` and `main`.

---

## 17. Deployment

### 17.1 Platform

**Vercel** — team `walkers-projects-da1ff726`  
Production branch: `master`

### 17.2 Pre-deploy checklist

1. Add all required environment variables (Production, Preview, Development).
2. Run Supabase migrations.
3. Enable Phone Auth and SMS provider.
4. Create `worker-documents` storage bucket.
5. Set `NEXT_PUBLIC_APP_URL` to production domain.

### 17.3 Domain

- `tumahelper.com` and `www.tumahelper.com`
- After DNS: set `NEXT_PUBLIC_APP_URL=https://tumahelper.com` and redeploy.

### 17.4 Security headers (`vercel.json`)

- `X-Frame-Options: DENY`
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Strict-Transport-Security` with preload

### 17.5 Post-deploy smoke checks

- Homepage loads with hero and 7 service categories
- Pricing section (`#pricing`) shows featured visit cards
- `/customer/book` opens booking wizard
- `/workers` lists worker profiles
- `/privacy` and `/terms` render legal pages
- Admin login reaches `/admin` (admin account only)

---

## 18. Appendix

### 18.1 Glossary

| Term | Meaning |
|------|---------|
| **Ngwee** | 1/100 of a Zambian Kwacha; how amounts are stored in the database |
| **Visit type** | A specific bookable service variant (e.g. "Deep cleaning", "Day nanny") |
| **Trust score** | 0–100 score based on verification, reviews, reliability, disputes |
| **Platform fee** | 10% commission on on-demand bookings |
| **Placement fee** | Fee for permanent hire introductions (10% of salary, capped) |
| **Searchability** | Whether a worker appears in customer booking search |

### 18.2 Key file index

| Concern | Primary files |
|---------|---------------|
| Homepage | `app/page.tsx`, `components/landing/*`, `lib/landing/content.ts` |
| Booking wizard | `components/booking/booking-wizard.tsx` |
| Service catalog | `lib/services/catalog.ts` |
| Pricing featured cards | `components/landing/pricing-featured-visits.tsx` |
| Auth | `lib/auth/session.ts`, `middleware.ts` |
| Trust algorithm | `lib/trust-score.ts` |
| Worker eligibility | `lib/workers/eligibility.ts` |
| Legal pages | `lib/legal/*`, `app/privacy/page.tsx`, `app/terms/page.tsx` |
| Types | `types/index.ts` |
| Test catalog | `docs/TEST_CASES.md` |

### 18.3 Contact and support

- **Email:** hello@tumahelper.com
- **Location:** Lusaka, Zambia
- **WhatsApp:** configured via `NEXT_PUBLIC_WHATSAPP_NUMBER`

### 18.4 Document maintenance

Update this manual when:

- New service categories or visit types are added to `SERVICE_CATALOG`
- Booking flow steps change in `booking-wizard.tsx`
- New API routes are added under `app/api/`
- New migrations are added under `supabase/migrations/`
- Landing page sections are restructured

---

*End of TumaHelper System Manual*
