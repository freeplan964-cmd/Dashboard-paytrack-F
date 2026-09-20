import { PageShell, ComingSoon } from '@/components/workspace/page-shell'

export default function PayrollPage() {
  return <PageShell eyebrow="Pay cycles" title="Payroll" description="Review payroll periods, calculate compensation, and keep every run traceable. "><ComingSoon title="Payroll runs" detail="Payroll calculations are protected by session authentication. Sign in to review periods and run payroll without exposing sensitive compensation data." /></PageShell>
}
