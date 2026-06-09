import Link from "next/link";
import { MessageCircle } from "lucide-react";
import { FAQ_ITEMS } from "@/lib/landing/content";

const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "260970000000";
const whatsappHref = `https://wa.me/${whatsappNumber.replace(/\D/g, "")}?text=${encodeURIComponent("Hi TumaHelper — I need help finding a worker in Lusaka.")}`;

export function LandingFaqCta() {
  return (
    <section className="py-24 md:py-32 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 lg:gap-24">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-accent mb-4">
            FAQ
          </p>
          <h2 className="font-display text-4xl font-semibold mb-10">
            Questions before you book?
          </h2>
          <div className="space-y-2">
            {FAQ_ITEMS.map((item) => (
              <details
                key={item.q}
                className="group border-b border-border py-4"
              >
                <summary className="cursor-pointer list-none font-semibold flex items-center justify-between gap-4">
                  {item.q}
                  <span className="text-accent text-xl group-open:rotate-45 transition-transform shrink-0">
                    +
                  </span>
                </summary>
                <p className="text-muted-foreground leading-relaxed pt-3 pb-1">{item.a}</p>
              </details>
            ))}
          </div>
        </div>

        <div className="lg:pt-12">
          <div className="rounded-[2rem] bg-forest text-cream p-10 md:p-12 h-full flex flex-col justify-between">
            <div>
              <h2 className="font-display text-3xl md:text-4xl font-semibold mb-4 text-balance">
                Ready when you are.
              </h2>
              <p className="text-cream/70 leading-relaxed mb-8">
                Find verified help for your home — or join as a worker and build
                a reputation that opens doors across Lusaka.
              </p>
            </div>

            <div className="space-y-3">
              <Link
                href="/workers"
                className="flex items-center justify-center rounded-2xl bg-accent text-accent-foreground py-4 text-sm font-semibold hover:opacity-95 transition-opacity"
              >
                Find help now
              </Link>
              <Link
                href="/onboarding/worker"
                className="flex items-center justify-center rounded-2xl border border-cream/25 py-4 text-sm font-semibold hover:bg-white/5 transition-colors"
              >
                Apply as a worker
              </Link>
              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 rounded-2xl border border-cream/25 py-4 text-sm font-semibold hover:bg-white/5 transition-colors"
              >
                <MessageCircle className="h-4 w-4" />
                Chat on WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
