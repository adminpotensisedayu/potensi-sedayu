// src/app/sekolah/[id]/page.tsx
import { notFound }    from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import Link            from "next/link"
import Image           from "next/image"
import {
  ArrowLeft, Star, MapPin, MessageCircle,
  Globe, User, Calendar, BookOpen, Navigation,
} from "lucide-react"

export const revalidate = 300

export default async function SekolahDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  const { data } = await supabase
    .from("sekolah")
    .select("*")
    .eq("id", id)
    .eq("is_aktif", true)
    .maybeSingle()

  if (!data) notFound()
  const s = data as any

  const photos = [s.foto_url, s.foto_url_2, s.foto_url_3].filter(Boolean) as string[]

  // WA number: 0812xxx → 62812xxx
  const waNumber = s.kontak
    ? s.kontak.replace(/\D/g, "").replace(/^0/, "62")
    : null

  // Google Maps directions (rute ke sini)
  const mapsDir =
    s.latitude && s.longitude
      ? `https://www.google.com/maps/dir/?api=1&destination=${s.latitude},${s.longitude}`
      : null

  return (
    <article className="mx-auto max-w-5xl px-6 py-12">
      {/* ── Back link ─────────────────────────────────────────────── */}
      <Link
        href="/sekolah"
        className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground transition hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Direktori Sekolah
      </Link>

      {/* ── Header ────────────────────────────────────────────────── */}
      <div className="mb-8">
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-[#0D9488]/10 px-3 py-0.5 text-sm font-bold text-[#0D9488]">
            {s.jenjang}
          </span>
          {s.status && (
            <span className="rounded-full bg-secondary px-3 py-0.5 text-sm text-muted-foreground">
              {s.status}
            </span>
          )}
          {s.akreditasi && (
            <span className="rounded-full border border-border px-3 py-0.5 text-sm text-muted-foreground">
              Akreditasi {s.akreditasi}
            </span>
          )}
        </div>
        <h1 className="font-serif text-3xl font-semibold text-foreground sm:text-4xl">
          {s.is_unggulan && (
            <Star
              className="mb-1 mr-2 inline size-6 fill-amber-500 text-amber-500"
              strokeWidth={0}
            />
          )}
          {s.nama}
        </h1>
        {s.alamat && (
          <p className="mt-3 flex items-center gap-2 text-muted-foreground">
            <MapPin className="size-4 shrink-0" />
            {s.alamat}
          </p>
        )}
      </div>

      {/* ── Gallery ───────────────────────────────────────────────── */}
      {photos.length > 0 && (
        <div className="mb-10">
          <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-muted">
            <Image
              src={photos[0]}
              alt={s.nama}
              fill
              className="object-cover"
              priority
            />
          </div>
          {photos.length > 1 && (
            <div className="mt-2 grid grid-cols-2 gap-2">
              {photos.slice(1).map((url, i) => (
                <div
                  key={i}
                  className="relative aspect-video overflow-hidden rounded-xl bg-muted"
                >
                  <Image
                    src={url}
                    alt={`${s.nama} foto ${i + 2}`}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── Body grid ─────────────────────────────────────────────── */}
      <div className="grid gap-10 lg:grid-cols-[1fr_300px]">
        {/* Left */}
        <div className="space-y-8">
          {s.deskripsi && (
            <div>
              <h2 className="mb-3 font-serif text-xl text-foreground">Tentang Sekolah</h2>
              <p className="leading-relaxed text-muted-foreground">{s.deskripsi}</p>
            </div>
          )}
          <div>
            <h2 className="mb-4 font-serif text-xl text-foreground">Informasi</h2>
            <dl className="space-y-4">
              {s.npsn && (
                <div className="flex gap-3">
                  <BookOpen className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                  <div>
                    <dt className="text-xs text-muted-foreground">NPSN</dt>
                    <dd className="font-mono text-sm font-medium text-foreground">{s.npsn}</dd>
                  </div>
                </div>
              )}
              {s.kepala_sekolah && (
                <div className="flex gap-3">
                  <User className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                  <div>
                    <dt className="text-xs text-muted-foreground">Kepala Sekolah</dt>
                    <dd className="text-sm font-medium text-foreground">{s.kepala_sekolah}</dd>
                  </div>
                </div>
              )}
              {s.tahun_berdiri && (
                <div className="flex gap-3">
                  <Calendar className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                  <div>
                    <dt className="text-xs text-muted-foreground">Tahun Berdiri</dt>
                    <dd className="text-sm font-medium text-foreground">{s.tahun_berdiri}</dd>
                  </div>
                </div>
              )}
            </dl>
          </div>
        </div>

        {/* Right — sticky contact card */}
        <div>
          <div className="sticky top-24 rounded-2xl border border-border bg-card p-5">
            <h3 className="mb-4 font-serif text-lg text-foreground">Kontak & Lokasi</h3>
            <div className="space-y-2">

              {/* WhatsApp — sama dengan UMKM */}
              {waNumber && (
                <a
                  href={`https://wa.me/${waNumber}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 rounded-xl bg-[#25D366]/10 border border-[#25D366]/20 px-4 py-3 text-sm font-medium text-foreground transition hover:bg-[#25D366]/20"
                >
                  <MessageCircle className="size-4 text-[#25D366]" />
                  Chat WhatsApp
                </a>
              )}

              {/* Website */}
              {s.website && (
                <a
                  href={s.website.startsWith("http") ? s.website : `https://${s.website}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 rounded-xl bg-[#0D9488] px-4 py-3 text-sm font-medium text-white transition hover:bg-[#0D9488]/90"
                >
                  <Globe className="size-4" />
                  Kunjungi Website
                </a>
              )}

              {/* Rute ke Sini — sama dengan UMKM */}
              {mapsDir && (
                <a
                  href={mapsDir}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 rounded-xl border border-border px-4 py-3 text-sm font-medium text-foreground transition hover:bg-muted"
                >
                  <Navigation className="size-4 text-[#0D9488]" />
                  Rute ke Sini
                </a>
              )}
            </div>

            {/* Quick facts */}
            <div className="mt-5 space-y-2 border-t border-border pt-5 text-sm">
              {[
                { label: "Jenjang",    val: s.jenjang },
                { label: "Status",     val: s.status },
                { label: "Akreditasi", val: s.akreditasi ? `Akreditasi ${s.akreditasi}` : null },
              ]
                .filter((x) => x.val)
                .map(({ label, val }) => (
                  <div key={label} className="flex items-center justify-between">
                    <span className="text-muted-foreground">{label}</span>
                    <span className="font-medium text-foreground">{val}</span>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </article>
  )
}