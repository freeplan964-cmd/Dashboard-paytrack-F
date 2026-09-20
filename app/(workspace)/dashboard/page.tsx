'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import {
  BarChart3,
  CircleDollarSign,
  FileText,
  LayoutDashboard,
  Menu,
  Moon,
  Plus,
  Search,
  Settings,
  Sun,
  Users,
  X,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { apiRequest } from '@/lib/http/client'
import {
  appConfig,
  getNavItems,
  formatCurrency,
  getEmptyEmployeeForm,
  getPayrollPeriods,
  getDefaultPeriod,
} from '@/config/app'

// Map icon names to icon components for nav items
const iconComponents = {
  LayoutDashboard,
  Users,
  FileText,
  BarChart3,
  Settings,
}

const periods = getPayrollPeriods()
const navItems = getNavItems(iconComponents)
const emptyForm = getEmptyEmployeeForm()

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

function Sidebar({ mobile, open, onClose, activeNav, onNavigate }) {
  const { description, details } = appConfig.metadata.brand
  const sidebarContent = (
    <>
      <Brand />
      <Separator className="my-7" />
      <SidebarNav activeNav={activeNav} onNavigate={onNavigate} />
      <div className="mt-auto rounded-xl bg-primary p-4 text-primary-foreground">
        <p className="text-sm font-medium">{description}</p>
        <p className="mt-1 text-xs text-primary-foreground/70">{details}</p>
      </div>
    </>
  )

  if (!mobile && !open)
    return (
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 border-r bg-card px-5 py-6 lg:flex lg:flex-col">
        {sidebarContent}
      </aside>
    )

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 lg:hidden"
      role="dialog"
      aria-modal="true"
      aria-label="Navigation menu"
    >
      <button
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
        aria-label="Close navigation"
      />
      <aside className="relative flex h-full w-[min(18rem,86vw)] flex-col border-r bg-card px-5 py-6 shadow-xl">
        <div className="flex items-center justify-between">
          <Brand />
          <Button variant="ghost" size="icon" onClick={onClose} aria-label="Close navigation">
            <X aria-hidden="true" />
          </Button>
        </div>
        <Separator className="my-7" />
        <SidebarNav
          activeNav={activeNav}
          onNavigate={(label) => {
            onNavigate(label)
            onClose()
          }}
        />
        <div className="mt-auto rounded-xl bg-primary p-4 text-primary-foreground">
          <p className="text-sm font-medium">{description}</p>
          <p className="mt-1 text-xs text-primary-foreground/70">{details}</p>
        </div>
      </aside>
    </div>
  )
}

const navRoutes = { Overview: '/dashboard', Employees: '/employees', Payroll: '/payroll', Analytics: '/analytics', Settings: '/settings' }

function SidebarNav({ activeNav, onNavigate }) {
  return <nav className="flex flex-col gap-1" aria-label="Primary navigation">{navItems.map(([Icon, label]) => <Button key={label} asChild variant={activeNav === label ? 'secondary' : 'ghost'} className="justify-start gap-3"><Link href={navRoutes[label]} onClick={() => onNavigate(label)}><Icon aria-hidden="true" className="size-4" />{label}</Link></Button>)}</nav>
}

function StatCard({ label, value, detail, icon: Icon }) {
  return (
    <Card className="border-border/70 shadow-sm">
      <CardContent className="flex items-start justify-between p-5">
        <div className="min-w-0">
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="mt-2 truncate text-2xl font-semibold tracking-tight">{value}</p>
          <p className="mt-1 text-xs text-muted-foreground">{detail}</p>
        </div>
        <div className="rounded-lg bg-primary/10 p-2.5 text-primary">
          <Icon aria-hidden="true" className="size-5" />
        </div>
      </CardContent>
    </Card>
  )
}

