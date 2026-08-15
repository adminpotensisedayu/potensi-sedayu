import { createClient } from "@/lib/supabase/server"
import dynamic from "next/dynamic"

export const revalidate = 300

const PetaExplorer = dynamic(
  () => import("@/components/map/peta-explorer"),
  { ssr: false }
)

export type MapPoint = {
  id: string
  lat: number
  lng: number
  sector: "umkm" | "sekolah"
  label: string
  alamat?: string
  subLabel?: string
  subKat?: string
  href: string
  foto?: string
}

export default async function PetaPage() {
  const supabase = await createClient()

  const [{ data: umkmRows }, { data: sekolahRows }] = await Promise.all([
    supabase
      .from("umkm")
      .select("id, nama_usaha, alamat, latitude, longitude, foto_url, kategori:kategori_id(nama), sub_kategori:sub_kategori_id(nama)")
      .eq("is_aktif", true)
      .not("latitude", "is", null)
      .not("longitude", "is", null),
    supabase
      .from("sekolah")
      .select("id, nama, jenjang, akreditasi, alamat, latitude, longitude, foto_url")
      .eq("is_aktif", true)
      .not("latitude", "is", null)
      .not("longitude", "is", null),
  ])

  const points: MapPoint[] = [
    ...(umkmRows ?? []).map((u: any) => ({
      id:       String(u.id),
      lat:      Number(u.latitude),
      lng:      Number(u.longitude),
      sector:   "umkm" as const,
      label:    u.nama_usaha,
      alamat:   u.alamat   ?? undefined,
      subLabel: u.kategori?.nama ?? undefined,
      subKat:   u.sub_kategori?.nama ?? undefined,
      href:     `/umkm/${u.id}`,
      foto:     u.foto_url ?? undefined,
    })),
    ...(sekolahRows ?? []).map((s: any) => ({
      id:       String(s.id),
      lat:      Number(s.latitude),
      lng:      Number(s.longitude),
      sector:   "sekolah" as const,
      label:    s.nama,
      alamat:   s.alamat ?? undefined,
      subLabel: s.jenjang ?? undefined,
      subKat:   s.akreditasi ? `Akreditasi ${s.akreditasi}` : undefined,
      href:     `/sekolah/${s.id}`,
      foto:     s.foto_url ?? undefined,
    })),
  ]

  return (
    <div className="flex flex-col" style={{ height: "calc(100dvh - 64px)" }}>
      <PetaExplorer points={points} />
    </div>
  )
}
