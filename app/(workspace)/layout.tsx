'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import {
  BarChart3,
  CircleDollarSign,
  LayoutDashboard,
  Menu,
  Moon,
  Settings,
  Sun,
  Users,
  X,
  FileText,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { appConfig } from '@/config/app'

const navRoutes = {
  Overview: '/dashboard',
  Employees: '/employees',
  Payroll: '/payroll',
  Analytics: '/analytics',
  Settings: '/settings',
}

const navIcons = {
  Overview: LayoutDashboard,
  Employees: Users,
  Payroll: FileText,
  Analytics: BarChart3,
  Settings: Settings,
}

function Brand() {
  const { name, tagline } = appConfig.metadata.brand
  return (
    <div className="flex items-center gap-3">
      <div className="grid size-9 shrink-0 place-items-center rounded-xl bg-primary text-primary-foreground">
        <CircleDollarSign aria-hidden="true" className="size-5" />
      </div>
      <div className="min-w-0">
        <p className="truncate font-semibold">{name}</p>
        <p className="truncate text-xs text-muted-foreground">{tagline}</p>
      </div>
    </div>
  )
}

function WorkspaceSidebar({
  mobile,
  open,
  onClose,
  activeNav,
  onNavigate,
}: {
  mobile?: boolean
  open?: boolean
  onClose?: () => void
  activeNav: string
  onNavigate: (label: string) => void
}) {
  const { description, details } = appConfig.metadata.brand

  const sidebarContent = (
    <>
      <Brand />
      <Separator className="my-7" />
      <nav className="flex flex-col gap-1" aria-label="Primary navigation">
        {Object.entries(navRoutes).map(([label, href]) => {
          const Icon = navIcons[label]
          return (
            <Button
              key={label}
              asChild
              variant={activeNav === label ? 'secondary' : 'ghost'}
              className="justify-start gap-3"
            >
              <Link
                href={href}
                onClick={() => onNavigate(label)}
              >
                <Icon aria-hidden="true" className="size-4" />
                {label}
              </Link>
            </Button>
          )
        })}
      </nav>
      <div className="mt-auto rounded-xl bg-primary p-4 text-primary-foreground">
        <p className="text-sm font-medium">{description}</p>
        <p className="mt-1 text-xs text-primary-foreground/70">{details}</p>
      </div>
    </>
  )

  if (!mobile && !open) {
    return (
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 border-r bg-card px-5 py-6 lg:flex lg:flex-col">
        {sidebarContent}
      </aside>
    )
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label="Navigation menu">
      <button
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
        aria-label="Close navigation"
      />
      <aside className="relative flex h-full w-[min(18rem,86vw)] flex-col border-r bg-card px-5 py-6 shadow-xl">
        <div className="flex items-center justify-between">
          <Brand />
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            aria-label="Close navigation"
          >
            <X aria-hidden="true" />
          </Button>
        </div>
        <Separator className="my-7" />
        <nav className="flex flex-col gap-1" aria-label="Primary navigation">
          {Object.entries(navRoutes).map(([label, href]) => {
            const Icon = navIcons[label]
            return (
              <Button
                key={label}
                asChild
                variant={activeNav === label ? 'secondary' : 'ghost'}
                className="justify-start gap-3"
              >
                <Link
                  href={href}
                  onClick={() => {
                    onNavigate(label)
                    onClose?.()
                  }}
                >
                  <Icon aria-hidden="true" className="size-4" />
                  {label}
                </Link>
              </Button>
            )
          })}
        </nav>
        <div className="mt-auto rounded-xl bg-primary p-4 text-primary-foreground">
          <p className="text-sm font-medium">{description}</p>
          <p className="mt-1 text-xs text-primary-foreground/70">{details}</p>
        </div>
      </aside>
    </div>
  )
}

export default function WorkspaceLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [darkMode, setDarkMode] = useState(false)
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const [activeNav, setActiveNav] = useState('Overview')

  useEffect(() => {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    setDarkMode(prefersDark)
    document.documentElement.classList.toggle('dark', prefersDark)
  }, [])

  useEffect(() => {
    document.body.style.overflow = mobileNavOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [mobileNavOpen])

  const toggleTheme = () =>
    setDarkMode((current) => {
      const next = !current
      document.documentElement.classList.toggle('dark', next)
      return next
    })

  // The dashboard page owns its legacy data workspace shell; avoid stacking a second header.
  if (pathname === '/dashboard') return children

  return (
    <div className="min-h-screen bg-muted/30">
      <WorkspaceSidebar
        activeNav={activeNav}
        onNavigate={setActiveNav}
      />
      <WorkspaceSidebar
        mobile
        open={mobileNavOpen}
        onClose={() => setMobileNavOpen(false)}
        activeNav={activeNav}
        onNavigate={setActiveNav}
      />
      <main className="min-h-screen lg:pl-64">
        <header className="sticky top-0 z-20 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
          <div className="mx-auto flex min-h-16 max-w-[1600px] items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
            <div className="flex min-w-0 items-center gap-3">
              <Button
                className="lg:hidden"
                variant="outline"
                size="icon"
                onClick={() => setMobileNavOpen(true)}
                aria-label="Open navigation"
                aria-expanded={mobileNavOpen}
              >
                <Menu aria-hidden="true" />
              </Button>
              <div className="lg:hidden">
                <Brand />
              </div>
              <div className="hidden min-w-0 lg:block">
                <p className="truncate text-sm text-muted-foreground">Workspace</p>
                <h1 className="truncate text-lg font-semibold">{activeNav}</h1>
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-1 sm:gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
                aria-label={darkMode ? 'Switch to light theme' : 'Switch to dark theme'}
              >
                {darkMode ? <Sun aria-hidden="true" /> : <Moon aria-hidden="true" />}
              </Button>
              <div className="hidden size-9 place-items-center rounded-full bg-primary/10 text-sm font-semibold text-primary sm:grid">
                AM
              </div>
            </div>
          </div>
        </header>
        {children}
      </main>
    </div>
  )
}
