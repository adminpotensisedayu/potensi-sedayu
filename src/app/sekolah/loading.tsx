export default function SekolahLoading() {
  return (
    <section className="mx-auto max-w-6xl animate-pulse px-6 py-16">
      <div className="mb-10 space-y-3">
        <div className="h-4 w-16 rounded bg-muted" />
        <div className="h-10 w-64 rounded bg-muted" />
        <div className="h-4 w-80 rounded bg-muted" />
      </div>
      <div className="mb-8 flex gap-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-8 w-16 rounded-full bg-muted" />
        ))}
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-64 rounded-2xl bg-muted" />
        ))}
      </div>
    </section>
  )
}