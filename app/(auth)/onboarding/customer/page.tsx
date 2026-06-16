import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { getRedirectForRole } from "@/lib/auth/config";
import { CustomerOnboardingForm } from "./customer-onboarding-form";

export default async function CustomerOnboardingPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login?redirect=/onboarding/customer");
  }

  if (user.role !== "customer") {
    redirect(getRedirectForRole(user.role));
  }

  return <CustomerOnboardingForm />;
}
