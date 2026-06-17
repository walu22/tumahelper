# TumaHelper 2.0 MVP

Trusted Nanny & House Cleaner Marketplace for Lusaka, Zambia

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **Database**: Supabase PostgreSQL
- **Auth**: Supabase Auth (Phone OTP)
- **Storage**: Supabase Storage
- **Hosting**: Vercel
- **SMS**: Africa's Talking

## Getting Started

### Prerequisites

- Node.js 18+
- Supabase account
- Africa's Talking account (for Zambia SMS)

### Installation

```bash
# Clone and install
git clone <your-repo>
cd tumahelper
npm install

# Copy environment variables
cp .env.local.example .env.local
# Edit .env.local with your credentials

# Run development server
npm run dev
```

### Supabase Setup

1. Create a new Supabase project
2. Run migrations in SQL Editor (see `supabase/migrations/`)
3. Enable Phone Auth provider
4. Configure Africa's Talking SMS
5. Create private storage bucket: `worker-documents`

### Deployment (Vercel)

Repo: `walu22/tumahelper` · Production branch: `master` (also mirrored on `main`)

#### 1. Create the project

1. Open your team dashboard: [vercel.com/walkers-projects-da1ff726](https://vercel.com/walkers-projects-da1ff726)
2. Click **Add New…** → **Project**
3. Under **Import Git Repository**, choose **GitHub** and authorize Vercel if prompted
4. Select **`walu22/tumahelper`**
5. Confirm settings:
   - **Framework Preset**: Next.js
   - **Root Directory**: `./`
   - **Build Command**: `npm run build`
   - **Production Branch**: `master`

#### 2. Add environment variables (required before first deploy)

In **Environment Variables**, add these for **Production**, **Preview**, and **Development**:

| Variable | Example / notes |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://xxxx.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | From Supabase → Settings → API |
| `SUPABASE_SERVICE_ROLE_KEY` | Service role key (keep secret) |
| `NEXT_PUBLIC_APP_URL` | `https://tumahelper.com` (or your `.vercel.app` URL for first deploy) |
| `NRC_ENCRYPTION_KEY` | 32-character secret string |
| `SUPABASE_STORAGE_BUCKET` | `worker-documents` |

Optional:

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | WhatsApp CTA on landing/hire pages |
| `AFRICAS_TALKING_API_KEY` | SMS OTP |
| `AFRICAS_TALKING_USERNAME` | SMS OTP |
| `AFRICAS_TALKING_SENDER_ID` | `TumaHelper` |

#### 3. Deploy

Click **Deploy**. The first build will fail if Supabase env vars are missing.

After a successful deploy you should see:

- Hero: **“Book verified nannies & cleaners.”**
- **What we do** section with **Airbnb cleaning** card
- **Airbnb clean** in the header nav

#### 4. Connect your domain

1. Project → **Settings** → **Domains**
2. Add `tumahelper.com` and `www.tumahelper.com`
3. Point DNS to Vercel (or confirm existing records)
4. Set `NEXT_PUBLIC_APP_URL` to `https://tumahelper.com` and **Redeploy**

#### CLI deploy (optional)

```bash
npm i -g vercel
vercel login
vercel link --scope walkers-projects-da1ff726
vercel env pull .env.local
vercel --prod
```

```bash
# Push latest code
git push origin master
```

## Project Structure

```
tumahelper/
├── app/                    # Next.js App Router pages
│   ├── (public)/          # Public pages
│   ├── (auth)/            # Auth pages
│   ├── (customer)/        # Customer dashboard
│   ├── (worker)/          # Worker dashboard
│   ├── (employer)/        # Employer dashboard
│   ├── (admin)/           # Admin dashboard
│   └── api/               # API routes
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   ├── trust-score/      # Trust score components
│   ├── verification/     # Verification components
│   ├── booking/          # Booking components
│   └── worker/           # Worker components
├── lib/                   # Utilities
│   ├── supabase.ts       # Supabase client
│   ├── auth.ts           # Auth helpers
│   ├── encryption.ts     # NRC encryption
│   ├── trust-score.ts    # Trust score algorithm
│   └── validations.ts    # Zod schemas
├── types/                 # TypeScript types
├── hooks/                 # Custom hooks
├── utils/                 # Helper functions
├── supabase/
│   └── migrations/       # SQL migrations
└── scripts/              # Build scripts
```

## Environment Variables

See `.env.local.example` for all required variables.

## License

MIT