import { MapPin, Shield, Star } from "lucide-react";

export function ProductMoment() {
  return (
    <section className="py-24 md:py-32 px-4 sm:px-6 lg:px-8 bg-forest text-cream landing-grain overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-accent mb-4">
            The platform
          </p>
          <h2 className="font-display text-4xl md:text-5xl font-semibold text-balance">
            Every profile tells you who you&apos;re inviting in.
          </h2>
        </div>

        <div className="relative max-w-4xl mx-auto">
          <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full scale-75" />

          <div className="relative grid md:grid-cols-5 gap-4 md:gap-0 md:items-stretch">
            {/* Profile card */}
            <div className="md:col-span-3 bg-white text-foreground rounded-3xl p-6 md:p-8 shadow-2xl md:rounded-r-none md:my-4">
              <div className="flex items-start gap-4 mb-6">
                <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center font-display text-2xl font-semibold text-primary">
                  SM
                </div>
                <div className="flex-1">
                  <h3 className="font-display text-2xl font-semibold">Sarah Mulenga</h3>
                  <p className="text-muted-foreground text-sm flex items-center gap-1 mt-1">
                    <MapPin className="h-3.5 w-3.5" />
                    Kabulonga, Lusaka
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-display text-3xl font-semibold text-primary">92</p>
                  <p className="text-xs text-muted-foreground">Trust score</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-6">
                <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                  <Shield className="h-3 w-3" />
                  Gold verified
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
                  <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                  4.9 · 24 reviews
                </span>
              </div>

              <div className="grid grid-cols-3 gap-3 mb-6">
                {[
                  { label: "Jobs done", value: "47" },
                  { label: "Response", value: "< 2hr" },
                  { label: "Since", value: "2024" },
                ].map((item) => (
                  <div key={item.label} className="rounded-xl bg-surface p-3 text-center">
                    <p className="font-semibold text-lg">{item.value}</p>
                    <p className="text-xs text-muted-foreground">{item.label}</p>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap gap-2">
                {["Deep cleaning", "Laundry", "Live-out", "Childcare"].map((skill) => (
                  <span
                    key={skill}
                    className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Booking panel */}
            <div className="md:col-span-2 bg-primary text-primary-foreground rounded-3xl p-6 md:p-8 shadow-2xl md:rounded-l-none md:my-0 flex flex-col justify-center">
              <p className="text-xs font-semibold uppercase tracking-wider text-primary-foreground/70 mb-6">
                Quick book
              </p>
              <div className="space-y-3 mb-8">
                {[
                  { label: "Service", value: "House cleaning" },
                  { label: "When", value: "Sat 14 Jun · 8:00 AM" },
                  { label: "Duration", value: "4 hours" },
                  { label: "From", value: "K250" },
                ].map((row) => (
                  <div
                    key={row.label}
                    className="flex justify-between text-sm border-b border-white/15 pb-3"
                  >
                    <span className="text-primary-foreground/70">{row.label}</span>
                    <span className="font-semibold">{row.value}</span>
                  </div>
                ))}
              </div>
              <div className="rounded-2xl bg-white text-primary text-center py-4 font-semibold text-sm">
                Confirm booking →
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
