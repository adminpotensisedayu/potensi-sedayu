import { notFound } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { DetailPelaku } from "@/components/shared/detail-pelaku"
import { waPesan } from "@/lib/utils"

export const revalidate = 300

export default async function UmkmDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  const { data } = await supabase
    .from("umkm")
    // ← tambah sub_kategori
    .select("*, kategori:kategori_id(nama), sub_kategori:sub_kategori_id(nama)")
    .eq("id", id)
    .eq("is_aktif", true)
    .maybeSingle()

  if (!data) notFound()
  const u = data as any

  // "Kuliner › Makanan Berat" — tanpa ubah DetailPelaku
  const subNama = u.sub_kategori?.nama
  const kategoriLabel = subNama
    ? `${u.kategori?.nama ?? ""} › ${subNama}`
    : (u.kategori?.nama ?? null)

  return (
    <DetailPelaku
      sektorLabel="UMKM"
      sektorHref="/umkm"
      title={u.nama_usaha}
      kategori={kategoriLabel}
      kategoriColorClass="text-sector-umkm"
      unggulan={u.is_unggulan}
      deskripsi={u.deskripsi}
      alamat={u.alamat}
      jam={u.jam_operasional}
      fotos={[u.foto_url, u.foto_url_2, u.foto_url_3]}
      whatsapp={u.whatsapp}
      waPesan={waPesan.umkm(u.nama_usaha)}
      lat={u.latitude}
      lng={u.longitude}
    />
  )
}