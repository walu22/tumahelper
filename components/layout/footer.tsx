import Link from "next/link";
import { Logo } from "@/components/brand/logo";
import {
  FOOTER_TAGLINE,
  GET_HELP_HREF,
  PERMANENT_HIRE_HREF,
  PRICING_SECTION_HREF,
  SHORT_STAY_CLEAN_BOOK_HREF,
} from "@/lib/landing/content";
import { cn } from "@/lib/utils";

export function Footer({ className }: { className?: string }) {
  return (
    <footer className={cn("bg-surface border-t border-border", className)}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <Link href="/" className="inline-block mb-4">
              <Logo size="sm" />
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {FOOTER_TAGLINE}
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-4">For Customers</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href={GET_HELP_HREF} className="hover:text-primary transition-colors">Book a service</Link></li>
              <li><Link href="/workers" className="hover:text-primary transition-colors">Find a worker</Link></li>
              <li><Link href={PRICING_SECTION_HREF} className="hover:text-primary transition-colors">Typical prices</Link></li>
              <li><Link href={PERMANENT_HIRE_HREF} className="hover:text-primary transition-colors">Permanent hire</Link></li>
              <li><Link href={SHORT_STAY_CLEAN_BOOK_HREF} className="hover:text-primary transition-colors">Short-stay cleaning</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">For Workers</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/register?role=worker" className="hover:text-primary transition-colors">Apply Now</Link></li>
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
