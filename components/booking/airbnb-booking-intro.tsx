import { CheckCircle2, Clock, Home, Sparkles } from "lucide-react";

const TRUST_POINTS = [
  {
    icon: Home,
    text: "Between-guest cleans for Airbnb and short-stay homes",
  },
  {
    icon: CheckCircle2,
    text: "Beds remade, bathrooms reset, kitchen & floors guest-ready",
  },
  {
    icon: Clock,
    text: "Schedule around check-out and your next guest arrival",
  },
  {
    icon: Sparkles,
    text: "Choose a verified cleaner. Book once or set up regular cleans",
  },
] as const;

export function AirbnbBookingIntro() {
  return (
    <div className="rounded-2xl border border-primary/15 bg-gradient-to-br from-primary/8 via-card to-card p-6 sm:p-8 mb-6">
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary mb-3">
        Short-stay cleaning
      </p>
      <h2 className="font-display text-xl sm:text-2xl font-bold text-balance leading-snug mb-2">
        Between-guest clean for your property
      </h2>
      <p className="text-sm text-muted-foreground leading-relaxed max-w-2xl mb-6">
        Tell us about your property, pick add-ons if needed, and choose when the clean should
        happen, then select a verified cleaner in Lusaka.
      </p>
      <ul className="grid sm:grid-cols-2 gap-3">
        {TRUST_POINTS.map(({ icon: Icon, text }) => (
          <li key={text} className="flex items-start gap-2.5 text-sm text-muted-foreground">
            <Icon className="h-4 w-4 text-primary shrink-0 mt-0.5" />
            <span className="leading-relaxed">{text}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
