import Link from "next/link";
import { MessageCircle } from "lucide-react";
import { FAQ_CTA_INTRO, FAQ_ITEMS, GET_HELP_HREF, HERO_WHATSAPP_MESSAGE } from "@/lib/landing/content";

const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "260970000000";
const whatsappHref = `https://wa.me/${whatsappNumber.replace(/\D/g, "")}?text=${encodeURIComponent(
  HERO_WHATSAPP_MESSAGE
)}`;

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

        <div className="rounded-3xl border border-border bg-card p-8 sm:p-10 shadow-lg flex flex-col justify-center">
          <div className="mb-8">
            <p className="text-sm font-semibold text-primary mb-4 tracking-wide">
              {FAQ_CTA_INTRO.eyebrow}
            </p>
            <h2 className="font-display text-3xl font-bold mb-4 text-balance text-foreground">
              {FAQ_CTA_INTRO.headline}
            </h2>
            <p className="text-muted-foreground leading-relaxed text-balance">
              {FAQ_CTA_INTRO.subtitle}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <Link
              href={GET_HELP_HREF}
              className="flex flex-1 items-center justify-center rounded-full bg-primary text-primary-foreground py-3.5 text-sm font-semibold hover:opacity-95 transition-opacity"
            >
              {FAQ_CTA_INTRO.bookLabel}
            </Link>
            <Link
              href="/workers"
              className="flex flex-1 items-center justify-center rounded-full border border-border py-3.5 text-sm font-semibold hover:bg-surface transition-colors"
            >
              {FAQ_CTA_INTRO.browseLabel}
            </Link>
          </div>

          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 py-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
          >
            <MessageCircle className="h-4 w-4" />
            Prefer WhatsApp? Chat with us
          </a>
        </div>
      </div>
    </section>
  );
}
