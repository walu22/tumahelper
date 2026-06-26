# Go-live checklist (Track A)

Use this before pointing `tumahelper.com` at the full product (`COMING_SOON=false`).

## 1. Database (Supabase)

Apply migrations in order on production:

```bash
supabase db push
# or run each file under supabase/migrations/ in numeric order
```

Critical migrations for the booking loop:

| Migration | Purpose |
|-----------|---------|
| `005_add_user_profile_fields.sql` | `users.full_name` and profile fields |
| `007_booking_service_details.sql` | `bookings.service_details` JSON column |
| `009_worker_location_coords.sql` | Worker proximity sorting |

Verify seed/dev data migrations (`003`, `006`, `008`) are **not** applied to production unless intentional.

## 2. Vercel environment variables

Copy from `.env.local.example` and set in Vercel → Project → Settings → Environment Variables:

| Variable | Required | Notes |
|----------|----------|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Production Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes | Anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | Yes | Server-side admin operations |
| `SUPABASE_STORAGE_BUCKET` | Yes | Default: `worker-documents` |
| `NEXT_PUBLIC_AIRTEL_MONEY_NUMBER` | Yes | Customer-facing MoMo number |
| `NEXT_PUBLIC_APP_URL` | Yes | `https://tumahelper.com` |
| `NRC_ENCRYPTION_KEY` | Yes | 32-character secret |
| `COMING_SOON` | Launch | Set `false` when ready to go live |
| `COMING_SOON_BYPASS_SECRET` | Optional | Preview link secret while gated |
| `DEV_AUTH_BYPASS` | Never in prod | Must be unset or `false` |
| `ALLOW_DEV_LOGIN` | Never in prod | Must be unset or `false` |

SMS/OTP (pick one provider): `AFRICAS_TALKING_*` or `TWILIO_*`.

## 3. Storage bucket

In Supabase Storage, ensure bucket `worker-documents` (or your `SUPABASE_STORAGE_BUCKET`) exists with policies allowing:

- Customers to upload payment proofs under `payments/{bookingId}/`
- Workers to upload verification documents

## 4. Smoke test (automated)

```bash
npm run test:ci
```

Covers P0 paths including the go-live loop (`e2e/go-live-loop.spec.ts`):

1. Worker accepts pending booking (WRK-002)
2. Customer uploads payment proof (BD-002)
3. Admin confirms payment (ADM-003)

## 5. Manual staging walkthrough

Use dev accounts on staging (or local with real Supabase):

| Step | Role | Action |
|------|------|--------|
| 1 | Customer | Book via `/customer/book?category=nanny&type=babysitting` |
| 2 | Worker | Accept on `/worker/bookings/{id}` |
| 3 | Customer | Upload Airtel Money proof on `/customer/bookings/{id}` |
| 4 | Admin | Confirm on `/admin/payments?status=pending` or booking detail |
| 5 | Worker | Start job → Complete job |

Expected end state: `booking.status = completed`, `booking.payment_status = confirmed`.

## 6. Launch switch

1. Deploy `master` → `main` (Vercel production branch).
2. Set `COMING_SOON=false` on production.
3. Confirm homepage loads (not coming-soon screen).
4. Run smoke checklist from `docs/TEST_CASES.md` § Test execution checklist.

## 7. Post-launch monitoring

- Admin dashboard → **Payments to confirm** count matches `/admin/payments?status=pending`
- Check Supabase logs for failed payment-proof uploads
- Verify notifications appear for booking accept, proof upload, and payment confirm
