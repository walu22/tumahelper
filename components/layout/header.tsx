'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Logo } from '@/components/brand/logo'
import { useState } from 'react'
import { Menu, X, Sun, Moon } from 'lucide-react'
import { useTheme } from '@/components/theme-provider'
import type { User as AppUser } from '@/types'
import { HEADER_BOOK_CTA, HEADER_NAV_LINKS } from '@/lib/landing/content'
import { NotificationBell } from '@/components/layout/notification-bell'
import { AccountMenu, AccountMenuLinks } from '@/components/layout/account-menu'

function ThemeToggle({
  className,
  showLabel = false,
}: {
  className?: string
  showLabel?: boolean
}) {
  const { theme, toggleTheme } = useTheme()

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={className}
      aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
      {showLabel ? (
        <span>{theme === 'dark' ? 'Light mode' : 'Dark mode'}</span>
      ) : null}
    </button>
  )
}

export function Header({ user }: { user: AppUser | null }) {
  const [isOpen, setIsOpen] = useState(false)

  function closeMenu() {
    setIsOpen(false)
  }

  return (
    <header className="border-b border-border/60 bg-background/95 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          <div className="flex items-center gap-8 min-w-0">
            <Link href="/" className="flex items-center shrink-0">
              <Logo size="sm" />
            </Link>

            <nav className="hidden md:flex items-center gap-6" aria-label="Main">
              {HEADER_NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors whitespace-nowrap"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="hidden md:flex items-center gap-2 shrink-0">
            <ThemeToggle className="p-2 rounded-full hover:bg-surface transition-colors" />

            {user ? (
              <>
                <NotificationBell userId={user.id} />
                <AccountMenu user={user} />
              </>
            ) : (
              <Button variant="ghost" size="sm" className="rounded-full" asChild>
                <Link href="/login">Sign in</Link>
              </Button>
            )}

            <Button size="sm" className="rounded-full px-6" asChild>
              <Link href={HEADER_BOOK_CTA.href}>{HEADER_BOOK_CTA.label}</Link>
            </Button>
          </div>

          <div className="flex md:hidden items-center gap-2 shrink-0">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-3 min-h-11 min-w-11 flex items-center justify-center rounded-lg hover:bg-surface transition-colors"
              aria-label={isOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={isOpen}
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {isOpen && (
          <div className="md:hidden border-t py-4">
            <nav className="space-y-1" aria-label="Main">
              <Link
                href={HEADER_BOOK_CTA.href}
                className="block text-sm font-semibold py-3 px-1 text-primary"
                onClick={closeMenu}
              >
                {HEADER_BOOK_CTA.label}
              </Link>
              {HEADER_NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="block text-sm font-medium py-3 px-1"
                  onClick={closeMenu}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <div className="flex flex-col gap-2 pt-4 mt-2 border-t border-border">
              <ThemeToggle
                showLabel
                className="flex items-center gap-2 px-1 py-2 text-sm font-medium rounded-lg hover:bg-surface transition-colors w-full text-left"
              />

              {user ? (
                <>
                  <NotificationBell userId={user.id} />
                  <AccountMenuLinks user={user} onNavigate={closeMenu} />
                </>
              ) : (
                <Button variant="outline" className="w-full rounded-full" asChild>
                  <Link href="/login" onClick={closeMenu}>
                    Sign in
                  </Link>
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
