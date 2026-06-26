export const ADMIN_NAV_LINKS = [
  { href: "/admin", label: "Dashboard", segment: "dashboard" },
  { href: "/admin/workers", label: "Workers", segment: "workers" },
  { href: "/admin/documents", label: "Documents", segment: "documents" },
  { href: "/admin/bookings", label: "Bookings", segment: "bookings" },
  { href: "/admin/payments", label: "Payments", segment: "payments" },
  { href: "/admin/disputes", label: "Disputes", segment: "disputes" },
  { href: "/admin/audit", label: "Audit Logs", segment: "audit" },
  { href: "/admin/analytics", label: "Analytics", segment: "analytics" },
] as const;

export function getAdminPageTitle(pathname: string): string {
  if (pathname === "/admin") return "Dashboard";
  if (pathname.startsWith("/admin/workers/")) return "Worker details";
  if (pathname.startsWith("/admin/bookings/")) return "Booking details";
  const match = ADMIN_NAV_LINKS.find(
    (link) => link.href !== "/admin" && pathname.startsWith(link.href)
  );
  return match?.label ?? "Admin";
}
