import { getServerClient } from "@/lib/supabase";
import { WorkerCard } from "@/components/worker-card";
import { Suspense } from "react";

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
    .eq("availability_status", "available");

  if (searchParams.category) query = query.eq("category", searchParams.category);
  if (searchParams.city) query = query.eq("city", searchParams.city);
  if (searchParams.area) query = query.eq("area", searchParams.area);
  if (searchParams.verification) query = query.eq("verification_level", searchParams.verification);
  if (searchParams.minTrust) query = query.gte("trust_score", parseInt(searchParams.minTrust));

  const { data: workers } = await query
    .order("trust_score", { ascending: false })
    .limit(20);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Find a Worker</h1>
      
      <div className="mb-8 p-4 bg-gray-50 rounded-lg">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <select className="rounded-md border-gray-300">
            <option value="">All Categories</option>
            <option value="nanny">Nanny</option>
            <option value="house_cleaner">House Cleaner</option>
          </select>
          <select className="rounded-md border-gray-300">
            <option value="">All Areas</option>
            <option value="Kabulonga">Kabulonga</option>
            <option value="Woodlands">Woodlands</option>
            <option value="Roma">Roma</option>
          </select>
          <select className="rounded-md border-gray-300">
            <option value="">All Verification</option>
            <option value="bronze">Bronze+</option>
            <option value="silver">Silver+</option>
            <option value="gold">Gold+</option>
          </select>
          <select className="rounded-md border-gray-300">
            <option value="">Min Trust Score</option>
            <option value="60">60+</option>
            <option value="75">75+</option>
            <option value="90">90+</option>
          </select>
        </div>
      </div>

      <Suspense fallback={<div>Loading workers...</div>}>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {workers?.map((worker) => (
            <WorkerCard key={worker.id} worker={worker as any} />
          ))}
        </div>
        {(!workers || workers.length === 0) && (
          <div className="text-center py-12 text-gray-500">
            No workers found matching your criteria
          </div>
        )}
      </Suspense>
    </div>
  );
}
