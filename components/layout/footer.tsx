import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">TH</span>
              </div>
              <span className="font-bold text-xl text-white">TumaHelper</span>
            </Link>
            <p className="text-sm text-gray-400 leading-relaxed">
              Connecting Lusaka families with trusted, verified nannies and house cleaners.
            </p>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">For Customers</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/workers" className="hover:text-white transition-colors">Find a Worker</Link></li>
              <li><Link href="/nannies" className="hover:text-white transition-colors">Nannies</Link></li>
              <li><Link href="/house-cleaners" className="hover:text-white transition-colors">House Cleaners</Link></li>
              <li><Link href="/how-it-works" className="hover:text-white transition-colors">How It Works</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">For Workers</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/register?role=worker" className="hover:text-white transition-colors">Become a Provider</Link></li>
              <li><Link href="/worker/dashboard" className="hover:text-white transition-colors">Worker Dashboard</Link></li>
              <li><Link href="/jobs" className="hover:text-white transition-colors">Find Jobs</Link></li>
              <li><Link href="/verification" className="hover:text-white transition-colors">Verification Process</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Contact</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <span>Lusaka, Zambia</span>
              </li>
              <li>
                <a href="tel:+26097XXXXXXX" className="hover:text-white transition-colors">+260 97 XXX XXXX</a>
              </li>
              <li>
                <a href="mailto:hello@tumahelper.com" className="hover:text-white transition-colors">hello@tumahelper.com</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} TumaHelper. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
