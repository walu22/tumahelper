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

export const SERVICES = [
  {
    slug: "nannies",
    title: "Nannies & childcare",
    description: "Babysitting, after-school care, live-in support.",
    price: "From K200/day",
    image: "/images/home-family.jpg",
    span: "col-span-1 row-span-1",
    dark: false,
  },
  {
    slug: "house-cleaners",
    title: "House cleaning",
    description: "Deep cleans, laundry, and weekly upkeep across Lusaka.",
    price: "From K150",
    image: "/images/cleaning-service.jpg",
    span: "col-span-1 md:col-span-2 row-span-1",
    dark: false,
  },
  {
    slug: "jobs",
    title: "Full-time help",
    description: "Live-in nannies, housekeepers, and domestic workers — matched in 48 hours.",
    price: "From K800/mo",
    image: "/images/hero-home.jpg",
    span: "col-span-1 md:col-span-2 md:row-span-2",
    dark: true,
  },
  {
    slug: "house-cleaners",
    title: "Express visits",
    description: "1–3 hour tidying, dishes, and priority tasks.",
    price: "From K150",
    image: "/images/cleaning-service.jpg",
    span: "col-span-1 row-span-1",
    dark: false,
  },
];

export const PROCESS_STEPS = [
  {
    step: "01",
    title: "Tell us what you need",
    body: "Choose a service, pick your area, and browse verified profiles.",
  },
  {
    step: "02",
    title: "Meet your match",
    body: "Compare trust scores, reviews, and verification badges before you book.",
  },
  {
    step: "03",
    title: "Book with confidence",
    body: "Confirm online. Rate your experience. Build trust for the whole community.",
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
