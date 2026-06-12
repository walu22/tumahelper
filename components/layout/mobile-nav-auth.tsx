import { getCurrentUser } from "@/lib/auth";
import { MobileNav } from "@/components/mobile-nav";
import type { UserRole } from "@/types";

export async function MobileNavAuth() {
  const user = await getCurrentUser();
  const role = (user?.role ?? "guest") as UserRole | "guest";
  return <MobileNav role={role} />;
}
