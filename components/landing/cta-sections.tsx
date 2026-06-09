import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ProviderCtaSection() {
  return (
    <section className="py-20 px-4 bg-gray-900 text-white">
      <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-10 items-center">
        <div>
          <p className="text-xs font-semibold tracking-[0.2em] uppercase text-primary-light mb-3">
            For workers
          </p>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Want to work with TumaHelper?
          </h2>
          <p className="text-gray-300 text-lg leading-relaxed">
            Become your own boss, choose your own schedule, and work in your preferred
            areas across Lusaka.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row lg:justify-end gap-4">
          <Link href="/onboarding/worker">
            <Button size="lg" className="w-full sm:w-auto bg-primary hover:bg-primary/90">
              Apply to join
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
          <Link href="/jobs">
            <Button
              size="lg"
              variant="outline"
              className="w-full sm:w-auto border-gray-600 text-white bg-transparent hover:bg-white/10"
            >
              Browse jobs
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}

export function CustomerCtaSection() {
  return (
    <section className="py-20 px-4 bg-primary text-white">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to find your perfect match?</h2>
        <p className="text-green-100 mb-8 text-lg">
          Join families across Lusaka who trust TumaHelper for home help.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/workers">
            <Button size="lg" className="bg-white text-primary hover:bg-gray-100 shadow-lg">
              Find a worker
            </Button>
          </Link>
          <Link href="/jobs">
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white bg-white/10 hover:bg-white/20"
            >
              Post a job
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
