import { getServerClient } from "@/lib/supabase";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { formatDate, formatCurrency } from "@/lib/utils";
import { Briefcase, Users, Eye, Plus, Clock } from "lucide-react";

export default async function EmployerDashboardPage() {
  const user = await getCurrentUser();
  if (!user || user.role !== "employer") redirect("/login");

  const supabase = getServerClient();

  const { data: jobPosts } = await supabase
    .from("job_posts")
    .select(`
      *,
      applications:job_applications(count)
    `)
    .eq("employer_id", user.id)
    .order("created_at", { ascending: false })
    .limit(10);

  const activeJobs = jobPosts?.filter((j) => j.status === "open") || [];
  const totalApplications = jobPosts?.reduce((sum, j) => sum + (j.applications?.[0]?.count || 0), 0) || 0;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Employer Dashboard</h1>
        <Link href="/employer/jobs/new">
          <Button className="bg-primary">
            <Plus className="w-4 h-4 mr-2" />
            Post a Job
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-card rounded-lg shadow-sm p-4 text-center">
          <Briefcase className="w-6 h-6 text-primary mx-auto mb-2" />
          <div className="text-2xl font-bold">{activeJobs.length}</div>
          <div className="text-sm text-gray-500">Active Jobs</div>
        </div>
        <div className="bg-card rounded-lg shadow-sm p-4 text-center">
          <Users className="w-6 h-6 text-primary mx-auto mb-2" />
          <div className="text-2xl font-bold">{totalApplications}</div>
          <div className="text-sm text-gray-500">Applications</div>
        </div>
        <div className="bg-card rounded-lg shadow-sm p-4 text-center">
          <Eye className="w-6 h-6 text-primary mx-auto mb-2" />
          <div className="text-2xl font-bold">{jobPosts?.filter((j) => j.status === "filled").length || 0}</div>
          <div className="text-sm text-gray-500">Hires</div>
        </div>
      </div>

      {/* Job Posts */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Your Job Posts</h2>
        {jobPosts && jobPosts.length > 0 ? (
          <div className="space-y-4">
            {jobPosts.map((job: any) => (
              <Link key={job.id} href={`/employer/jobs/${job.id}`}>
                <div className="bg-card rounded-lg shadow-sm border p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="font-semibold text-lg">{job.title}</div>
                      <div className="text-sm text-gray-500 mt-1">
                        {job.city} &middot; {job.employment_type?.replace("_", " ")}
                        {job.salary_min && ` &middot; ${formatCurrency(job.salary_min)}/mo`}
                      </div>
                      <div className="flex items-center gap-3 mt-2 text-sm">
                        <span className="flex items-center gap-1 text-gray-500">
                          <Users className="w-3 h-3" />
                          {job.applications?.[0]?.count || 0} applicants
                        </span>
                        <span className="flex items-center gap-1 text-gray-500">
                          <Clock className="w-3 h-3" />
                          {formatDate(job.created_at)}
                        </span>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${
                      job.status === "open" ? "bg-green-100 text-green-800" :
                      job.status === "filled" ? "bg-blue-100 text-blue-800" :
                      "bg-gray-100 text-gray-600"
                    }`}>
                      {job.status}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="bg-gray-50 rounded-lg p-12 text-center">
            <Briefcase className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 mb-4">No job posts yet</p>
            <Link href="/employer/jobs/new">
              <Button className="bg-primary">Post Your First Job</Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
