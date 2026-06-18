export const AIRBNB_SCOPE_PITCH =
  "We clean your short-stay property so the next guest can walk in to a fresh space. Rooms are sanitised and reset to a turnover standard, aligned with Airbnb's enhanced cleaning and reset guidance.";

export interface AirbnbScopeSection {
  id: string;
  title: string;
  subtitle?: string;
  items: string[];
}

export const AIRBNB_SCOPE_SECTIONS: AirbnbScopeSection[] = [
  {
    id: "living-room",
    title: "Living room",
    subtitle: "General cleaning plus a tidy, guest-ready finish:",
    items: [
      "Dust furniture, shelves, and decorative items",
      "Vacuum carpets and mop hard floors",
      "Wipe skirting boards",
      "Remove guest belongings and clear rubbish",
    ],
  },
  {
    id: "kitchen",
    title: "Kitchen",
    subtitle: "Full kitchen reset:",
    items: [
      "Wipe worktops, sinks, taps, and appliance fronts",
      "Wash dishes and put them away, or load and run the dishwasher",
      "Clean the outside of cupboards, fridge, oven, and dishwasher",
      "Wipe walls, splashbacks, and handles where needed",
      "Clean inside the microwave and wipe kettle, toaster, and coffee machine (if you request this on booking)",
      "Empty bins and clean around the bin area",
      "Mop the floor",
      "Remove food left behind by guests",
      "Top up items you already keep at the property (tea, coffee, sugar, washing up liquid, dishwasher tablets, paper towels) if you request this on booking",
    ],
  },
  {
    id: "bedrooms",
    title: "Bedrooms",
    subtitle: "Bedroom turnover:",
    items: [
      "Dust furniture and surfaces",
      "Strip used bedding",
      "Remake beds with fresh linen you provide on site",
      "Vacuum and mop floors",
      "Wipe skirting boards",
      "Check under beds and inside cupboards for items guests may have left",
      "Straighten furniture and soft furnishings",
    ],
  },
  {
    id: "bathrooms",
    title: "Bathrooms",
    subtitle: "Clean and sanitise:",
    items: [
      "Scrub and disinfect shower, bath, basin, and taps",
      "Deep clean the toilet",
      "Wipe counters, shelves, and mirrors",
      "Wipe walls and frequent touch points",
      "Wipe the outside of cupboards and bathroom cabinets",
      "Empty bins and mop floors",
      "Replace towels with clean sets you provide, folded or hung neatly",
      "Replace toilet paper",
      "Refill toiletries you stock on site (soap, shampoo, conditioner, body wash) if you request this on booking",
    ],
  },
  {
    id: "extras",
    title: "Extras",
    items: [
      "Share your laundry preference when you book: wash, dry, and repack linen and towels, or place used laundry in the basket you designate.",
      "Book enough time if you want laundry handled as part of the visit.",
    ],
  },
];

export const AIRBNB_SCOPE_NOT_INCLUDED: string[] = [
  "Checking or replacing missing inventory (for example cutlery, mugs, or glasses)",
  "Buying extra supplies. We only refill what is already at the property",
  "Key handover, guest messaging, or welcome packs",
  "Exterior windows and outdoor areas",
];
