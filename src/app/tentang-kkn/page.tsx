import { createClient } from "@/lib/supabase/server"
import { Users, CalendarDays, Sprout } from "lucide-react"

export const revalidate = 3600

export const metadata = {
  title: "Tentang KKN - Desa Sedayu",
  description: "Program KKN Literasi Kelompok 123 UNS bersama Pemerintah Desa Sedayu.",
}

function tanggalID(d: string | null) {
  if (!d) return ""
  try {
    return new Date(d).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    })
  } catch {
    return d
  }
}

export default async function TentangKknPage() {
  const supabase = await createClient()
  const [timRes, kegiatanRes] = await Promise.all([
    supabase.from("tim_kkn").select("*").order("nama"),
    supabase.from("kegiatan_kkn").select("*").order("tanggal", { ascending: true }),
  ])
  const tim = (timRes.data ?? []) as any[]
  const kegiatan = (kegiatanRes.data ?? []) as any[]

  return (
    <div className="mx-auto max-w-5xl px-6 py-16">
      <header className="max-w-2xl">
        <p className="mb-2 text-sm font-medium text-primary">Tentang Program</p>
        <h1 className="font-serif text-4xl text-foreground sm:text-5xl">KKN Literasi 123 UNS</h1>
        <p className="mt-3 text-muted-foreground">
          Program Kuliah Kerja Nyata bersama Pemerintah Desa Sedayu, Kecamatan Jumantono, Kabupaten
          Karanganyar.
        </p>
      </header>

      <section className="mt-10 rounded-2xl border border-border bg-secondary/40 p-6 sm:p-8">
        <div className="mb-3 flex items-center gap-2">
          <Sprout className="size-5 text-primary" strokeWidth={1.5} />
          <h2 className="font-serif text-2xl text-foreground">Semangat SDG 17: Kemitraan</h2>
        </div>
        <p className="leading-relaxed text-muted-foreground">
          Website potensi ekonomi ini dibangun sebagai wujud kemitraan (SDG 17) antara mahasiswa KKN
          dan perangkat desa untuk mendorong literasi digital serta memperluas pasar UMKM, pertanian,
          dan peternakan Desa Sedayu.
        </p>
      </section>

      <section className="mt-12">
        <div className="mb-5 flex items-center gap-2">
          <Users className="size-5 text-primary" strokeWidth={1.5} />
          <h2 className="font-serif text-2xl text-foreground">Anggota Kelompok</h2>
        </div>
        {tim.length === 0 ? (
          <p className="rounded-xl border border-border bg-card p-4 text-sm text-muted-foreground">
            Data anggota belum tersedia.
          </p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {tim.map((m) => (
              <div key={m.id} className="rounded-2xl border border-border bg-card p-5">
                <div className="flex items-center gap-3">
                  {m.foto_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={m.foto_url} alt={m.nama} className="size-14 rounded-full object-cover" />
                  ) : (
                    <div className="flex size-14 items-center justify-center rounded-full bg-primary/10 font-serif text-xl text-primary">
                      {String(m.nama ?? "?").charAt(0)}
                    </div>
                  )}
                  <div>
                    <h3 className="font-semibold text-foreground">{m.nama}</h3>
                    {m.divisi ? <p className="text-xs font-medium text-primary">{m.divisi}</p> : null}
                  </div>
                </div>
                <dl className="mt-4 space-y-1 text-sm text-muted-foreground">
                  {m.nim ? <div>NIM: {m.nim}</div> : null}
                  {m.program_studi ? <div>{m.program_studi}</div> : null}
                  {m.fakultas ? <div>{m.fakultas}</div> : null}
                </dl>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="mt-12">
        <div className="mb-5 flex items-center gap-2">
          <CalendarDays className="size-5 text-primary" strokeWidth={1.5} />
          <h2 className="font-serif text-2xl text-foreground">Timeline Kegiatan</h2>
        </div>
        {kegiatan.length === 0 ? (
          <p className="rounded-xl border border-border bg-card p-4 text-sm text-muted-foreground">
            Belum ada kegiatan yang tercatat.
          </p>
        ) : (
          <ol className="relative space-y-6 border-l border-border pl-6">
            {kegiatan.map((k) => (
              <li key={k.id} className="relative">
                <span className="absolute -left-[30px] top-1.5 size-3 rounded-full bg-primary" />
                {k.tanggal ? (
                  <p className="text-xs font-medium text-primary">{tanggalID(k.tanggal)}</p>
                ) : null}
                <h3 className="mt-0.5 font-serif text-lg text-foreground">{k.judul}</h3>
                {k.deskripsi ? <p className="mt-1 text-sm text-muted-foreground">{k.deskripsi}</p> : null}
              </li>
            ))}
          </ol>
        )}
      </section>
    </div>
  )
}
