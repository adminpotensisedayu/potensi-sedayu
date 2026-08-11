import Link from "next/link"
import Image from "next/image"
import { Star, MapPin, BookOpen } from "lucide-react"

type SekolahCardProps = {
  s: {
    id: string
    nama: string
    jenjang: string
    status?: string | null
    akreditasi?: string | null
    alamat?: string | null
    foto_url?: string | null
    is_unggulan?: boolean
  }
}

const JENJANG_COLOR: Record<string, string> = {
  TK:  "bg-pink-50 text-pink-600 dark:bg-pink-950 dark:text-pink-300",
  SD:  "bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-300",
  SMP: "bg-teal-50 text-[#0D9488] dark:bg-teal-950",
  SMA: "bg-purple-50 text-purple-600 dark:bg-purple-950 dark:text-purple-300",
  SMK: "bg-orange-50 text-orange-600 dark:bg-orange-950 dark:text-orange-300",
  SLB: "bg-yellow-50 text-yellow-600 dark:bg-yellow-950 dark:text-yellow-300",
}

export function SekolahCard({ s }: SekolahCardProps) {
  const jenjangCls = JENJANG_COLOR[s.jenjang] ?? "bg-muted text-muted-foreground"

  return (
    <Link
      href={`/sekolah/${s.id}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card transition hover:-translate-y-0.5 hover:shadow-md"
    >
      {/* Foto */}
      <div className="relative aspect-video overflow-hidden bg-muted">
        {s.foto_url ? (
          <Image
            src={s.foto_url}
            alt={s.nama}
            fill
            className="object-cover transition group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <BookOpen className="size-10 text-muted-foreground/25" strokeWidth={1} />
          </div>
        )}
        {s.is_unggulan && (
          <div className="absolute left-3 top-3 flex items-center gap-1 rounded-full bg-amber-500/90 px-2 py-0.5 text-xs font-medium text-white backdrop-blur">
            <Star className="size-3 fill-white" strokeWidth={0} />
            Unggulan
          </div>
        )}
        <div className={`absolute right-3 top-3 rounded-full px-2.5 py-0.5 text-xs font-bold backdrop-blur ${jenjangCls}`}>
          {s.jenjang}
        </div>
      </div>

      {/* Info */}
      <div className="flex flex-1 flex-col p-5">
        <h3 className="line-clamp-2 font-serif text-lg font-semibold leading-snug text-foreground">
          {s.nama}
        </h3>
        <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
          {s.status && (
            <span className="text-xs text-muted-foreground">{s.status}</span>
          )}
          {s.status && s.akreditasi && (
            <span className="text-xs text-muted-foreground">·</span>
          )}
          {s.akreditasi && (
            <span className="text-xs font-medium text-[#0D9488]">Akreditasi {s.akreditasi}</span>
          )}
        </div>
        {s.alamat && (
          <p className="mt-auto flex items-start gap-1.5 pt-3 text-xs text-muted-foreground">
            <MapPin className="mt-0.5 size-3 shrink-0" />
            <span className="line-clamp-1">{s.alamat}</span>
          </p>
        )}
      </div>
    </Link>
  )
}