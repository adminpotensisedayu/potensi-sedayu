import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import {
  ArrowLeft, MapPin, Clock, MessageCircle,
  Tag, Star, Navigation, Store, ChevronRight,
} from "lucide-react"

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data } = await supabase.from("umkm").select("nama_usaha, deskripsi").eq("id", id).single()
  if (!data) return { title: "UMKM Tidak Ditemukan" }
  return {
    title: `${(data as any).nama_usaha} — Potensi Sedayu`,
    description: (data as any).deskripsi?.slice(0, 150) ?? "Detail UMKM di Desa Sedayu",
  }
}

export default async function UmkmDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const { data: umkm } = await supabase
    .from("umkm")
    .select("*, kategori:kategori_id(nama), sub_kategori:sub_kategori_id(nama)")
    .eq("id", id)
    .eq("is_aktif", true)
    .single()

  if (!umkm) notFound()

  const u        = umkm as any
  const kategori = (u.kategori     as any)?.nama as string | undefined
  const subKat   = (u.sub_kategori as any)?.nama as string | undefined

  // ✅ Semua foto — hero = foto pertama, galeri = sisanya + hero di akhir
  const allFotos   = [u.foto_url, u.foto_url_2, u.foto_url_3].filter(Boolean) as string[]
  const mainFoto   = allFotos[0] ?? null
  // Galeri: extra fotos dulu, lalu foto utama di posisi akhir
  const galleryFotos = allFotos.length > 1
    ? [...allFotos.slice(1), allFotos[0]]
    : allFotos

  // WhatsApp
  const waNumber = u.whatsapp ? String(u.whatsapp).replace(/\D/g, "") : null
  const waText   = encodeURIComponent("Halo, saya tertarik dengan usaha " + u.nama_usaha)
  const waUrl    = waNumber ? "https://wa.me/" + waNumber + "?text=" + waText : null

  // ✅ Google Maps RUTE (bukan sekedar lokasi)
  const routeUrl = (u.latitude && u.longitude)
    ? "https://www.google.com/maps/dir/?api=1&destination=" + u.latitude + "," + u.longitude
    : null

  return (
    <div className="min-h-screen bg-background">

      {/* Hero */}
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
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/10" />

        <Link
          href="/umkm"
          className="absolute left-4 top-4 flex items-center gap-1.5 rounded-full border border-white/20 bg-black/40 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur-sm transition hover:bg-black/60"
        >
          <ArrowLeft className="size-3.5" />
          Kembali
        </Link>

        {u.is_unggulan && (
          <div className="absolute right-4 top-4 flex items-center gap-1.5 rounded-full bg-amber-400/90 px-3 py-1.5 backdrop-blur-sm">
            <Star className="size-3.5 fill-white text-white" />
            <span className="text-xs font-bold text-white">Unggulan</span>
          </div>
        )}

        <div className="absolute bottom-0 left-0 right-0 p-6">
          <div className="mb-2 flex flex-wrap items-center gap-2">
            {kategori && (
              <span className="rounded-full bg-amber-400/90 px-3 py-1 text-xs font-bold text-white backdrop-blur-sm">
                {kategori}
              </span>
            )}
            {subKat && (
              <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
                {subKat}
              </span>
            )}
          </div>
          <h1 className="font-serif text-2xl font-semibold leading-tight text-white drop-shadow-sm sm:text-3xl lg:text-4xl">
            {u.nama_usaha}
          </h1>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
        <div className="grid gap-8 lg:grid-cols-[1fr_320px]">

          {/* Left */}
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
                    {subKat && <p className="text-xs text-muted-foreground">{subKat}</p>}
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

            {/* ✅ Galeri: extra fotos dulu, foto hero di akhir */}
            {galleryFotos.length > 0 && (
              <div>
                <h2 className="mb-3 font-serif text-xl text-foreground">
                  Galeri Foto
                  <span className="ml-2 text-sm font-normal text-muted-foreground">({galleryFotos.length} foto)</span>
                </h2>
                <div className={`grid gap-3 ${galleryFotos.length === 1 ? "grid-cols-1" : "grid-cols-2"}`}>
                  {galleryFotos.map((src, i) => (
                    <div
                      key={i}
                      className="relative overflow-hidden rounded-2xl border border-border bg-muted"
                      style={{ aspectRatio: galleryFotos.length === 1 ? "16/9" : "4/3" }}
                    >
                      <Image
                        src={src}
                        alt={"Foto " + (i + 1)}
                        fill
                        className="object-cover"
                        unoptimized={src.startsWith("http")}
                      />
                      {/* Tandai foto terakhir sebagai foto utama */}
                      {i === galleryFotos.length - 1 && allFotos.length > 1 && (
                        <span className="absolute bottom-2 right-2 rounded-full bg-black/50 px-2 py-0.5 text-[10px] font-bold text-white backdrop-blur-sm">
                          Foto Utama
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right — sticky CTA */}
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

              {/* ✅ Rute langsung ke Google Maps */}
              {routeUrl && (
                <a
                  href={routeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex w-full items-center justify-center gap-2.5 rounded-xl bg-blue-500 px-4 py-3 text-sm font-bold text-white transition hover:bg-blue-600 active:scale-[.98]"
                >
                  <Navigation className="size-4" />
                  Rute ke Sini
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
            <div className="flex flex-wrap items-center gap-1 text-xs text-muted-foreground">
              <Link href="/" className="hover:text-foreground transition">Beranda</Link>
              <ChevronRight className="size-3" />
              <Link href="/umkm" className="hover:text-foreground transition">UMKM</Link>
              <ChevronRight className="size-3" />
              <span className="text-foreground truncate max-w-[130px]">{u.nama_usaha}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
