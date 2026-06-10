import Link from "next/link";
import { MessageCircle, CalendarCheck, ArrowRight, HeartHandshake } from "lucide-react";

const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "260970000000";
const whatsappHref = `https://wa.me/${whatsappNumber.replace(/\D/g, "")}?text=${encodeURIComponent(
  "Hi TumaHelper, I'm looking for permanent domestic help in Lusaka (full-time nanny / housekeeper / live-in). Can you help?"
)}`;

const STEPS = [
  {
    icon: CalendarCheck,
    title: "Book first",
    body: "Try a verified nanny or cleaner for a visit, or book them regularly.",
  },
  {
    icon: HeartHandshake,
    title: "Build trust",
    body: "See reviews, trust scores, and how they work in your home.",
  },
  {
    icon: ArrowRight,
    title: "Hire permanently",
    body: "When you're ready, we'll help you move to full-time or live-in.",
  },
];

export default function HirePage() {
  return (
    <div className="min-h-screen bg-white">
      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-12 md:py-20">
        <p className="text-sm font-semibold text-primary mb-3 tracking-wide">
          Permanent placements
        </p>
        <h1 className="font-display text-3xl md:text-4xl font-bold text-balance mb-5">
          Need a full-time nanny or housekeeper?
        </h1>
        <p className="text-lg text-muted-foreground leading-relaxed mb-10">
          TumaHelper is built for booking verified help first, then hiring permanently
          when you find the right person. We help Lusaka families with live-in nannies,
          full-time housekeepers, and long-term domestic workers.
        </p>

        <div className="space-y-6 mb-12">
          {STEPS.map(({ icon: Icon, title, body }) => (
            <div key={title} className="flex gap-4 rounded-2xl border border-border p-5">
              <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                <Icon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h2 className="font-semibold mb-1">{title}</h2>
                <p className="text-sm text-muted-foreground leading-relaxed">{body}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="rounded-3xl bg-surface border border-border p-8 space-y-4">
          <h2 className="font-display text-xl font-semibold">Get in touch</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Tell us what you need: area in Lusaka, live-in or live-out, nanny or
            housekeeper. We&apos;ll help you find a match.
          </p>

          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full rounded-full bg-primary text-primary-foreground py-3.5 text-sm font-semibold hover:opacity-95 transition-opacity"
          >
            <MessageCircle className="h-4 w-4" />
            Chat on WhatsApp
          </a>

          <Link
            href="/customer/book"
            className="flex items-center justify-center w-full rounded-full border border-border py-3.5 text-sm font-semibold hover:bg-white transition-colors"
          >
            Or book a visit first
          </Link>
        </div>

        <p className="text-center text-sm text-muted-foreground mt-8">
          <Link href="/" className="text-primary hover:underline">
            ← Back to home
          </Link>
        </p>
      </main>
    </div>
  );
}
