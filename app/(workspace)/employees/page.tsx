'use client'

import { useEffect, useMemo, useState } from 'react'
import { Search, Users } from 'lucide-react'
import { PageShell } from '@/components/workspace/page-shell'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { apiRequest } from '@/lib/http/client'
import { formatCurrency } from '@/config/app'

type Employee = { id: string; name: string; email: string; position: string; department: string; baseSalary: number; status: string }

export default function EmployeesPage() {
  const [employees, setEmployees] = useState<Employee[]>([])
  const [search, setSearch] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    void apiRequest('/api/employees').then(setEmployees).catch((caught) => setError(caught instanceof Error ? caught.message : 'Unable to load employees.')).finally(() => setLoading(false))
  }, [])

  const results = useMemo(() => employees.filter((employee) => [employee.name, employee.email, employee.position, employee.department].some((value) => value.toLowerCase().includes(search.toLowerCase()))), [employees, search])

  return <PageShell eyebrow="People operations" title="Employees" description="Review your employee directory and compensation records."><Card><CardContent className="p-0"><div className="flex flex-col gap-4 border-b p-5 sm:flex-row sm:items-center sm:justify-between"><div className="flex items-center gap-3"><div className="rounded-lg bg-primary/10 p-2 text-primary"><Users className="size-5" /></div><p className="text-sm text-muted-foreground">{employees.length} team members</p></div><div className="relative w-full sm:w-72"><Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" /><Input aria-label="Search employees" className="pl-9" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search employees" /></div></div>{error && <p role="alert" className="m-5 rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">{error}</p>}<div className="overflow-x-auto"><Table><TableHeader><TableRow><TableHead>Employee</TableHead><TableHead>Department</TableHead><TableHead>Role</TableHead><TableHead>Base salary</TableHead><TableHead>Status</TableHead></TableRow></TableHeader><TableBody>{results.map((employee) => <TableRow key={employee.id}><TableCell><p className="font-medium">{employee.name}</p><p className="text-xs text-muted-foreground">{employee.email}</p></TableCell><TableCell>{employee.department}</TableCell><TableCell>{employee.position}</TableCell><TableCell>{formatCurrency(employee.baseSalary)}</TableCell><TableCell className="capitalize">{employee.status}</TableCell></TableRow>)}</TableBody></Table></div>{loading && <p className="p-8 text-center text-sm text-muted-foreground">Loading employees…</p>}{!loading && !results.length && <p className="p-8 text-center text-sm text-muted-foreground">No employees match this search. Add an employee from the dashboard to get started.</p>}</CardContent></Card></PageShell>
}
