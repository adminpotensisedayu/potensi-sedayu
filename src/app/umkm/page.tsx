import { Suspense } from "react"
import { createClient } from "@/lib/supabase/server"
import { UmkmCard } from "@/components/cards/UmkmCard"
import { UmkmFilter } from "@/components/umkm/umkm-filter"

export const dynamic = "force-dynamic"
export const metadata = { title: "UMKM", description: "Daftar UMKM aktif Desa Sedayu." }

export default async function UmkmPage({
  searchParams,
}: {
  searchParams: Promise<{ kat?: string; sub?: string }>
}) {
  const { kat, sub } = await searchParams
  const supabase = await createClient()

  // Build query — filter sub dulu, lalu kat, lalu semua
  let query = supabase
    .from("umkm")
    .select(
      "id, nama_usaha, deskripsi, foto_url, is_unggulan, " +
      "kategori:kategori_id(nama), sub_kategori:sub_kategori_id(nama)"
    )
    .eq("is_aktif", true)
    .order("is_unggulan", { ascending: false })
    .order("nama_usaha")

  if (sub)      query = query.eq("sub_kategori_id", sub)
  else if (kat) query = query.eq("kategori_id", kat)

  const [{ data: umkm }, { data: kategoriList }] = await Promise.all([
    query,
    supabase.from("kategori").select("id, nama").order("urutan"),
  ])

  const rows = (umkm ?? []) as any[]

  return (
    <section className="mx-auto max-w-6xl px-6 py-16">
      <header className="mb-10">
        <p className="text-sm font-medium text-sector-umkm">Direktori</p>
        <h1 className="mt-1 font-serif text-4xl text-foreground">UMKM Desa Sedayu</h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          Jelajahi usaha mikro, kecil, dan menengah warga Desa Sedayu — kuliner, kerajinan, jasa, dan perdagangan.
        </p>
      </header>

      {/* Filter 2-level */}
      <div className="mb-8">
        <Suspense fallback={<div className="h-9" />}>
          <UmkmFilter
            kategoriList={(kategoriList ?? []) as any[]}
            currentKat={kat ?? ""}
            currentSub={sub ?? ""}
          />
        </Suspense>
      </div>

      {rows.length > 0 ? (
        <>
          <p className="mb-6 text-sm text-muted-foreground">{rows.length} usaha ditemukan</p>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {rows.map((u) => (
              <UmkmCard key={u.id} u={u as any} />
            ))}
          </div>
        </>
      ) : (
        <div className="rounded-2xl border border-dashed border-border py-20 text-center text-muted-foreground">
          {kat || sub ? "Tidak ada UMKM untuk filter ini." : "Belum ada data UMKM."}
        </div>
      )}
    </section>
  )
}