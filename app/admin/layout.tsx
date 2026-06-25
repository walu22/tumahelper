import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { getRedirectForRole } from "@/lib/auth/config";
import { AdminShell } from "@/components/admin/admin-shell";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login?redirect=/admin");
  }

  if (user.role !== "admin") {
    redirect(getRedirectForRole(user.role));
  }

  return <AdminShell>{children}</AdminShell>;
}
