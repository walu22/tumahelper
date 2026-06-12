# TumaHelper Test Cases

Master test catalog for TumaHelper (Lusaka nanny + cleaning marketplace).

**Legend**

| Field | Meaning |
|-------|---------|
| **P0** | Release blocker — must pass every deploy |
| **P1** | High — core user journey |
| **P2** | Medium — important edge case or secondary flow |
| **P3** | Low — polish, nice-to-have |
| **Auto** | Covered by automated test (see `e2e/`) |

**Dev test accounts** (`/dev-login` or cookie bypass): `dev123` password when using login form.

| Role | Email |
|------|-------|
| Customer | `client@tumahelper.dev` |
| Worker | `worker@tumahelper.dev` |
| Admin | `admin@tumahelper.dev` |
| Employer | `employer@tumahelper.dev` |

Run automated tests: `npm run test:e2e` · Unit tests: `npm run test:unit`

---

## 1. Authentication & access control

| ID | Priority | Title | Preconditions | Steps | Expected result | Auto |
|----|----------|-------|---------------|-------|-----------------|------|
| AUTH-001 | P0 | Unauthenticated user blocked from customer area | Logged out | Visit `/customer/dashboard` | Redirect to `/login?redirect=/customer/dashboard` | auth-access.spec |
| AUTH-002 | P0 | Unauthenticated user blocked from worker area | Logged out | Visit `/worker/dashboard` | Redirect to login with redirect param | auth-access.spec |
| AUTH-003 | P0 | Non-admin blocked from admin | Logged in as customer | Visit `/admin` | Redirect away from admin (dashboard or home) | auth-access.spec |
| AUTH-004 | P1 | Login redirect preserves booking URL | Logged out | Visit `/customer/book?category=nanny&type=babysitting` | Redirect to login; after login, land on booking wizard | Manual |
| AUTH-005 | P1 | Customer dev login reaches dashboard | Dev bypass enabled | Use `/dev-login` as customer | Lands on `/customer/dashboard` | Manual |
| AUTH-006 | P1 | Worker dev login reaches worker dashboard | Dev bypass enabled | Use `/dev-login` as worker | Lands on `/worker/dashboard` | auth-access.spec |
| AUTH-007 | P1 | Register new customer | Logged out | `/register` → select Customer → fill form → submit | Account created; onboarding or dashboard | Manual |
| AUTH-008 | P1 | Register new worker | Logged out | `/register` → select Worker → fill form → submit | Worker stub profile; onboarding wizard | Manual |
| AUTH-009 | P2 | Duplicate email rejected | Email already exists | Register with same email | Clear error; no duplicate account | Manual |
| AUTH-010 | P2 | Wrong password shows error | Valid email | Login with bad password | Error message; stay on login | Manual |
| AUTH-011 | P2 | Logout clears session | Logged in | Click Sign Out | Session cleared; protected routes redirect | Manual |
| AUTH-012 | P3 | OTP request API accepts valid phone | API client | `POST /api/auth/otp/request` with +260… | 200 or provider-specific success | Manual |

---

## 2. Landing page & navigation

| ID | Priority | Title | Preconditions | Steps | Expected result | Auto |
|----|----------|-------|---------------|-------|-----------------|------|
| LND-001 | P0 | Hero has no duplicate Book a nanny / Book cleaning pills | Logged in as customer | Open `/` | Hero shows category scroller icons only; no pill buttons below scroller | book-entry.spec |
| LND-002 | P0 | Hero Nannies icon opens babysitting booking | Customer logged in | Click Nannies icon in hero scroller | URL has `category=nanny&type=babysitting`; Details step visible | book-entry.spec |
| LND-003 | P0 | Hero Cleaning icon opens standard clean booking | Customer logged in | Click Cleaning icon in hero scroller | URL has `category=cleaning&type=standard`; Details step visible | book-entry.spec |
| LND-004 | P1 | FAQ Book cleaning opens cleaning details | Customer logged in | Scroll to FAQ panel → Book cleaning | Cleaning booking details form | book-entry.spec |
| LND-005 | P1 | Header Nannies link deep-links | Customer logged in | Click Nannies in nav | Booking wizard for nanny category | Manual |
| LND-006 | P1 | `/nannies` redirects to nanny book | Any | Visit `/nannies` | Redirect to `/customer/book?category=nanny` | Manual |
| LND-007 | P1 | `/house-cleaners` redirects to cleaning book | Any | Visit `/house-cleaners` | Redirect to `/customer/book?category=cleaning` | Manual |
| LND-008 | P2 | Legacy `/book` forwards query params | Any | Visit `/book?category=nanny&type=babysitting` | Redirect to `/customer/book?...` with same params | Manual |
| LND-009 | P2 | Browse workers page loads | Any | Visit `/workers` | Worker list or empty state; no crash | Manual |
| LND-010 | P2 | Services in detail cards link to book | Customer logged in | Click a service type in Services section | Opens booking details for that type | Manual |
| LND-011 | P3 | WhatsApp CTA opens wa.me link | Any | Click Chat on WhatsApp in FAQ | External WhatsApp link with prefilled message | Manual |
| LND-012 | P3 | Worker recruitment CTA | Any | Click Apply in worker recruitment section | Goes to `/register?role=worker` | Manual |

