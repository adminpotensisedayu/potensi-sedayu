"use server"

import { revalidatePath } from "next/cache"
import { createAdminClient } from "@/lib/supabase/admin-client"

export type ActionResult = { success: true } | { error: string }

// ─────────────────────────────────────────────────────────────
// Setujui pengajuan → buat entry di tabel umkm
// ─────────────────────────────────────────────────────────────
export async function approvePengajuan(id: string): Promise<ActionResult> {
  const admin = createAdminClient()

  // 1. Ambil data pengajuan
  const { data: p, error: fetchErr } = await admin
    .from("pengajuan_umkm")
    .select("*")
    .eq("id", id)
    .single()

  if (fetchErr || !p) return { error: "Pengajuan tidak ditemukan" }
  if (p.status !== "menunggu")
    return { error: "Pengajuan ini sudah diproses sebelumnya" }

  // 2. Cari kategori_id dari nama
  let kategori_id: string | null = null
  let sub_kategori_id: string | null = null

  if (p.kategori_nama) {
    const { data: kat } = await admin
      .from("kategori")
      .select("id")
      .eq("nama", p.kategori_nama)
      .maybeSingle()

    if (kat) {
      kategori_id = kat.id

      // 3. Cari sub_kategori_id dari nama + kategori_id
      if (p.sub_kategori_nama) {
        const { data: sub } = await admin
          .from("sub_kategori")
          .select("id")
          .eq("nama", p.sub_kategori_nama)
          .eq("kategori_id", kat.id)
          .maybeSingle()

        if (sub) sub_kategori_id = sub.id
      }
    }
  }

  // 4. Insert ke tabel umkm
  const { error: insertErr } = await admin.from("umkm").insert({
    nama_usaha:      p.nama_usaha,
    deskripsi:       p.deskripsi       ?? null,
    alamat:          p.alamat          ?? null,
    whatsapp:        p.whatsapp,
    jam_operasional: p.jam_operasional ?? null,
    latitude:        p.latitude        ?? null,
    longitude:       p.longitude       ?? null,
    foto_url:        p.foto_url        ?? null,
    foto_url_2:      p.foto_url_2      ?? null,
    foto_url_3:      p.foto_url_3      ?? null,
    kategori_id,
    sub_kategori_id,
    is_aktif:        true,
    is_unggulan:     false,
  })

  if (insertErr) return { error: `Gagal membuat UMKM: ${insertErr.message}` }

  // 5. Update status pengajuan → disetujui
  const { error: updateErr } = await admin
    .from("pengajuan_umkm")
    .update({
      status:      "disetujui",
      reviewed_at: new Date().toISOString(),
    })
    .eq("id", id)

  if (updateErr) return { error: `Gagal update status: ${updateErr.message}` }

  revalidatePath("/admin/pengajuan")
  revalidatePath("/admin/umkm")
  revalidatePath("/umkm")
  return { success: true }
}

// ─────────────────────────────────────────────────────────────
// Tolak pengajuan
// ─────────────────────────────────────────────────────────────
export async function tolakPengajuan(
  id: string,
  alasan: string
): Promise<ActionResult> {
  if (!alasan.trim()) return { error: "Alasan penolakan wajib diisi" }

  const admin = createAdminClient()

  const { error } = await admin
    .from("pengajuan_umkm")
    .update({
      status:       "ditolak",
      alasan_tolak: alasan.trim(),
      reviewed_at:  new Date().toISOString(),
    })
    .eq("id", id)

  if (error) return { error: error.message }

  revalidatePath("/admin/pengajuan")
  return { success: true }
}
// ─────────────────────────────────────────────────────────────
// Hapus pengajuan (hanya yang sudah diproses)
// ─────────────────────────────────────────────────────────────
export async function hapusPengajuan(id: string): Promise<ActionResult> {
  const admin = createAdminClient()

  // Pastikan bukan "menunggu" dulu
  const { data: p } = await admin
    .from("pengajuan_umkm")
    .select("status")
    .eq("id", id)
    .single()

  if (p?.status === "menunggu")
    return { error: "Pengajuan yang masih menunggu tidak bisa dihapus" }

  const { error } = await admin
    .from("pengajuan_umkm")
    .delete()
    .eq("id", id)

  if (error) return { error: error.message }

  revalidatePath("/admin/pengajuan")
  return { success: true }
}
