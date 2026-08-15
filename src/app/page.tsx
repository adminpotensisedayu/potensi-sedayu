import { createClient } from "@/lib/supabase/server"
import HeroSection from "@/components/home/hero-section"
import UmkmShowcase from "@/components/home/umkm-showcase"
import SekolahShowcase from "@/components/home/sekolah-showcase"
import PetaCta from "@/components/home/peta-cta"

export const revalidate = 300

export default async function HomePage() {
  const supabase = await createClient()

  const [
    { count: umkmCount },
    { count: sekolahCount },
    { count: kategoriCount },
    { data: profilData },
    { data: umkmRows },
    { data: sekolahRows },
  ] = await Promise.all([
    supabase.from("umkm").select("*", { count: "exact", head: true }).eq("is_aktif", true),
    supabase.from("sekolah").select("*", { count: "exact", head: true }).eq("is_aktif", true),
    supabase.from("kategori").select("*", { count: "exact", head: true }),
    supabase
      .from("profil_desa")
      .select("foto_hero_1, foto_hero_2, foto_hero_3, foto_hero_4, foto_hero_5")
      .eq("id", 1)
      .maybeSingle(),
    supabase
      .from("umkm")
      .select("id, nama_usaha, deskripsi, foto_url, kategori:kategori_id(nama)")
      .eq("is_aktif", true)
      .order("is_unggulan", { ascending: false })
      .order("nama_usaha")
      .limit(12),
    supabase
      .from("sekolah")
      .select("id, nama, jenjang, akreditasi, foto_url, alamat")
      .eq("is_aktif", true)
      .order("is_unggulan", { ascending: false })
      .order("nama")
      .limit(10),
  ])

  const p = profilData as any
  const heroPhotos: (string | null)[] = [
    p?.foto_hero_1 ?? null,
    p?.foto_hero_2 ?? null,
    p?.foto_hero_3 ?? null,
    p?.foto_hero_4 ?? null,
    p?.foto_hero_5 ?? null,
  ]

  return (
    <main className="overflow-x-hidden">
      <HeroSection
        umkmCount={umkmCount ?? 0}
        sekolahCount={sekolahCount ?? 0}
        kategoriCount={kategoriCount ?? 0}
        heroPhotos={heroPhotos}
      />
      <UmkmShowcase items={(umkmRows ?? []) as any[]} />
      <SekolahShowcase items={(sekolahRows ?? []) as any[]} />
      <PetaCta />
    </main>
  )
}
