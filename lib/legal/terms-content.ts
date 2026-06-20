import type { LegalDocument } from "./types";

export const TERMS_OF_SERVICE: LegalDocument = {
  title: "Terms of Service",
  description:
    "The rules and conditions for using TumaHelper to book or provide home-help services in Lusaka, Zambia.",
  intro: [
    "These Terms of Service (“Terms”) govern your access to and use of the TumaHelper website, mobile experience, and related services (collectively, the “Platform”).",
    "TumaHelper connects households with independent home-help workers. We are a technology platform, not an employer of workers and not the provider of domestic services performed in your home.",
    "By creating an account, browsing profiles, making a booking, or applying as a worker, you agree to these Terms. If you do not agree, do not use the Platform.",
  ],
  sections: [
    {
      id: "eligibility",
      title: "1. Who may use TumaHelper",
      paragraphs: [
        "You must be at least 18 years old and able to enter a binding agreement to use the Platform.",
        "Workers must provide accurate identity and contact information and complete verification steps before accepting paid bookings where required.",
        "Customers must provide accurate booking details, treat workers respectfully, and ensure a safe working environment.",
      ],
    },
    {
      id: "our-role",
      title: "2. TumaHelper’s role",
      paragraphs: [
        "TumaHelper provides tools to discover workers, request bookings, manage schedules, upload payment proof, leave reviews, and access support.",
        "Workers listed on TumaHelper are independent service providers, not employees, agents, or partners of TumaHelper. TumaHelper does not control how workers perform their work beyond platform standards, verification requirements, and community rules.",
        "Except where we explicitly offer a placement or matching service, TumaHelper is not a party to the domestic employment relationship that may arise if you later hire a worker permanently outside the Platform.",
      ],
    },
    {
      id: "accounts",
      title: "3. Accounts and security",
      paragraphs: [
        "You are responsible for maintaining the confidentiality of your login credentials and for all activity under your account.",
        "You agree to provide accurate, current information and to update it when it changes. We may suspend or terminate accounts that contain false information, pose a safety risk, or violate these Terms.",
      ],
    },
    {
      id: "bookings",
      title: "4. Bookings and services",
      paragraphs: [
        "When a customer requests a booking and a worker accepts it, a service agreement is formed directly between the customer and the worker for the described visit or recurring schedule.",
        "Customers are responsible for providing accurate addresses or areas, access instructions, and any information needed to perform the service safely (for example childcare instructions, dietary needs, or cleaning priorities).",
        "Workers are responsible for arriving on time, performing agreed services professionally, and communicating promptly about delays or issues.",
        "TumaHelper may facilitate matching, messaging, and status updates, but we do not guarantee that any worker will be available for a particular date, time, or area.",
      ],
    },
    {
      id: "payments",
      title: "5. Payments and fees",
      paragraphs: [
        "Prices shown on the Platform are estimates or typical ranges unless a final amount is confirmed during booking. The amount due for a completed booking is based on the agreed service, duration, and any applicable platform fees disclosed at checkout.",
        "Customers may pay via supported methods such as Airtel Money or cash as indicated in the booking flow. Where mobile-money payment is used, customers are responsible for completing payment and uploading valid proof when requested.",
        "Workers receive earnings according to completed bookings and platform payout rules shown in the worker dashboard. TumaHelper may deduct disclosed platform fees from worker earnings.",
        "TumaHelper is not responsible for delays, failures, or disputes arising from third-party payment networks, incorrect payment references, or cash arrangements agreed directly between users.",
      ],
    },
    {
      id: "verification",
      title: "6. Verification and profiles",
      paragraphs: [
        "TumaHelper may verify worker identity using NRC checks, reference calls, document review, and other steps before or after a profile goes live.",
        "Verification badges and trust scores are based on information available to us at the time of review and may change over time. They indicate that certain checks were completed, but they are not a guarantee of future performance, character, or suitability for every household.",
        "Customers should still exercise judgment when inviting someone into their home and may report safety concerns through platform support channels.",
      ],
    },
    {
      id: "conduct",
      title: "7. Acceptable use",
      paragraphs: ["You agree not to:"],
      bullets: [
        "Use the Platform for unlawful, harassing, discriminatory, or abusive conduct.",
        "Misrepresent your identity, skills, experience, or availability.",
        "Circumvent the Platform to avoid fees for bookings originally made through TumaHelper.",
        "Upload false payment proof, fake reviews, or misleading documents.",
        "Attempt to access another user’s account or interfere with Platform security.",
        "Solicit users for unrelated commercial activity without our permission.",
      ],
    },
    {
      id: "reviews",
      title: "8. Reviews, trust scores, and disputes",
      paragraphs: [
        "Users may leave reviews after completed bookings. Reviews must be honest and based on actual experience. We may remove or moderate content that is false, abusive, or unrelated to a booking.",
        "If a booking does not go as planned, contact the other party promptly and use TumaHelper support or dispute tools where available. We may investigate disputes and take action including refunds, account restrictions, or removal from the Platform where appropriate.",
      ],
    },
    {
      id: "cancellations",
      title: "9. Cancellations and no-shows",
      paragraphs: [
        "Cancellation and rescheduling rules may vary by service type and are shown during booking or in booking details. Late cancellations or repeated no-shows may result in fees, reduced visibility, or account restrictions.",
        "Customers should provide reasonable notice when cancelling. Workers should notify customers as early as possible if they cannot attend a confirmed booking.",
      ],
    },
    {
      id: "liability",
      title: "10. Disclaimers and limitation of liability",
      paragraphs: [
        "The Platform is provided on an “as is” and “as available” basis. To the fullest extent permitted by law, TumaHelper disclaims warranties of merchantability, fitness for a particular purpose, and non-infringement.",
        "TumaHelper is not liable for acts or omissions of workers or customers, property damage, personal injury, theft, childcare incidents, or disputes arising from services performed in a home, except where liability cannot be excluded under applicable law.",
        "To the fullest extent permitted by law, TumaHelper’s total liability for any claim arising out of or relating to the Platform or these Terms is limited to the greater of (a) the platform fees you paid to TumaHelper in the three months before the event giving rise to the claim, or (b) ZMW 500.",
      ],
    },
    {
      id: "indemnity",
      title: "11. Indemnity",
      paragraphs: [
        "You agree to indemnify and hold harmless TumaHelper, its operators, and affiliates from claims, losses, and expenses (including reasonable legal fees) arising from your use of the Platform, your bookings or services, your violation of these Terms, or your violation of another person’s rights.",
      ],
    },
    {
      id: "termination",
      title: "12. Suspension and termination",
      paragraphs: [
        "You may stop using the Platform at any time. We may suspend or terminate access if we reasonably believe you violated these Terms, created safety risks, or engaged in fraud or abuse.",
        "Sections that by their nature should survive termination — including payment obligations, disclaimers, limitation of liability, and indemnity — will continue to apply.",
      ],
    },
    {
      id: "governing-law",
      title: "13. Governing law",
      paragraphs: [
        "These Terms are governed by the laws of the Republic of Zambia, without regard to conflict-of-law principles. Disputes that cannot be resolved informally may be brought in the courts of Zambia, subject to any mandatory consumer protections that apply to you.",
      ],
    },
    {
      id: "changes",
      title: "14. Changes to these Terms",
      paragraphs: [
        "We may update these Terms from time to time. We will post the revised version on this page and update the “Last updated” date. Material changes may also be communicated through the Platform or by email where appropriate. Continued use after changes take effect constitutes acceptance of the updated Terms.",
      ],
    },
    {
      id: "contact",
      title: "15. Contact",
      paragraphs: [
        "Questions about these Terms can be sent to hello@tumahelper.com or to TumaHelper in Lusaka, Zambia.",
      ],
    },
  ],
};
