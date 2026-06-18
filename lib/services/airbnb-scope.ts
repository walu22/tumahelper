export const AIRBNB_SCOPE_PITCH =
  "A specialised clean that gets your property guest-ready quickly and professionally. We follow hospitality standards, including Airbnb's enhanced cleaning, sanitising, and resetting guidelines.";

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
    subtitle: "Includes all general cleaning plus guest-ready presentation:",
    items: [
      "Dust all furniture, décor, and surfaces",
      "Vacuum and/or mop floors",
      "Dust and wipe skirtings",
      "Check for and remove any guest items or rubbish",
    ],
  },
  {
    id: "kitchen",
    title: "Kitchen",
    subtitle: "Clean and full reset:",
    items: [
      "Wipe down all counters, sinks, taps, and appliances",
      "Wash and pack away all dishes (or load and run dishwasher)",
      "Wipe exterior of cupboards, fridge, oven, and dishwasher",
      "Spot-clean walls, splashbacks, and high-touch areas",
      "Clean inside microwave, kettle exterior, toaster, and coffee machine (if requested on booking)",
      "Empty bins and clean the bin area",
      "Mop floors",
      "Remove leftover food items from guests",
      "Restock kitchen consumables you keep on site (tea, coffee, sugar, dishwashing liquid, pods/tablets, paper towels — if requested on booking)",
    ],
  },
  {
    id: "bedrooms",
    title: "Bedrooms",
    subtitle: "Hotel-style reset:",
    items: [
      "Dust all furniture and surfaces",
      "Strip beds and remove used linen",
      "Remake beds with fresh, correctly fitted linen you provide on site",
      "Vacuum and/or mop floors",
      "Dust and wipe skirtings",
      "Remove guest items or rubbish; check under the bed and inside cupboards for left-behind belongings",
      "Ensure décor and furniture are neatly arranged",
    ],
  },
  {
    id: "bathrooms",
    title: "Bathrooms",
    subtitle: "Sanitisation and presentation:",
    items: [
      "Clean and disinfect shower, bath, basin, and all taps",
      "Thorough toilet clean",
      "Wipe counters, shelves, and mirrors",
      "Spot-clean walls and high-touch areas",
      "Wipe outside of cupboards and bathroom cabinets",
      "Empty bins and clean bin area",
      "Mop floors",
      "Replace towels with clean, neatly folded or hung sets you provide",
      "Restock toilet paper",
      "Restock toiletries you keep on site (soap, shampoo, conditioner, body wash — if requested on booking)",
    ],
  },
  {
    id: "extras",
    title: "Extras",
    items: [
      "Specify laundry preferences when booking. Let us know whether you would like the cleaner to wash, dry, and repack linen/towels, or simply place used laundry in the designated basket.",
      "Book enough time to cover laundry if you select it as an add-on.",
    ],
  },
];

export const AIRBNB_SCOPE_NOT_INCLUDED: string[] = [
  "Checking or replacing missing inventory items (e.g. utensils, mugs, glasses)",
  "Providing or purchasing extra supplies — we can only restock items already available in the property",
  "Key exchange, guest messaging, or welcome packs",
  "Exterior windows or outdoor areas",
];
