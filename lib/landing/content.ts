export type ServiceIconKey =
  | "indoor"
  | "nanny"
  | "short_stay"
  | "housekeeping"
  | "cooking"
  | "laundry"
  | "garden"
  | "handyman";

export type HeroCategoryId =
  | "nanny"
  | "cleaning"
  | "housekeeping"
  | "cooking"
  | "laundry"
  | "garden"
  | "handyman"
  | "short_stay";

export const LUSAKA_AREAS = [
  "Kabulonga",
  "Woodlands",
  "Roma",
  "Meanwood",
  "Ibex Hill",
  "Chelstone",
  "Kalundu",
  "Longacres",
  "Rhodes Park",
  "Avondale",
  "Chainda",
  "Chilenje",
  "Kamwala",
  "Libala",
  "Makeni",
  "Sunningdale",
] as const;

export const HERO_CATEGORY_PANEL_IDS = {
  nanny: "hero-nanny-panel",
  cleaning: "hero-cleaning-panel",
  housekeeping: "hero-housekeeping-panel",
  cooking: "hero-cooking-panel",
  laundry: "hero-laundry-panel",
  garden: "hero-garden-panel",
  handyman: "hero-handyman-panel",
  short_stay: "hero-short-stay-panel",
} as const;

/** @deprecated Use HERO_CATEGORY_PANEL_IDS.short_stay */
export const LEGACY_SHORT_STAY_PANEL_ID = "hero-airbnb-panel";

/** Launch homepage services for the Zambian market */
export const HERO_CATEGORIES: {
  id: HeroCategoryId;
  href: string;
  label: string;
  subtitle: string;
  icon: ServiceIconKey;
  panelId: string;
}[] = [
  {
    id: "nanny",
    href: `/#${HERO_CATEGORY_PANEL_IDS.nanny}`,
    label: "Nannies",
    subtitle: "Childcare support for families.",
    icon: "nanny",
    panelId: HERO_CATEGORY_PANEL_IDS.nanny,
  },
  {
    id: "cleaning",
    href: `/#${HERO_CATEGORY_PANEL_IDS.cleaning}`,
    label: "Cleaning",
    subtitle: "Household cleaning for homes and apartments.",
    icon: "indoor",
    panelId: HERO_CATEGORY_PANEL_IDS.cleaning,
  },
  {
    id: "housekeeping",
    href: `/#${HERO_CATEGORY_PANEL_IDS.housekeeping}`,
    label: "Housekeeping",
    subtitle: "Half-day or full-day help: cleaning, dishes, and tidying.",
    icon: "housekeeping",
    panelId: HERO_CATEGORY_PANEL_IDS.housekeeping,
  },
  {
    id: "cooking",
    href: `/#${HERO_CATEGORY_PANEL_IDS.cooking}`,
    label: "Cooking & Meals",
    subtitle: "Lunch, dinner, meal prep, and weekly cooking.",
    icon: "cooking",
    panelId: HERO_CATEGORY_PANEL_IDS.cooking,
  },
  {
    id: "laundry",
    href: `/#${HERO_CATEGORY_PANEL_IDS.laundry}`,
    label: "Laundry & Ironing",
    subtitle: "Wash, fold, iron, bedding, and curtains.",
    icon: "laundry",
    panelId: HERO_CATEGORY_PANEL_IDS.laundry,
  },
  {
    id: "garden",
    href: `/#${HERO_CATEGORY_PANEL_IDS.garden}`,
    label: "Garden & Yard",
    subtitle: "Lawn, sweeping, trimming, and outside tidy-up.",
    icon: "garden",
    panelId: HERO_CATEGORY_PANEL_IDS.garden,
  },
  {
    id: "handyman",
    href: `/#${HERO_CATEGORY_PANEL_IDS.handyman}`,
    label: "Handyman & Home Repairs",
    subtitle: "Plumbing, electrical, mounting, repairs, and maintenance.",
    icon: "handyman",
    panelId: HERO_CATEGORY_PANEL_IDS.handyman,
  },
  {
    id: "short_stay",
    href: `/#${HERO_CATEGORY_PANEL_IDS.short_stay}`,
    label: "Short-Stay Cleaning",
    subtitle: "Airbnbs, guesthouses, and furnished rentals.",
    icon: "short_stay",
    panelId: HERO_CATEGORY_PANEL_IDS.short_stay,
  },
];

