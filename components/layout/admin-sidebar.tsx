'use client'

import Link from 'next/link'
import { LogoMark } from '@/components/brand/logo'
import { usePathname } from 'next/navigation'
import { cn } from '@/utils/formatters'
import { Button } from '@/components/ui/button'
import { logoutAction } from '@/app/(auth)/login/actions'
import { ADMIN_NAV_LINKS } from '@/lib/admin/navigation'
import {
  LayoutDashboard,
  Users,
  FileText,
  CalendarCheck,
  CreditCard,
  Scale,
  ClipboardList,
  BarChart3,
  LogOut,
  X,
} from 'lucide-react'

const iconBySegment = {
  dashboard: LayoutDashboard,
  workers: Users,
  documents: FileText,
  bookings: CalendarCheck,
  payments: CreditCard,
  disputes: Scale,
  audit: ClipboardList,
  analytics: BarChart3,
} as const

export function AdminSidebar({
  mobileOpen = false,
  onNavigate,
}: {
  mobileOpen?: boolean
  onNavigate?: () => void
}) {
  const pathname = usePathname()

  return (
    <aside
      className={cn(
        'fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-border/70 bg-card transition-transform md:static md:translate-x-0',
        mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
      )}
    >
      <div className="flex items-center justify-between border-b border-border/70 px-4 py-4">
        <Link href="/admin" className="flex items-center gap-2" onClick={onNavigate}>
          <LogoMark size={28} />
          <div className="min-w-0">
            <p className="truncate font-display text-sm font-bold text-primary">TumaHelper</p>
            <p className="truncate text-xs text-muted-foreground">Admin</p>
          </div>
        </Link>
        <button
          type="button"
          className="rounded-lg p-2 text-muted-foreground hover:bg-muted md:hidden"
          aria-label="Close admin menu"
          onClick={onNavigate}
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto p-3" aria-label="Admin">
        {ADMIN_NAV_LINKS.map((link) => {
          const Icon = iconBySegment[link.segment]
          const isActive =
            pathname === link.href ||
            (link.href !== '/admin' && pathname.startsWith(link.href))

          return (
            <Link
              key={link.href}
              href={link.href}
              onClick={onNavigate}
              className={cn(
                'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              )}
            >
              <Icon className="h-4 w-4" />
              {link.label}
            </Link>
          )
        })}
      </nav>

      <div className="border-t border-border/70 p-3">
        <form action={logoutAction}>
          <Button
            type="submit"
            variant="outline"
            className="w-full justify-start gap-2 rounded-xl text-muted-foreground"
          >
            <LogOut className="h-4 w-4" />
            Sign out
          </Button>
        </form>
      </div>
    </aside>
  )
}
