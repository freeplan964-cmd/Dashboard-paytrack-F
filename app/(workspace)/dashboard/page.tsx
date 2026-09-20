'use client'

import { useEffect, useMemo, useState, type FormEvent } from 'react'
import { BarChart3, CircleDollarSign, FileText, Plus, Search, Users } from 'lucide-react'
import type { DashboardStats } from '@/features/dashboard/types'
import { apiRequest } from '@/lib/http/client'
import { formatCurrency, getDefaultPeriod, getEmptyEmployeeForm, getPayrollPeriods } from '@/config/app'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'

type Employee = {
  id: string
  name: string
  email: string
  position: string
  department: string
  baseSalary: number
}

type PayrollRecord = {
  id: string
  employeeName: string
  period: string
  netSalary: number
  status: string
}

const periods = getPayrollPeriods()
const moneyFields = [
  ['housing', 'Housing allowance', 'allowances'],
  ['transport', 'Transport allowance', 'allowances'],
  ['medical', 'Medical allowance', 'allowances'],
  ['insurance', 'Insurance deduction', 'deductions'],
  ['loan', 'Loan deduction', 'deductions'],
] as const

function StatCard({ label, value, detail, icon: Icon }: { label: string; value: string | number; detail: string; icon: typeof Users }) {
  return <Card className="border-border/70 shadow-sm"><CardContent className="flex items-start justify-between p-5"><div><p className="text-sm text-muted-foreground">{label}</p><p className="mt-2 text-2xl font-semibold tracking-tight">{value}</p><p className="mt-1 text-xs text-muted-foreground">{detail}</p></div><div className="rounded-lg bg-primary/10 p-2.5 text-primary"><Icon aria-hidden="true" className="size-5" /></div></CardContent></Card>
}

