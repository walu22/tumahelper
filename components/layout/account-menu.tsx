"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  Briefcase,
  CalendarCheck,
  ChevronDown,
  LayoutDashboard,
  LogOut,
  User,
  UserCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { logoutAction } from "@/app/(auth)/login/actions";
import { ROLE_REDIRECTS } from "@/lib/auth/config";
import type { User as AppUser, UserRole } from "@/types";
import { cn } from "@/lib/utils";

type MenuItem = {
  href: string;
  label: string;
  icon: typeof LayoutDashboard;
};

export function getAccountMenuItems(role: UserRole): MenuItem[] {
  switch (role) {
    case "customer":
      return [
        { href: ROLE_REDIRECTS.customer, label: "Dashboard", icon: LayoutDashboard },
        { href: "/customer/bookings", label: "My bookings", icon: CalendarCheck },
      ];
    case "worker":
      return [
        { href: ROLE_REDIRECTS.worker, label: "Dashboard", icon: LayoutDashboard },
        { href: "/worker/bookings", label: "My jobs", icon: Briefcase },
        { href: "/worker/profile", label: "Profile", icon: UserCircle },
      ];
    case "employer":
      return [
        { href: ROLE_REDIRECTS.employer, label: "Dashboard", icon: LayoutDashboard },
        { href: "/employer/jobs", label: "My jobs", icon: Briefcase },
      ];
    case "admin":
      return [
        { href: ROLE_REDIRECTS.admin, label: "Dashboard", icon: LayoutDashboard },
        { href: "/admin/bookings", label: "Bookings", icon: CalendarCheck },
      ];
  }
}

function SignOutMenuItem({ className, onClick }: { className?: string; onClick?: () => void }) {
  return (
    <form action={logoutAction}>
      <button
        type="submit"
        className={className}
        role="menuitem"
        onClick={onClick}
      >
        <LogOut className="h-4 w-4 text-muted-foreground" />
        Sign out
      </button>
    </form>
  );
}

export function AccountMenu({ user }: { user: AppUser }) {
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const items = getAccountMenuItems(user.role);

  useEffect(() => {
    if (!open) return;
    function onPointerDown(event: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, [open]);

  return (
    <div className="relative" ref={panelRef}>
      <Button
        variant="ghost"
        size="sm"
        className="rounded-full gap-1"
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-haspopup="menu"
      >
        <User className="h-4 w-4" />
        Account
        <ChevronDown className={cn("h-4 w-4 transition-transform", open && "rotate-180")} />
      </Button>

      {open && (
        <div
          className="absolute right-0 mt-2 w-52 rounded-xl border border-border bg-card shadow-lg z-50 py-1"
          role="menu"
        >
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-2 px-3 py-2.5 text-sm hover:bg-surface/60 transition-colors"
              role="menuitem"
              onClick={() => setOpen(false)}
            >
              <item.icon className="h-4 w-4 text-muted-foreground" />
              {item.label}
            </Link>
          ))}
          <div className="my-1 border-t border-border" />
          <SignOutMenuItem
            className="flex w-full items-center gap-2 px-3 py-2.5 text-sm hover:bg-surface/60 transition-colors text-left"
            onClick={() => setOpen(false)}
          />
        </div>
      )}
    </div>
  );
}

export function AccountMenuLinks({
  user,
  onNavigate,
}: {
  user: AppUser;
  onNavigate?: () => void;
}) {
  const items = getAccountMenuItems(user.role);

  return (
    <div className="flex flex-col gap-2">
      {items.map((item) => (
        <Button key={item.href} variant="outline" className="w-full rounded-full justify-start" asChild>
          <Link href={item.href} onClick={onNavigate}>
            <item.icon className="h-4 w-4 mr-2" />
            {item.label}
          </Link>
        </Button>
      ))}
      <SignOutMenuItem
        className="inline-flex w-full items-center justify-center gap-2 rounded-full px-4 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors"
        onClick={onNavigate}
      />
    </div>
  );
}
