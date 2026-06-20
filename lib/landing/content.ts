export type ServiceIconKey =
  | "indoor"
  | "nanny"
  | "short_stay"
  | "housekeeping"
  | "cooking"
  | "laundry"
  | "garden";

export type HeroCategoryId =
  | "nanny"
  | "cleaning"
  | "housekeeping"
  | "cooking"
  | "laundry"
  | "garden"
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
export const HOUSEKEEPING_BOOK_HREF = `/#${HERO_CATEGORY_PANEL_IDS.housekeeping}`;
export const COOKING_BOOK_HREF = `/#${HERO_CATEGORY_PANEL_IDS.cooking}`;
/** @deprecated Prefer NANNY_BOOK_HREF or CLEANING_BOOK_HREF */
export const PRIMARY_BOOK_HREF = NANNY_BOOK_HREF;

export const GET_HELP_HREF = "/#choose-service";

export const PRICING_SECTION_ID = "pricing";

/** In-page link to pricing & scope reference on the homepage. */
export const PRICING_SECTION_HREF = `/#${PRICING_SECTION_ID}`;

/** Primary header CTA — opens the homepage service picker. */
export const HEADER_BOOK_CTA = {
  href: GET_HELP_HREF,
  label: "Book a service",
} as const;

/** Minimal header links (Option B — services live on homepage hero). */
export const HEADER_NAV_LINKS = [
  { href: "/workers", label: "Find workers" },
  { href: "/hire", label: "Permanent hire" },
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
  { href: "/hire", label: "Permanent hire" },
  { href: "/workers", label: "Find workers" },
] as const;

export const FOOTER_TAGLINE =
  "Connecting Lusaka families with trusted, verified home help: nannies, cleaners, housekeepers, cooks, laundry, gardeners, and short-stay turnover cleaning.";

export const PLATFORM_OFFERINGS_INTRO = {
  eyebrow: "How it works",
  headline: "One place to book trusted help at home.",
  subtitle:
    "Choose a service, pick a verified worker, and book for a single visit or every week.",
};

export const PLATFORM_BOOKING_STEPS = [
  {
    title: "Choose a service",
    description: "Pick nannies, cleaning, cooking, laundry, and more from the homepage.",
  },
  {
    title: "Pick your worker",
    description: "Browse verified profiles matched to your service and area.",
  },
  {
    title: "Book & pay securely",
    description: "Pay via Airtel Money or cash, with proof upload after booking.",
  },
] as const;

export const PLATFORM_TRUST_BAR = [
  "NRC identity checks",
  "Reference verification",
  "Reviews & trust scores",
] as const;

export const SERVICES_DETAIL_INTRO = {
  eyebrow: "Pricing & what's included",
  headline: "Know what you're booking before you pay.",
  subtitle:
    "Typical visit lengths and price ranges for Lusaka homes. Final price depends on your address, duties, and chosen worker.",
} as const;

export const WORKERS_SPOTLIGHT_INTRO = {
  eyebrow: "Real profiles",
  headline: "Helpers families in Lusaka already book.",
  subtitle:
    "NRC-checked profiles with areas, experience, and reviews. Choose during booking or browse first.",
  emptyHeadline: "Verified helpers joining every week",
  emptySubtitle:
    "We're growing Lusaka's trusted home-help network. Browse profiles as more helpers go live.",
} as const;

export const WORKERS_SPOTLIGHT_LIMIT = 3;

export const SERVICE_DETAIL_TAB_ORDER: HeroCategoryId[] = [
  "nanny",
  "cleaning",
  "housekeeping",
  "cooking",
  "laundry",
  "garden",
  "short_stay",
];

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
  "NRC identity checks on every worker",
  "Employer reference verification before profiles go live",
  "Trust scores updated after each completed job",
  "Pay via Airtel Money or cash, with proof upload",
];

export const FAQ_ITEMS = [
  {
    q: "How are workers verified?",
    a: "Every worker passes NRC identity checks and employer reference verification. Top performers earn trust scores and verification badges based on completed jobs and reviews.",
  },
  {
    q: "How do I pay?",
    a: "After booking, pay via Airtel Money and upload your confirmation screenshot. Cash on arrival works too. Just agree with your worker beforehand.",
  },
  {
    q: "Can I book once or regularly?",
    a: "Both. Book a single visit or schedule recurring help with the same verified worker. Many families book regularly before moving to permanent hire.",
  },
  {
    q: "What about full-time or live-in help?",
    a: "Start by booking a worker you like, or contact us for a permanent placement. We help match live-in nannies, housekeepers, and long-term domestic workers in Lusaka.",
  },
  {
    q: "Which areas do you cover?",
    a: "We serve households across Lusaka, including Kabulonga, Woodlands, Roma, Meanwood, Ibex Hill, Chelstone, and surrounding areas.",
  },
  {
    q: "Can I book a cook for lunch or dinner?",
    a: "Yes. Choose Cooking & meals on the homepage, pick lunch, dinner, meal prep, or weekly cooking, then set your schedule. You provide ingredients unless you agree otherwise with your cook.",
  },
  {
    q: "Do you clean short-stay rentals?",
    a: "Yes. Short-stay cleaning covers Airbnbs, guesthouses, and furnished rentals: guest checkout, same-day turnaround, deep cleans, and linen setup.",
  },
];
