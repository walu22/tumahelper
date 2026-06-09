import Link from "next/link";
import { Mail, MessageCircle, Phone } from "lucide-react";

const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "260970000000";
const whatsappMessage = encodeURIComponent(
  "Hi TumaHelper, I'd like help finding a worker in Lusaka."
);
const whatsappHref = `https://wa.me/${whatsappNumber.replace(/\D/g, "")}?text=${whatsappMessage}`;

export function ContactStrip() {
  return (
    <section className="py-10 px-4 bg-gray-900 text-white">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <p className="text-sm text-gray-400 uppercase tracking-wider mb-1">Need help choosing?</p>
          <h2 className="text-xl font-semibold">Talk to us — we&apos;re here for Lusaka families</h2>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#25D366] px-5 py-3 text-sm font-medium text-white hover:bg-[#20bd5a] transition-colors"
          >
            <MessageCircle className="h-4 w-4" />
            Chat on WhatsApp
          </a>
          <a
            href="mailto:hello@tumahelper.com"
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-600 px-5 py-3 text-sm font-medium hover:bg-white/10 transition-colors"
          >
            <Mail className="h-4 w-4" />
            Email us
          </a>
          <Link
            href="/workers"
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-600 px-5 py-3 text-sm font-medium hover:bg-white/10 transition-colors"
          >
            <Phone className="h-4 w-4" />
            Browse workers
          </Link>
        </div>
      </div>
    </section>
  );
}