export const NANNY_BOOK_HREF = `/#${HERO_CATEGORY_PANEL_IDS.nanny}`;
export const CLEANING_BOOK_HREF = `/#${HERO_CATEGORY_PANEL_IDS.cleaning}`;
export const SHORT_STAY_CLEAN_BOOK_HREF = `/#${HERO_CATEGORY_PANEL_IDS.short_stay}`;
/** @deprecated Use SHORT_STAY_CLEAN_BOOK_HREF */
export const AIRBNB_CLEAN_BOOK_HREF = SHORT_STAY_CLEAN_BOOK_HREF;
export const LAUNDRY_BOOK_HREF = `/#${HERO_CATEGORY_PANEL_IDS.laundry}`;
export const GARDEN_BOOK_HREF = `/#${HERO_CATEGORY_PANEL_IDS.garden}`;
export const HANDYMAN_BOOK_HREF = `/#${HERO_CATEGORY_PANEL_IDS.handyman}`;
export const HOUSEKEEPING_BOOK_HREF = `/#${HERO_CATEGORY_PANEL_IDS.housekeeping}`;
export const COOKING_BOOK_HREF = `/#${HERO_CATEGORY_PANEL_IDS.cooking}`;
/** @deprecated Prefer NANNY_BOOK_HREF or CLEANING_BOOK_HREF */
export const PRIMARY_BOOK_HREF = NANNY_BOOK_HREF;

export const GET_HELP_HREF = "/#choose-service";

export const PERMANENT_HIRE_SECTION_ID = "permanent-hire";

/** In-page link to permanent placement block on the homepage. */
export const PERMANENT_HIRE_HREF = `/#${PERMANENT_HIRE_SECTION_ID}`;

export function heroCategoryPanelHref(tabId: HeroCategoryId): string {
  return `/#${HERO_CATEGORY_PANEL_IDS[tabId]}`;
}

export const PERMANENT_PLACEMENT_STEPS = [
  {
    title: "Book first",
    body: "Try a verified nanny or cleaner for a visit, or book them regularly.",
  },
  {
    title: "Build trust",
    body: "See reviews, trust scores, and how they work in your home.",
  },
  {
    title: "Hire permanently",
    body: "When you're ready, we'll help you move to full-time or live-in.",
  },
] as const;

export const PERMANENT_HIRE_WHATSAPP_MESSAGE =
  "Hi TumaHelper, I need full-time or live-in help in Lusaka. Can you help me find someone?";

/** Primary header CTA — opens the homepage service picker. */
export const HEADER_BOOK_CTA = {
  href: GET_HELP_HREF,
  label: "Book a service",
} as const;

/** Minimal header links (Option B — services live on homepage hero). */
export const HEADER_NAV_LINKS = [
  { href: "/workers", label: "Find workers" },
  { href: PERMANENT_HIRE_HREF, label: "Permanent hire" },
] as const;

/** @deprecated Services are chosen on the homepage hero; use HEADER_NAV_LINKS in the header. */
export const PRIMARY_NAV_LINKS = [
  { href: NANNY_BOOK_HREF, label: "Nannies" },
  { href: CLEANING_BOOK_HREF, label: "Cleaning" },
  { href: HOUSEKEEPING_BOOK_HREF, label: "Housekeeping" },
  { href: COOKING_BOOK_HREF, label: "Cooking & meals" },
  { href: SHORT_STAY_CLEAN_BOOK_HREF, label: "Short-stay cleaning" },
  { href: LAUNDRY_BOOK_HREF, label: "Laundry & ironing" },
  { href: GARDEN_BOOK_HREF, label: "Garden & yard work" },
  { href: PERMANENT_HIRE_HREF, label: "Permanent hire" },
  { href: "/workers", label: "Find workers" },
] as const;

export const FOOTER_TAGLINE =
  "Verified nannies, cleaners, and home help for families in Lusaka. We reply on WhatsApp, usually the same day.";

