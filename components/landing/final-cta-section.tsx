import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function FinalCtaSection() {
  return (
    <section className="py-16 md:py-20 px-4 bg-foreground text-background">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-10 md:gap-16">
          <div>
            <p className="text-xs font-semibold tracking-[0.2em] uppercase text-primary-light mb-3">
              For families
            </p>
            <h2 className="font-display text-2xl md:text-3xl font-bold mb-4">
              Ready to find trusted help?
            </h2>
            <p className="text-background/70 mb-6 leading-relaxed">
              Browse verified workers or post a full-time role — built for households across Lusaka.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/workers">
                <Button size="lg" className="w-full sm:w-auto bg-primary hover:bg-primary/90">
                  Find a worker
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/jobs">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto border-background/30 text-background bg-transparent hover:bg-background/10"
                >
                  Post a job
                </Button>
              </Link>
            </div>
          </div>

          <div className="md:border-l md:border-background/15 md:pl-10">
            <p className="text-xs font-semibold tracking-[0.2em] uppercase text-primary-light mb-3">
              For workers
            </p>
            <h2 className="font-display text-2xl md:text-3xl font-bold mb-4">
              Want to join TumaHelper?
            </h2>
            <p className="text-background/70 mb-6 leading-relaxed">
              Build your reputation, choose your schedule, and find dignified work across Lusaka.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/onboarding/worker">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto border-background/30 text-background bg-transparent hover:bg-background/10"
                >
                  Apply to join
                </Button>
              </Link>
              <Link href="/register">
                <Button size="lg" className="w-full sm:w-auto bg-white text-foreground hover:bg-white/90">
                  Create account
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
