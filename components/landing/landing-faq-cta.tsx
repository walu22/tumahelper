import Link from "next/link";
import { ArrowRight, MessageCircle, Sparkles, UserPlus } from "lucide-react";
import {
  CLEANING_BOOK_HREF,
  COOKING_BOOK_HREF,
  FAQ_ITEMS,
  GET_HELP_HREF,
  HOUSEKEEPING_BOOK_HREF,
  NANNY_BOOK_HREF,
} from "@/lib/landing/content";

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

        <div className="rounded-3xl border border-border bg-card p-8 sm:p-10 shadow-lg">
          <div className="mb-8">
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-primary mb-4">
              Get started
            </p>
            <h2 className="font-display text-3xl font-bold mb-4 text-balance text-foreground">
              Ready when you are.
            </h2>
            <p className="text-muted-foreground leading-relaxed text-balance">
              Find verified help for your home, or join as a worker and build
              a reputation that opens doors across Lusaka.
            </p>
          </div>

          <div className="space-y-5">
            <div className="rounded-2xl border border-border bg-surface p-5">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="h-4 w-4 text-sweep-pink" />
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  For your home
                </p>
              </div>
              <div className="grid sm:grid-cols-2 gap-3">
                <Link
                  href={GET_HELP_HREF}
                  className="flex items-center justify-center rounded-full bg-primary text-primary-foreground py-3.5 text-sm font-semibold hover:opacity-95 transition-opacity sm:col-span-2"
                >
                  Choose a service
                </Link>
                <Link
                  href={NANNY_BOOK_HREF}
                  className="flex items-center justify-center rounded-full border border-border py-3.5 text-sm font-semibold hover:bg-surface transition-colors"
                >
                  Book a nanny
                </Link>
                <Link
                  href={CLEANING_BOOK_HREF}
                  className="flex items-center justify-center rounded-full border border-border py-3.5 text-sm font-semibold hover:bg-surface transition-colors"
                >
                  Book cleaning
                </Link>
                <Link
                  href={HOUSEKEEPING_BOOK_HREF}
                  className="flex items-center justify-center rounded-full border border-border py-3.5 text-sm font-semibold hover:bg-surface transition-colors"
                >
                  Book housekeeping
                </Link>
                <Link
                  href={COOKING_BOOK_HREF}
                  className="flex items-center justify-center rounded-full border border-border py-3.5 text-sm font-semibold hover:bg-surface transition-colors"
                >
                  Book cooking
                </Link>
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-surface p-5">
              <div className="flex items-center gap-2 mb-4">
                <UserPlus className="h-4 w-4 text-primary" />
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  For workers
                </p>
              </div>
              <Link
                href="/register?role=worker"
                className="flex items-center justify-center gap-2 rounded-full bg-sweep-pink text-foreground py-3.5 text-sm font-semibold hover:opacity-95 transition-opacity"
              >
                Apply as a worker
                <ArrowRight className="h-4 w-4" />
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
      </div>
    </section>
  );
}
