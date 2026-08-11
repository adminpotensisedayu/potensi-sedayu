import Link from "next/link"
import { School } from "lucide-react"

export default function SekolahNotFound() {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-32 text-center">
      <School className="size-10 text-muted-foreground/40" strokeWidth={1} />
      <p className="mt-4 text-lg font-medium text-foreground">Sekolah tidak ditemukan</p>
      <p className="mt-1 text-sm text-muted-foreground">
        Data ini mungkin sudah tidak aktif atau tidak tersedia.
      </p>
      <Link href="/sekolah" className="mt-6 text-sm text-primary hover:underline">
        Kembali ke Direktori Sekolah
      </Link>
    </div>
  )
}