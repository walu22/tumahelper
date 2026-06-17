import { getServerClient } from "@/lib/supabase";
import { LandingWorkerCard } from "@/components/landing/landing-worker-card";
import { PUBLIC_WORKER_AVAILABILITY, WORKER_STUB_AREA } from "@/lib/workers/public-listing";
import { Suspense } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface WorkersPageProps {
  searchParams: {
    category?: string;
    city?: string;
    area?: string;
    verification?: string;
    minTrust?: string;
    page?: string;
  };
}

export default async function WorkersPage({ searchParams }: WorkersPageProps) {
  const supabase = getServerClient();

  let query = supabase
    .from("worker_profiles")
    .select("*")
    .eq("availability_status", PUBLIC_WORKER_AVAILABILITY)
    .neq("area", WORKER_STUB_AREA);

  if (searchParams.category) query = query.eq("category", searchParams.category);
  if (searchParams.city) query = query.eq("city", searchParams.city);
  if (searchParams.area) query = query.eq("area", searchParams.area);
  if (searchParams.verification)
    query = query.eq("verification_level", searchParams.verification);
  if (searchParams.minTrust)
    query = query.gte("trust_score", parseInt(searchParams.minTrust));

  const { data: workers } = await query
    .order("trust_score", { ascending: false })
    .limit(20);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="font-display text-3xl md:text-4xl font-bold mb-2">Find workers</h1>
        <p className="text-muted-foreground">
          Browse verified nannies and cleaners across Lusaka, or{" "}
          <Link href="/customer/book" className="font-semibold text-primary hover:underline">
            book by service
          </Link>{" "}
          and pick someone in the next step.
        </p>
      </div>

      <div className="mb-8 rounded-2xl border border-border bg-surface p-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <select className="rounded-xl border border-border bg-background px-3 py-2 text-sm">
            <option value="">All categories</option>
            <option value="nanny">Nanny</option>
            <option value="house_cleaner">House cleaning</option>
          </select>
          <select className="rounded-xl border border-border bg-background px-3 py-2 text-sm">
            <option value="">All areas</option>
            <option value="Kabulonga">Kabulonga</option>
            <option value="Woodlands">Woodlands</option>
            <option value="Roma">Roma</option>
          </select>
          <select className="rounded-xl border border-border bg-background px-3 py-2 text-sm">
            <option value="">All verification</option>
            <option value="bronze">Bronze+</option>
            <option value="silver">Silver+</option>
            <option value="gold">Gold+</option>
          </select>
          <select className="rounded-xl border border-border bg-background px-3 py-2 text-sm">
            <option value="">Min trust score</option>
            <option value="60">60+</option>
            <option value="75">75+</option>
            <option value="90">90+</option>
          </select>
        </div>
      </div>

      <Suspense fallback={<div className="text-muted-foreground py-12">Loading workers…</div>}>
        {workers && workers.length > 0 ? (
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {workers.map((worker) => (
              <li key={worker.id} className="min-h-[180px]">
                <LandingWorkerCard worker={worker as any} featured={worker.is_featured} />
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-center py-16 rounded-3xl border border-dashed border-border bg-surface">
            <p className="text-muted-foreground mb-4">No workers match those filters.</p>
            <Link
              href="/customer/book"
              className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
            >
              Book a service instead
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        )}
      </Suspense>
    </div>
  );
}
