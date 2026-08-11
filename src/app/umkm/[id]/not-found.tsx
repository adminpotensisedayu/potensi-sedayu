import Link from "next/link"

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4 text-center">
      <p className="text-5xl">🔍</p>
      <h2 className="font-display text-2xl text-ink">Data tidak ditemukan</h2>
      <p className="text-clay">Item yang kamu cari tidak ada atau sudah dihapus.</p>
      <Link href="/" className="text-sm text-primary underline">
        ← Kembali ke beranda
      </Link>
    </div>
  )
}