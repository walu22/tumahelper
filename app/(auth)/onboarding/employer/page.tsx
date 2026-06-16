import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { getRedirectForRole } from "@/lib/auth/config";
import { EmployerOnboardingForm } from "./employer-onboarding-form";

export default async function EmployerOnboardingPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login?redirect=/onboarding/employer");
  }

  if (user.role !== "employer") {
    redirect(getRedirectForRole(user.role));
  }

  return <EmployerOnboardingForm />;
}
