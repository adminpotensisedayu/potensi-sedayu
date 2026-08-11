import Image from "next/image"
import Link from "next/link"
import { Store } from "lucide-react"  // ← Ganti Sprout jadi Store
import { Badge } from "@/components/ui/badge"

type Umkm = {
  id: string
  nama_usaha: string
  deskripsi: string | null
  foto_url: string | null
  is_unggulan: boolean | null
  kategori?: { nama: string } | null
}

export function UmkmCard({ u }: { u: Umkm }) {
  return (
    <Link
      href={"/umkm/" + u.id}
      className="group overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition hover:-translate-y-0.5 hover:shadow-md active:scale-[.99]"
    >
      {/* Photo */}
      <div className="relative aspect-[3/2] overflow-hidden bg-muted">
        {u.foto_url ? (
          <Image
            src={u.foto_url}
            alt={u.nama_usaha}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover transition duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-muted-foreground/30">
            <Store className="size-10" />  {/* ← Store lebih tepat dari Sprout */}
          </div>
        )}
        {u.is_unggulan ? (
          <Badge className="absolute left-3 top-3">Unggulan</Badge>
        ) : null}
      </div>

      {/* Info */}
      <div className="p-4">
        {u.kategori?.nama ? (
          <p className="mb-1 text-xs font-medium text-sector-umkm">
            {u.kategori.nama}
          </p>
        ) : null}
        <h3 className="font-serif text-lg text-foreground">{u.nama_usaha}</h3>
        <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
          {u.deskripsi}
        </p>
      </div>
    </Link>
  )
}