import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { SekolahCard } from "@/components/cards/SekolahCard"

export const dynamic = "force-dynamic"
export const metadata = { title: "Sekolah", description: "Daftar sekolah di Desa Sedayu." }

const JENJANG_LIST = ["TK", "SD", "SMP", "SMA", "SMK"]

export default async function SekolahPage({
  searchParams,
}: {
  searchParams: Promise<{ jenjang?: string }>
}) {
  const { jenjang } = await searchParams
  const activeJenjang = JENJANG_LIST.includes(jenjang ?? "") ? jenjang : undefined

  const supabase = await createClient()
  let query = supabase
    .from("sekolah")
    .select("id, nama, jenjang, status, akreditasi, alamat, foto_url, is_unggulan")
    .eq("is_aktif", true)
    .order("is_unggulan", { ascending: false })
    .order("nama")

  if (activeJenjang) query = query.eq("jenjang", activeJenjang)

  const { data } = await query
  const rows = (data ?? []) as any[]

  const tabCls = (active: boolean) =>
    "rounded-full px-4 py-1.5 text-sm font-medium transition " +
    (active
      ? "bg-[#0D9488] text-white"
      : "border border-border bg-card text-muted-foreground hover:text-foreground")

  return (
    <section className="mx-auto max-w-6xl px-6 py-16">
      <header className="mb-10">
        <p className="text-sm font-medium text-[#0D9488]">Direktori</p>
        <h1 className="mt-1 font-serif text-4xl text-foreground">Sekolah Desa Sedayu</h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          Pilihan sekolah dari jenjang TK hingga SMP di wilayah Desa Sedayu, Kecamatan Jumantono.
        </p>
      </header>

      {/* Filter tabs — no JS needed */}
      <div className="mb-8 flex flex-wrap gap-2">
        <Link href="/sekolah" className={tabCls(!activeJenjang)}>Semua</Link>
        {JENJANG_LIST.map((j) => (
          <Link key={j} href={`/sekolah?jenjang=${j}`} className={tabCls(activeJenjang === j)}>
            {j}
          </Link>
        ))}
      </div>

      {rows.length > 0 ? (
        <>
          <p className="mb-6 text-sm text-muted-foreground">{rows.length} sekolah ditemukan</p>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {rows.map((s) => <SekolahCard key={s.id} s={s as any} />)}
          </div>
        </>
      ) : (
        <div className="rounded-2xl border border-dashed border-border py-20 text-center text-muted-foreground">
          {activeJenjang ? `Belum ada data sekolah jenjang ${activeJenjang}.` : "Belum ada data sekolah."}
        </div>
      )}
    </section>
  )
}