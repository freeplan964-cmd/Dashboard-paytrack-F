import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth/session'
import WorkspaceLayout from '@/components/workspace/workspace-layout'

export default function ProtectedWorkspaceLayout({ children }: { children: React.ReactNode }) {
  if (!getSession()) redirect('/login')

  return <WorkspaceLayout>{children}</WorkspaceLayout>
}
