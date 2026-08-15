import { createClient } from "@/lib/supabase/server"
import Image from "next/image"
import Link from "next/link"
import { School, ChevronLeft, ChevronRight } from "lucide-react"
import { SekolahFilter } from "@/components/sekolah/sekolah-filter"

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

const JENJANG_COLORS: Record<string, string> = {
  SD:   "bg-green-100 text-green-700 dark:bg-green-950/40 dark:text-green-400",
  SMP:  "bg-blue-100  text-blue-700  dark:bg-blue-950/40  dark:text-blue-400",
  SMA:  "bg-purple-100 text-purple-700 dark:bg-purple-950/40 dark:text-purple-400",
  SMK:  "bg-orange-100 text-orange-700 dark:bg-orange-950/40 dark:text-orange-400",
  TK:   "bg-pink-100  text-pink-700  dark:bg-pink-950/40  dark:text-pink-400",
  PAUD: "bg-pink-100  text-pink-700  dark:bg-pink-950/40  dark:text-pink-400",
}

export default async function SekolahPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>
}) {
  const sp      = await searchParams
  const q       = sp.q       ?? ""
  const jenjang = sp.jenjang ?? ""
  const halaman = Math.max(1, parseInt(sp.halaman ?? "1"))
  const offset  = (halaman - 1) * PAGE_SIZE

  const supabase = await createClient()

  let query = supabase
    .from("sekolah")
    .select("id, nama, jenjang, akreditasi, status, foto_url, alamat, is_unggulan", { count: "exact" })
    .eq("is_aktif", true)

  if (q)       query = query.or(`nama.ilike.%${q}%,alamat.ilike.%${q}%`)
  if (jenjang) query = query.eq("jenjang", jenjang)

  const { data: rows, count } = await query
    .order("is_unggulan", { ascending: false })
    .order("nama")
    .range(offset, offset + PAGE_SIZE - 1)

  const total      = count ?? 0
  const totalPages = Math.ceil(total / PAGE_SIZE)

  const toPage = (page: number) => buildUrl("/sekolah", {
    q:       q       || undefined,
    jenjang: jenjang || undefined,
    halaman: page > 1 ? String(page) : undefined,
  })

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
        <h1 className="font-serif text-3xl text-foreground sm:text-4xl">Sekolah Desa Sedayu</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {total > 0
            ? `${total} institusi pendidikan${q || jenjang ? " ditemukan" : " terdaftar"}`
            : "Tidak ada sekolah yang ditemukan"}
        </p>
      </div>

      {/* Filter */}
      <SekolahFilter currentQ={q} currentJenjang={jenjang} />

      {/* Grid */}
      {(rows ?? []).length === 0 ? (
        <div className="mt-10 flex flex-col items-center gap-3 rounded-2xl border border-border bg-card py-16 text-center">
          <School className="size-10 text-muted-foreground/30" />
          <p className="font-medium text-muted-foreground">Tidak ada sekolah yang cocok</p>
          {(q || jenjang) && (
            <Link href="/sekolah" className="text-sm text-primary hover:underline">Reset filter</Link>
          )}
        </div>
      ) : (
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {(rows ?? []).map((s: any) => {
            const jColor = JENJANG_COLORS[s.jenjang ?? ""] ?? "bg-teal-100 text-teal-700 dark:bg-teal-950/40 dark:text-teal-400"
            return (
              <Link key={s.id} href={"/sekolah/" + s.id}
                className="group overflow-hidden rounded-2xl border border-border bg-card transition hover:border-teal-300 hover:shadow-lg hover:-translate-y-0.5">
                <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                  {s.foto_url ? (
                    <Image src={s.foto_url} alt={s.nama} fill
                      className="object-cover transition duration-500 group-hover:scale-105"
                      unoptimized={s.foto_url.startsWith("http")} />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <School className="size-10 text-muted-foreground/20" />
                    </div>
                  )}
                  {s.is_unggulan && (
                    <span className="absolute left-2 top-2 rounded-full bg-teal-500/90 px-2.5 py-0.5 text-[10px] font-bold text-white backdrop-blur-sm">
                      ⭐ Unggulan
                    </span>
                  )}
                  {s.jenjang && (
                    <span className={"absolute right-2 top-2 rounded-full px-2.5 py-0.5 text-[10px] font-bold backdrop-blur-sm " + jColor}>
                      {s.jenjang}
                    </span>
                  )}
                </div>
                <div className="p-4">
                  <div className="mb-1 flex items-center gap-1.5 flex-wrap">
                    {s.akreditasi && (
                      <span className="text-xs font-medium text-teal-600 dark:text-teal-400">
                        Akreditasi {s.akreditasi}
                      </span>
                    )}
                  </div>
                  <p className="font-semibold text-foreground line-clamp-2 leading-snug">{s.nama}</p>
                  {s.alamat && (
                    <p className="mt-1.5 flex items-start gap-1 text-xs text-muted-foreground">
                      <span className="shrink-0">📍</span>
                      <span className="line-clamp-1">{s.alamat}</span>
                    </p>
                  )}
                </div>
              </Link>
            )
          })}
        </div>
      )}

      {/* ── Pagination ── */}
      {totalPages > 1 && (
        <div className="mt-10 space-y-3">
          <div className="flex items-center justify-center gap-1.5">
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
            {offset + 1}–{Math.min(offset + PAGE_SIZE, total)} dari {total} sekolah
            &nbsp;·&nbsp; Halaman {halaman} dari {totalPages}
          </p>
        </div>
      )}
    </div>
  )
}