export default function PayTrackApp() {
  const [employees, setEmployees] = useState([])
  const [payroll, setPayroll] = useState([])
  const [stats, setStats] = useState({})
  const [search, setSearch] = useState('')
  const [period, setPeriod] = useState(getDefaultPeriod())
  const [form, setForm] = useState(emptyForm)
  const [open, setOpen] = useState(false)
  const [busy, setBusy] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [darkMode, setDarkMode] = useState(false)
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const [activeNav, setActiveNav] = useState('Overview')
  const load = async () => {
    try {
      setError('')
      setLoading(true)
      const [employeeData, payrollData, statsData] = await Promise.all([
        apiRequest('/api/employees'),
        apiRequest(`/api/payroll?period=${period}`),
        apiRequest('/api/dashboard/stats'),
      ])
      setEmployees(employeeData)
      setPayroll(payrollData)
      setStats(statsData)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [period])

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

  const filtered = useMemo(
    () =>
      employees.filter((employee) =>
        [employee.name, employee.email, employee.position, employee.department].some(
          (value) => value?.toLowerCase().includes(search.toLowerCase())
        )
      ),
    [employees, search]
  )

  const update = (key, value) => setForm((current) => ({ ...current, [key]: value }))
  const updateNested = (group, key, value) =>
    setForm((current) => ({ ...current, [group]: { ...current[group], [key]: value } }))

  const createEmployee = async (event) => {
    event.preventDefault()
    setBusy(true)
    try {
      await apiRequest('/api/employees', {
        method: 'POST',
        body: JSON.stringify({
          ...form,
          baseSalary: Number(form.baseSalary),
          allowances: Object.fromEntries(
            Object.entries(form.allowances).map(([key, value]) => [key, Number(value || 0)])
          ),
          deductions: Object.fromEntries(
            Object.entries(form.deductions).map(([key, value]) => [key, Number(value || 0)])
          ),
        }),
      })
      setForm(emptyForm)
      setOpen(false)
      await load()
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  const calculate = async (employeeId) => {
    setBusy(true)
    try {
      await apiRequest('/api/payroll/calculate', {
        method: 'POST',
        body: JSON.stringify({ employeeId, period }),
      })
      await load()
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }
  return <div className="min-h-screen bg-muted/30"><Sidebar activeNav={activeNav} onNavigate={setActiveNav} /><Sidebar mobile open={mobileNavOpen} onClose={() => setMobileNavOpen(false)} activeNav={activeNav} onNavigate={setActiveNav} /><main className="min-h-screen lg:pl-64"><header className="sticky top-0 z-20 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80"><div className="mx-auto flex min-h-16 max-w-[1600px] items-center justify-between gap-3 px-4 sm:px-6 lg:px-8"><div className="flex min-w-0 items-center gap-3"><Button className="lg:hidden" variant="outline" size="icon" onClick={() => setMobileNavOpen(true)} aria-label="Open navigation" aria-expanded={mobileNavOpen}><Menu aria-hidden="true" /></Button><div className="lg:hidden"><Brand /></div><div className="hidden min-w-0 lg:block"><p className="truncate text-sm text-muted-foreground">Workspace</p><h1 className="truncate text-lg font-semibold">{activeNav}</h1></div></div><div className="flex shrink-0 items-center gap-1 sm:gap-2"><Button variant="ghost" size="icon" onClick={toggleTheme} aria-label={darkMode ? 'Switch to light theme' : 'Switch to dark theme'}>{darkMode ? <Sun aria-hidden="true" /> : <Moon aria-hidden="true" />}</Button><div className="hidden size-9 place-items-center rounded-full bg-primary/10 text-sm font-semibold text-primary sm:grid">AM</div></div></div></header><div className="mx-auto max-w-[1600px] p-4 sm:p-6 lg:p-8"><div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"><div><p className="text-sm text-muted-foreground">Welcome back</p><h2 className="mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">Payroll overview</h2><p className="mt-1 text-sm text-muted-foreground">Monitor your team and keep payroll moving.</p></div><div className="flex flex-wrap gap-2"><Select value={period} onValueChange={setPeriod}><SelectTrigger aria-label="Payroll period" className="h-9 min-w-40 rounded-lg border-border/80 bg-background font-medium shadow-sm hover:border-primary/50"><SelectValue placeholder="Select period" /></SelectTrigger><SelectContent align="end"><SelectItem value="2024-06">June 2024</SelectItem><SelectItem value="2024-05">May 2024</SelectItem><SelectItem value="2024-04">April 2024</SelectItem></SelectContent></Select><Dialog open={open} onOpenChange={setOpen}><DialogTrigger asChild><Button><Plus data-icon="inline-start" />Add employee</Button></DialogTrigger><DialogContent className="max-h-[90vh] overflow-y-auto"><DialogHeader><DialogTitle>Add employee</DialogTitle></DialogHeader><form onSubmit={createEmployee} className="grid gap-4"><div className="grid gap-4 sm:grid-cols-2">{[['name','Name'],['email','Email'],['position','Position'],['department','Department'],['baseSalary','Base salary']].map(([key, label]) => <div key={key} className="grid gap-2"><Label htmlFor={key}>{label}</Label><Input id={key} type={key === 'baseSalary' ? 'number' : key === 'email' ? 'email' : 'text'} required value={form[key]} onChange={(event) => update(key, event.target.value)} /></div>)}</div><div className="grid gap-4 sm:grid-cols-2"><div className="grid gap-2"><Label htmlFor="housing">Housing allowance</Label><Input id="housing" type="number" value={form.allowances.housing} onChange={(event) => updateNested('allowances', 'housing', event.target.value)} /></div><div className="grid gap-2"><Label htmlFor="transport">Transport allowance</Label><Input id="transport" type="number" value={form.allowances.transport} onChange={(event) => updateNested('allowances', 'transport', event.target.value)} /></div><div className="grid gap-2"><Label htmlFor="medical">Medical allowance</Label><Input id="medical" type="number" value={form.allowances.medical} onChange={(event) => updateNested('allowances', 'medical', event.target.value)} /></div></div><Button type="submit" disabled={busy}>{busy ? 'Saving...' : 'Save employee'}</Button></form></DialogContent></Dialog></div></div>{error && <div role="alert" className="mb-6 rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">{error}</div>}<section aria-label="Payroll summary" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"><StatCard label="Total payroll" value={formatCurrency(stats.totalPayroll)} detail="Current period" icon={CircleDollarSign} /><StatCard label="Employees" value={stats.employeeCount || employees.length} detail="Active team members" icon={Users} /><StatCard label="Average salary" value={formatCurrency(stats.averageSalary)} detail="Across your team" icon={BarChart3} /><StatCard label="Pending payroll" value={stats.pendingCount || 0} detail="Needs calculation" icon={FileText} /></section><section className="mt-6 grid gap-6 xl:grid-cols-[1.35fr_1fr]"><Card className="min-w-0"><CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"><div><CardTitle>Employees</CardTitle><p className="mt-1 text-sm text-muted-foreground">Search and manage your people.</p></div><div className="relative w-full sm:w-64"><Search aria-hidden="true" className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" /><Input aria-label="Search employees" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search employees" className="pl-9" /></div></CardHeader><CardContent><div className="overflow-x-auto"><Table><TableHeader><TableRow><TableHead>Name</TableHead><TableHead>Department</TableHead><TableHead>Salary</TableHead><TableHead className="text-right">Action</TableHead></TableRow></TableHeader><TableBody>{filtered.slice(0, 8).map((employee) => <TableRow key={employee.id}><TableCell><div className="font-medium">{employee.name}</div><div className="text-xs text-muted-foreground">{employee.position}</div></TableCell><TableCell>{employee.department}</TableCell><TableCell>{formatCurrency(employee.baseSalary)}</TableCell><TableCell className="text-right"><Button variant="outline" size="sm" disabled={busy} onClick={() => calculate(employee.id)}>Calculate</Button></TableCell></TableRow>)}</TableBody></Table></div>{!filtered.length && <p className="py-8 text-center text-sm text-muted-foreground">No employees found.</p>}</CardContent></Card><Card className="min-w-0"><CardHeader><CardTitle>Recent payroll</CardTitle><p className="mt-1 text-sm text-muted-foreground">Latest calculations for {period}.</p></CardHeader><CardContent className="grid gap-3">{payroll.slice(0, 6).map((item) => <div key={item.id} className="flex items-center justify-between gap-3 rounded-lg border p-3"><div className="min-w-0"><p className="truncate text-sm font-medium">{item.employeeName || item.name}</p><p className="text-xs text-muted-foreground">{item.period}</p></div><div className="text-right"><p className="font-medium">{formatCurrency(item.netSalary || item.netPay)}</p><Badge variant="secondary">{item.status || 'Processed'}</Badge></div></div>)}{!payroll.length && <p className="py-8 text-center text-sm text-muted-foreground">No payroll records yet.</p>}</CardContent></Card></section></div></main></div>
}
