// src/app/peta/page.tsx
import { createClient } from "@/lib/supabase/server"
import { PetaExplorer } from "@/components/map/peta-explorer"
import type { MapPoint } from "@/components/map/peta-explorer"

export const metadata = { title: "Peta Potensi — Desa Sedayu" }

export default async function PetaPage() {
  const supabase = await createClient()

  const [{ data: umkmData }, { data: sekolahData }] = await Promise.all([
    supabase
      .from("umkm")
      .select("id, nama_usaha, deskripsi, alamat, latitude, longitude, kategori:kategori_id(nama)")
      .eq("is_aktif", true)
      .not("latitude", "is", null),
    supabase
      .from("sekolah")
      .select("id, nama, jenjang, alamat, latitude, longitude")
      .eq("is_aktif", true)
      .not("latitude", "is", null),
  ])

  const points: MapPoint[] = [
    ...(umkmData ?? []).map((u: any) => ({
      id:       u.id,
      lat:      u.latitude  as number,
      lng:      u.longitude as number,
      sector:   "umkm"      as const,
      label:    u.nama_usaha,
      desc:     u.deskripsi     ?? undefined,
      alamat:   u.alamat        ?? undefined,
      subLabel: u.kategori?.nama ?? undefined,
      subKat:   u.kategori?.nama ?? undefined,
      href:     `/umkm/${u.id}`,
    })),
    ...(sekolahData ?? []).map((s: any) => ({
      id:       s.id,
      lat:      s.latitude  as number,
      lng:      s.longitude as number,
      sector:   "sekolah"   as const,
      label:    s.nama,
      desc:     s.jenjang   ?? undefined,
      alamat:   s.alamat    ?? undefined,
      subLabel: s.jenjang   ?? undefined,
      subKat:   s.jenjang   ?? undefined,
      href:     `/sekolah/${s.id}`,
    })),
  ]

  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col">
      <PetaExplorer points={points} />
    </div>
  )
}