import { createClient } from "@/lib/supabase/server"
import Image from "next/image"
import Link from "next/link"
import { Store, ChevronLeft, ChevronRight } from "lucide-react"
import { UmkmFilter } from "@/components/umkm/umkm-filter"

export const revalidate = 60

const PAGE_SIZE = 12

function buildUrl(base: string, params: Record<string, string | undefined>) {
  const p = new URLSearchParams()
  for (const [k, v] of Object.entries(params)) {
    if (v && v !== "") p.set(k, v)
  }
  const str = p.toString()
  return base + (str ? "?" + str : "")
}

export default async function UmkmPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>
}) {
  const sp      = await searchParams
  const q       = sp.q       ?? ""
  const kat     = sp.kat     ?? ""
  const sub     = sp.sub     ?? ""
  const halaman = Math.max(1, parseInt(sp.halaman ?? "1"))
  const offset  = (halaman - 1) * PAGE_SIZE

  const supabase = await createClient()

  // Fetch kategori list untuk filter
  const { data: kategoriList } = await supabase
    .from("kategori")
    .select("id, nama")
    .order("urutan")

  // Query utama
  let query = supabase
    .from("umkm")
    .select(
      "id, nama_usaha, deskripsi, foto_url, alamat, is_unggulan, kategori:kategori_id(id, nama), sub_kategori:sub_kategori_id(nama)",
      { count: "exact" }
    )
    .eq("is_aktif", true)

  if (q)   query = query.or(`nama_usaha.ilike.%${q}%,deskripsi.ilike.%${q}%,alamat.ilike.%${q}%`)
  if (kat) query = query.eq("kategori_id", kat)
  if (sub) query = query.eq("sub_kategori_id", sub)

  const { data: rows, count } = await query
    .order("is_unggulan", { ascending: false })
    .order("nama_usaha")
    .range(offset, offset + PAGE_SIZE - 1)

  const total      = count ?? 0
  const totalPages = Math.ceil(total / PAGE_SIZE)

  // Helper URL pagination (pertahankan filter aktif)
  const toPage = (page: number) => buildUrl("/umkm", {
    q:       q     || undefined,
    kat:     kat   || undefined,
    sub:     sub   || undefined,
    halaman: page > 1 ? String(page) : undefined,
  })

  // Ellipsis pagination helper
  const pageNums = Array.from({ length: totalPages }, (_, i) => i + 1)
    .filter((p) => p === 1 || p === totalPages || Math.abs(p - halaman) <= 1)
    .reduce<(number | "…")[]>((acc, p, idx, arr) => {
      if (idx > 0 && p - (arr[idx - 1] as number) > 1) acc.push("…")
      acc.push(p)
      return acc
    }, [])

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">

      {/* Header */}
      <div className="mb-6">
        <p className="mb-1 text-sm font-medium text-primary">Direktori</p>
        <h1 className="font-serif text-3xl text-foreground sm:text-4xl">UMKM Desa Sedayu</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {total > 0
            ? `${total} UMKM aktif${q || kat ? " ditemukan" : " terdaftar"}`
            : "Tidak ada UMKM yang ditemukan"}
        </p>
      </div>

      {/* Filter */}
      <UmkmFilter kategoriList={(kategoriList ?? []) as any[]} currentQ={q} currentKat={kat} currentSub={sub} />

      {/* Grid */}
      {(rows ?? []).length === 0 ? (
        <div className="mt-10 flex flex-col items-center gap-3 rounded-2xl border border-border bg-card py-16 text-center">
          <Store className="size-10 text-muted-foreground/30" />
          <p className="font-medium text-muted-foreground">Tidak ada UMKM yang cocok</p>
          {(q || kat || sub) && (
            <Link href="/umkm" className="text-sm text-primary hover:underline">Reset filter</Link>
          )}
        </div>
      ) : (
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {(rows ?? []).map((u: any) => (
            <Link key={u.id} href={"/umkm/" + u.id}
              className="group overflow-hidden rounded-2xl border border-border bg-card transition hover:border-amber-300 hover:shadow-lg hover:-translate-y-0.5">
              <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                {u.foto_url ? (
                  <Image src={u.foto_url} alt={u.nama_usaha} fill
                    className="object-cover transition duration-500 group-hover:scale-105"
                    unoptimized={u.foto_url.startsWith("http")} />
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <Store className="size-10 text-muted-foreground/20" />
                  </div>
                )}
                {u.is_unggulan && (
                  <span className="absolute left-2 top-2 rounded-full bg-amber-400/90 px-2.5 py-0.5 text-[10px] font-bold text-white backdrop-blur-sm">
                    ⭐ Unggulan
                  </span>
                )}
              </div>
              <div className="p-4">
                <p className="mb-1 text-xs font-medium text-amber-600 dark:text-amber-400">
                  {(u.kategori as any)?.nama ?? ""}
                  {(u.sub_kategori as any)?.nama ? " · " + (u.sub_kategori as any).nama : ""}
                </p>
                <p className="font-semibold text-foreground line-clamp-2 leading-snug">{u.nama_usaha}</p>
                {u.alamat && (
                  <p className="mt-1.5 flex items-start gap-1 text-xs text-muted-foreground">
                    <span className="shrink-0">📍</span>
                    <span className="line-clamp-1">{u.alamat}</span>
                  </p>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* ── Pagination ── */}
      {totalPages > 1 && (
        <div className="mt-10 space-y-3">
          <div className="flex items-center justify-center gap-1.5">
            {/* Prev */}
            {halaman > 1 ? (
              <Link href={toPage(halaman - 1)}
                className="flex size-9 items-center justify-center rounded-xl border border-border bg-card text-muted-foreground transition hover:bg-muted hover:text-foreground">
                <ChevronLeft className="size-4" />
              </Link>
            ) : (
              <span className="flex size-9 items-center justify-center rounded-xl border border-border bg-muted/40 text-muted-foreground/30 cursor-not-allowed">
                <ChevronLeft className="size-4" />
              </span>
            )}

            {/* Page numbers */}
            {pageNums.map((p, i) =>
              p === "…" ? (
                <span key={"e" + i} className="flex size-9 items-center justify-center text-sm text-muted-foreground">…</span>
              ) : (
                <Link key={p} href={toPage(p as number)}
                  className={`flex size-9 items-center justify-center rounded-xl text-sm font-semibold transition ${
                    p === halaman
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "border border-border bg-card text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}>
                  {p}
                </Link>
              )
            )}

            {/* Next */}
            {halaman < totalPages ? (
              <Link href={toPage(halaman + 1)}
                className="flex size-9 items-center justify-center rounded-xl border border-border bg-card text-muted-foreground transition hover:bg-muted hover:text-foreground">
                <ChevronRight className="size-4" />
              </Link>
            ) : (
              <span className="flex size-9 items-center justify-center rounded-xl border border-border bg-muted/40 text-muted-foreground/30 cursor-not-allowed">
                <ChevronRight className="size-4" />
              </span>
            )}
          </div>

          <p className="text-center text-xs text-muted-foreground">
            {offset + 1}–{Math.min(offset + PAGE_SIZE, total)} dari {total} UMKM
            &nbsp;·&nbsp; Halaman {halaman} dari {totalPages}
          </p>
        </div>
      )}
    </div>
  )
}
