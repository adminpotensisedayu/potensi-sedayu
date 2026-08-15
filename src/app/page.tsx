import { createClient } from "@/lib/supabase/server"
import HeroSection from "@/components/home/hero-section"
import UmkmShowcase from "@/components/home/umkm-showcase"
import SekolahShowcase from "@/components/home/sekolah-showcase"
import PetaCta from "@/components/home/peta-cta"

export const revalidate = 300

export default async function HomePage() {
  const supabase = await createClient()

  const [{ data: umkmRows }, { data: sekolahRows }] = await Promise.all([
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

  return (
    <main className="overflow-x-hidden">
      <HeroSection />
      <UmkmShowcase items={(umkmRows ?? []) as any[]} />
      <SekolahShowcase items={(sekolahRows ?? []) as any[]} />
      <PetaCta />
    </main>
  )
}
