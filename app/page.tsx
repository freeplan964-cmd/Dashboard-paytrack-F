'use client'

import Link from 'next/link'
import { ArrowRight, Check, CircleDollarSign, Menu, ShieldCheck, Sparkles, X, Zap } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'

const features = [
  { icon: Zap, title: 'Payroll without the drag', text: 'Run accurate payroll calculations in a few focused steps, not a maze of spreadsheets.' },
  { icon: ShieldCheck, title: 'Built for confident decisions', text: 'Keep people, compensation, and payroll records aligned in one dependable workspace.' },
  { icon: Sparkles, title: 'Clarity at a glance', text: 'See headcount, payroll totals, and team trends without digging through reports.' },
]

const workflow = ['Add your team once', 'Review compensation details', 'Calculate and track each period']

function Brand() {
  return <Link href="/" className="flex items-center gap-3" aria-label="PayTrack home"><span className="grid size-10 place-items-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/20"><CircleDollarSign className="size-5" aria-hidden="true" /></span><span><span className="block text-base font-semibold tracking-tight">PayTrack</span><span className="block text-[11px] text-muted-foreground">Payroll, made clear.</span></span></Link>
}

export default function HomePage() {
  const [menuOpen, setMenuOpen] = useState(false)
  return <main className="min-h-screen overflow-hidden bg-background">
    <header className="border-b border-border/70 bg-background/85 backdrop-blur-xl">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 sm:px-8">
        <Brand />
        <nav className="hidden items-center gap-8 text-sm text-muted-foreground md:flex" aria-label="Main navigation">
          <a href="#features" className="transition-colors hover:text-foreground">Features</a>
          <a href="#workflow" className="transition-colors hover:text-foreground">How it works</a>
          <a href="#trust" className="transition-colors hover:text-foreground">Why PayTrack</a>
        </nav>
        <div className="hidden items-center gap-3 md:flex"><Link href="/dashboard" className="text-sm font-medium text-muted-foreground hover:text-foreground">Open dashboard</Link><Button asChild><Link href="/dashboard">Get started <ArrowRight className="ml-2 size-4" aria-hidden="true" /></Link></Button></div>
        <Button variant="outline" size="icon" className="md:hidden" onClick={() => setMenuOpen(!menuOpen)} aria-label={menuOpen ? 'Close navigation' : 'Open navigation'} aria-expanded={menuOpen}>{menuOpen ? <X /> : <Menu />}</Button>
      </div>
      {menuOpen && <nav className="border-t px-5 py-4 md:hidden" aria-label="Mobile navigation"><div className="flex flex-col gap-3 text-sm"><a href="#features" onClick={() => setMenuOpen(false)}>Features</a><a href="#workflow" onClick={() => setMenuOpen(false)}>How it works</a><Link href="/dashboard" className="font-medium text-primary">Open dashboard <ArrowRight className="ml-1 inline size-4" /></Link></div></nav>}
    </header>

    <section className="relative mx-auto grid max-w-7xl gap-14 px-5 pb-20 pt-16 sm:px-8 sm:pt-24 lg:grid-cols-[1.05fr_.95fr] lg:items-center lg:gap-20 lg:pb-28">
      <div className="absolute -left-24 -top-24 -z-0 size-72 rounded-full bg-primary/10 blur-3xl" aria-hidden="true" />
      <div className="relative z-10 max-w-2xl"><div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1.5 text-xs font-medium text-primary"><span className="size-1.5 rounded-full bg-primary" />A clearer way to run payroll</div><h1 className="text-5xl font-semibold tracking-[-.045em] text-foreground sm:text-6xl lg:text-7xl">Make every payroll day feel <span className="text-primary">under control.</span></h1><p className="mt-6 max-w-xl text-lg leading-8 text-muted-foreground">PayTrack brings your team, compensation, and payroll operations into one calm, focused workspace—so you can spend less time reconciling and more time moving forward.</p><div className="mt-9 flex flex-col gap-3 sm:flex-row"><Button size="lg" asChild><Link href="/dashboard">Explore the dashboard <ArrowRight className="ml-2 size-4" /></Link></Button><Button size="lg" variant="outline" asChild><a href="#features">See what&apos;s inside</a></Button></div><div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm text-muted-foreground"><span className="flex items-center gap-2"><Check className="size-4 text-primary" />Team visibility</span><span className="flex items-center gap-2"><Check className="size-4 text-primary" />Payroll clarity</span><span className="flex items-center gap-2"><Check className="size-4 text-primary" />Built to scale</span></div></div>
      <div className="relative z-10 rounded-[2rem] border border-border/70 bg-card p-3 shadow-2xl shadow-primary/10"><div className="rounded-[1.5rem] bg-slate-950 p-5 text-white sm:p-7"><div className="flex items-center justify-between"><div><p className="text-xs text-slate-400">Payroll overview</p><p className="mt-1 text-2xl font-semibold">March 2025</p></div><span className="rounded-full bg-emerald-400/15 px-3 py-1 text-xs font-medium text-emerald-300">On track</span></div><div className="mt-8 grid grid-cols-2 gap-3"><div className="rounded-2xl bg-white/10 p-4"><p className="text-xs text-slate-400">Total payroll</p><p className="mt-2 text-xl font-semibold">$284,920</p><p className="mt-1 text-xs text-emerald-300">+8.4% this period</p></div><div className="rounded-2xl bg-white/10 p-4"><p className="text-xs text-slate-400">Active team</p><p className="mt-2 text-xl font-semibold">48 people</p><p className="mt-1 text-xs text-slate-400">Across 6 departments</p></div></div><div className="mt-4 rounded-2xl bg-white/10 p-4"><div className="flex items-center justify-between text-xs text-slate-400"><span>Payroll activity</span><span>Last 6 months</span></div><div className="mt-6 flex h-28 items-end gap-2">{[42,58,48,76,65,92,82,100].map((height, index) => <div key={index} className="flex-1 rounded-t-md bg-gradient-to-t from-blue-500 to-cyan-300" style={{ height: `${height}%`, opacity: .45 + index * .07 }} />)}</div></div><div className="mt-4 flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-4"><div className="grid size-9 place-items-center rounded-xl bg-emerald-400/15"><Check className="size-4 text-emerald-300" /></div><div><p className="text-sm font-medium">April payroll ready</p><p className="text-xs text-slate-400">All employee records are up to date</p></div></div></div></div>
    </section>

    <section id="features" className="border-y border-border/70 bg-muted/30"><div className="mx-auto max-w-7xl px-5 py-20 sm:px-8"><div className="max-w-2xl"><p className="text-sm font-semibold uppercase tracking-[.18em] text-primary">One focused workspace</p><h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">Everything you need to keep payroll moving.</h2></div><div className="mt-12 grid gap-5 md:grid-cols-3">{features.map(({ icon: Icon, title, text }) => <article key={title} className="rounded-3xl border border-border/70 bg-card p-7"><div className="grid size-11 place-items-center rounded-2xl bg-primary/10 text-primary"><Icon className="size-5" /></div><h3 className="mt-6 text-lg font-semibold">{title}</h3><p className="mt-3 leading-7 text-muted-foreground">{text}</p></article>)}</div></div></section>

    <section id="workflow" className="mx-auto grid max-w-7xl gap-12 px-5 py-20 sm:px-8 lg:grid-cols-[.8fr_1.2fr] lg:items-center"><div><p className="text-sm font-semibold uppercase tracking-[.18em] text-primary">A simpler rhythm</p><h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">From employee records to confident payroll.</h2><p className="mt-5 leading-7 text-muted-foreground">Give your operations team a shared source of truth. PayTrack keeps the process visible, repeatable, and ready for the next period.</p><Button className="mt-7" variant="outline" asChild><Link href="/dashboard">View the workspace <ArrowRight className="ml-2 size-4" /></Link></Button></div><div className="space-y-3">{workflow.map((item, index) => <div key={item} className="flex items-center gap-5 rounded-2xl border border-border/70 bg-card p-5"><span className="grid size-10 shrink-0 place-items-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">0{index + 1}</span><span className="font-medium">{item}</span><Check className="ml-auto size-5 text-primary" /></div>)}</div></section>

    <section id="trust" className="mx-5 mb-20 rounded-[2rem] bg-primary px-6 py-14 text-primary-foreground sm:mx-8 sm:px-12 lg:mx-auto lg:max-w-7xl"><div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-center"><div className="max-w-2xl"><p className="text-sm font-semibold uppercase tracking-[.18em] text-primary-foreground/70">Ready when you are</p><h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">Bring a little more calm to payroll day.</h2></div><Button size="lg" variant="secondary" asChild><Link href="/dashboard">Open PayTrack <ArrowRight className="ml-2 size-4" /></Link></Button></div></section>

    <footer className="border-t border-border/70"><div className="mx-auto flex max-w-7xl flex-col gap-6 px-5 py-10 sm:px-8 md:flex-row md:items-center md:justify-between"><Brand /><div className="flex flex-wrap gap-5 text-sm text-muted-foreground"><a href="#features" className="hover:text-foreground">Features</a><a href="#workflow" className="hover:text-foreground">How it works</a><Link href="/dashboard" className="hover:text-foreground">Dashboard</Link></div><p className="text-xs text-muted-foreground">© 2025 PayTrack. Payroll, made clear.</p></div></footer>
  </main>
}
