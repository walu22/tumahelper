import {
  Baby,
  Briefcase,
  Clock3,
  Home,
  Shirt,
  Sparkles,
  type LucideIcon,
} from "lucide-react";

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

export const HERO_CATEGORIES: { href: string; label: string; icon: LucideIcon }[] = [
  { href: "/nannies", label: "Nannies", icon: Baby },
  { href: "/house-cleaners", label: "Cleaning", icon: Home },
  { href: "/house-cleaners", label: "Express", icon: Clock3 },
  { href: "/house-cleaners", label: "Laundry", icon: Shirt },
  { href: "/jobs", label: "Full-time", icon: Briefcase },
  { href: "/workers", label: "Browse all", icon: Sparkles },
];

export const PLATFORM_OFFERINGS = [
  {
    title: "Bookings",
    description: "One-off cleans, childcare, laundry, and express help — booked in minutes.",
    href: "/workers",
  },
  {
    title: "Placements",
    description: "Full-time nannies, housekeepers, and live-in workers matched within 48 hours.",
    href: "/jobs",
  },
  {
    title: "Trust Hub",
    description: "NRC checks, reference verification, trust scores, and reviews on every profile.",
    href: "/workers",
  },
];

export const PLATFORM_STATS = [
  { value: "500+", label: "Bookings completed", sub: "Across Lusaka" },
  { value: "100+", label: "Verified workers", sub: "NRC & reference checked" },
  { value: "4.8★", label: "Average rating", sub: "From real families" },
  { value: "48hr", label: "Full-time matching", sub: "Priority placements" },
];

export const POPULAR_SERVICES = [
  {
    slug: "house-cleaners",
    title: "Indoor cleaning",
    description: "3.5–8 hours top-to-bottom home cleaning.",
    price: "From K250",
  },
  {
    slug: "nannies",
    title: "Nanny & childcare",
    description: "Babysitting, after-school, and supervised help.",
    price: "From K200/day",
  },
  {
    slug: "house-cleaners",
    title: "Express cleaning",
    description: "1–3 hours for tidying, dishes, and laundry.",
    price: "From K150",
  },
  {
    slug: "house-cleaners",
    title: "Laundry & ironing",
    description: "Fresh, folded, and ready-to-wear laundry.",
    price: "From K80",
  },
  {
    slug: "jobs",
    title: "Moving clean",
    description: "Move-in and move-out deep cleaning.",
    price: "From K400",
  },
  {
    slug: "jobs",
    title: "Mom's helper",
    description: "Supervised help with children and around the home.",
    price: "From K180",
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

export const HAPPINESS_PLEDGE = [
  {
    title: "TumaHelper guarantee",
    description: "Not satisfied? We'll help you find a replacement within 48 hours.",
  },
  {
    title: "Vetted workers",
    description: "Every worker is NRC-verified and reference-checked before joining.",
  },
  {
    title: "Dedicated support",
    description: "WhatsApp and email support when you need help choosing or booking.",
  },
];

export const SAFETY_SIGNALS = [
  "Ratings and reviews from other families",
  "Reference and background checks completed",
  "2+ years experience preferred for featured workers",
  "Trust scores based on real job performance",
];

export const PROCESS_STEPS = [
  {
    step: "1",
    title: "Choose a worker",
    body: "Browse by price, skills, area, and reviews.",
  },
  {
    step: "2",
    title: "Book as early as today",
    body: "Schedule one-off help or start a full-time placement.",
  },
  {
    step: "3",
    title: "Review all in one place",
    body: "Book, rate, and build trust — all on TumaHelper.",
  },
];

export const SWEEP_STARS = [
  {
    name: "Sarah Mulenga",
    category: "Indoor",
    area: "Kabulonga",
    quote: "Loved her professional attitude, pleasant disposition and thorough cleaning.",
    rating: 4.9,
    href: "/workers",
  },
  {
    name: "Mary Phiri",
    category: "Childcare",
    area: "Woodlands",
    quote: "Our kids took to her immediately. Reliable, warm, and always on time.",
    rating: 4.8,
    href: "/workers",
  },
  {
    name: "Grace Banda",
    category: "Indoor",
    area: "Roma",
    quote: "So much effort — she even cleaned the mirrors. Our kitchen looks amazing again!",
    rating: 4.9,
    href: "/workers",
  },
];

export const FALLBACK_REVIEWS = [
  {
    id: "r1",
    quote:
      "We matched with a housekeeper in Kabulonga within two days. The trust score and reviews made the decision easy.",
    author: "Grace M.",
    role: "Homeowner, Kabulonga",
    rating: 5,
  },
  {
    id: "r2",
    quote:
      "Reference checks gave us real peace of mind when hiring a nanny. The whole process felt professional.",
    author: "James & Linda C.",
    role: "Family, Woodlands",
    rating: 5,
  },
  {
    id: "r3",
    quote:
      "My verified profile helped me get steady bookings in Meanwood. I finally feel valued as a worker.",
    author: "Mary T.",
    role: "Domestic worker, Lusaka",
    rating: 5,
  },
];

export const FAQ_ITEMS = [
  {
    q: "How are workers verified?",
    a: "Every worker passes NRC identity checks and employer reference verification. Top performers earn trust scores and verification badges based on completed jobs and reviews.",
  },
  {
    q: "Can I hire for one day or full-time?",
    a: "Both. Book express cleans and babysitting for single visits, or post a full-time role for live-in nannies, housekeepers, and domestic workers.",
  },
  {
    q: "What if the match isn't right?",
    a: "Contact us within 48 hours and we'll help you find a replacement. Your peace of mind is part of the TumaHelper promise.",
  },
  {
    q: "Which areas do you cover?",
    a: "We serve households across Lusaka — Kabulonga, Woodlands, Roma, Meanwood, Ibex Hill, Chelstone, and surrounding areas.",
  },
];

export const TRUST_STATS = [
  { value: "100+", label: "Verified workers" },
  { value: "4.8★", label: "Average rating" },
  { value: "48hr", label: "Full-time matching" },
  { value: "NRC", label: "Identity checked" },
];
