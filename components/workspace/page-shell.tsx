import type { ReactNode } from 'react'
import Link from 'next/link'
import { ArrowLeft, CircleDollarSign } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function PageShell({ title, eyebrow, description, children }: { title: string; eyebrow: string; description: string; children: ReactNode }) {
  return <main className="min-h-screen bg-muted/30"><header className="border-b bg-background"><div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-5 sm:px-8"><Link href="/" className="flex items-center gap-3"><span className="grid size-9 place-items-center rounded-xl bg-primary text-primary-foreground"><CircleDollarSign className="size-5" aria-hidden="true" /></span><span className="font-semibold tracking-tight">PayTrack</span></Link><Button variant="outline" asChild><Link href="/dashboard"><ArrowLeft className="mr-2 size-4" />Dashboard</Link></Button></div></header><div className="mx-auto max-w-6xl px-5 py-12 sm:px-8"><p className="text-sm font-semibold uppercase tracking-[.18em] text-primary">{eyebrow}</p><h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">{title}</h1><p className="mt-3 max-w-2xl text-muted-foreground">{description}</p><div className="mt-10">{children}</div></div></main>
}

export function ComingSoon({ title, detail }: { title: string; detail: string }) {
  return <section className="rounded-3xl border border-border/70 bg-card p-8 shadow-sm"><h2 className="text-xl font-semibold">{title}</h2><p className="mt-3 max-w-xl leading-7 text-muted-foreground">{detail}</p><p className="mt-6 inline-flex rounded-full bg-primary/10 px-3 py-1.5 text-sm font-medium text-primary">Session access required</p></section>
}
