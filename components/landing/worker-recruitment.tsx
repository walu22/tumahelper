import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function WorkerRecruitment() {
  return (
    <section className="py-16 md:py-20 px-4 sm:px-6 lg:px-8 bg-surface border-t border-border">
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
          Are you a nanny or housekeeper in Lusaka?
        </h2>
        <p className="text-muted-foreground leading-relaxed max-w-xl mx-auto mb-8">
          Join TumaHelper, get verified, set your availability, and receive bookings
          from families who respect your work.
        </p>
        <Link
          href="/register?role=worker"
          className="inline-flex items-center justify-center gap-2 rounded-full bg-sweep-pink text-foreground px-10 py-4 text-sm font-semibold hover:opacity-95 transition-opacity"
        >
          Apply as a worker
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}
