"use client"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 px-4 text-center">
      <p className="text-4xl">😕</p>
      <h2 className="font-serif text-xl text-foreground">Gagal memuat data</h2>
      <p className="max-w-sm text-sm text-muted-foreground">
        {error.message || "Terjadi kesalahan. Coba lagi sebentar."}
      </p>
      <button
        onClick={reset}
        className="rounded-lg bg-primary px-5 py-2 text-sm font-medium text-white hover:bg-primary/90"
      >
        Coba lagi
      </button>
    </div>
  )
}