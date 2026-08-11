export default function SekolahDetailLoading() {
  return (
    <article className="mx-auto max-w-5xl animate-pulse px-6 py-12">
      <div className="mb-8 h-4 w-40 rounded bg-muted" />
      <div className="mb-8 space-y-3">
        <div className="flex gap-2">
          <div className="h-6 w-14 rounded-full bg-muted" />
          <div className="h-6 w-20 rounded-full bg-muted" />
        </div>
        <div className="h-10 w-96 rounded bg-muted" />
        <div className="h-4 w-64 rounded bg-muted" />
      </div>
      <div className="mb-10 aspect-video w-full rounded-2xl bg-muted" />
      <div className="grid gap-10 lg:grid-cols-[1fr_300px]">
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-4 rounded bg-muted" style={{ width: `${70 + i * 5}%` }} />
          ))}
        </div>
        <div className="h-72 rounded-2xl bg-muted" />
      </div>
    </article>
  )
}