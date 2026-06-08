import Link from "next/link";
import { getServerClient } from "@/lib/supabase";
import { WorkerCard } from "@/components/worker-card";
import { Button } from "@/components/ui/button";
import { Shield, Search, Star, Baby, Home, Briefcase, HeartHandshake, ScrollText, PhoneCall, MessageSquare, Users } from "lucide-react";

export default async function HomePage() {
  const supabase = getServerClient();
  
  let featuredWorkers = null;
  let categories = null;
  let testimonials = null;

  try {
    const { data: fw } = await supabase
      .from("worker_profiles")
      .select("*")
      .eq("is_featured", true)
      .eq("availability_status", "available")
      .limit(4);
    featuredWorkers = fw;
  } catch {}

  try {
    const { data: cat } = await supabase
      .from("service_categories")
      .select("*")
      .eq("is_active", true)
      .order("sort_order");
    categories = cat;
  } catch {}

  try {
    const { data: rv } = await supabase
      .from("reviews")
      .select("*, reviewer:reviewer_id(full_name), reviewee:reviewee_id(full_name)")
      .eq("is_visible", true)
      .order("created_at", { ascending: false })
      .limit(3);
    testimonials = rv;
  } catch {}

  return (
    <div>
      <section className="bg-gradient-to-b from-primary to-primary-dark text-white py-16 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Find Trusted Help for Your Home
          </h1>
          <p className="text-lg md:text-xl mb-10 text-green-100">
            Verified nannies and house cleaners in Lusaka. Background-checked, rated, and ready.
          </p>

          <div className="grid md:grid-cols-3 gap-4 max-w-3xl mx-auto mb-10">
            <Link href="/nannies" className="group bg-white/10 backdrop-blur-sm rounded-xl p-5 hover:bg-white/20 transition-all border border-white/20">
              <Baby className="w-8 h-8 mx-auto mb-3 text-white" />
              <h3 className="font-semibold text-lg">Nanny Services</h3>
              <p className="text-sm text-green-100 mt-1">Childcare, babysitting & live-in nannies</p>
            </Link>
            <Link href="/house-cleaners" className="group bg-white/10 backdrop-blur-sm rounded-xl p-5 hover:bg-white/20 transition-all border border-white/20">
              <Home className="w-8 h-8 mx-auto mb-3 text-white" />
              <h3 className="font-semibold text-lg">House Cleaning</h3>
              <p className="text-sm text-green-100 mt-1">Deep cleaning, laundry & regular upkeep</p>
            </Link>
            <Link href="/jobs" className="group bg-white/10 backdrop-blur-sm rounded-xl p-5 hover:bg-white/20 transition-all border border-white/20">
              <Briefcase className="w-8 h-8 mx-auto mb-3 text-white" />
              <h3 className="font-semibold text-lg">Full-Time Jobs</h3>
              <p className="text-sm text-green-100 mt-1">Hire permanent staff for your home</p>
            </Link>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/workers">
              <Button size="lg" className="bg-white text-primary hover:bg-gray-100 shadow-lg">
                <Search className="w-5 h-5 mr-2" />
                Find a Worker
              </Button>
            </Link>
            <Link href="/onboarding/worker">
              <Button size="lg" variant="outline" className="border-white text-white bg-white/10 hover:bg-white/20">
                Become a Provider
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4 rotate-45">
                <div className="-rotate-45">
                  <Search className="w-8 h-8 text-primary" />
                </div>
              </div>
              <h3 className="font-semibold text-lg mb-2">1. Browse & Filter</h3>
              <p className="text-gray-600">Search verified workers by category, area, and trust score</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4 rotate-45">
                <div className="-rotate-45">
                  <HeartHandshake className="w-8 h-8 text-primary" />
                </div>
              </div>
              <h3 className="font-semibold text-lg mb-2">2. Book with Confidence</h3>
              <p className="text-gray-600">Every worker is ID-verified and reference-checked</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4 rotate-45">
                <div className="-rotate-45">
                  <Star className="w-8 h-8 text-primary" />
                </div>
              </div>
              <h3 className="font-semibold text-lg mb-2">3. Rate & Review</h3>
              <p className="text-gray-600">Build trust together. Rate your experience after each booking</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4">Our Services</h2>
          <p className="text-gray-500 text-center mb-12 max-w-2xl mx-auto">
            Whether you need a one-time clean or regular childcare, we connect you with trusted professionals
          </p>
          <div className="grid md:grid-cols-2 gap-6">
            {categories?.map((category) => (
              <Link
                key={category.id}
                href={`/${category.slug}`}
                className="group relative overflow-hidden rounded-xl bg-white shadow-md hover:shadow-lg transition-shadow p-8 border border-gray-100"
              >
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                  {category.slug?.includes("nanny") ? (
                    <Baby className="w-6 h-6 text-primary" />
                  ) : (
                    <Home className="w-6 h-6 text-primary" />
                  )}
                </div>
                <h3 className="text-xl font-semibold mb-2">{category.name}</h3>
                <p className="text-gray-600 mb-4">{category.description}</p>
                <span className="text-primary font-medium text-sm group-hover:underline">
                  Browse workers →
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {featuredWorkers && featuredWorkers.length > 0 && (
        <section className="py-16 px-4 bg-gray-50">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-4">Featured Workers</h2>
            <p className="text-gray-500 text-center mb-12">Meet some of our trusted, verified professionals</p>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredWorkers.map((worker) => (
                <WorkerCard key={worker.id} worker={worker as any} />
              ))}
            </div>
            <div className="text-center mt-8">
              <Link href="/workers">
                <Button variant="outline" size="lg">View All Workers</Button>
              </Link>
            </div>
          </div>
        </section>
      )}

      {testimonials && testimonials.length > 0 && (
        <section className="py-16 px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-4">What Our Customers Say</h2>
            <p className="text-gray-500 text-center mb-12">Real reviews from real families in Lusaka</p>
            <div className="grid md:grid-cols-3 gap-6">
              {testimonials.map((review: any) => (
                <div key={review.id} className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
                  <div className="flex items-center gap-1 mb-3">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${i < review.overall_rating ? "text-yellow-400 fill-yellow-400" : "text-gray-200"}`}
                      />
                    ))}
                  </div>
                  <p className="text-gray-700 text-sm mb-4 italic">&ldquo;{review.comment}&rdquo;</p>
                  <div className="flex items-center gap-3 pt-3 border-t">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-sm">
                      {review.reviewer?.full_name?.charAt(0) || "C"}
                    </div>
                    <div>
                      <p className="font-medium text-sm">{review.reviewer?.full_name || "Customer"}</p>
                      <p className="text-xs text-gray-500">reviewed {review.reviewee?.full_name || "worker"}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4">Your Safety is Our Priority</h2>
          <p className="text-gray-500 text-center mb-12 max-w-2xl mx-auto">
            We thoroughly vet every worker so you can book with confidence
          </p>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="bg-white rounded-xl p-6 text-center shadow-sm border border-gray-100">
              <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <ScrollText className="w-7 h-7 text-blue-600" />
              </div>
              <h3 className="font-semibold mb-2">ID Verification</h3>
              <p className="text-sm text-gray-500">National Registration Cards verified by our team</p>
            </div>
            <div className="bg-white rounded-xl p-6 text-center shadow-sm border border-gray-100">
              <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <PhoneCall className="w-7 h-7 text-green-600" />
              </div>
              <h3 className="font-semibold mb-2">Reference Checks</h3>
              <p className="text-sm text-gray-500">We personally call previous employers</p>
            </div>
            <div className="bg-white rounded-xl p-6 text-center shadow-sm border border-gray-100">
              <div className="w-14 h-14 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="w-7 h-7 text-purple-600" />
              </div>
              <h3 className="font-semibold mb-2">Trust Scores</h3>
              <p className="text-sm text-gray-500">Data-driven ratings based on real performance</p>
            </div>
            <div className="bg-white rounded-xl p-6 text-center shadow-sm border border-gray-100">
              <div className="w-14 h-14 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-7 h-7 text-amber-600" />
              </div>
              <h3 className="font-semibold mb-2">Police Clearance</h3>
              <p className="text-sm text-gray-500">Background checks for platinum-level workers</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-primary text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to find your perfect match?</h2>
          <p className="text-green-100 mb-8 text-lg">
            Join hundreds of families in Lusaka who trust TumaHelper
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/workers">
              <Button size="lg" className="bg-white text-primary hover:bg-gray-100 shadow-lg">
                Find a Worker
              </Button>
            </Link>
            <Link href="/jobs">
              <Button size="lg" variant="outline" className="border-white text-white bg-white/10 hover:bg-white/20">
                Post a Job
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
