import Link from "next/link"

export default function NotFound() {
  return (
    <main className="flex min-h-[70vh] flex-col items-center justify-center gap-6 px-4 text-center">
      <p className="font-display text-8xl font-bold text-primary/20">404</p>
      <h1 className="font-display text-2xl text-ink">Halaman tidak ditemukan</h1>
      <p className="max-w-sm text-clay">
        Halaman yang kamu cari tidak ada atau sudah dipindahkan.
      </p>
      <Link
        href="/"
        className="rounded-xl bg-primary px-6 py-2.5 text-sm font-medium text-white hover:bg-primary/90"
      >
        Kembali ke Beranda
      </Link>
    </main>
  )
}