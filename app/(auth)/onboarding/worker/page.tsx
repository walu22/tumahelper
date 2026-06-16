import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { getRedirectForRole } from "@/lib/auth/config";
import { WorkerOnboardingForm } from "./worker-onboarding-form";

export default async function WorkerOnboardingPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login?redirect=/onboarding/worker");
  }

  if (user.role !== "worker") {
    redirect(getRedirectForRole(user.role));
  }

  return <WorkerOnboardingForm initialFullName={user.full_name || ""} />;
}
