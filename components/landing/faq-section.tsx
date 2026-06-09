import { SectionHeader } from "./section-header";

const faqs = [
  {
    question: "How are workers verified on TumaHelper?",
    answer:
      "Every worker goes through ID verification (NRC), reference checks with previous employers, and profile review by our team. Top workers can also earn trust scores and verification badges based on completed jobs and customer reviews.",
  },
  {
    question: "Can I book for a one-off clean or hire full-time help?",
    answer:
      "Yes. TumaHelper supports both one-off bookings (express cleans, laundry, babysitting) and full-time placements (live-in nannies, housekeepers, and domestic workers). Browse workers for short-term help or post a job for permanent roles.",
  },
  {
    question: "What if I'm not happy with my worker?",
    answer:
      "Contact us within 48 hours and we'll help you find a replacement. Our goal is to match you with someone who fits your household's needs — whether that's for a single booking or a long-term placement.",
  },
  {
    question: "What's the difference between live-in and live-out help?",
    answer:
      "Live-in workers stay at your home and typically handle broader household duties. Live-out (commuter) workers come for set hours or specific tasks. You can filter by availability and discuss arrangements directly when booking or hiring.",
  },
  {
    question: "How do payments work?",
    answer:
      "Payment terms depend on the type of service — one-off bookings vs monthly full-time arrangements. You'll see clear details before confirming. We're building secure in-app payments; for now, arrangements are agreed between you and your worker with TumaHelper support when needed.",
  },
  {
    question: "Which areas of Lusaka do you cover?",
    answer:
      "We serve households across Lusaka including Kabulonga, Woodlands, Roma, Meanwood, Ibex Hill, Chelstone, and surrounding areas. Use the area filter when browsing workers to find help near you.",
  },
];

export function FaqSection() {
  return (
    <section className="py-16 md:py-20 px-4 bg-white">
      <div className="max-w-3xl mx-auto">
        <SectionHeader
          eyebrow="FAQ"
          title="Questions families ask us"
          description="Everything you need to know before booking or hiring through TumaHelper."
        />

        <div className="space-y-3">
          {faqs.map((faq) => (
            <details
              key={faq.question}
              className="group rounded-xl border border-gray-100 bg-white shadow-sm open:shadow-md transition-shadow"
            >
              <summary className="cursor-pointer list-none px-6 py-4 font-semibold text-foreground flex items-center justify-between gap-4">
                {faq.question}
                <span className="text-primary text-xl leading-none group-open:rotate-45 transition-transform">
                  +
                </span>
              </summary>
              <div className="px-6 pb-5 text-muted-foreground leading-relaxed border-t border-gray-50 pt-4">
                {faq.answer}
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