export const HERO_INTRO = {
  eyebrow: "Home help in Lusaka",
  headline: "Get a nanny or cleaner you can actually trust.",
  founderNote:
    "We built TumaHelper after one too many no-shows. If we wouldn't send them to our own homes, they don't go on the platform.",
  searchPlaceholder: "What do you need help with?",
  trustLine: "We check NRC and references before anyone gets booked.",
} as const;

export const HERO_WHATSAPP_MESSAGE =
  "Hi, I'm in Lusaka and need help at home. Can you point me in the right direction?";

export const PLATFORM_OFFERINGS_INTRO = {
  eyebrow: "How it works",
  headline: "Three steps to book help at home.",
  subtitle:
    "Like a referral from someone in your estate, but we check NRC and references before they come through your gate.",
};

/** Single line per step in the how-it-works card. */
export const PLATFORM_BOOKING_STEPS = [
  {
    description: "Search for what you need, or pick a service below.",
  },
  {
    description: "Choose a helper and pick a time that works for you.",
  },
  {
    description: "Pay on Airtel Money after booking. Leave a review when the visit is done.",
  },
] as const;

export const HOW_IT_WORKS_STEP_BADGE_COLORS = [
  "bg-violet-200 text-foreground",
  "bg-amber-100 text-foreground",
  "bg-emerald-200 text-foreground",
] as const;

/** Placeholder until real Lusaka photography is available. */
export const HOW_IT_WORKS_HERO_IMAGE =
  "https://images.unsplash.com/photo-1556911220-bff31c812dba?w=1400&h=800&fit=crop&q=80";

export const WORKERS_SPOTLIGHT_INTRO = {
  eyebrow: "Available this week",
  headline: "Meet helpers Lusaka families are booking.",
  subtitle:
    "Real profiles with service areas, experience, and reviews. Pick someone during booking, or browse first.",
  emptyHeadline: "Helpers are joining every week",
  emptySubtitle:
    "We are still growing the network. Check back soon, or WhatsApp us if you need help finding someone.",
} as const;

export const WORKERS_SPOTLIGHT_LIMIT = 3;

export const FAQ_CTA_INTRO = {
  eyebrow: "Still deciding?",
  headline: "Book when you are ready.",
  subtitle: "Browse profiles first, or start from the homepage. We are happy to help on WhatsApp.",
  bookLabel: "Book a service",
  browseLabel: "Browse all workers",
} as const;

export const TRUST_SECTION_INTRO = {
  eyebrow: "Trust first",
  headline: "Know who is coming through your gate.",
  subtitle:
    "In Lusaka, hiring help often means a WhatsApp forward and hoping they show up. We check NRC, call references, and track reviews so you know who you are letting in.",
  linkLabel: "Browse helpers",
} as const;

export const PERMANENT_PLACEMENT_ROLES = [
  {
    title: "Full-time nanny",
    description: "Live-in or live-out childcare for your family.",
  },
  {
    title: "Full-time housekeeper",
    description: "Daily cleaning, laundry, and household management.",
  },
  {
    title: "Live-in domestic worker",
    description: "Long-term help tailored to your home.",
  },
];

export const SAFETY_SIGNALS = [
  "NRC check on every worker before their profile goes live",
  "We call previous employers for references",
  "Trust scores update after each completed visit",
  "Pay on Airtel Money or cash. Upload proof if you pay in the app",
];

export const FAQ_ITEMS = [
  {
    q: "How are workers verified?",
    a: "We check NRC and call previous employers before a profile goes live. After each visit, families leave reviews and trust scores update.",
  },
  {
    q: "How do I pay?",
    a: "Pay on Airtel Money and upload your confirmation screenshot in the app. Cash on the day is fine too. Just agree with your helper beforehand.",
  },
  {
    q: "What if they do not show up?",
    a: "Message us on WhatsApp as soon as you can. We will help you rebook or follow up with the helper.",
  },
  {
    q: "Which areas do you cover?",
    a: "Most bookings are in Kabulonga, Woodlands, Roma, Meanwood, Ibex Hill, and Chelstone. Outside that? WhatsApp us and we will tell you honestly if we can help.",
  },
  {
    q: "Full-time or live-in help?",
    a: "Book someone you like for a few visits first, or WhatsApp us for a permanent placement. We help with live-in nannies and housekeepers across Lusaka.",
  },
];
