import { createClient } from "@/lib/supabase/server"
import { PengajuanTable } from "@/components/admin/pengajuan-table"
import { ClipboardList } from "lucide-react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Pengajuan UMKM | Admin Potensi Sedayu",
}

export default async function PengajuanPage() {
  const supabase = await createClient()

  const { data: list } = await supabase
    .from("pengajuan_umkm")
    .select("*")
    .order("created_at", { ascending: false })

  const data = list ?? []

  const counts = {
    semua:     data.length,
    menunggu:  data.filter((p) => p.status === "menunggu").length,
    disetujui: data.filter((p) => p.status === "disetujui").length,
    ditolak:   data.filter((p) => p.status === "ditolak").length,
  }

  return (
    <div className="space-y-6">

      {/* Header — responsive */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="mb-1 flex items-center gap-1.5 text-xs text-muted-foreground">
            <ClipboardList className="size-3.5" />
            <span>Admin</span>
          </div>
          <h1 className="font-serif text-xl font-bold text-foreground sm:text-2xl">
            Pengajuan UMKM
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Review dan proses pengajuan pendaftaran UMKM dari warga.
          </p>
        </div>

        {/* Stat cards — wrap on mobile */}
        <div className="flex flex-wrap gap-2 sm:flex-nowrap sm:shrink-0">
          <div className="flex-1 min-w-[70px] rounded-xl border border-yellow-200 bg-yellow-50 px-3 py-2 text-center sm:px-4 dark:border-yellow-900 dark:bg-yellow-950/30">
            <div className="text-lg font-bold text-yellow-700 sm:text-xl dark:text-yellow-400">{counts.menunggu}</div>
            <div className="text-[10px] font-medium text-yellow-600 dark:text-yellow-500">Menunggu</div>
          </div>
          <div className="flex-1 min-w-[70px] rounded-xl border border-green-200 bg-green-50 px-3 py-2 text-center sm:px-4 dark:border-green-900 dark:bg-green-950/30">
            <div className="text-lg font-bold text-green-700 sm:text-xl dark:text-green-400">{counts.disetujui}</div>
            <div className="text-[10px] font-medium text-green-600 dark:text-green-500">Disetujui</div>
          </div>
          <div className="flex-1 min-w-[70px] rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-center sm:px-4 dark:border-red-900 dark:bg-red-950/30">
            <div className="text-lg font-bold text-red-700 sm:text-xl dark:text-red-400">{counts.ditolak}</div>
            <div className="text-[10px] font-medium text-red-600 dark:text-red-500">Ditolak</div>
          </div>
        </div>
      </div>

      <PengajuanTable data={data} counts={counts} />
    </div>
  )
}
