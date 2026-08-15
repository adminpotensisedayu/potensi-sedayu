import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import {
  ArrowLeft, MapPin, Clock, MessageCircle,
  Tag, Star, ExternalLink, Store, ChevronRight,
} from "lucide-react"

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data } = await supabase.from("umkm").select("nama_usaha, deskripsi").eq("id", id).single()
  if (!data) return { title: "UMKM Tidak Ditemukan" }
  return {
    title: `${data.nama_usaha} — Potensi Sedayu`,
    description: data.deskripsi?.slice(0, 150) ?? `Detail UMKM ${data.nama_usaha} di Desa Sedayu`,
  }
}

export default async function UmkmDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const [{ data: umkm }, { data: related }] = await Promise.all([
    supabase
      .from("umkm")
      .select("*, kategori:kategori_id(nama), sub_kategori:sub_kategori_id(nama)")
      .eq("id", id)
      .eq("is_aktif", true)
      .single(),
    supabase
      .from("umkm")
      .select("id, nama_usaha, foto_url, kategori:kategori_id(nama)")
      .eq("is_aktif", true)
      .neq("id", id)
      .limit(4),
  ])

  if (!umkm) notFound()

  const u = umkm as any
  const fotos = [u.foto_url, u.foto_url_2, u.foto_url_3].filter(Boolean) as string[]
  const mainFoto = fotos[0]
  const extraFotos = fotos.slice(1)

  const waUrl = u.whatsapp
    ? `https://wa.me/${String(u.whatsapp).replace(/\D/g, "")}?text=Halo%2C saya tertarik dengan usaha ${encodeURIComponent(u.nama_usaha)}`
    : null
  const mapsUrl = u.latitude && u.longitude
    ? `https://www.google.com/maps?q=${u.latitude},${u.longitude}`
    : null

  const kategori    = (u.kategori    as any)?.nama
  const subKategori = (u.sub_kategori as any)?.nama

  return (
    <div className="min-h-screen bg-background">

      {/* ── Hero ── */}
      <div className="relative h-[55vw] max-h-[520px] min-h-[280px] w-full overflow-hidden bg-muted">
        {mainFoto ? (
          <Image
            src={mainFoto}
            alt={u.nama_usaha}
            fill
            className="object-cover"
            unoptimized={mainFoto.startsWith("http")}
            priority
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <Store className="size-20 text-muted-foreground/20" />
          </div>
        )}
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/10" />

        {/* Back button */}
        <Link
          href="/umkm"
          className="absolute left-4 top-4 flex items-center gap-1.5 rounded-full border border-white/20 bg-black/40 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur-sm transition hover:bg-black/60"
        >
          <ArrowLeft className="size-3.5" />
          Kembali
        </Link>

        {/* Unggulan badge */}
        {u.is_unggulan && (
          <div className="absolute right-4 top-4 flex items-center gap-1.5 rounded-full bg-amber-400/90 px-3 py-1.5 backdrop-blur-sm">
            <Star className="size-3.5 fill-white text-white" />
            <span className="text-xs font-bold text-white">Unggulan</span>
          </div>
        )}

        {/* Title overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <div className="mb-2 flex flex-wrap items-center gap-2">
            {kategori && (
              <span className="rounded-full bg-amber-400/90 px-3 py-1 text-xs font-bold text-white backdrop-blur-sm">
                {kategori}
              </span>
            )}
            {subKategori && (
              <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
                {subKategori}
              </span>
            )}
          </div>
          <h1 className="font-serif text-2xl font-semibold leading-tight text-white drop-shadow-sm sm:text-3xl lg:text-4xl">
            {u.nama_usaha}
          </h1>
        </div>
      </div>

      {/* ── Content ── */}
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
        <div className="grid gap-8 lg:grid-cols-[1fr_340px]">

          {/* Left column */}
          <div className="space-y-8">

            {/* Info cards */}
            <div className="grid gap-3 sm:grid-cols-2">
              {u.alamat && (
                <div className="flex items-start gap-3 rounded-2xl border border-border bg-card p-4">
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-amber-50 dark:bg-amber-950/40">
                    <MapPin className="size-4 text-amber-500" strokeWidth={1.5} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-muted-foreground">Alamat</p>
                    <p className="mt-0.5 text-sm font-medium text-foreground leading-snug">{u.alamat}</p>
                  </div>
                </div>
              )}
              {u.jam_operasional && (
                <div className="flex items-start gap-3 rounded-2xl border border-border bg-card p-4">
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-950/40">
                    <Clock className="size-4 text-blue-500" strokeWidth={1.5} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-muted-foreground">Jam Operasional</p>
                    <p className="mt-0.5 text-sm font-medium text-foreground leading-snug">{u.jam_operasional}</p>
                  </div>
                </div>
              )}
              {kategori && (
                <div className="flex items-start gap-3 rounded-2xl border border-border bg-card p-4">
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-purple-50 dark:bg-purple-950/40">
                    <Tag className="size-4 text-purple-500" strokeWidth={1.5} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-muted-foreground">Kategori</p>
                    <p className="mt-0.5 text-sm font-medium text-foreground">{kategori}</p>
                    {subKategori && <p className="text-xs text-muted-foreground">{subKategori}</p>}
                  </div>
                </div>
              )}
            </div>

            {/* Deskripsi */}
            {u.deskripsi && (
              <div>
                <h2 className="mb-3 font-serif text-xl text-foreground">Tentang Usaha</h2>
                <p className="whitespace-pre-line leading-relaxed text-muted-foreground">{u.deskripsi}</p>
              </div>
            )}

            {/* Extra photos */}
            {extraFotos.length > 0 && (
              <div>
                <h2 className="mb-3 font-serif text-xl text-foreground">Galeri Foto</h2>
                <div className={`grid gap-3 ${extraFotos.length === 1 ? "grid-cols-1" : "grid-cols-2"}`}>
                  {extraFotos.map((src, i) => (
                    <div key={i} className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-border bg-muted">
                      <Image src={src} alt={`Foto ${i + 2}`} fill className="object-cover" unoptimized={src.startsWith("http")} />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right column — sticky actions */}
          <div className="space-y-4 lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-2xl border border-border bg-card p-5 space-y-3">
              <h3 className="font-semibold text-foreground">Hubungi / Kunjungi</h3>

              {waUrl && (
                <a
                  href={waUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex w-full items-center justify-center gap-2.5 rounded-xl bg-green-500 px-4 py-3 text-sm font-bold text-white transition hover:bg-green-600 active:scale-[.98]"
                >
                  <MessageCircle className="size-4" />
                  Chat via WhatsApp
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
                <MapPin className="size-4 text-amber-500" strokeWidth={1.5} />
                Lihat di Peta Desa
              </Link>
            </div>

            {/* Breadcrumb */}
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Link href="/" className="hover:text-foreground transition">Beranda</Link>
              <ChevronRight className="size-3" />
              <Link href="/umkm" className="hover:text-foreground transition">UMKM</Link>
              <ChevronRight className="size-3" />
              <span className="text-foreground truncate max-w-[120px]">{u.nama_usaha}</span>
            </div>
          </div>
        </div>

        {/* Related UMKM */}
        {(related ?? []).length > 0 && (
          <div className="mt-12">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-serif text-xl text-foreground">UMKM Lainnya</h2>
              <Link href="/umkm" className="flex items-center gap-1 text-sm font-medium text-primary hover:underline">
                Lihat Semua <ChevronRight className="size-4" />
              </Link>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {(related ?? []).map((r: any) => (
                <Link
                  key={r.id}
                  href={`/umkm/${r.id}`}
                  className="group overflow-hidden rounded-2xl border border-border bg-card transition hover:border-amber-300 hover:shadow-md"
                >
                  <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                    {r.foto_url ? (
                      <Image
                        src={r.foto_url}
                        alt={r.nama_usaha}
                        fill
                        className="object-cover transition duration-500 group-hover:scale-105"
                        unoptimized={r.foto_url.startsWith("http")}
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <Store className="size-8 text-muted-foreground/20" />
                      </div>
                    )}
                  </div>
                  <div className="p-3">
                    <p className="text-xs text-muted-foreground">{(r.kategori as any)?.nama ?? ""}</p>
                    <p className="mt-0.5 text-sm font-semibold text-foreground line-clamp-2 leading-snug">{r.nama_usaha}</p>
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
