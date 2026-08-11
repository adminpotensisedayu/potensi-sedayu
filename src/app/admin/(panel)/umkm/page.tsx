import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { DeleteButton } from "@/components/admin/delete-button"
import { Plus, Pencil, Store, Star } from "lucide-react"

export const dynamic = "force-dynamic"

export default async function AdminUmkmPage() {
  const supabase = await createClient()
  const { data } = await supabase
    .from("umkm")
    .select("id, nama_usaha, is_unggulan, is_aktif, kategori:kategori_id (nama)")
    .order("created_at", { ascending: false })

  const rows = (data ?? []) as any[]

  return (
    <div className="mx-auto max-w-5xl">
      <header className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl text-foreground">Kelola UMKM</h1>
          <p className="mt-1 text-muted-foreground">{rows.length} usaha terdaftar</p>
        </div>
        <Link
          href="/admin/umkm/baru"
          className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:opacity-90"
        >
          <Plus className="size-4" strokeWidth={2} />
          Tambah UMKM
        </Link>
      </header>

      {rows.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card py-16 text-center">
          <Store className="size-8 text-muted-foreground" strokeWidth={1.5} />
          <p className="mt-3 font-medium text-foreground">Belum ada data UMKM</p>
          <p className="text-sm text-muted-foreground">
            Klik Tambah UMKM untuk menambah data pertama.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-border bg-card">
          <table className="w-full text-sm">
            <thead className="border-b border-border bg-secondary/40 text-left text-muted-foreground">
              <tr>
                <th className="px-4 py-3 font-medium">Nama Usaha</th>
                <th className="px-4 py-3 font-medium">Kategori</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 text-right font-medium">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((u) => (
                <tr key={u.id} className="border-b border-border last:border-0">
                  <td className="px-4 py-3">
                    <span className="flex items-center gap-2 font-medium text-foreground">
                      {u.is_unggulan ? (
                        <Star className="size-4 fill-amber-500 text-amber-500" strokeWidth={0} />
                      ) : null}
                      {u.nama_usaha}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{u.kategori?.nama ?? "-"}</td>
                  <td className="px-4 py-3">
                    {u.is_aktif ? (
                      <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                        Aktif
                      </span>
                    ) : (
                      <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
                        Nonaktif
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <Link
                        href={"/admin/umkm/" + u.id}
                        className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-sm font-medium text-foreground transition hover:bg-secondary"
                      >
                        <Pencil className="size-4" strokeWidth={1.5} />
                        Edit
                      </Link>
                      <DeleteButton table="umkm" id={u.id} label={'Hapus UMKM "' + u.nama_usaha + '"?'} />
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
