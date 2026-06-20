# TumaHelper test strategy

Risk-based testing plan for the Lusaka home-help marketplace. Complements the case catalog in [TEST_CASES.md](./TEST_CASES.md).

## Goals

1. **Protect money and trust paths** — booking creation, worker selection, payment proof.
2. **Protect product boundaries** — Cleaning (task-based) vs Housekeeping (time + duties) vs Short-stay vs Nannies.
3. **Keep CI fast** — smoke on every PR; full E2E nightly or pre-release.
4. **Separate mocked CI from real staging** — UI journeys with mocks in CI; Airtel Money and Supabase on staging.

## Testing pyramid

| Layer | Tool | What to test |
|-------|------|----------------|
| **Unit** | Vitest | Catalog types, `suggestPrice` / `suggestDuration`, scope rows, URL parsing, display labels |
| **E2E smoke** | Playwright `@smoke` | Auth, 4-service hero, redirects, service-model guardrails |
| **E2E full** | Playwright (all specs) | Golden-path booking per product, mobile, worker lifecycle |
| **Manual / staging** | Checklist | Real Supabase, Airtel Money proof, exploratory charters |

## Product test matrix

Each launch product needs:

| Product | Golden-path E2E | Guardrails | Unit coverage |
|---------|-----------------|------------|---------------|
| **Nannies** | `nanny-booking.spec.ts` | Child age required, single-child UI | Catalog nanny types |
| **Cleaning** | `cleaning-booking.spec.ts` | Home size on scope; schedule validation | Residential types, add-ons |
| **Housekeeping** | `housekeeping-booking.spec.ts` | Duties on scope; weekly hides frequency | Housekeeping types, duty add-ons |
| **Short-stay** | `airbnb-booking.spec.ts` | Property flow, linen, turnover | Airbnb types |

Cross-product rules live in `service-model-regression.spec.ts` (smoke).

## Release tiers

### P0 — every PR (automated)

```bash
npm run test:ci
```

Runs: lint → unit tests → production build → Playwright smoke (`@smoke` tag).

Smoke includes:

- Auth redirects and role guards (`auth-access.spec.ts`)
- Hero entry and deep-link redirects (`book-entry.spec.ts`)
- Four launch categories, no laundry/garden on hero (`hero-regression.spec.ts`)
- Cleaning vs housekeeping scope UI (`service-model-regression.spec.ts`)

### P1 — before production merge / nightly

```bash
npm run test:unit && npm run test:e2e
```

Full 30+ E2E tests including end-to-end booking confirmation for nanny, cleaning, housekeeping, and short-stay.

### P2 — staging with real backend

- Create a real booking; worker accepts on dashboard.
- Upload Airtel Money payment proof.
- Verify booking detail page and status transitions.
- Legacy URLs: `#hero-laundry-panel`, `?category=laundry`.

### P3 — exploratory (time-boxed)

Example charters:

- *Busy parent books weekly housekeeping with laundry + dishes.*
- *Host books same-day short-stay turnaround.*
- *Customer lands from old marketing link — do they reach the right product?*

## Environment for automated tests

Playwright starts the dev server with:

- `DEV_AUTH_BYPASS=true`
- Stub `NEXT_PUBLIC_SUPABASE_URL` / anon key (see `playwright.config.ts`)
- `mockServiceCategories()` intercepts Supabase REST for category loading
- Per-test mocks for `/api/workers` and `POST /api/bookings`

Without category loading, **Confirm booking** fails silently because `selectedCategory` is null.

## Commands

| Command | Purpose |
|---------|---------|
| `npm run test:unit` | Vitest — catalog, utils, labels |
| `npm run test:e2e:smoke` | Fast PR gate (`@smoke` only) |
| `npm run test:e2e` | Full Playwright suite |
| `npm run test:ci` | Lint + unit + build + smoke |
| `npm run test:e2e:report` | Open HTML report after failures |

## Definition of Done (product changes)

- [ ] Catalog / pricing unit tests updated
- [ ] At least one E2E from hero or deep link
- [ ] Service-model guardrail if booking UI differs from other products
- [ ] Smoke suite green (`npm run test:e2e:smoke`)
- [ ] Full E2E green before production (`npm run test:e2e`)
- [ ] No user-facing em dashes in new copy
- [ ] Mobile 375px checked for the changed flow

## What we deliberately do not automate

- Exact kwacha amounts in E2E (use unit tests for `suggestPrice`).
- Every pill × every add-on combination.
- Production data or live payment providers in CI.
- Admin/dashboard pages that require `SUPABASE_SERVICE_ROLE_KEY` (server errors in dev logs are expected in CI).

## Post-booking loop (implemented)

| Step | Behaviour |
|------|-----------|
| Sign in to pay | Booking wizard redirects to `/login?redirect=…` before payment step or on 401 |
| Payment proof | Customer uploads proof; worker + admins notified |
| Admin confirm | Customer and worker notified when payment is confirmed |
| Cancel | Other party notified |
| In-app alerts | Notification bell in header (`/api/notifications`) |

Configure production Airtel Money via `NEXT_PUBLIC_AIRTEL_MONEY_NUMBER`. Optionally set `NEXT_PUBLIC_PAYMENT_ACCOUNT_NAME` once the Airtel account is registered.

## File map

| Path | Role |
|------|------|
| `e2e/auth-access.spec.ts` | P0 auth smoke |
| `e2e/book-entry.spec.ts` | P0 hero & picker smoke |
| `e2e/hero-regression.spec.ts` | P0 four-service hero |
| `e2e/service-model-regression.spec.ts` | P0 product boundary smoke |
| `e2e/housekeeping-booking.spec.ts` | P1 housekeeping golden path |
| `e2e/nanny-booking.spec.ts` | P1 nanny golden path |
| `e2e/cleaning-booking.spec.ts` | P1 cleaning golden path |
| `e2e/airbnb-booking.spec.ts` | P1 short-stay golden path |
| `e2e/helpers/` | Auth cookies, mocks, shared schedule helper |
| `lib/services/catalog.test.ts` | Service catalog contracts |
| `lib/services/utils.test.ts` | Pricing, scope rows, frequency |
| `.github/workflows/ci.yml` | PR pipeline |

## CI pipeline

On pull request and push to `main` / `master`:

1. Install dependencies and Playwright Chromium
2. `npm run test:ci`

Nightly (optional): add a scheduled workflow running `npm run test:e2e`.
