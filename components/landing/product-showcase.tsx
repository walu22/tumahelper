import Image from "next/image";
import Link from "next/link";
import { Calendar, MapPin, Shield, Star } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ProductShowcase() {
  return (
    <section className="py-16 md:py-24 px-4 bg-white overflow-hidden">
      <div className="max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div>
            <p className="text-xs font-semibold tracking-[0.2em] uppercase text-primary mb-3">
              See how it works
            </p>
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-5">
              Browse profiles. Book with confidence.
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed mb-8">
              Every worker has a verified profile with trust scores, reviews, and skills —
              so you know exactly who you&apos;re inviting into your home.
            </p>

            <ol className="space-y-4 mb-8">
              {[
                "Search by service, area, and availability",
                "Compare trust scores and read family reviews",
                "Book in a few taps — express or full-time",
              ].map((step, i) => (
                <li key={step} className="flex items-start gap-4">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-bold">
                    {i + 1}
                  </span>
                  <span className="pt-1 text-foreground">{step}</span>
                </li>
              ))}
            </ol>

            <Link href="/workers">
              <Button size="lg">Explore worker profiles</Button>
            </Link>
          </div>

          <div className="relative">
            <div className="absolute -inset-4 bg-primary/5 rounded-3xl blur-2xl" />
            <div className="relative space-y-4">
              {/* Worker profile mock */}
              <div className="rounded-2xl border border-border bg-white shadow-xl p-5 md:p-6">
                <div className="flex items-start gap-4">
                  <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full bg-primary/10">
                    <Image
                      src="/images/cleaning-service.jpg"
                      alt=""
                      fill
                      className="object-cover"
                      sizes="64px"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="font-display font-bold text-lg">Sarah Mulenga</h3>
                        <p className="text-sm text-muted-foreground flex items-center gap-1 mt-0.5">
                          <MapPin className="h-3.5 w-3.5" />
                          Kabulonga, Lusaka
                        </p>
                      </div>
                      <span className="shrink-0 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
                        92 Trust
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-3 mt-3 text-sm">
                      <span className="inline-flex items-center gap-1">
                        <Star className="h-4 w-4 text-amber-400 fill-amber-400" />
                        <strong>4.9</strong>
                        <span className="text-muted-foreground">(24 reviews)</span>
                      </span>
                      <span className="inline-flex items-center gap-1 text-primary">
                        <Shield className="h-4 w-4" />
                        Gold verified
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 mt-4">
                  {["Deep cleaning", "Laundry", "Live-out"].map((skill) => (
                    <span
                      key={skill}
                      className="rounded-full bg-surface px-3 py-1 text-xs font-medium text-foreground"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Booking mock */}
              <div className="rounded-2xl border border-border bg-surface shadow-lg p-5 md:p-6 ml-4 md:ml-8">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">
                  Quick booking
                </p>
                <div className="space-y-3 mb-5">
                  <div className="flex items-center justify-between rounded-lg bg-white border border-border px-4 py-3 text-sm">
                    <span className="text-muted-foreground">Service</span>
                    <span className="font-medium">House cleaning</span>
                  </div>
                  <div className="flex items-center justify-between rounded-lg bg-white border border-border px-4 py-3 text-sm">
                    <span className="text-muted-foreground flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      Date
                    </span>
                    <span className="font-medium">Sat, 14 Jun · 8:00 AM</span>
                  </div>
                  <div className="flex items-center justify-between rounded-lg bg-white border border-border px-4 py-3 text-sm">
                    <span className="text-muted-foreground">Duration</span>
                    <span className="font-medium">4 hours · From K250</span>
                  </div>
                </div>
                <div className="rounded-lg bg-primary text-primary-foreground text-center py-3 text-sm font-semibold">
                  Confirm booking
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
