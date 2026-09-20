import type { ReactNode } from 'react'

export function PageShell({ title, eyebrow, description, children }: { title: string; eyebrow: string; description: string; children: ReactNode }) {
  return (
    <div className="mx-auto max-w-[1600px] p-4 sm:p-6 lg:p-8">
      <div className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-[.18em] text-primary">{eyebrow}</p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">{title}</h1>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">{description}</p>
      </div>
      {children}
    </div>
  )
}

export function ComingSoon({ title, detail }: { title: string; detail: string }) {
  return <section className="rounded-3xl border border-border/70 bg-card p-8 shadow-sm"><h2 className="text-xl font-semibold">{title}</h2><p className="mt-3 max-w-xl leading-7 text-muted-foreground">{detail}</p><p className="mt-6 inline-flex rounded-full bg-primary/10 px-3 py-1.5 text-sm font-medium text-primary">Session access required</p></section>
}
