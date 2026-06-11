import Link from "next/link";
import { MessageCircle } from "lucide-react";
import { CLEANING_BOOK_HREF, FAQ_ITEMS, NANNY_BOOK_HREF } from "@/lib/landing/content";

const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "260970000000";
const whatsappHref = `https://wa.me/${whatsappNumber.replace(/\D/g, "")}?text=${encodeURIComponent("Hi TumaHelper, I need help finding a worker in Lusaka.")}`;

export function LandingFaqCta() {
  return (
    <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 bg-surface border-t border-border">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 lg:gap-20">
        <div>
          <h2 className="font-display text-3xl font-bold mb-8">
            Questions before you book?
          </h2>
          <div className="space-y-1">
            {FAQ_ITEMS.map((item) => (
              <details
                key={item.q}
                className="group border-b border-border py-4"
              >
                <summary className="cursor-pointer list-none font-semibold flex items-center justify-between gap-4">
                  {item.q}
                  <span className="text-primary text-xl group-open:rotate-45 transition-transform shrink-0">
                    +
                  </span>
                </summary>
                <p className="text-muted-foreground leading-relaxed pt-3 pb-1">{item.a}</p>
              </details>
            ))}
          </div>
        </div>

        <div className="rounded-3xl bg-primary text-primary-foreground p-10 flex flex-col justify-between">
          <div>
            <h2 className="font-display text-3xl font-bold mb-4 text-balance">
              Ready when you are.
            </h2>
            <p className="text-primary-foreground/80 leading-relaxed mb-8">
              Find verified help for your home, or join as a worker and build
              a reputation that opens doors across Lusaka.
            </p>
          </div>

          <div className="space-y-3">
            <Link
              href={NANNY_BOOK_HREF}
              className="flex items-center justify-center rounded-full bg-white text-primary py-3.5 text-sm font-semibold hover:opacity-95 transition-opacity"
            >
              Book a nanny
            </Link>
            <Link
              href={CLEANING_BOOK_HREF}
              className="flex items-center justify-center rounded-full border border-white/30 py-3.5 text-sm font-semibold hover:bg-white/10 transition-colors"
            >
              Book cleaning
            </Link>
            <Link
              href="/register?role=worker"
              className="flex items-center justify-center rounded-full border border-white/30 py-3.5 text-sm font-semibold hover:bg-white/10 transition-colors"
            >
              Apply as a worker
            </Link>
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 rounded-full border border-white/30 py-3.5 text-sm font-semibold hover:bg-white/10 transition-colors"
            >
              <MessageCircle className="h-4 w-4" />
              Chat on WhatsApp
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
