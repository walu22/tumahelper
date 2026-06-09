export type ServiceIconKey =
  | "indoor"
  | "nanny"
  | "express"
  | "laundry"
  | "moving"
  | "moms-helper";

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

export const HERO_CATEGORIES: { href: string; label: string; icon: ServiceIconKey }[] = [
  { href: "/customer/book?category=nanny", label: "Nannies", icon: "nanny" },
  { href: "/customer/book?category=cleaning", label: "Cleaning", icon: "indoor" },
  { href: "/customer/book?category=cleaning", label: "Express", icon: "express" },
  { href: "/customer/book?category=cleaning", label: "Laundry", icon: "laundry" },
  { href: "/jobs", label: "Full-time", icon: "moving" },
  { href: "/workers", label: "Browse all", icon: "moms-helper" },
];

export const PLATFORM_OFFERINGS = [
  {
    title: "Book today",
    description:
      "Need a cleaner this Saturday or a nanny for the afternoon? Pick a verified worker, set the time, and book in minutes.",
    href: "/customer/book",
    variant: "green" as const,
  },
  {
    title: "Hire full-time",
    description:
      "Live-in nannies, housekeepers, and domestic workers — we help Lusaka families find long-term help that fits.",
    href: "/jobs",
    variant: "pink" as const,
  },
  {
    title: "Verified profiles",
    description:
      "Every worker is NRC-checked and reference-verified. See trust scores, reviews, and skills before you invite someone in.",
    href: "/workers",
    variant: "teal" as const,
  },
];

export const POPULAR_SERVICES: {
  slug: string;
  bookHref: string;
  title: string;
  description: string;
  price: string;
  icon: ServiceIconKey;
}[] = [
  {
    slug: "house-cleaners",
    bookHref: "/customer/book?category=cleaning",
    title: "Indoor cleaning",
    description: "3.5–8 hours top-to-bottom home cleaning across Lusaka.",
    price: "From K250",
    icon: "indoor",
  },
  {
    slug: "nannies",
    bookHref: "/customer/book?category=nanny",
    title: "Nanny & childcare",
    description: "Babysitting, after-school pickup, and supervised help at home.",
    price: "From K200/day",
    icon: "nanny",
  },
  {
    slug: "house-cleaners",
    bookHref: "/customer/book?category=cleaning",
    title: "Express cleaning",
    description: "1–3 hours for tidying, dishes, and quick laundry.",
    price: "From K150",
    icon: "express",
  },
  {
    slug: "house-cleaners",
    bookHref: "/customer/book?category=cleaning",
    title: "Laundry & ironing",
    description: "Fresh, folded, and ready-to-wear — done at your home.",
    price: "From K80",
    icon: "laundry",
  },
  {
    slug: "jobs",
    bookHref: "/jobs",
    title: "Moving clean",
    description: "Move-in and move-out deep cleaning before the keys handover.",
    price: "From K400",
    icon: "moving",
  },
  {
    slug: "jobs",
    bookHref: "/customer/book?category=nanny",
    title: "Mom's helper",
    description: "An extra pair of hands with the kids and around the house.",
    price: "From K180",
    icon: "moms-helper",
  },
];

export const FULL_TIME_ROLES = [
  {
    title: "Full-time housekeeper",
    description: "Daily cleaning, laundry, and household management.",
    href: "/jobs",
  },
  {
    title: "Full-time nanny",
    description: "Dedicated childcare for families needing ongoing support.",
    href: "/jobs",
  },
  {
    title: "Live-in domestic worker",
    description: "Long-term help tailored to your household.",
    href: "/jobs",
  },
];

export const SAFETY_SIGNALS = [
  "NRC identity checks on every worker",
  "Employer reference verification before profiles go live",
  "Trust scores updated after each completed job",
  "Pay via MTN MoMo, Airtel Money, or cash — with proof upload",
];

export const FAQ_ITEMS = [
  {
    q: "How are workers verified?",
    a: "Every worker passes NRC identity checks and employer reference verification. Top performers earn trust scores and verification badges based on completed jobs and reviews.",
  },
  {
    q: "How do I pay?",
    a: "After booking, pay via MTN Mobile Money or Airtel Money and upload your confirmation screenshot. Cash on arrival works too — just agree with your worker beforehand.",
  },
  {
    q: "Can I hire for one day or full-time?",
    a: "Both. Book express cleans and babysitting for single visits, or post a full-time role for live-in nannies, housekeepers, and domestic workers.",
  },
  {
    q: "Which areas do you cover?",
    a: "We serve households across Lusaka — Kabulonga, Woodlands, Roma, Meanwood, Ibex Hill, Chelstone, and surrounding areas.",
  },
];
