import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { DeleteButton } from "@/components/admin/delete-button"
import { Plus, Pencil, Users, CalendarDays, ImageOff } from "lucide-react"

export const dynamic = "force-dynamic"

export const metadata = {
  title: "Tim & Kegiatan KKN | Admin Potensi Sedayu",
}

function tanggalID(d: string | null) {
  if (!d) return "-"
  try {
    return new Date(d).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })
  } catch { return d }
}

export default async function AdminKknPage() {
  const supabase = await createClient()

  const [timRes, kegiatanRes] = await Promise.all([
    supabase.from("tim_kkn").select("*").order("nama"),
    supabase.from("kegiatan_kkn").select("*").order("tanggal", { ascending: true }),
  ])

  const tim      = (timRes.data      ?? []) as any[]
  const kegiatan = (kegiatanRes.data ?? []) as any[]

  return (
    <div className="mx-auto max-w-5xl space-y-10">

      {/* ══ TIM ANGGOTA ══════════════════════════════════════════ */}
      <section>
        <header className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Users className="size-5 text-primary" strokeWidth={1.5} />
            <h1 className="font-serif text-xl font-bold text-foreground sm:text-2xl">Tim Anggota KKN</h1>
            <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
              {tim.length} anggota
            </span>
          </div>
          <Link
            href="/admin/kkn/tim/baru"
            className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:opacity-90"
          >
            <Plus className="size-4" strokeWidth={2} />
            Tambah Anggota
          </Link>
        </header>

        {tim.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card py-12 text-center">
            <Users className="size-8 text-muted-foreground" strokeWidth={1.5} />
            <p className="mt-3 font-medium text-foreground">Belum ada anggota tim</p>
            <p className="text-sm text-muted-foreground">Klik Tambah Anggota untuk mulai.</p>
          </div>
        ) : (
          <>
            {/* Mobile: cards */}
            <div className="space-y-2 md:hidden">
              {tim.map((m) => (
                <div key={m.id} className="flex items-center gap-3 rounded-xl border border-border bg-card p-3.5">
                  {m.foto_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={m.foto_url} alt={m.nama} className="size-10 shrink-0 rounded-full object-cover" />
                  ) : (
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10 font-serif text-sm font-bold text-primary">
                      {String(m.nama ?? "?").charAt(0)}
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold text-foreground">{m.nama}</p>
                    <div className="mt-0.5 flex flex-wrap gap-x-2 text-xs text-muted-foreground">
                      {m.nim && <span>{m.nim}</span>}
                      {m.divisi && <span>· {m.divisi}</span>}
                    </div>
                    {m.program_studi && (
                      <p className="mt-0.5 truncate text-xs text-muted-foreground">{m.program_studi}</p>
                    )}
                  </div>
                  <div className="flex shrink-0 items-center gap-1">
                    <Link
                      href={"/admin/kkn/tim/" + m.id}
                      className="flex size-8 items-center justify-center rounded-lg text-muted-foreground transition hover:bg-secondary hover:text-foreground"
                    >
                      <Pencil className="size-4" strokeWidth={1.5} />
                    </Link>
                    <DeleteButton table="tim_kkn" id={m.id} label={"Hapus anggota \"" + m.nama + "\"?"} />
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop: table */}
            <div className="hidden overflow-x-auto rounded-2xl border border-border bg-card md:block">
              <table className="w-full text-sm">
                <thead className="border-b border-border bg-secondary/40 text-left text-muted-foreground">
                  <tr>
                    <th className="px-4 py-3 font-medium">Nama</th>
                    <th className="px-4 py-3 font-medium">NIM</th>
                    <th className="px-4 py-3 font-medium">Divisi</th>
                    <th className="px-4 py-3 font-medium">Program Studi</th>
                    <th className="px-4 py-3 text-right font-medium">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {tim.map((m) => (
                    <tr key={m.id} className="border-b border-border last:border-0">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          {m.foto_url ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={m.foto_url} alt={m.nama} className="size-8 rounded-full object-cover" />
                          ) : (
                            <div className="flex size-8 items-center justify-center rounded-full bg-primary/10 font-serif text-sm text-primary">
                              {String(m.nama ?? "?").charAt(0)}
                            </div>
                          )}
                          <span className="font-medium text-foreground">{m.nama}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">{m.nim ?? "-"}</td>
                      <td className="px-4 py-3 text-muted-foreground">{m.divisi ?? "-"}</td>
                      <td className="px-4 py-3 text-muted-foreground">{m.program_studi ?? "-"}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-1">
                          <Link
                            href={"/admin/kkn/tim/" + m.id}
                            className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-sm font-medium text-foreground transition hover:bg-secondary"
                          >
                            <Pencil className="size-4" strokeWidth={1.5} />Edit
                          </Link>
                          <DeleteButton table="tim_kkn" id={m.id} label={"Hapus anggota \"" + m.nama + "\"?"} />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </section>

      {/* ══ KEGIATAN KKN ═════════════════════════════════════════ */}
      <section>
        <header className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <CalendarDays className="size-5 text-primary" strokeWidth={1.5} />
            <h2 className="font-serif text-xl font-bold text-foreground sm:text-2xl">Kegiatan KKN</h2>
            <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
              {kegiatan.length} kegiatan
            </span>
          </div>
          <Link
            href="/admin/kkn/kegiatan/baru"
            className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:opacity-90"
          >
            <Plus className="size-4" strokeWidth={2} />
            Tambah Kegiatan
          </Link>
        </header>

        {kegiatan.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card py-12 text-center">
            <CalendarDays className="size-8 text-muted-foreground" strokeWidth={1.5} />
            <p className="mt-3 font-medium text-foreground">Belum ada kegiatan</p>
            <p className="text-sm text-muted-foreground">Klik Tambah Kegiatan untuk mulai.</p>
          </div>
        ) : (
          <>
            {/* Mobile: cards */}
            <div className="space-y-2 md:hidden">
              {kegiatan.map((k) => (
                <div key={k.id} className="flex items-start gap-3 rounded-xl border border-border bg-card p-3.5">
                  {k.foto_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={k.foto_url} alt={k.judul} className="size-14 shrink-0 rounded-xl object-cover" />
                  ) : (
                    <div className="flex size-14 shrink-0 items-center justify-center rounded-xl bg-muted">
                      <ImageOff className="size-5 text-muted-foreground" strokeWidth={1.5} />
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-foreground leading-tight">{k.judul}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">{tanggalID(k.tanggal)}</p>
                    {k.deskripsi && (
                      <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{k.deskripsi}</p>
                    )}
                  </div>
                  <div className="flex shrink-0 items-center gap-1">
                    <Link
                      href={"/admin/kkn/kegiatan/" + k.id}
                      className="flex size-8 items-center justify-center rounded-lg text-muted-foreground transition hover:bg-secondary hover:text-foreground"
                    >
                      <Pencil className="size-4" strokeWidth={1.5} />
                    </Link>
                    <DeleteButton table="kegiatan_kkn" id={k.id} label={"Hapus kegiatan \"" + k.judul + "\"?"} />
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop: table */}
            <div className="hidden overflow-x-auto rounded-2xl border border-border bg-card md:block">
              <table className="w-full text-sm">
                <thead className="border-b border-border bg-secondary/40 text-left text-muted-foreground">
                  <tr>
                    <th className="px-4 py-3 font-medium">Foto</th>
                    <th className="px-4 py-3 font-medium">Tanggal</th>
                    <th className="px-4 py-3 font-medium">Judul Kegiatan</th>
                    <th className="px-4 py-3 font-medium">Deskripsi</th>
                    <th className="px-4 py-3 text-right font-medium">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {kegiatan.map((k) => (
                    <tr key={k.id} className="border-b border-border last:border-0">
                      <td className="px-4 py-3">
                        {k.foto_url ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={k.foto_url} alt={k.judul} className="size-12 rounded-lg object-cover" />
                        ) : (
                          <div className="flex size-12 items-center justify-center rounded-lg bg-muted">
                            <ImageOff className="size-5 text-muted-foreground" strokeWidth={1.5} />
                          </div>
                        )}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-muted-foreground">{tanggalID(k.tanggal)}</td>
                      <td className="px-4 py-3 font-medium text-foreground">{k.judul}</td>
                      <td className="max-w-xs px-4 py-3 text-muted-foreground">
                        <span className="line-clamp-2">{k.deskripsi ?? "-"}</span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-1">
                          <Link
                            href={"/admin/kkn/kegiatan/" + k.id}
                            className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-sm font-medium text-foreground transition hover:bg-secondary"
                          >
                            <Pencil className="size-4" strokeWidth={1.5} />Edit
                          </Link>
                          <DeleteButton table="kegiatan_kkn" id={k.id} label={"Hapus kegiatan \"" + k.judul + "\"?"} />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </section>
    </div>
  )
}
