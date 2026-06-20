import type { ServiceAddonOption, ServiceTypeOption } from "./catalog";

/** Launch order: phase 1 (first 8) then phase 2. */
export const HANDYMAN_TYPE_IDS = [
  "general_handyman",
  "plumbing",
  "electrical",
  "mounting",
  "doors_cabinets",
  "wall_patch_paint",
  "furniture_assembly",
  "ac_fans",
  "tiling",
  "carpentry",
  "fence_gate",
  "home_maintenance",
] as const;

export type HandymanServiceTypeId = (typeof HANDYMAN_TYPE_IDS)[number];

export const HANDYMAN_SCOPE_DISCLAIMER =
  "TumaHelper handyman services are for minor repairs, installations, and maintenance. Major construction, high-risk electrical or plumbing work, emergency faults, and permit-based work are not included.";

export const HANDYMAN_TYPES: ServiceTypeOption[] = [
  {
    id: "general_handyman",
    label: "General Handyman",
    tabLabel: "General",
    description:
      "For small home repairs, installations, adjustments, and general fix-it jobs around the house.",
    pricingHint:
      "Final price depends on the type of repair, time required, tools needed, access, and whether materials or replacement parts are required.",
    included: [
      "Tightening loose handles or fittings",
      "Fixing small household items",
      "Adjusting doors, hinges, or fixtures",
      "Minor furniture fixes",
      "Small repairs around the house",
      "Basic diagnosis of the issue",
      "Advising if a specialist is needed",
    ],
    notIncluded: [
      "Major construction or full renovations",
      "Full electrical rewiring or in-wall plumbing",
      "Roofing or structural repairs",
      "Emergency flooding or dangerous electrical faults",
      "Gas work",
    ],
    defaultHours: 3,
    priceHintMin: 200,
    priceHintMax: 400,
  },
  {
    id: "plumbing",
    label: "Plumbing",
    tabLabel: "Plumbing",
    description:
      "For plumbing repairs and maintenance such as leaking taps, blocked drains, toilet issues, shower fittings, and visible pipe leaks.",
    pricingHint:
      "Final price depends on the issue, parts required, whether water is actively leaking, and whether the job is a repair, replacement, or diagnosis.",
    included: [
      "Fixing leaking taps",
      "Replacing taps or mixers",
      "Unblocking simple drains",
      "Fixing toilet cistern or flush issues",
      "Replacing shower heads",
      "Checking visible pipe leaks",
      "Checking water pressure issues",
      "Advising on parts needed",
    ],
    notIncluded: [
      "New pipe installation inside walls",
      "Major underground pipe or sewer work",
      "Full bathroom plumbing installation",
      "Borehole pump repair unless separately offered",
      "Emergency flooding unless separately offered",
    ],
    defaultHours: 2,
    priceHintMin: 250,
    priceHintMax: 500,
  },
  {
    id: "electrical",
    label: "Electrical",
    tabLabel: "Electrical",
    description:
      "For minor electrical repairs and installations such as lights, switches, plugs, sockets, and simple fixture replacements.",
    pricingHint:
      "Final price depends on the number of fittings, access height, whether wiring already exists, and whether replacement parts are available.",
    included: [
      "Replacing light fittings",
      "Replacing switches and sockets",
      "Installing simple light fixtures",
      "Installing outdoor or security lights",
      "Basic electrical fault checking",
      "Connecting a ceiling fan where wiring already exists",
    ],
    notIncluded: [
      "Full house rewiring or new circuits",
      "Main distribution board upgrades",
      "Generator, inverter, or solar installation",
      "Emergency electrical faults or unsafe wiring",
      "Industrial electrical work",
    ],
    defaultHours: 2,
    priceHintMin: 250,
    priceHintMax: 500,
  },
  {
    id: "mounting",
    label: "Mounting",
    tabLabel: "Mounting",
    description:
      "For mounting TVs, shelves, mirrors, curtain rods, hooks, rails, artwork, and small wall fixtures.",
    pricingHint:
      "Final price depends on the number of items, item weight, wall type, and whether brackets, screws, and plugs are available.",
    included: [
      "Mounting TV brackets",
      "Hanging mirrors and artwork",
      "Installing shelves and curtain rods",
      "Installing hooks and bathroom rails",
      "Basic cable tidying where possible",
      "Checking wall suitability",
    ],
    notIncluded: [
      "Electrical wiring or chasing cables into walls",
      "Mounting on unsafe or damaged walls",
      "Mounting extremely heavy items without inspection",
      "Supplying brackets unless agreed beforehand",
      "Structural wall work",
    ],
    defaultHours: 2,
    priceHintMin: 150,
    priceHintMax: 350,
  },
  {
    id: "doors_cabinets",
    label: "Doors & Cabinets",
    tabLabel: "Doors",
    description:
      "For fixing doors, locks, hinges, cupboard doors, drawers, wardrobe rails, and cabinet fittings.",
    pricingHint:
      "Final price depends on the number of doors or cabinets, replacement parts, and whether the work is repair, adjustment, or replacement.",
    included: [
      "Door handle and hinge repairs",
      "Cabinet door alignment",
      "Drawer runner repair",
      "Wardrobe rail replacement",
      "Lock replacement",
      "Fixing sticking doors",
      "Minor cabinet repairs",
    ],
    notIncluded: [
      "Custom furniture building",
      "Major carpentry or full door-frame replacement",
      "Security system installation",
      "Emergency locksmith lockouts",
      "Welding burglar bars or gates",
    ],
    defaultHours: 2,
    priceHintMin: 200,
    priceHintMax: 400,
  },
  {
    id: "wall_patch_paint",
    label: "Wall Patch & Paint",
    tabLabel: "Wall patch",
    description:
      "For small wall repairs, cracks, holes, plaster patching, skimming touch-ups, and paint touch-ups.",
    pricingHint:
      "Final price depends on the size of the damaged area, wall condition, paint availability, and whether filler, plaster, or primer is required.",
    included: [
      "Filling small holes and cracks",
      "Minor plaster repair and skimming touch-ups",
      "Small paint touch-ups",
      "Small ceiling patches",
      "Skirting touch-ups",
      "Preparing small damaged areas",
    ],
    notIncluded: [
      "Full room or full-house painting unless selected",
      "Major damp or mould treatment",
      "Structural cracks or roof leak repairs",
      "Large plastering jobs or full renovations",
    ],
    defaultHours: 3,
    priceHintMin: 200,
    priceHintMax: 450,
  },
  {
    id: "furniture_assembly",
    label: "Furniture Assembly",
    tabLabel: "Assembly",
    description:
      "For assembling beds, tables, wardrobes, desks, shelves, cabinets, and other ready-to-assemble furniture.",
    pricingHint:
      "Final price depends on the number of items, size, complexity, and whether assembly instructions and all parts are available.",
    included: [
      "Bed, table, desk, and chair assembly",
      "Wardrobe and shelf assembly",
      "Cabinet assembly",
      "Basic positioning after assembly",
    ],
    notIncluded: [
      "Custom furniture building",
      "Repairing broken parts",
      "Transporting furniture",
      "Wall mounting unless selected",
      "Missing-parts replacement unless agreed",
    ],
    defaultHours: 2,
    priceHintMin: 150,
    priceHintMax: 350,
  },
  {
    id: "ac_fans",
    label: "AC & Fans",
    tabLabel: "AC & Fans",
    description:
      "For ceiling fan installation, fan replacement, AC installation support, AC removal, and basic AC servicing.",
    pricingHint:
      "Final price depends on whether it is a fan or AC, installation complexity, height, wiring availability, and specialist tools required.",
    included: [
      "Installing and replacing ceiling fans",
      "Checking fan mounting points",
      "AC filter cleaning and basic service",
      "AC removal",
      "Split AC installation support with verified technician",
    ],
    notIncluded: [
      "Complex AC repairs or refrigerant gas refill",
      "Full HVAC systems",
      "Unsafe ceiling installations",
      "Electrical rewiring",
      "Warranty repairs",
    ],
    defaultHours: 3,
    priceHintMin: 300,
    priceHintMax: 600,
  },
  {
    id: "tiling",
    label: "Tiling",
    tabLabel: "Tiling",
    description:
      "For small tiling jobs, tile repairs, grout repair, backsplash work, and replacing broken tiles.",
    pricingHint:
      "Final price depends on the area size, number of tiles, tile type, surface condition, and whether materials are available.",
    included: [
      "Replacing broken tiles",
      "Fixing loose tiles",
      "Small backsplash installation",
      "Grout repair",
      "Small bathroom or kitchen tile jobs",
      "Advising on materials needed",
    ],
    notIncluded: [
      "Full bathroom or full-house tiling",
      "Large commercial tiling",
      "Waterproofing failure repairs",
      "Structural floor repairs",
      "Tile supply unless agreed",
    ],
    defaultHours: 4,
    priceHintMin: 250,
    priceHintMax: 500,
  },
  {
    id: "carpentry",
    label: "Carpentry",
    tabLabel: "Carpentry",
    description:
      "For light carpentry repairs and installations such as shelves, skirting, small wood repairs, frames, and minor woodwork.",
    pricingHint:
      "Final price depends on the type of woodwork, size, materials, cutting required, and whether parts are already available.",
    included: [
      "Minor wood repairs",
      "Shelf fitting and skirting repair",
      "Door-frame minor fixes",
      "Small cabinet adjustments",
      "Simple cutting and fitting work",
      "Advising on materials needed",
    ],
    notIncluded: [
      "Full custom kitchens or wardrobes",
      "Roof trusses or structural carpentry",
      "Large furniture manufacturing",
      "Major renovations",
    ],
    defaultHours: 3,
    priceHintMin: 250,
    priceHintMax: 450,
  },
  {
    id: "fence_gate",
    label: "Fence & Gate",
    tabLabel: "Fence",
    description:
      "For small fence, gate, lock, hinge, burglar bar, security gate, and palisade repair jobs.",
    pricingHint:
      "Final price depends on the type of gate or fence, repair size, materials, whether welding is needed, and security hardware involved.",
    included: [
      "Gate hinge and lock checks or replacement",
      "Small fence repairs",
      "Burglar bar adjustments",
      "Security gate repairs",
      "Palisade repair assessment",
      "Advising on welding or fabrication needs",
    ],
    notIncluded: [
      "Full wall or fence construction",
      "Electric fence installation unless verified specialist",
      "Gate motor installation unless verified specialist",
      "Major welding or fabrication unless separately offered",
    ],
    defaultHours: 3,
    priceHintMin: 300,
    priceHintMax: 600,
  },
  {
    id: "home_maintenance",
    label: "Home Maintenance",
    tabLabel: "Maintenance",
    description:
      "For routine home checks and small repairs booked as a half-day or full-day maintenance visit.",
    pricingHint:
      "Priced by time: half-day or full-day. Materials and replacement parts are charged separately.",
    included: [
      "Door and window hardware checks",
      "Cabinet adjustments",
      "Tap leak checks",
      "Minor wall patch checks",
      "Bathroom seal checks",
      "Gutter check or cleaning where safe",
      "AC filter cleaning",
      "Smoke detector battery checks",
      "Small repairs during booked time",
    ],
    notIncluded: [
      "Major repairs, renovations, or roofing",
      "Full plumbing or electrical rewiring",
      "High-risk work at heights",
      "Specialist appliance repair",
      "Construction work",
    ],
    defaultHours: 4,
    priceHintMin: 350,
    priceHintMax: 700,
  },
];

