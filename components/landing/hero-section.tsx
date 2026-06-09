import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import {
  FullTimeJobsIcon,
  HouseCleaningIcon,
  NannyServiceIcon,
} from "./service-icons";

const quickLinks = [
  {
    href: "/nannies",
    icon: NannyServiceIcon,
    iconClass: "text-rose-100",
    iconBg: "bg-rose-500/25 ring-1 ring-rose-200/30",
    title: "Nanny Services",
    description: "Childcare, babysitting, and live-in support",
  },
  {
    href: "/house-cleaners",
    icon: HouseCleaningIcon,
    iconClass: "text-sky-100",
    iconBg: "bg-sky-500/25 ring-1 ring-sky-200/30",
    title: "House Cleaning",
    description: "Deep cleans, laundry, and regular upkeep",
  },
  {
    href: "/jobs",
    icon: FullTimeJobsIcon,
    iconClass: "text-amber-100",
    iconBg: "bg-amber-500/25 ring-1 ring-amber-200/30",
    title: "Full-Time Jobs",
    description: "Hire permanent help for your home",
  },
];

export function HeroSection() {
  return (
    <section className="relative overflow-hidden min-h-[680px] lg:min-h-[760px] text-white">
      <Image
        src="/images/hero-home.jpg"
        alt="Professional home help in a bright, welcoming living room"
        fill
        priority
        sizes="100vw"
        className="object-cover object-[center_30%]"
      />

      <div className="absolute inset-0 bg-gradient-to-r from-primary-dark/95 via-primary/88 to-primary/55" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-black/10" />

      <div className="relative max-w-6xl mx-auto px-4 py-20 md:py-28">
        <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-black/15 backdrop-blur-sm px-4 py-1.5 text-sm mb-6">
              <Sparkles className="h-4 w-4" />
              Trusted home help in Lusaka
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6 drop-shadow-sm">
              All the help your home needs.
            </h1>

            <p className="text-lg md:text-xl text-green-50/95 max-w-xl mb-8 leading-relaxed">
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
                  className="w-full sm:w-auto border-white/40 text-white bg-white/10 hover:bg-white/20 backdrop-blur-sm"
                >
                  Book a Worker
                </Button>
              </Link>
            </div>

            <p className="text-sm text-green-100/85">
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
                className="group rounded-2xl border border-white/15 bg-black/20 backdrop-blur-md p-5 hover:bg-black/30 transition-all"
              >
                <div className="flex items-start gap-4">
                  <div className={`rounded-xl p-3 ${item.iconBg}`}>
                    <item.icon className={`h-7 w-7 ${item.iconClass}`} />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-semibold text-lg">{item.title}</h3>
                    <p className="text-sm text-green-100/90 mt-1">{item.description}</p>
                  </div>
                  <ArrowRight className="h-5 w-5 ml-auto shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
