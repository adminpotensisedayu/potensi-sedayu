"use client"

export default function SekolahError({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-32 text-center">
      <p className="text-lg font-medium text-foreground">Gagal memuat data sekolah</p>
      <p className="mt-1 text-sm text-muted-foreground">Periksa koneksimu dan coba lagi.</p>
      <button
        onClick={reset}
        className="mt-6 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:bg-primary/90"
      >
        Coba lagi
      </button>
    </div>
  )
}