export default function DashboardPage() {
  const [employees, setEmployees] = useState<Employee[]>([])
  const [payroll, setPayroll] = useState<PayrollRecord[]>([])
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [period, setPeriod] = useState(getDefaultPeriod())
  const [search, setSearch] = useState('')
  const [form, setForm] = useState(getEmptyEmployeeForm())
  const [dialogOpen, setDialogOpen] = useState(false)
  const [busy, setBusy] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const load = async () => {
    try {
      setError('')
      setLoading(true)
      const [employeeData, payrollData, statsData] = await Promise.all([
        apiRequest('/api/employees'),
        apiRequest(`/api/payroll?period=${period}`),
        apiRequest(`/api/dashboard/stats?period=${period}`),
      ])
      setEmployees(employeeData)
      setPayroll(payrollData)
      setStats(statsData)
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Unable to load workspace data.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { void load() }, [period])

  const filteredEmployees = useMemo(() => employees.filter((employee) =>
    [employee.name, employee.email, employee.position, employee.department]
      .some((value) => value.toLowerCase().includes(search.toLowerCase()))
  ), [employees, search])

  const updateForm = (key: string, value: string) => setForm((current) => ({ ...current, [key]: value }))
  const updateMoney = (group: 'allowances' | 'deductions', key: string, value: string) =>
    setForm((current) => ({ ...current, [group]: { ...current[group], [key]: value } }))

  const createEmployee = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    try {
      setBusy(true)
      await apiRequest('/api/employees', {
        method: 'POST',
        body: JSON.stringify({
          ...form,
          baseSalary: Number(form.baseSalary),
          allowances: Object.fromEntries(Object.entries(form.allowances).map(([key, value]) => [key, Number(value || 0)])),
          deductions: Object.fromEntries(Object.entries(form.deductions).map(([key, value]) => [key, Number(value || 0)])),
        }),
      })
      setDialogOpen(false)
      setForm(getEmptyEmployeeForm())
      await load()
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Unable to save employee.')
    } finally {
      setBusy(false)
    }
  }

  const calculatePayroll = async (employeeId: string) => {
    try {
      setBusy(true)
      await apiRequest('/api/payroll/calculate', { method: 'POST', body: JSON.stringify({ employeeId, period }) })
      await load()
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Unable to calculate payroll.')
    } finally {
      setBusy(false)
    }
  }

  return <div className="mx-auto max-w-[1600px] p-4 sm:p-6 lg:p-8">
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"><div><p className="text-sm text-muted-foreground">Welcome back</p><h1 className="mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">Payroll overview</h1><p className="mt-1 text-sm text-muted-foreground">Monitor your team and keep payroll moving.</p></div><div className="flex flex-wrap gap-2"><Select value={period} onValueChange={setPeriod}><SelectTrigger aria-label="Payroll period" className="min-w-36"><SelectValue /></SelectTrigger><SelectContent>{periods.map((value) => <SelectItem key={value} value={value}>{value}</SelectItem>)}</SelectContent></Select><Dialog open={dialogOpen} onOpenChange={setDialogOpen}><DialogTrigger asChild><Button><Plus className="mr-2 size-4" />Add employee</Button></DialogTrigger><DialogContent className="max-h-[90vh] overflow-y-auto"><DialogHeader><DialogTitle>Add employee</DialogTitle></DialogHeader><form onSubmit={createEmployee} className="grid gap-4"><div className="grid gap-4 sm:grid-cols-2">{[['name', 'Name', 'text'], ['email', 'Email', 'email'], ['position', 'Position', 'text'], ['department', 'Department', 'text'], ['baseSalary', 'Base salary', 'number']].map(([key, label, type]) => <div key={key} className="grid gap-2"><Label htmlFor={key}>{label}</Label><Input id={key} type={type} required value={form[key]} onChange={(event) => updateForm(key, event.target.value)} /></div>)}</div><div className="grid gap-4 sm:grid-cols-2">{moneyFields.map(([key, label, group]) => <div key={key} className="grid gap-2"><Label htmlFor={key}>{label}</Label><Input id={key} type="number" min="0" value={form[group][key]} onChange={(event) => updateMoney(group, key, event.target.value)} /></div>)}</div><Button type="submit" disabled={busy}>{busy ? 'Saving…' : 'Save employee'}</Button></form></DialogContent></Dialog></div></div>
    {error && <p role="alert" className="mb-6 rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">{error}</p>}
    <section aria-label="Payroll summary" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"><StatCard label="Total payroll" value={formatCurrency(stats?.totalPayroll || 0)} detail="Current period" icon={CircleDollarSign} /><StatCard label="Employees" value={stats?.employeeCount || employees.length} detail="Active team members" icon={Users} /><StatCard label="Average salary" value={formatCurrency(stats?.averageSalary || 0)} detail="Across processed payroll" icon={BarChart3} /><StatCard label="Pending payroll" value={stats?.pendingCount || 0} detail="Needs calculation" icon={FileText} /></section>
    <section className="mt-6 grid gap-6 xl:grid-cols-[1.35fr_1fr]"><Card><CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"><div><CardTitle>Employees</CardTitle><p className="mt-1 text-sm text-muted-foreground">Calculate payroll for the selected period.</p></div><div className="relative w-full sm:w-64"><Search aria-hidden="true" className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" /><Input aria-label="Search employees" className="pl-9" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search employees" /></div></CardHeader><CardContent><div className="overflow-x-auto"><Table><TableHeader><TableRow><TableHead>Name</TableHead><TableHead>Department</TableHead><TableHead>Salary</TableHead><TableHead className="text-right">Action</TableHead></TableRow></TableHeader><TableBody>{filteredEmployees.slice(0, 8).map((employee) => <TableRow key={employee.id}><TableCell><p className="font-medium">{employee.name}</p><p className="text-xs text-muted-foreground">{employee.position}</p></TableCell><TableCell>{employee.department}</TableCell><TableCell>{formatCurrency(employee.baseSalary)}</TableCell><TableCell className="text-right"><Button variant="outline" size="sm" disabled={busy} onClick={() => void calculatePayroll(employee.id)}>Calculate</Button></TableCell></TableRow>)}</TableBody></Table></div>{loading && <p className="py-6 text-center text-sm text-muted-foreground">Loading workspace data…</p>}{!loading && !filteredEmployees.length && <p className="py-6 text-center text-sm text-muted-foreground">No employees found.</p>}</CardContent></Card><Card><CardHeader><CardTitle>Recent payroll</CardTitle><p className="mt-1 text-sm text-muted-foreground">Latest calculations for {period}.</p></CardHeader><CardContent className="grid gap-3">{payroll.slice(0, 6).map((record) => <div key={record.id} className="flex items-center justify-between rounded-lg border p-3"><div><p className="text-sm font-medium">{record.employeeName}</p><p className="text-xs text-muted-foreground">{record.period}</p></div><div className="text-right"><p className="font-medium">{formatCurrency(record.netSalary)}</p><Badge variant="secondary">{record.status}</Badge></div></div>)}{!loading && !payroll.length && <p className="py-6 text-center text-sm text-muted-foreground">No payroll records yet.</p>}</CardContent></Card></section>
  </div>
}