---

## 3. Booking — entry & service picker

| ID | Priority | Title | Preconditions | Steps | Expected result | Auto |
|----|----------|-------|---------------|-------|-----------------|------|
| BK-001 | P0 | Plain `/customer/book` shows flat service types | Customer logged in | Visit `/customer/book` | "What do you need?" with Babysitting, Standard home clean, etc.; no old category cards | book-entry.spec |
| BK-002 | P0 | Deep link skips service picker | Customer logged in | Open `/customer/book?category=nanny&type=babysitting` | Lands on Details step, not picker | book-entry.spec |
| BK-003 | P1 | Service picker lists all nanny types | Customer logged in | `/customer/book` → scroll list | Babysitting, After-school, Regular part-time, Newborn visible | Manual |
| BK-004 | P1 | Service picker lists all cleaning types | Customer logged in | `/customer/book` | Standard, Deep, Move-in/out visible | Manual |
| BK-005 | P2 | Worker deep link pre-selects worker | Customer logged in | `/customer/book?worker={id}` | Details step; worker pre-selected when list loads | Manual |
| BK-006 | P2 | Back button disabled on deep-linked booking | Deep link with category param | On Details step, click Back | Back disabled or hidden when category in URL | Manual |

---

## 4. Booking — nanny flow

| ID | Priority | Title | Preconditions | Steps | Expected result | Auto |
|----|----------|-------|---------------|-------|-----------------|------|
| NAN-001 | P0 | Happy path: babysitting booking | Customer logged in | Fill date, time, address, child age → choose worker → confirm fee → submit | Booking created; redirect to booking detail; API payload correct | nanny-booking.spec |
| NAN-002 | P0 | Cannot proceed without date, time, address, age | On nanny Details | Leave fields empty; try Choose worker | Button disabled until all required fields set | nanny-booking.spec |
| NAN-003 | P1 | Single child uses one age dropdown | Babysitting, 1 child | Open Details | One `#child-age` dropdown; label "Child's age range" | nanny-booking.spec |
| NAN-004 | P1 | Multiple children require age per child | Regular part-time, 3 children | Set children to 3 | Three age selectors; all required to continue | Manual |
| NAN-005 | P1 | Suggested fee prefilled on payment step | Complete Details + worker | Reach Confirm & pay | Fee input prefilled from `suggestPrice()` | nanny-booking.spec |
| NAN-006 | P1 | Platform fee 10% shown in totals | Amount entered | View payment totals | Service fee + 10% platform = total | Manual |
| NAN-007 | P2 | Add-ons update scope in summary | Select meal prep, homework | View sidebar summary | Add-ons listed in scope | Manual |
| NAN-008 | P2 | Worker search filters list | Multiple workers | Type area name in search | List filters by name/area | Manual |
| NAN-009 | P2 | Empty worker list message | No available workers | Open worker step | Friendly empty state, no crash | Manual |
| NAN-010 | P2 | Cannot select worker without schedule | Skip schedule fields via URL hack | Click worker card | Toast error; return to Details | Manual |

---

## 5. Booking — cleaning flow

| ID | Priority | Title | Preconditions | Steps | Expected result | Auto |
|----|----------|-------|---------------|-------|-----------------|------|
| CLN-001 | P0 | Happy path: standard home clean | Customer logged in | Deep link or picker → fill date/time/address → worker → pay | Booking created with cleaning serviceDetails | cleaning-booking.spec |
| CLN-002 | P1 | Bedrooms/bathrooms configurable | Standard clean Details | Change bed/bath counts | Summary updates; price suggestion changes | Manual |
| CLN-003 | P1 | Deep clean uses longer default duration | Deep clean type | Open Details | Default hours reflect deep clean (6h) | Manual |
| CLN-004 | P2 | Cleaning add-ons (laundry, oven) | Standard clean | Toggle add-ons | Scope shows add-ons; fee suggestion increases | Manual |
| CLN-005 | P2 | Move-in/out booking | Customer logged in | Select move-in/out from picker | 8h default; appropriate price range | Manual |

---

## 6. Booking — payment & confirmation UI

