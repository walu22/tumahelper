import Link from "next/link";
import { Logo } from "@/components/brand/logo";

export function Footer() {
  return (
    <footer className="bg-surface border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <Link href="/" className="inline-block mb-4">
              <Logo size="sm" />
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Connecting Lusaka families with trusted, verified nannies and house cleaners.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-4">For Customers</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/customer/book" className="hover:text-primary transition-colors">Book a Service</Link></li>
              <li><Link href="/workers" className="hover:text-primary transition-colors">Find a Worker</Link></li>
              <li><Link href="/nannies" className="hover:text-primary transition-colors">Nannies</Link></li>
              <li><Link href="/house-cleaners" className="hover:text-primary transition-colors">House Cleaners</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">For Workers</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/onboarding/worker" className="hover:text-primary transition-colors">Apply Now</Link></li>
              <li><Link href="/worker/dashboard" className="hover:text-primary transition-colors">Worker Dashboard</Link></li>
              <li><Link href="/jobs" className="hover:text-primary transition-colors">Find Jobs</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Contact</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>Lusaka, Zambia</li>
              <li>
                <a href="mailto:hello@tumahelper.com" className="hover:text-primary transition-colors">hello@tumahelper.com</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} TumaHelper. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <Link href="/privacy" className="hover:text-primary transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-primary transition-colors">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
