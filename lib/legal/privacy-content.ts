import type { LegalDocument } from "./types";

export const PRIVACY_POLICY: LegalDocument = {
  title: "Privacy Policy",
  description:
    "How TumaHelper collects, uses, and protects personal information when you use our platform in Lusaka, Zambia.",
  intro: [
    "TumaHelper (“we”, “us”, or “our”) operates a marketplace that connects households in Lusaka with verified home-help workers, including nannies, cleaners, housekeepers, cooks, and related services.",
    "This Privacy Policy explains what personal information we collect, how we use it, who we share it with, and the choices you have. By creating an account, making a booking, or otherwise using TumaHelper, you agree to the practices described here.",
    "If you have questions about this policy or your data, contact us at hello@tumahelper.com.",
  ],
  sections: [
    {
      id: "information-we-collect",
      title: "1. Information we collect",
      paragraphs: [
        "We collect information needed to run the platform, verify workers, process bookings, and keep users safe. The information we collect depends on how you use TumaHelper.",
      ],
      bullets: [
        "Account details: name, phone number, email address, password or one-time login codes, and account role (customer, worker, employer, or admin).",
        "Profile information: area in Lusaka, skills, availability, work history, profile photo, bio, salary or rate preferences, and other details you choose to add.",
        "Verification documents (workers): National Registration Card (NRC) details and uploaded identity documents, reference contact information, and verification status.",
        "Booking information: service type, address or area, schedule, special instructions, selected worker, booking status, and communications related to a job.",
        "Payment information: payment method selected (for example Airtel Money or cash), payment status, transaction references, and payment proof images you upload. We do not store full mobile-money PINs or bank card numbers on our servers.",
        "Reviews and trust data: ratings, reviews, trust scores, dispute reports, and moderation notes.",
        "Usage and device data: pages visited, actions taken in the app, approximate location derived from your area selection, browser or device type, IP address, and cookies or similar technologies used for sign-in and preferences (such as theme settings).",
        "Support communications: messages you send us by email, WhatsApp, or in-app support channels.",
      ],
    },
    {
      id: "how-we-use-information",
      title: "2. How we use your information",
      paragraphs: ["We use personal information for the following purposes:"],
      bullets: [
        "Create and manage your account and authenticate you securely.",
        "Display worker profiles to customers and share limited booking details with matched workers.",
        "Verify worker identity and references before profiles go live.",
        "Process bookings, payments, cancellations, and customer support requests.",
        "Calculate trust scores, show reviews, and investigate disputes or safety concerns.",
        "Send service-related messages such as booking updates, verification reminders, and payment confirmations.",
        "Improve platform reliability, prevent fraud, and enforce our Terms of Service.",
        "Comply with legal obligations and respond to lawful requests.",
      ],
    },
    {
      id: "legal-bases",
      title: "3. Legal bases for processing",
      paragraphs: [
        "Where applicable under Zambian data protection law, we rely on one or more of the following bases: performance of a contract (for example to complete a booking you request), legitimate interests (such as fraud prevention, platform security, and service improvement), consent (where you opt in to optional communications), and legal obligation.",
        "You may withdraw consent for optional processing at any time by contacting us, though this will not affect processing that is required to provide core platform services.",
      ],
    },
    {
      id: "sharing",
      title: "4. When we share information",
      paragraphs: [
        "We do not sell your personal information. We share information only as needed to operate TumaHelper:",
      ],
      bullets: [
        "Between customers and workers: when you book or accept a job, each party may see relevant profile and booking details such as name, contact method, service area, schedule, and instructions needed to complete the visit.",
        "Service providers: hosting, database, authentication, file storage, analytics, SMS delivery, and payment-related infrastructure providers that process data on our behalf under contractual safeguards. Our platform uses providers such as Supabase and Vercel.",
        "Verification and safety partners: where needed to verify identity, references, or investigate reported misconduct.",
        "Legal and safety disclosures: if required by law, court order, or to protect the rights, safety, and security of users, workers, or the public.",
        "Business transfers: if TumaHelper is involved in a merger, acquisition, or asset sale, information may transfer as part of that transaction subject to this policy.",
      ],
    },
    {
      id: "retention",
      title: "5. How long we keep information",
      paragraphs: [
        "We keep personal information only for as long as necessary for the purposes described in this policy, including to meet legal, accounting, and dispute-resolution requirements.",
        "Account and booking records are generally retained while your account is active and for a reasonable period afterward. Verification documents may be retained for compliance and safety purposes. You may request deletion of your account subject to limits described in section 7.",
      ],
    },
    {
      id: "security",
      title: "6. Security",
      paragraphs: [
        "We use technical and organizational measures designed to protect personal information, including encrypted connections (HTTPS), access controls, and restricted access to sensitive documents such as NRC uploads.",
        "No online service can guarantee absolute security. Please use a strong password, keep your phone secure, and contact us immediately if you suspect unauthorized access to your account.",
      ],
    },
    {
      id: "your-rights",
      title: "7. Your choices and rights",
      paragraphs: [
        "Depending on applicable law, you may have the right to request access to, correction of, or deletion of your personal information, to object to or restrict certain processing, and to withdraw consent where processing is consent-based.",
        "You can update much of your profile information directly in the app. For other requests, email hello@tumahelper.com. We may need to verify your identity before responding.",
        "We may retain certain information where required by law or for legitimate business purposes such as fraud prevention, unresolved disputes, or completed booking records.",
      ],
    },
    {
      id: "children",
      title: "8. Children’s privacy",
      paragraphs: [
        "TumaHelper is intended for adults aged 18 and over. We do not knowingly collect personal information from children. If you believe a child has provided us personal information, contact us and we will take appropriate steps to delete it.",
        "Customers may book childcare services through the platform, but accounts must be created and managed by adults responsible for the booking.",
      ],
    },
    {
      id: "international",
      title: "9. International data processing",
      paragraphs: [
        "TumaHelper is based in Zambia. Some of our service providers may process or store information in other countries. When information is transferred outside Zambia, we take steps designed to ensure it remains protected in line with this policy and applicable law.",
      ],
    },
    {
      id: "changes",
      title: "10. Changes to this policy",
      paragraphs: [
        "We may update this Privacy Policy from time to time. When we make material changes, we will post the updated version on this page and update the “Last updated” date. Continued use of TumaHelper after changes take effect means you accept the revised policy.",
      ],
    },
    {
      id: "contact",
      title: "11. Contact us",
      paragraphs: [
        "For privacy questions or requests, contact TumaHelper at hello@tumahelper.com or write to us in Lusaka, Zambia.",
      ],
    },
  ],
};
