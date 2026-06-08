'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import { Menu, X, User, Sun, Moon } from 'lucide-react'
import { useTheme } from '@/components/theme-provider'

export function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const { theme, toggleTheme } = useTheme()

  return (
    <header className="border-b bg-background sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">TH</span>
            </div>
            <span className="font-bold text-xl text-primary">TumaHelper</span>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            <Link href="/nannies" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Nannies
            </Link>
            <Link href="/house-cleaners" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              House Cleaners
            </Link>
            <Link href="/jobs" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Jobs
            </Link>
            <Link href="/workers" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Browse All
            </Link>
          </nav>

          <div className="hidden md:flex items-center gap-3">
            <button onClick={toggleTheme} className="p-2 rounded-lg hover:bg-muted transition-colors" aria-label="Toggle theme">
              {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
            <Link href="/login">
              <Button variant="ghost" size="sm">
                <User className="h-4 w-4 mr-2" />
                Sign In
              </Button>
            </Link>
            <Link href="/register?role=worker">
              <Button variant="outline" size="sm">Become a Provider</Button>
            </Link>
            <Link href="/register">
              <Button size="sm">Get Started</Button>
            </Link>
          </div>

          <button onClick={() => setIsOpen(!isOpen)} className="md:hidden p-2">
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {isOpen && (
          <div className="md:hidden border-t py-4 space-y-3">
            <Link href="/nannies" className="block text-sm font-medium py-2" onClick={() => setIsOpen(false)}>
              Nannies
            </Link>
            <Link href="/house-cleaners" className="block text-sm font-medium py-2" onClick={() => setIsOpen(false)}>
              House Cleaners
            </Link>
            <Link href="/jobs" className="block text-sm font-medium py-2" onClick={() => setIsOpen(false)}>
              Jobs
            </Link>
            <Link href="/workers" className="block text-sm font-medium py-2" onClick={() => setIsOpen(false)}>
              Browse All
            </Link>
            <div className="flex gap-2 pt-2">
              <button onClick={toggleTheme} className="flex items-center gap-2 px-3 py-2 text-sm rounded-lg hover:bg-muted transition-colors">
                {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
              </button>
              <Link href="/login" className="flex-1">
                <Button variant="outline" className="w-full">Sign In</Button>
              </Link>
              <Link href="/register" className="flex-1">
                <Button className="w-full">Get Started</Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}