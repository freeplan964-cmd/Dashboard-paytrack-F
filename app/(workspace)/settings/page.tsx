import { PageShell, ComingSoon } from '@/components/workspace/page-shell'

export default function SettingsPage() {
  return <PageShell eyebrow="Workspace controls" title="Settings" description="Configure workspace preferences, payroll defaults, and access controls without scattering configuration across the app."><ComingSoon title="Workspace settings" detail="Settings are intentionally gated until session authentication is connected, so organization preferences cannot be changed anonymously." /></PageShell>
}
