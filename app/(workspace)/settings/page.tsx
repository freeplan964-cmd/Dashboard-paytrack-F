import { PageShell } from '@/components/workspace/page-shell'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { appConfig } from '@/config/app'

export default function SettingsPage() {
  const { taxRates, allowanceFields, deductionFields } = appConfig.payroll
  return <PageShell eyebrow="Workspace controls" title="Settings" description="Review the payroll rules currently used for every calculation."><div className="grid gap-6 lg:grid-cols-2"><Card><CardHeader><CardTitle>Tax rules</CardTitle></CardHeader><CardContent className="grid gap-3 text-sm"><p className="flex justify-between"><span className="text-muted-foreground">Standard rate</span><span className="font-medium">{taxRates.rateLow * 100}% up to {taxRates.thresholdHigh.toLocaleString()}</span></p><p className="flex justify-between"><span className="text-muted-foreground">Higher rate</span><span className="font-medium">{taxRates.rateHigh * 100}% above {taxRates.thresholdHigh.toLocaleString()}</span></p></CardContent></Card><Card><CardHeader><CardTitle>Payroll fields</CardTitle></CardHeader><CardContent className="grid gap-3 text-sm"><p><span className="text-muted-foreground">Allowances: </span>{allowanceFields.join(', ')}</p><p><span className="text-muted-foreground">Manual deductions: </span>{deductionFields.join(', ')}</p><p className="pt-2 text-xs text-muted-foreground">These controls are intentionally read-only. Payroll rules are managed in the application configuration so calculations remain consistent and auditable.</p></CardContent></Card></div></PageShell>
}
