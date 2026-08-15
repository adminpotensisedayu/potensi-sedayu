import { Suspense } from "react"
import { createClient } from "@/lib/supabase/server"
import { UmkmCard } from "@/components/cards/UmkmCard"
import { UmkmFilter } from "@/components/umkm/umkm-filter"

export const dynamic = "force-dynamic"
export const metadata = { title: "UMKM", description: "Daftar UMKM aktif Desa Sedayu." }

export default async function UmkmPage({
  searchParams,
}: {
  searchParams: Promise<{ kat?: string; sub?: string; q?: string }>
}) {
  const { kat, sub, q } = await searchParams
  const supabase = await createClient()

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

  if (q?.trim()) {
    const term = q.trim()
    query = query.or(`nama_usaha.ilike.%${term}%,deskripsi.ilike.%${term}%`)
  }

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

      <div className="mb-8">
        <Suspense fallback={<div className="h-9" />}>
          <UmkmFilter
            kategoriList={(kategoriList ?? []) as any[]}
            currentKat={kat ?? ""}
            currentSub={sub ?? ""}
            currentQ={q ?? ""}
          />
        </Suspense>
      </div>

      {rows.length > 0 ? (
        <>
          <p className="mb-6 text-sm text-muted-foreground">
            {rows.length} usaha ditemukan
            {q?.trim() ? ` untuk "${q.trim()}"` : ""}
          </p>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {rows.map((u) => (
              <UmkmCard key={u.id} u={u as any} />
            ))}
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-border py-20 text-center text-muted-foreground">
          <svg className="size-10 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z"/>
          </svg>
          <p className="font-medium">
            {kat || sub || q ? "Tidak ada UMKM yang cocok." : "Belum ada data UMKM."}
          </p>
          {(kat || sub || q) && (
            <p className="text-sm">Coba ubah kata kunci atau hapus filter.</p>
          )}
        </div>
      )}
    </section>
  )
}
