import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { DeleteButton } from "@/components/admin/delete-button"
import { Plus, Pencil, School, Star } from "lucide-react"

export const dynamic = "force-dynamic"

export default async function AdminSekolahPage() {
  const supabase = await createClient()
  const { data } = await supabase
    .from("sekolah")
    .select("id, nama, jenjang, status, akreditasi, is_unggulan, is_aktif")
    .order("jenjang")
    .order("nama")

  const rows = (data ?? []) as any[]

  return (
    <div className="mx-auto max-w-5xl">
      <header className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl text-foreground">Kelola Sekolah</h1>
          <p className="mt-1 text-muted-foreground">{rows.length} sekolah terdaftar</p>
        </div>
        <Link
          href="/admin/sekolah/baru"
          className="inline-flex items-center gap-2 rounded-full bg-[#0D9488] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#0D9488]/90"
        >
          <Plus className="size-4" strokeWidth={2} />
          Tambah Sekolah
        </Link>
      </header>

      {rows.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card py-16 text-center">
          <School className="size-8 text-muted-foreground" strokeWidth={1.5} />
          <p className="mt-3 font-medium text-foreground">Belum ada data sekolah</p>
          <p className="text-sm text-muted-foreground">Klik Tambah Sekolah untuk mulai.</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-border bg-card">
          <table className="w-full text-sm">
            <thead className="border-b border-border bg-secondary/40 text-left text-muted-foreground">
              <tr>
                <th className="px-4 py-3 font-medium">Nama Sekolah</th>
                <th className="px-4 py-3 font-medium">Jenjang</th>
                <th className="px-4 py-3 font-medium">Akreditasi</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 text-right font-medium">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((s) => (
                <tr key={s.id} className="border-b border-border last:border-0">
                  <td className="px-4 py-3">
                    <span className="flex items-center gap-2 font-medium text-foreground">
                      {s.is_unggulan && (
                        <Star className="size-4 fill-amber-500 text-amber-500" strokeWidth={0} />
                      )}
                      {s.nama}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="rounded-full bg-[#0D9488]/10 px-2.5 py-0.5 text-xs font-bold text-[#0D9488]">
                      {s.jenjang ?? "-"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {s.akreditasi ? `Akreditasi ${s.akreditasi}` : "-"}
                  </td>
                  <td className="px-4 py-3">
                    {s.is_aktif ? (
                      <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">Aktif</span>
                    ) : (
                      <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">Nonaktif</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <Link
                        href={`/admin/sekolah/${s.id}`}
                        className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-sm font-medium text-foreground transition hover:bg-secondary"
                      >
                        <Pencil className="size-4" strokeWidth={1.5} />
                        Edit
                      </Link>
                      <DeleteButton table="sekolah" id={s.id} label={`Hapus "${s.nama}"?`} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}