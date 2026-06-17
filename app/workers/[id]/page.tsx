import { getServerClient } from "@/lib/supabase";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { TrustScoreBadge } from "@/components/trust-score-badge";
import { VerificationBadge } from "@/components/verification-badge";
import { StarRating } from "@/components/star-rating";
import { formatDate, formatCurrency } from "@/lib/utils";
import { MapPin, Star, Briefcase, Languages, CheckCircle, Calendar } from "lucide-react";

export default async function WorkerDetailPage({ params }: { params: { id: string } }) {
  const supabase = getServerClient();

  const { data: worker } = await supabase
    .from("worker_profiles")
    .select(`
      *,
      user:user_id(full_name, phone, created_at)
    `)
    .eq("id", params.id)
    .single();

  if (!worker) notFound();

  const { data: reviews } = await supabase
    .from("reviews")
    .select(`
      *,
      reviewer:reviewer_id(full_name)
    `)
    .eq("reviewee_id", worker.user_id)
    .order("created_at", { ascending: false })
    .limit(10);

  const { data: completedBookings } = await supabase
    .from("bookings")
    .select("id")
    .eq("worker_id", worker.user_id)
    .eq("status", "completed");

  const memberSince = new Date(worker.user?.created_at || Date.now()).toLocaleDateString("en-ZM", {
    year: "numeric", month: "long",
  });

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Profile Header */}
      <div className="bg-card rounded-lg shadow-md p-8 mb-6">
        <div className="flex flex-col md:flex-row items-start gap-6">
          <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-gray-200 overflow-hidden flex-shrink-0">
            {worker.profile_photo_url ? (
              <img src={worker.profile_photo_url} alt="" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400 text-4xl">
                {worker.user?.full_name?.charAt(0) || "?"}
              </div>
            )}
          </div>
          <div className="flex-1">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-3xl font-bold">{worker.user?.full_name}</h1>
                <div className="flex items-center gap-2 mt-1 text-gray-500">
                  <MapPin className="w-4 h-4" />
                  <span>{worker.area}, {worker.city}</span>
                </div>
              </div>
              <Link href={`/customer/book?worker=${worker.id}`}>
                <Button className="bg-primary">Book Now</Button>
              </Link>
            </div>

            <div className="flex items-center gap-3 mt-4">
              <TrustScoreBadge score={worker.trust_score} isProvisional={worker.is_provisional} size="md" />
              <VerificationBadge level={worker.verification_level} size="md" />
            </div>

            <div className="flex items-center gap-6 mt-4 text-sm">
              <div className="flex items-center gap-1">
                <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                <span className="font-medium text-lg">{(worker.average_rating || 0).toFixed(1)}</span>
                <span className="text-gray-400">({worker.total_reviews} reviews)</span>
              </div>
              <div className="flex items-center gap-1 text-gray-500">
                <Briefcase className="w-4 h-4" />
                <span>{completedBookings?.length || 0} jobs completed</span>
              </div>
              <div className="flex items-center gap-1 text-gray-500">
                <Calendar className="w-4 h-4" />
                <span>Member since {memberSince}</span>
              </div>
            </div>

            {worker.bio && (
              <p className="mt-4 text-gray-700">{worker.bio}</p>
            )}
          </div>
        </div>
      </div>

      {/* Details Grid */}
      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <div className="bg-card rounded-lg shadow-md p-6">
          <h2 className="font-semibold text-lg mb-4">Skills</h2>
          <div className="flex flex-wrap gap-2">
            {worker.skills?.map((skill: string) => (
              <span key={skill} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                {skill.replace("_", " ")}
              </span>
            )) || <span className="text-gray-400">No skills listed</span>}
          </div>
        </div>

        <div className="bg-card rounded-lg shadow-md p-6">
          <h2 className="font-semibold text-lg mb-4">Languages</h2>
          <div className="flex flex-wrap gap-2">
            {worker.languages?.map((lang: string) => (
              <span key={lang} className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm flex items-center gap-1">
                <Languages className="w-3 h-3" />
                {lang}
              </span>
            )) || <span className="text-gray-400">No languages listed</span>}
          </div>
        </div>

        <div className="bg-card rounded-lg shadow-md p-6">
          <h2 className="font-semibold text-lg mb-4">Experience</h2>
          <p className="text-gray-700">{worker.experience_years} years of experience</p>
          <p className="text-sm text-gray-500 capitalize mt-1">{worker.category.replace("_", " ")}</p>
        </div>

        <div className="bg-card rounded-lg shadow-md p-6">
          <h2 className="font-semibold text-lg mb-4">Availability</h2>
          <div className="flex flex-wrap gap-2">
            {worker.employment_types?.map((type: string) => (
              <span key={type} className="bg-green-50 text-green-700 px-3 py-1 rounded-full text-sm capitalize">
                {type.replace("_", " ")}
              </span>
            )) || <span className="text-gray-400">Not specified</span>}
          </div>
        </div>
      </div>

      {/* Reviews */}
      <div className="bg-card rounded-lg shadow-md p-6">
        <h2 className="font-semibold text-lg mb-4">Reviews ({reviews?.length || 0})</h2>
        {reviews && reviews.length > 0 ? (
          <div className="space-y-4">
            {reviews.map((review: any) => (
              <div key={review.id} className="border-b last:border-0 pb-4 last:pb-0">
                <div className="flex items-center justify-between">
                  <div className="font-medium">{review.reviewer?.full_name || "Anonymous"}</div>
                  <div className="text-sm text-gray-500">{formatDate(review.created_at)}</div>
                </div>
                <StarRating value={review.overall_rating} readOnly size="sm" />
                {review.comment && <p className="text-gray-600 mt-1 text-sm">{review.comment}</p>}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-400 text-center py-4">No reviews yet</p>
        )}
      </div>
    </div>
  );
}
