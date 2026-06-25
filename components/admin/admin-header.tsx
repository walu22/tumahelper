"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getAdminPageTitle } from "@/lib/admin/navigation";

export function AdminHeader({ onMenuClick }: { onMenuClick?: () => void }) {
  const pathname = usePathname();
  const title = getAdminPageTitle(pathname);
  const isDashboard = pathname === "/admin";

  return (
    <header className="sticky top-0 z-30 flex h-14 shrink-0 items-center gap-3 border-b border-border/60 bg-background/95 px-4 backdrop-blur-sm md:px-6">
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="md:hidden"
        onClick={onMenuClick}
        aria-label="Open admin menu"
      >
        <Menu className="h-5 w-5" />
      </Button>

      <div className="flex min-w-0 flex-1 flex-col">
        <nav className="flex items-center gap-1 text-xs text-muted-foreground" aria-label="Breadcrumb">
          <Link href="/admin" className="hover:text-foreground transition-colors">
            Admin
          </Link>
          {!isDashboard && (
            <>
              <ChevronRight className="h-3.5 w-3.5" aria-hidden />
              <span className="truncate text-foreground">{title}</span>
            </>
          )}
        </nav>
        <h1 className="truncate font-display text-lg font-semibold tracking-tight md:text-xl">
          {title}
        </h1>
      </div>

      <Button variant="outline" size="sm" className="rounded-full shrink-0" asChild>
        <Link href="/">View site</Link>
      </Button>
    </header>
  );
}
