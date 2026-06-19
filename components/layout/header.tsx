'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Logo } from '@/components/brand/logo'
import { useState } from 'react'
import { Menu, X, User, LogOut, Sun, Moon } from 'lucide-react'
import { useTheme } from '@/components/theme-provider'
import type { User as AppUser } from '@/types'
import { ROLE_REDIRECTS } from '@/lib/auth/config'
import { logoutAction } from '@/app/(auth)/login/actions'
import { GET_HELP_HREF, HEADER_NAV_LINKS } from '@/lib/landing/content'
import { NotificationBell } from '@/components/layout/notification-bell'

export function Header({ user }: { user: AppUser | null }) {
  const [isOpen, setIsOpen] = useState(false)
  const { theme, toggleTheme } = useTheme()
  const dashboardHref = user ? ROLE_REDIRECTS[user.role] || '/dashboard' : '/login'

  return (
    <header className="border-b border-border/60 bg-background/95 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center shrink-0">
            <Logo size="sm" />
          </Link>

          <div className="hidden md:flex items-center gap-6">
            {HEADER_NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
              >
                {link.label}
              </Link>
            ))}

            <button
              type="button"
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-surface transition-colors"
              aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>

            {user ? (
              <>
                <NotificationBell userId={user.id} />
                <Link href={dashboardHref}>
                <Button variant="ghost" size="sm" className="rounded-full">
                  <User className="h-4 w-4 mr-2" />
                  Account
                </Button>
                </Link>
              </>
            ) : (
              <Link href="/login">
                <Button variant="ghost" size="sm" className="rounded-full">
                  Sign in
                </Button>
              </Link>
            )}

            <Link href={GET_HELP_HREF}>
              <Button size="sm" className="rounded-full px-6">
                Get help
              </Button>
            </Link>
          </div>

          <div className="flex md:hidden items-center gap-2">
            <button
              type="button"
              onClick={toggleTheme}
              className="p-2 min-h-11 min-w-11 flex items-center justify-center rounded-lg hover:bg-surface transition-colors"
              aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
            <Link href={GET_HELP_HREF}>
              <Button size="sm" className="rounded-full px-4">
                Get help
              </Button>
            </Link>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-3 min-h-11 min-w-11 flex items-center justify-center rounded-lg"
              aria-label={isOpen ? 'Close menu' : 'Open menu'}
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {isOpen && (
          <div className="md:hidden border-t py-4 space-y-1">
            {HEADER_NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block text-sm font-medium py-3 px-1"
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/hire"
              className="block text-sm font-medium py-3 px-1"
              onClick={() => setIsOpen(false)}
            >
              Permanent hire
            </Link>
            <div className="flex flex-col gap-2 pt-4 border-t border-border mt-2">
              <button
                type="button"
                onClick={toggleTheme}
                className="flex items-center gap-2 px-1 py-2 text-sm font-medium rounded-lg hover:bg-surface transition-colors"
              >
                {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                {theme === 'dark' ? 'Light mode' : 'Dark mode'}
              </button>
              {user ? (
                <>
                  <NotificationBell userId={user.id} />
                  <Link href={dashboardHref} onClick={() => setIsOpen(false)}>
                    <Button variant="outline" className="w-full rounded-full">
                      Account
                    </Button>
                  </Link>
                  <form action={logoutAction}>
                    <Button variant="ghost" className="w-full rounded-full" type="submit">
                      <LogOut className="h-4 w-4 mr-2" />
                      Sign out
                    </Button>
                  </form>
                </>
              ) : (
                <Link href="/login" onClick={() => setIsOpen(false)}>
                  <Button variant="outline" className="w-full rounded-full">
                    Sign in
                  </Button>
                </Link>
              )}
              <Link href={GET_HELP_HREF} onClick={() => setIsOpen(false)}>
                <Button className="w-full rounded-full">Get help</Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