| ID | Priority | Title | Preconditions | Steps | Expected result | Auto |
|----|----------|-------|---------------|-------|-----------------|------|
| PAY-001 | P1 | Summary shown once on payment step | On Confirm & pay | View desktop layout | Left: Your booking card; right: fee + totals only | Manual |
| PAY-002 | P1 | Child ages deduped in summary | 3 children, repeated ages | View summary scope | Shows `0–2 years ×2` not three identical labels | Manual |
| PAY-003 | P1 | Minimum fee enforced | Payment step | Enter 0 or empty fee | Confirm booking disabled | Manual |
| PAY-004 | P2 | Change worker from payment | On payment step | Click Change worker | Returns to worker list; selection preserved | Manual |
| PAY-005 | P2 | Booking summary sticky on desktop | Wide viewport | Scroll Details/Worker/Payment | Summary stays visible (sticky) | Manual |

---

## 7. Booking detail & customer post-booking

| ID | Priority | Title | Preconditions | Steps | Expected result | Auto |
|----|----------|-------|---------------|-------|-----------------|------|
| BD-001 | P0 | Customer can open own booking detail | Booking exists for customer | Visit `/customer/bookings/{id}` | Page loads; worker name, date, status visible; no 404 | payment-proof.spec |
| BD-002 | P1 | Payment proof upload | Pending booking, unpaid | Upload screenshot on detail page | `payment_status` → paid; success feedback | payment-proof.spec |
| BD-003 | P1 | Customer can cancel pending booking | Status pending | Click cancel, confirm | Status cancelled; worker notified | Manual |
| BD-004 | P2 | Customer cannot cancel completed booking | Status completed | Attempt cancel | Action blocked or hidden | Manual |
| BD-005 | P2 | Review after completion | Status completed | Submit star rating + comment | Review saved; worker rating updated | Manual |
| BD-006 | P2 | Booking list tabs filter by status | Multiple bookings | Click Pending / Completed tabs | List filters correctly | Manual |
| BD-007 | P3 | Booking code displayed | Any booking | Open detail | Human-readable code (TH-XXXX) shown | Manual |

---

## 8. Worker flows

| ID | Priority | Title | Preconditions | Steps | Expected result | Auto |
|----|----------|-------|---------------|-------|-----------------|------|
| WRK-001 | P1 | Worker dashboard loads | Worker logged in | Visit `/worker/dashboard` | Upcoming bookings, profile summary | auth-access.spec |
| WRK-002 | P1 | Worker accepts pending booking | Worker assigned, pending | Open booking → Accept | Status → accepted | booking-lifecycle.spec |
| WRK-003 | P1 | Worker declines booking | Pending booking | Decline with reason | Status → declined; customer notified | booking-lifecycle.spec |
| WRK-004 | P1 | Worker marks in progress | Accepted booking | Start job | Status → in_progress | booking-lifecycle.spec |
| WRK-005 | P1 | Worker marks completed | In progress | Complete job | Status → completed; trust score recalc | booking-lifecycle.spec |
| WRK-006 | P2 | Worker edits profile | Worker logged in | `/worker/profile` → save changes | Profile updated via API | Manual |
| WRK-007 | P2 | Worker uploads NRC document | Worker logged in | Upload valid image/PDF | Document queued for admin review | Manual |
| WRK-008 | P2 | Unapproved worker hidden from book API | Worker not approved | Customer books same category | Worker not in available list | Manual |
| WRK-009 | P3 | Worker earnings page | Completed paid jobs | Visit `/worker/earnings` | Earnings summary shown | Manual |

---

## 9. Employer & permanent jobs

| ID | Priority | Title | Preconditions | Steps | Expected result | Auto |
|----|----------|-------|---------------|-------|-----------------|------|
| EMP-001 | P2 | Employer onboarding | New employer account | Complete company + location | Redirect to employer dashboard | Manual |
| EMP-002 | P2 | Post permanent job | Employer logged in | Create job at `/employer/jobs/new` | Job visible on `/jobs` | Manual |
| EMP-003 | P2 | Worker applies to job | Verified worker | Apply on job detail | Application created; employer sees candidate | Manual |
| EMP-004 | P3 | Employer hires applicant | Pending application | Hire from candidates page | Application status updated | Manual |

---

## 10. Admin operations