export const HANDYMAN_ADDONS: ServiceAddonOption[] = [
  {
    id: "bring_tools",
    label: "Bring basic tools",
    description: "Helper arrives with standard hand tools for the visit",
    priceHint: 0,
  },
  {
    id: "buy_parts",
    label: "Buy replacement parts",
    description: "Helper purchases agreed parts and brings receipt",
    priceHint: 80,
  },
  {
    id: "extra_hour",
    label: "Extra hour",
    description: "Book an additional hour if the job may run long",
    priceHint: 100,
  },
  {
    id: "second_helper",
    label: "Second helper",
    description: "Add another worker for heavy or two-person jobs",
    priceHint: 150,
  },
  {
    id: "ladder_required",
    label: "Ladder required",
    description: "Work at height needs a ladder on site or brought by helper",
    priceHint: 50,
  },
  {
    id: "inspection_only",
    label: "Inspection only",
    description:
      "Not sure what is wrong? The helper assesses the issue, advises on parts, and recommends the next step.",
    priceHint: 0,
  },
  {
    id: "weekend_booking",
    label: "Weekend booking",
    description: "Saturday or Sunday visit",
    priceHint: 80,
  },
  {
    id: "urgent_booking",
    label: "Urgent booking",
    description: "Same-day or next-available priority scheduling",
    priceHint: 120,
  },
  {
    id: "photo_report",
    label: "Photo report after work",
    description: "Receive photos and a short summary when the visit ends",
    priceHint: 40,
  },
  {
    id: "dispose_waste",
    label: "Dispose small waste",
    description: "Remove small packaging or job waste after the visit",
    priceHint: 50,
  },
  {
    id: "return_visit",
    label: "Return visit required",
    description: "Reserve time for a follow-up visit after parts are sourced",
    priceHint: 0,
  },
];
