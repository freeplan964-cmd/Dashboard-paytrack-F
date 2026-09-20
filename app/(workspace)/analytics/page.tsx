import { PageShell, ComingSoon } from '@/components/workspace/page-shell'

export default function AnalyticsPage() {
  return <PageShell eyebrow="Decision support" title="Analytics" description="Turn payroll and headcount data into a clear view of team cost, department trends, and operational health."><ComingSoon title="Department insights" detail="Analytics will load only for an authenticated workspace session, with period-aware totals and bounded data queries." /></PageShell>
}
