import { createClient } from "@/lib/supabase/server"
import Image from "next/image"
import {
  MapPin, Users, Maximize, History,
  Target, Compass, ExternalLink, Images,
} from "lucide-react"

export const revalidate = 3600

export const metadata = {
  title: "Profil Desa Sedayu",
  description: "Sejarah, visi misi, dan data ringkas Desa Sedayu, Kecamatan Jumantono, Kabupaten Karanganyar.",
}

const MAPS_URL = "https://www.google.com/maps/search/?api=1&query=-7.67672,110.99979"

export default async function ProfilPage() {
  const supabase = await createClient()
  const { data: p } = await supabase
    .from("profil_desa")
    .select("*")
    .eq("id", 1)
    .maybeSingle()

  const misi  = ((p?.misi as string) ?? "").split("\n").map((s) => s.trim()).filter(Boolean)
  const batas = ((p?.batas_wilayah as string) ?? "").split("\n").map((s) => s.trim()).filter(Boolean)

  const pp = p as any
  const heroFotos = [
    pp?.foto_hero_1, pp?.foto_hero_2, pp?.foto_hero_3, pp?.foto_hero_4, pp?.foto_hero_5,
  ].filter(Boolean) as string[]

  return (
    <div className="mx-auto max-w-5xl px-6 py-16">
      <header className="max-w-2xl">
        <p className="mb-2 text-sm font-medium text-primary">Profil Desa</p>
        <h1 className="font-serif text-4xl text-foreground sm:text-5xl">Desa Sedayu</h1>
        <p className="mt-3 flex items-center gap-2 text-muted-foreground">
          <MapPin className="size-4 text-primary" strokeWidth={1.5} />
          Kecamatan Jumantono, Kabupaten Karanganyar, Jawa Tengah
        </p>
      </header>

      {/* ✅ Galeri foto hero dari DB — masonry-like grid */}
      {heroFotos.length > 0 && (
        <section className="mt-10">
          <div className="mb-3 flex items-center gap-2">
            <Images className="size-5 text-primary" strokeWidth={1.5} />
            <h2 className="font-serif text-2xl text-foreground">Foto Desa</h2>
          </div>

          {/* Layout responsif berdasarkan jumlah foto */}
          {heroFotos.length === 1 && (
            <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl border border-border">
              <Image src={heroFotos[0]} alt="Foto Desa 1" fill className="object-cover" unoptimized priority />
            </div>
          )}

          {heroFotos.length === 2 && (
            <div className="grid grid-cols-2 gap-3">
              {heroFotos.map((src, i) => (
                <div key={i} className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-border">
                  <Image src={src} alt={`Foto Desa ${i + 1}`} fill className="object-cover" unoptimized priority={i === 0} />
                </div>
              ))}
            </div>
          )}

          {heroFotos.length === 3 && (
            <div className="grid grid-cols-2 gap-3">
              <div className="relative row-span-2 aspect-[3/4] overflow-hidden rounded-2xl border border-border sm:aspect-auto sm:h-full">
                <Image src={heroFotos[0]} alt="Foto Desa 1" fill className="object-cover" unoptimized priority />
              </div>
              {heroFotos.slice(1).map((src, i) => (
                <div key={i} className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-border">
                  <Image src={src} alt={`Foto Desa ${i + 2}`} fill className="object-cover" unoptimized />
                </div>
              ))}
            </div>
          )}

          {heroFotos.length >= 4 && (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {/* Foto pertama: span 2 kolom di sm+ */}
              <div className="relative col-span-2 aspect-[16/7] overflow-hidden rounded-2xl border border-border sm:col-span-2">
                <Image src={heroFotos[0]} alt="Foto Desa 1" fill className="object-cover" unoptimized priority />
              </div>
              {heroFotos.slice(1, 5).map((src, i) => (
                <div key={i} className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-border">
                  <Image src={src} alt={`Foto Desa ${i + 2}`} fill className="object-cover" unoptimized priority={i === 0} />
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {!p ? (
        <p className="mt-10 rounded-xl border border-border bg-card p-4 text-sm text-muted-foreground">
          Data profil desa belum tersedia.
        </p>
      ) : (
        <div className="mt-12 space-y-12">
          <section className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-border bg-card p-6">
              <Maximize className="size-6 text-primary" strokeWidth={1.5} />
              <p className="mt-3 text-sm text-muted-foreground">Luas Wilayah</p>
              <p className="font-serif text-2xl text-foreground">{p.luas_wilayah ?? "-"}</p>
            </div>
            <div className="rounded-2xl border border-border bg-card p-6">
              <Users className="size-6 text-primary" strokeWidth={1.5} />
              <p className="mt-3 text-sm text-muted-foreground">Jumlah Penduduk</p>
              <p className="font-serif text-2xl text-foreground">
                {p.jumlah_penduduk != null ? Number(p.jumlah_penduduk).toLocaleString("id-ID") + " jiwa" : "-"}
              </p>
            </div>
            <div className="rounded-2xl border border-border bg-card p-6">
              <MapPin className="size-6 text-primary" strokeWidth={1.5} />
              <p className="mt-3 text-sm text-muted-foreground">Lokasi</p>
              <p className="font-serif text-2xl text-foreground">Jumantono</p>
            </div>
          </section>

          {p.sejarah ? (
            <section>
              <div className="mb-3 flex items-center gap-2">
                <History className="size-5 text-primary" strokeWidth={1.5} />
                <h2 className="font-serif text-2xl text-foreground">Sejarah & Sekilas Desa</h2>
              </div>
              <p className="whitespace-pre-line leading-relaxed text-muted-foreground">{p.sejarah}</p>
            </section>
          ) : null}

          <section className="grid gap-4 md:grid-cols-2">
            {p.visi ? (
              <div className="rounded-2xl border border-border bg-secondary/40 p-6">
                <div className="mb-2 flex items-center gap-2">
                  <Compass className="size-5 text-primary" strokeWidth={1.5} />
                  <h2 className="font-serif text-xl text-foreground">Visi</h2>
                </div>
                <p className="leading-relaxed text-muted-foreground">{p.visi}</p>
              </div>
            ) : null}
            {misi.length > 0 ? (
              <div className="rounded-2xl border border-border bg-secondary/40 p-6">
                <div className="mb-2 flex items-center gap-2">
                  <Target className="size-5 text-primary" strokeWidth={1.5} />
                  <h2 className="font-serif text-xl text-foreground">Misi</h2>
                </div>
                <ol className="list-decimal space-y-1.5 pl-5 leading-relaxed text-muted-foreground">
                  {misi.map((m) => <li key={m}>{m}</li>)}
                </ol>
              </div>
            ) : null}
          </section>

          {batas.length > 0 ? (
            <section>
              <h2 className="mb-3 font-serif text-2xl text-foreground">Batas Wilayah</h2>
              <div className="grid gap-3 sm:grid-cols-2">
                {batas.map((b) => (
                  <div key={b} className="rounded-xl border border-border bg-card px-4 py-3 text-sm text-muted-foreground">{b}</div>
                ))}
              </div>
            </section>
          ) : null}

          <section>
            <a href={MAPS_URL} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-5 py-3 text-sm font-medium text-foreground transition hover:bg-secondary/50"
            >
              <MapPin className="size-4 text-primary" strokeWidth={1.5} />
              Lihat lokasi di Google Maps
              <ExternalLink className="size-3.5" strokeWidth={2} />
            </a>
          </section>
        </div>
      )}
    </div>
  )
}
