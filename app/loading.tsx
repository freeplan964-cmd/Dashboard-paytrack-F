export default function Loading() {
  return (
    <main className="min-h-screen bg-muted/30" aria-busy="true" aria-label="Loading PayTrack">
      <div className="flex min-h-screen">
        <aside className="hidden w-64 shrink-0 border-r bg-card p-6 lg:flex lg:flex-col lg:gap-8">
          <div className="flex items-center gap-3">
            <div className="size-9 animate-pulse rounded-xl bg-muted" />
            <div className="flex flex-1 flex-col gap-2">
              <div className="h-4 w-24 animate-pulse rounded bg-muted" />
              <div className="h-3 w-32 animate-pulse rounded bg-muted" />
            </div>
          </div>
          <div className="flex flex-col gap-3">
            {Array.from({ length: 5 }, (_, index) => (
              <div key={index} className="h-10 animate-pulse rounded-md bg-muted" />
            ))}
          </div>
        </aside>
        <section className="min-w-0 flex-1">
          <header className="border-b bg-background/95">
            <div className="mx-auto h-16 max-w-[1600px] animate-pulse bg-muted/40 px-4 sm:px-6 lg:px-8" />
          </header>
          <div className="mx-auto flex max-w-[1600px] flex-col gap-6 p-4 sm:p-6 lg:p-8">
            <div className="flex flex-col gap-3">
              <div className="h-4 w-24 animate-pulse rounded bg-muted" />
              <div className="h-9 w-64 animate-pulse rounded bg-muted" />
              <div className="h-4 w-80 max-w-full animate-pulse rounded bg-muted" />
            </div>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {Array.from({ length: 4 }, (_, index) => (
                <div key={index} className="h-32 animate-pulse rounded-xl border bg-card" />
              ))}
            </div>
            <div className="h-96 animate-pulse rounded-xl border bg-card" />
          </div>
        </section>
      </div>
    </main>
  )
}
