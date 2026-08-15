import { createClient } from "@/lib/supabase/server"
import { SekolahCard } from "@/components/cards/SekolahCard"
import { SekolahFilter } from "@/components/sekolah/sekolah-filter"

export const dynamic = "force-dynamic"
export const metadata = { title: "Sekolah", description: "Daftar sekolah di Desa Sedayu." }

const JENJANG_LIST = ["TK", "SD", "SMP", "SMA", "SMK"]

export default async function SekolahPage({
  searchParams,
}: {
  searchParams: Promise<{ jenjang?: string; q?: string }>
}) {
  const { jenjang, q } = await searchParams
  const activeJenjang = JENJANG_LIST.includes(jenjang ?? "") ? jenjang : undefined

  const supabase = await createClient()
  let query = supabase
    .from("sekolah")
    .select("id, nama, jenjang, status, akreditasi, alamat, foto_url, is_unggulan")
    .eq("is_aktif", true)
    .order("is_unggulan", { ascending: false })
    .order("nama")

  if (activeJenjang) query = query.eq("jenjang", activeJenjang)

  if (q?.trim()) {
    const term = q.trim()
    query = query.or(`nama.ilike.%${term}%,alamat.ilike.%${term}%`)
  }

  const { data } = await query
  const rows = (data ?? []) as any[]

  return (
    <section className="mx-auto max-w-6xl px-6 py-16">
      <header className="mb-10">
        <p className="text-sm font-medium text-[#0D9488]">Direktori</p>
        <h1 className="mt-1 font-serif text-4xl text-foreground">Sekolah Desa Sedayu</h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          Pilihan sekolah dari jenjang TK hingga SMP di wilayah Desa Sedayu, Kecamatan Jumantono.
        </p>
      </header>

      <div className="mb-8">
        <SekolahFilter currentJenjang={activeJenjang ?? ""} currentQ={q ?? ""} />
      </div>

      {rows.length > 0 ? (
        <>
          <p className="mb-6 text-sm text-muted-foreground">
            {rows.length} sekolah ditemukan
            {q?.trim() ? ` untuk "${q.trim()}"` : ""}
          </p>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {rows.map((s) => <SekolahCard key={s.id} s={s as any} />)}
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-border py-20 text-center text-muted-foreground">
          <svg className="size-10 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z"/>
          </svg>
          <p className="font-medium">
            {activeJenjang || q ? "Tidak ada sekolah yang cocok." : "Belum ada data sekolah."}
          </p>
          {(activeJenjang || q) && (
            <p className="text-sm">Coba ubah kata kunci atau hapus filter.</p>
          )}
        </div>
      )}
    </section>
  )
}
