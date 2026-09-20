'use client'

import { useEffect, useState } from 'react'
import { FileText } from 'lucide-react'
import { PageShell } from '@/components/workspace/page-shell'
import { Card, CardContent } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { apiRequest } from '@/lib/http/client'
import { formatCurrency, getDefaultPeriod, getPayrollPeriods } from '@/config/app'

type PayrollRecord = { id: string; employeeName: string; period: string; grossSalary: number; taxAmount: number; totalDeductions: number; netSalary: number; status: string }
const periods = getPayrollPeriods()

export default function PayrollPage() {
  const [period, setPeriod] = useState(getDefaultPeriod())
  const [records, setRecords] = useState<PayrollRecord[]>([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => { setLoading(true); void apiRequest(`/api/payroll?period=${period}`).then(setRecords).catch((caught) => setError(caught instanceof Error ? caught.message : 'Unable to load payroll.')).finally(() => setLoading(false)) }, [period])

  return <PageShell eyebrow="Pay cycles" title="Payroll" description="Review calculated payroll records and their deductions for each pay period."><Card><CardContent className="p-0"><div className="flex items-center justify-between border-b p-5"><div className="flex items-center gap-3"><div className="rounded-lg bg-primary/10 p-2 text-primary"><FileText className="size-5" /></div><p className="text-sm text-muted-foreground">{records.length} calculated records</p></div><Select value={period} onValueChange={setPeriod}><SelectTrigger aria-label="Payroll period" className="w-36"><SelectValue /></SelectTrigger><SelectContent>{periods.map((value) => <SelectItem key={value} value={value}>{value}</SelectItem>)}</SelectContent></Select></div>{error && <p role="alert" className="m-5 rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">{error}</p>}<div className="overflow-x-auto"><Table><TableHeader><TableRow><TableHead>Employee</TableHead><TableHead>Gross pay</TableHead><TableHead>Tax</TableHead><TableHead>Deductions</TableHead><TableHead>Net pay</TableHead><TableHead>Status</TableHead></TableRow></TableHeader><TableBody>{records.map((record) => <TableRow key={record.id}><TableCell className="font-medium">{record.employeeName}</TableCell><TableCell>{formatCurrency(record.grossSalary)}</TableCell><TableCell>{formatCurrency(record.taxAmount)}</TableCell><TableCell>{formatCurrency(record.totalDeductions)}</TableCell><TableCell className="font-medium">{formatCurrency(record.netSalary)}</TableCell><TableCell><Badge variant="secondary" className="capitalize">{record.status}</Badge></TableCell></TableRow>)}</TableBody></Table></div>{loading && <p className="p-8 text-center text-sm text-muted-foreground">Loading payroll records…</p>}{!loading && !records.length && <p className="p-8 text-center text-sm text-muted-foreground">No payroll has been calculated for this period. Start from the dashboard.</p>}</CardContent></Card></PageShell>
}