| ID | Priority | Title | Preconditions | Steps | Expected result | Auto |
|----|----------|-------|---------------|-------|-----------------|------|
| ADM-001 | P1 | Admin dashboard loads | Admin logged in | Visit `/admin` | Stats cards; navigation to queues | auth-access.spec |
| ADM-002 | P1 | Approve worker verification | Pending worker | Admin workers → approve | Worker approved; can appear in search | Manual |
| ADM-003 | P1 | Confirm customer payment | Payment proof uploaded | Admin payments → confirm | `payment_status` confirmed | Manual |
| ADM-004 | P2 | Reject payment proof | Invalid screenshot | Admin payments → reject | Customer can re-upload | Manual |
| ADM-005 | P2 | Approve worker document | Pending NRC doc | Admin documents → approve | Verification level may increase | Manual |
| ADM-006 | P2 | Resolve dispute | Open dispute | Admin disputes → resolve | Dispute closed; audit log entry | Manual |
| ADM-007 | P3 | Audit log records admin actions | Admin action performed | View `/admin/audit` | Action logged with timestamp | Manual |

---

## 11. API & business rules

| ID | Priority | Title | Preconditions | Steps | Expected result | Auto |
|----|----------|-------|---------------|-------|-----------------|------|
| API-001 | P0 | Create booking requires customer auth | No/wrong token | `POST /api/bookings` | 401 Unauthorized | Manual |
| API-002 | P0 | Platform fee = 10% of service amount | Valid booking body | Create booking | `platform_fee` = 10% of amount | Unit (future) |
| API-003 | P1 | Invalid status transition rejected | Booking pending | Worker PATCH to `completed` | 400/422; status unchanged | Manual |
| API-004 | P1 | Worker below verification level rejected | Bronze worker, gold-required category | POST booking with that worker | 400 with clear message | Manual |
| API-005 | P2 | Booking amount minimum | Below minimum | POST with amount 10 ngwee | Validation error | Manual |
| API-006 | P2 | Duplicate job application blocked | Already applied | POST apply again | 409 or error | Manual |
| API-007 | P3 | Trust score recalculates on completion | Completed booking | Trigger recalc | Score reflects completion + rating | Unit (future) |

---

## 12. Security, edge cases & resilience

| ID | Priority | Title | Preconditions | Steps | Expected result | Auto |
|----|----------|-------|---------------|-------|-----------------|------|
| SEC-001 | P0 | Customer cannot view another customer's booking | Two customers | Customer A opens B's booking ID | 404 or forbidden | Manual |
| SEC-002 | P1 | Worker cannot accept another worker's booking | Wrong worker logged in | PATCH status on unassigned booking | 403 Forbidden | Manual |
| SEC-003 | P2 | XSS in address field sanitized | Customer booking | Enter `<script>alert(1)</script>` in address | Stored safely; rendered escaped | Manual |
| SEC-004 | P2 | Payment proof file size limit | Large file >5MB | Upload | Rejected with error | Manual |
| RES-001 | P1 | Booking wizard works if categories fetch slow | Mock slow Supabase | Deep link with category+type | Details form still loads from catalog | Manual |
| RES-002 | P2 | Graceful error when workers API fails | Mock 500 on workers | Open worker step | Toast error; empty state | Manual |
| RES-003 | P3 | Mobile layout usable | 375px viewport | Complete booking flow | No horizontal scroll; buttons tappable | Manual |

---

## 13. Onboarding

| ID | Priority | Title | Preconditions | Steps | Expected result | Auto |
|----|----------|-------|---------------|-------|-----------------|------|
| ONB-001 | P1 | Customer onboarding saves location | New customer post-register | City + area → continue | Profile updated; dashboard | Manual |
| ONB-002 | P1 | Worker 3-step onboarding | New worker | Complete all steps | Worker profile created | Manual |
| ONB-003 | P2 | Employer onboarding saves company | New employer | Company name + location | Employer dashboard | Manual |
| ONB-004 | P3 | Onboarding requires auth (known gap) | Logged out | Visit `/onboarding/customer` | Should redirect to login (document if not) | Manual |

---

## Test execution checklist (smoke — run before every release)

- [ ] AUTH-001, AUTH-003 — access control
- [ ] LND-002, LND-003 — hero booking entry
- [ ] BK-001, BK-002 — booking wizard entry
- [ ] NAN-001, NAN-002 — nanny happy path + validation
- [ ] CLN-001 — cleaning happy path
- [ ] BD-001 — booking detail loads
- [ ] WRK-002 — worker accept flow (staging)
- [ ] ADM-003 — payment confirm (staging)

---

## Automation roadmap

| Phase | Scope | Status |
|-------|-------|--------|
| 1 | Booking entry + nanny/cleaning flow + auth guards | Done (`e2e/`) |
| 2 | Booking detail, payment upload, worker status changes | Done (`booking-lifecycle`, `payment-proof`) |
| 3 | Admin queues, employer jobs | Planned |
| 4 | Unit tests: trust score, validations, fee math, status machine | Planned |

---

## Reporting defects

Include: **TC-ID**, role, environment (local/staging), browser, steps to reproduce, expected vs actual, screenshot, and `git log -1 --oneline` if self-hosting.
