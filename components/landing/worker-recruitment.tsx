import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { WORKER_RECRUITMENT_INTRO } from "@/lib/landing/content";

export function WorkerRecruitment() {
  return (
    <section className="py-12 md:py-16 px-4 sm:px-6 lg:px-8 border-t border-border">
      <div className="max-w-2xl mx-auto text-center">
        <h2 className="font-display text-2xl md:text-3xl font-bold mb-3 text-balance">
          {WORKER_RECRUITMENT_INTRO.headline}
        </h2>
        <p className="text-muted-foreground leading-relaxed mb-6">
          {WORKER_RECRUITMENT_INTRO.subtitle}
        </p>
        <Link
          href="/register?role=worker"
          className="inline-flex items-center justify-center gap-2 rounded-full bg-sweep-pink text-foreground px-8 py-3.5 text-sm font-semibold hover:opacity-95 transition-opacity"
        >
          {WORKER_RECRUITMENT_INTRO.ctaLabel}
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}
