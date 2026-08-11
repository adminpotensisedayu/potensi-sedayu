import { createClient } from "@/lib/supabase/server"
import HeroSection from "@/components/home/hero-section"
import StatsBar from "@/components/home/stats-bar"
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
    { data: umkmRows },
    { data: sekolahRows },
  ] = await Promise.all([
    supabase
      .from("umkm")
      .select("*", { count: "exact", head: true })
      .eq("is_aktif", true),
    supabase
      .from("sekolah")
      .select("*", { count: "exact", head: true })
      .eq("is_aktif", true),
    supabase
      .from("kategori")
      .select("*", { count: "exact", head: true }),
    supabase
      .from("umkm")
      .select("id, nama_usaha, deskripsi, foto_url, kategori:kategori_id(nama)")
      .eq("is_aktif", true)
      .limit(4),
    supabase
      .from("sekolah")
      .select("id, nama, jenjang, akreditasi, foto_url, alamat")
      .eq("is_aktif", true)
      .limit(5),
  ])

  return (
    <main className="overflow-x-hidden">
      <HeroSection />
      <StatsBar
        umkmCount={umkmCount ?? 0}
        sekolahCount={sekolahCount ?? 0}
        kategoriCount={kategoriCount ?? 0}
      />
      <UmkmShowcase items={(umkmRows ?? []) as any[]} />
      <SekolahShowcase items={(sekolahRows ?? []) as any[]} />
      <PetaCta />
    </main>
  )
}