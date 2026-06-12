"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Briefcase,
  CalendarCheck,
  Home,
  LayoutDashboard,
  Search,
  CalendarPlus,
  UserCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { UserRole } from "@/types";

type NavRole = UserRole | "guest";

const customerNav = [
  { href: "/", label: "Home", icon: Home },
  { href: "/customer/book", label: "Book", icon: CalendarPlus },
  { href: "/customer/bookings", label: "Bookings", icon: CalendarCheck },
  { href: "/workers", label: "Find", icon: Search },
];

const workerNav = [
  { href: "/worker/dashboard", label: "Home", icon: LayoutDashboard },
  { href: "/worker/bookings", label: "Jobs", icon: Briefcase },
  { href: "/worker/profile", label: "Profile", icon: UserCircle },
];

const guestNav = [
  { href: "/", label: "Home", icon: Home },
  { href: "/customer/book", label: "Book", icon: CalendarPlus },
  { href: "/workers", label: "Find", icon: Search },
  { href: "/login", label: "Sign in", icon: UserCircle },
];

function navForRole(role: NavRole) {
  if (role === "worker") return workerNav;
  if (role === "customer" || role === "employer") return customerNav;
  return guestNav;
}

export function MobileNav({ role = "guest" }: { role?: NavRole }) {
  const pathname = usePathname();
  const items = navForRole(role);

  if (role === "admin") return null;

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-t border-border md:hidden z-50">
      <div className="flex items-center justify-around py-2">
        {items.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/" && pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-0.5 px-3 py-1 rounded-lg transition-colors min-w-[4rem]",
                isActive ? "text-primary" : "text-muted-foreground"
              )}
            >
              <item.icon className="w-5 h-5" />
              <span className="text-[11px] font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
