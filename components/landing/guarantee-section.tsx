import Link from "next/link";
import { RefreshCw, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

export function GuaranteeSection() {
  return (
    <section className="py-16 px-4 bg-primary/5 border-y border-primary/10">
      <div className="max-w-6xl mx-auto">
        <div className="rounded-2xl bg-white border border-primary/15 p-8 md:p-10 shadow-sm grid md:grid-cols-[1fr_auto] gap-8 items-center">
          <div className="flex gap-5">
            <div className="hidden sm:flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-primary/10">
              <RefreshCw className="h-7 w-7 text-primary" />
            </div>
            <div>
              <div className="inline-flex items-center gap-2 text-primary text-sm font-semibold mb-2">
                <ShieldCheck className="h-4 w-4" />
                TumaHelper Guarantee
              </div>
              <h2 className="text-2xl md:text-3xl font-bold mb-3">
                Not the right match? We&apos;ll help you find a replacement.
              </h2>
              <p className="text-muted-foreground leading-relaxed max-w-2xl">
                If your booking or placement isn&apos;t working out, contact our team within
                48 hours and we&apos;ll help you find a better fit — because your peace of mind
                matters as much as getting the job done.
              </p>
            </div>
          </div>
          <Link href="/workers" className="md:justify-self-end">
            <Button size="lg" className="w-full md:w-auto">
              Browse verified workers
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
