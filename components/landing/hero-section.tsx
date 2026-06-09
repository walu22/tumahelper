import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Baby, Briefcase, Home, Sparkles } from "lucide-react";

const quickLinks = [
  {
    href: "/nannies",
    icon: Baby,
    title: "Nanny Services",
    description: "Childcare, babysitting, and live-in support",
  },
  {
    href: "/house-cleaners",
    icon: Home,
    title: "House Cleaning",
    description: "Deep cleans, laundry, and regular upkeep",
  },
  {
    href: "/jobs",
    icon: Briefcase,
    title: "Full-Time Jobs",
    description: "Hire permanent help for your home",
  },
];

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary-dark via-primary to-primary-light text-white">
      <div className="absolute inset-0 opacity-20">
        <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-white/30 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-64 w-64 rounded-full bg-emerald-900/40 blur-3xl" />
      </div>

      <div className="relative max-w-6xl mx-auto px-4 py-20 md:py-28">
        <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-sm mb-6">
              <Sparkles className="h-4 w-4" />
              Trusted home help in Lusaka
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              All the help your home needs.
            </h1>

            <p className="text-lg md:text-xl text-green-50/90 max-w-xl mb-8 leading-relaxed">
              Whether you need a quick clean or full-time help, TumaHelper connects
              you with reliable, vetted professionals you can trust.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-10">
              <Link href="/jobs">
                <Button size="lg" className="w-full sm:w-auto bg-white text-primary hover:bg-gray-100 shadow-lg">
                  Find Full-Time Help
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/workers">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto border-white/40 text-white bg-white/10 hover:bg-white/20"
                >
                  Book a Worker
                </Button>
              </Link>
            </div>

            <p className="text-sm text-green-100/80">
              Are you a worker?{" "}
              <Link href="/onboarding/worker" className="font-semibold text-white underline underline-offset-4">
                Apply now
              </Link>
            </p>
          </div>

          <div className="grid gap-4">
            {quickLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="group rounded-2xl border border-white/15 bg-white/10 backdrop-blur-sm p-5 hover:bg-white/15 transition-all"
              >
                <div className="flex items-start gap-4">
                  <div className="rounded-xl bg-white/15 p-3">
                    <item.icon className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{item.title}</h3>
                    <p className="text-sm text-green-100/90 mt-1">{item.description}</p>
                  </div>
                  <ArrowRight className="h-5 w-5 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
