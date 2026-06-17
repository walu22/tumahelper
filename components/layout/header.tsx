'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Logo } from '@/components/brand/logo'
import { useState } from 'react'
import { Menu, X, User, Sun, Moon, LogOut } from 'lucide-react'
import { useTheme } from '@/components/theme-provider'
import type { User as AppUser } from '@/types'
import { ROLE_REDIRECTS } from '@/lib/auth/config'
import { logoutAction } from '@/app/(auth)/login/actions'

export function Header({ user }: { user: AppUser | null }) {
  const [isOpen, setIsOpen] = useState(false)
  const { theme, toggleTheme } = useTheme()
  const dashboardHref = user ? ROLE_REDIRECTS[user.role] || '/dashboard' : '/login'

  return (
    <header className="border-b border-border/60 bg-background/95 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center">
            <Logo size="sm" />
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            <Link href="/customer/book?category=nanny" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
              Nannies
            </Link>
            <Link href="/customer/book?category=cleaning" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
              Cleaning
            </Link>
            <Link href="/hire" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
              Permanent hire
            </Link>
            <Link href="/workers" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
              Find workers
            </Link>
          </nav>

          <div className="hidden md:flex items-center gap-3">
            <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-surface transition-colors" aria-label="Toggle theme">
              {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>

            {user ? (
              <>
                <Link href={dashboardHref}>
                  <Button variant="ghost" size="sm" className="rounded-full">
                    <User className="h-4 w-4 mr-2" />
                    {user.full_name || user.email || 'Dashboard'}
                  </Button>
                </Link>
                <form action={logoutAction}>
                  <Button variant="outline" size="sm" type="submit" className="rounded-full">
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </Button>
                </form>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost" size="sm" className="rounded-full">
                    Sign In
                  </Button>
                </Link>
                <Link href="/customer/book">
                  <Button size="sm" className="rounded-full px-6">Find help</Button>
                </Link>
              </>
            )}
          </div>

          <button onClick={() => setIsOpen(!isOpen)} className="md:hidden p-2">
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {isOpen && (
          <div className="md:hidden border-t py-4 space-y-3">
            <Link href="/customer/book?category=nanny" className="block text-sm font-medium py-2" onClick={() => setIsOpen(false)}>
              Nannies
            </Link>
            <Link href="/customer/book?category=cleaning" className="block text-sm font-medium py-2" onClick={() => setIsOpen(false)}>
              Cleaning
            </Link>
            <Link href="/hire" className="block text-sm font-medium py-2" onClick={() => setIsOpen(false)}>
              Permanent hire
            </Link>
            <Link href="/workers" className="block text-sm font-medium py-2" onClick={() => setIsOpen(false)}>
              Find workers
            </Link>
            <div className="flex gap-2 pt-2">
              <button onClick={toggleTheme} className="flex items-center gap-2 px-3 py-2 text-sm rounded-full hover:bg-surface transition-colors">
                {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
              </button>
              {user ? (
                <>
                  <Link href={dashboardHref} className="flex-1" onClick={() => setIsOpen(false)}>
                    <Button variant="outline" className="w-full rounded-full">Dashboard</Button>
                  </Link>
                  <form action={logoutAction} className="flex-1">
                    <Button className="w-full rounded-full" type="submit">Sign Out</Button>
                  </form>
                </>
              ) : (
                <>
                  <Link href="/login" className="flex-1">
                    <Button variant="outline" className="w-full rounded-full">Sign In</Button>
                  </Link>
                  <Link href="/customer/book" className="flex-1" onClick={() => setIsOpen(false)}>
                    <Button className="w-full rounded-full">Find help</Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
