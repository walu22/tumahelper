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

### Deployment

```bash
# Push to GitHub
git push origin main

# Connect to Vercel
# Add environment variables in Vercel dashboard
# Deploy
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