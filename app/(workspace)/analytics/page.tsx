'use client'

import { useEffect, useMemo, useState } from 'react'
import { BarChart3, Users } from 'lucide-react'
import { PageShell } from '@/components/workspace/page-shell'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { apiRequest } from '@/lib/http/client'
import { formatCurrency, getDefaultPeriod, getPayrollPeriods } from '@/config/app'

type DepartmentStat = { department: string; employeeCount: number; totalSalary: number; avgSalary: number }
const periods = getPayrollPeriods()

export default function AnalyticsPage() {
  const [period, setPeriod] = useState(getDefaultPeriod())
  const [departments, setDepartments] = useState<DepartmentStat[]>([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => { setLoading(true); void apiRequest(`/api/analytics/departments?period=${period}`).then(setDepartments).catch((caught) => setError(caught instanceof Error ? caught.message : 'Unable to load analytics.')).finally(() => setLoading(false)) }, [period])
  const totals = useMemo(() => ({ headcount: departments.reduce((sum, item) => sum + item.employeeCount, 0), payroll: departments.reduce((sum, item) => sum + item.totalSalary, 0) }), [departments])

  return <PageShell eyebrow="Decision support" title="Analytics" description="Compare department payroll totals and average pay for the selected period."><div className="mb-6 flex flex-wrap items-center justify-between gap-4"><div className="grid grid-cols-2 gap-3"><Card><CardContent className="flex items-center gap-3 p-4"><Users className="size-5 text-primary" /><div><p className="text-xs text-muted-foreground">Headcount</p><p className="font-semibold">{totals.headcount}</p></div></CardContent></Card><Card><CardContent className="flex items-center gap-3 p-4"><BarChart3 className="size-5 text-primary" /><div><p className="text-xs text-muted-foreground">Net payroll</p><p className="font-semibold">{formatCurrency(totals.payroll)}</p></div></CardContent></Card></div><Select value={period} onValueChange={setPeriod}><SelectTrigger aria-label="Analytics period" className="w-36"><SelectValue /></SelectTrigger><SelectContent>{periods.map((value) => <SelectItem key={value} value={value}>{value}</SelectItem>)}</SelectContent></Select></div>{error && <p role="alert" className="mb-6 rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">{error}</p>}<section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{departments.map((department) => <Card key={department.department}><CardHeader><CardTitle className="text-base">{department.department}</CardTitle></CardHeader><CardContent className="grid gap-4"><div className="flex justify-between text-sm"><span className="text-muted-foreground">Team members</span><span className="font-medium">{department.employeeCount}</span></div><div className="flex justify-between text-sm"><span className="text-muted-foreground">Net payroll</span><span className="font-medium">{formatCurrency(department.totalSalary)}</span></div><div className="flex justify-between text-sm"><span className="text-muted-foreground">Average pay</span><span className="font-medium">{formatCurrency(department.avgSalary)}</span></div></CardContent></Card>)}</section>{loading && <p className="py-8 text-center text-sm text-muted-foreground">Loading department analytics…</p>}{!loading && !departments.length && <Card><CardContent className="p-8 text-center text-sm text-muted-foreground">No department payroll data exists for this period.</CardContent></Card>}</PageShell>
}
