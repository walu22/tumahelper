import Image from "next/image";
import { Sparkles } from "lucide-react";

export function ComingSoonScreen() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_hsl(var(--primary)/0.12),_transparent_55%)]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -right-24 top-24 h-72 w-72 rounded-full bg-accent/20 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -left-16 bottom-16 h-64 w-64 rounded-full bg-primary/10 blur-3xl"
        aria-hidden
      />

      <div className="relative mx-auto flex min-h-screen max-w-3xl flex-col items-center justify-center px-6 py-16 text-center">
        <div className="mb-8 flex items-center gap-3">
          <Image src="/logo.svg" alt="" width={44} height={44} priority />
          <span className="font-display text-2xl font-bold tracking-tight text-foreground">
            TumaHelper
          </span>
        </div>

        <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary">
          <Sparkles className="h-4 w-4" aria-hidden />
          Coming soon
        </div>

        <h1 className="font-display text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
          Home help in Lusaka, without the stress.
        </h1>

        <p className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
          Soon you&apos;ll be able to book verified helpers for cleaning, childcare, cooking,
          laundry, garden work, and home repairs all in one place.
        </p>

        <p className="mt-10 text-sm text-muted-foreground">
          Launching soon in Lusaka, Zambia.
        </p>
      </div>
    </div>
  );
}
