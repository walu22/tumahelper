export type ServiceIconKey = "indoor" | "nanny" | "airbnb";

export const LUSAKA_AREAS = [
  "Kabulonga",
  "Woodlands",
  "Roma",
  "Meanwood",
  "Ibex Hill",
  "Chelstone",
  "Kalundu",
  "Longacres",
];

/** Launch categories only: nannies + cleaning */
export const HERO_CATEGORIES: { href: string; label: string; icon: ServiceIconKey }[] = [
  { href: "/customer/book?category=nanny&type=babysitting", label: "Nannies", icon: "nanny" },
  { href: "/customer/book?category=cleaning&type=standard", label: "Cleaning", icon: "indoor" },
  { href: "/customer/book/airbnb", label: "Airbnb clean", icon: "airbnb" },
];

/** Deep links that skip the service picker and open booking details */
export const NANNY_BOOK_HREF = "/customer/book?category=nanny&type=babysitting";
export const CLEANING_BOOK_HREF = "/customer/book?category=cleaning&type=standard";
export const AIRBNB_CLEAN_BOOK_HREF = "/customer/book/airbnb";
/** @deprecated Prefer NANNY_BOOK_HREF or CLEANING_BOOK_HREF */
export const PRIMARY_BOOK_HREF = NANNY_BOOK_HREF;

export const PRIMARY_NAV_LINKS = [
  { href: "/customer/book?category=nanny", label: "Nannies" },
  { href: "/customer/book?category=cleaning", label: "Cleaning" },
  { href: AIRBNB_CLEAN_BOOK_HREF, label: "Airbnb clean" },
  { href: "/hire", label: "Permanent hire" },
  { href: "/workers", label: "Find workers" },
] as const;

export const FOOTER_TAGLINE =
  "Connecting Lusaka families with trusted, verified nannies and house cleaners — including between-guest cleans for Airbnb and short-stay properties.";

export const PLATFORM_OFFERINGS_INTRO = {
  eyebrow: "What we do",
  headline: "Nannies and house cleaners, verified for Lusaka homes.",
  subtitle:
    "Book for a single visit or set up regular help — including between-guest cleans for Airbnb and short-stay properties — then hire permanently when you find the right person.",
};

export const PLATFORM_OFFERINGS = [
  {
    title: "Nannies & childcare",
    description:
      "Babysitting, after-school help, or regular childcare. Book a verified nanny for the times you need.",
    href: "/customer/book?category=nanny",
    variant: "pink" as const,
  },
  {
    title: "House cleaning",
    description:
      "Standard, deep, or between-guest cleans — including Airbnb and short-stay properties across Lusaka.",
    href: "/customer/book?category=cleaning",
    variant: "green" as const,
  },
  {
    title: "Verified profiles",
    description:
      "NRC checks, reference verification, trust scores, and reviews on every worker.",
    href: "/workers",
    variant: "teal" as const,
  },
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
  "Pay via MTN MoMo, Airtel Money, or cash, with proof upload",
];

export const FAQ_ITEMS = [
  {
    q: "How are workers verified?",
    a: "Every worker passes NRC identity checks and employer reference verification. Top performers earn trust scores and verification badges based on completed jobs and reviews.",
  },
  {
    q: "How do I pay?",
    a: "After booking, pay via MTN Mobile Money or Airtel Money and upload your confirmation screenshot. Cash on arrival works too. Just agree with your worker beforehand.",
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
    q: "Do you clean Airbnb properties?",
    a: "Yes. Between-guest cleaning is one of our house cleaning options — book a verified cleaner after check-out and before the next guest arrives.",
  },
];
