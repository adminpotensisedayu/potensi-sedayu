import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import {
  ArrowLeft, MapPin, Phone, Globe,
  BookOpen, User, Calendar, Hash,
  Award, ExternalLink, School, ChevronRight, Star,
} from "lucide-react"

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data } = await supabase.from("sekolah").select("nama, jenjang").eq("id", id).single()
  if (!data) return { title: "Sekolah Tidak Ditemukan" }
  return {
    title: `${data.nama} — Potensi Sedayu`,
    description: `Profil ${data.jenjang ?? "sekolah"} ${data.nama} di Desa Sedayu`,
  }
}

export default async function SekolahDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const [{ data: sekolah }, { data: related }] = await Promise.all([
    supabase
      .from("sekolah")
      .select("*")
      .eq("id", id)
      .eq("is_aktif", true)
      .single(),
    supabase
      .from("sekolah")
      .select("id, nama, jenjang, akreditasi, foto_url")
      .eq("is_aktif", true)
      .neq("id", id)
      .limit(4),
  ])

  if (!sekolah) notFound()

  const s = sekolah as any

  const mapsUrl = s.latitude && s.longitude
    ? `https://www.google.com/maps?q=${s.latitude},${s.longitude}`
    : null

  const jenjangColor: Record<string, string> = {
    SD:   "bg-green-100 text-green-700 dark:bg-green-950/40 dark:text-green-400",
    SMP:  "bg-blue-100  text-blue-700  dark:bg-blue-950/40  dark:text-blue-400",
    SMA:  "bg-purple-100 text-purple-700 dark:bg-purple-950/40 dark:text-purple-400",
    SMK:  "bg-orange-100 text-orange-700 dark:bg-orange-950/40 dark:text-orange-400",
    TK:   "bg-pink-100  text-pink-700  dark:bg-pink-950/40  dark:text-pink-400",
    PAUD: "bg-pink-100  text-pink-700  dark:bg-pink-950/40  dark:text-pink-400",
  }
  const jColor = jenjangColor[s.jenjang ?? ""] ?? "bg-teal-100 text-teal-700 dark:bg-teal-950/40 dark:text-teal-400"

  const infoItems = [
    s.alamat         && { icon: MapPin,   label: "Alamat",          value: s.alamat,         color: "text-teal-500",   bg: "bg-teal-50 dark:bg-teal-950/40"     },
    s.kepala_sekolah && { icon: User,     label: "Kepala Sekolah",  value: s.kepala_sekolah, color: "text-blue-500",   bg: "bg-blue-50 dark:bg-blue-950/40"     },
    s.npsn           && { icon: Hash,     label: "NPSN",            value: s.npsn,           color: "text-purple-500", bg: "bg-purple-50 dark:bg-purple-950/40" },
    s.tahun_berdiri  && { icon: Calendar, label: "Tahun Berdiri",   value: String(s.tahun_berdiri), color: "text-amber-500",  bg: "bg-amber-50 dark:bg-amber-950/40"   },
    s.akreditasi     && { icon: Award,    label: "Akreditasi",      value: s.akreditasi,     color: "text-green-600",  bg: "bg-green-50 dark:bg-green-950/40"   },
    s.status         && { icon: BookOpen, label: "Status",          value: s.status,         color: "text-gray-500",   bg: "bg-gray-50 dark:bg-gray-900/40"     },
    s.kontak         && { icon: Phone,    label: "Kontak",          value: s.kontak,         color: "text-pink-500",   bg: "bg-pink-50 dark:bg-pink-950/40"     },
  ].filter(Boolean) as Array<{ icon: any; label: string; value: string; color: string; bg: string }>

  return (
    <div className="min-h-screen bg-background">

      {/* ── Hero ── */}
      <div className="relative h-[50vw] max-h-[460px] min-h-[260px] w-full overflow-hidden bg-muted">
        {s.foto_url ? (
          <Image
            src={s.foto_url}
            alt={s.nama}
            fill
            className="object-cover"
            unoptimized={s.foto_url.startsWith("http")}
            priority
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <School className="size-20 text-muted-foreground/20" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/10" />

        {/* Back */}
        <Link
          href="/sekolah"
          className="absolute left-4 top-4 flex items-center gap-1.5 rounded-full border border-white/20 bg-black/40 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur-sm transition hover:bg-black/60"
        >
          <ArrowLeft className="size-3.5" />
          Kembali
        </Link>

        {/* Unggulan */}
        {s.is_unggulan && (
          <div className="absolute right-4 top-4 flex items-center gap-1.5 rounded-full bg-teal-500/90 px-3 py-1.5 backdrop-blur-sm">
            <Star className="size-3.5 fill-white text-white" />
            <span className="text-xs font-bold text-white">Unggulan</span>
          </div>
        )}

        {/* Title overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <div className="mb-2 flex flex-wrap items-center gap-2">
            {s.jenjang && (
              <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-bold text-white backdrop-blur-sm">
                {s.jenjang}
              </span>
            )}
            {s.akreditasi && (
              <span className="rounded-full bg-green-500/80 px-3 py-1 text-xs font-bold text-white backdrop-blur-sm">
                Akreditasi {s.akreditasi}
              </span>
            )}
          </div>
          <h1 className="font-serif text-2xl font-semibold leading-tight text-white drop-shadow-sm sm:text-3xl lg:text-4xl">
            {s.nama}
          </h1>
        </div>
      </div>

      {/* ── Content ── */}
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
        <div className="grid gap-8 lg:grid-cols-[1fr_300px]">

          {/* Left */}
          <div className="space-y-8">

            {/* Info grid */}
            <div className="grid gap-3 sm:grid-cols-2">
              {infoItems.map(({ icon: Icon, label, value, color, bg }) => (
                <div key={label} className="flex items-start gap-3 rounded-2xl border border-border bg-card p-4">
                  <div className={`flex size-9 shrink-0 items-center justify-center rounded-xl ${bg}`}>
                    <Icon className={`size-4 ${color}`} strokeWidth={1.5} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-muted-foreground">{label}</p>
                    <p className="mt-0.5 text-sm font-medium text-foreground leading-snug">{value}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Deskripsi */}
            {s.deskripsi && (
              <div>
                <h2 className="mb-3 font-serif text-xl text-foreground">Tentang Sekolah</h2>
                <p className="whitespace-pre-line leading-relaxed text-muted-foreground">{s.deskripsi}</p>
              </div>
            )}
          </div>

          {/* Right sticky */}
          <div className="space-y-4 lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-2xl border border-border bg-card p-5 space-y-3">
              <h3 className="font-semibold text-foreground">Info & Kontak</h3>

              {/* Jenjang chip */}
              {s.jenjang && (
                <div className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-bold ${jColor}`}>
                  <BookOpen className="size-3.5" strokeWidth={1.5} />
                  {s.jenjang}
                </div>
              )}

              {s.website && (
                <a
                  href={s.website.startsWith("http") ? s.website : `https://${s.website}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex w-full items-center justify-center gap-2.5 rounded-xl border border-border bg-background px-4 py-3 text-sm font-semibold text-foreground transition hover:bg-muted active:scale-[.98]"
                >
                  <Globe className="size-4 text-teal-500" strokeWidth={1.5} />
                  Kunjungi Website
                  <ExternalLink className="size-3.5 text-muted-foreground" />
                </a>
              )}

              {mapsUrl && (
                <a
                  href={mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex w-full items-center justify-center gap-2.5 rounded-xl border border-border bg-background px-4 py-3 text-sm font-semibold text-foreground transition hover:bg-muted active:scale-[.98]"
                >
                  <MapPin className="size-4 text-primary" strokeWidth={1.5} />
                  Lihat di Google Maps
                  <ExternalLink className="size-3.5 text-muted-foreground" />
                </a>
              )}

              <Link
                href="/peta"
                className="flex w-full items-center justify-center gap-2.5 rounded-xl border border-border bg-background px-4 py-3 text-sm font-semibold text-foreground transition hover:bg-muted active:scale-[.98]"
              >
                <MapPin className="size-4 text-teal-500" strokeWidth={1.5} />
                Lihat di Peta Desa
              </Link>
            </div>

            {/* Breadcrumb */}
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Link href="/" className="hover:text-foreground transition">Beranda</Link>
              <ChevronRight className="size-3" />
              <Link href="/sekolah" className="hover:text-foreground transition">Sekolah</Link>
              <ChevronRight className="size-3" />
              <span className="text-foreground truncate max-w-[120px]">{s.nama}</span>
            </div>
          </div>
        </div>

        {/* Related */}
        {(related ?? []).length > 0 && (
          <div className="mt-12">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-serif text-xl text-foreground">Sekolah Lainnya</h2>
              <Link href="/sekolah" className="flex items-center gap-1 text-sm font-medium text-primary hover:underline">
                Lihat Semua <ChevronRight className="size-4" />
              </Link>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {(related ?? []).map((r: any) => (
                <Link
                  key={r.id}
                  href={`/sekolah/${r.id}`}
                  className="group overflow-hidden rounded-2xl border border-border bg-card transition hover:border-teal-300 hover:shadow-md"
                >
                  <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                    {r.foto_url ? (
                      <Image
                        src={r.foto_url}
                        alt={r.nama}
                        fill
                        className="object-cover transition duration-500 group-hover:scale-105"
                        unoptimized={r.foto_url.startsWith("http")}
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <School className="size-8 text-muted-foreground/20" />
                      </div>
                    )}
                    {r.jenjang && (
                      <span className="absolute left-2 top-2 rounded-full bg-teal-500/90 px-2 py-0.5 text-[10px] font-bold text-white">
                        {r.jenjang}
                      </span>
                    )}
                  </div>
                  <div className="p-3">
                    <p className="text-xs text-muted-foreground">{r.akreditasi ? `Akreditasi ${r.akreditasi}` : ""}</p>
                    <p className="mt-0.5 text-sm font-semibold text-foreground line-clamp-2 leading-snug">{r.nama}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
