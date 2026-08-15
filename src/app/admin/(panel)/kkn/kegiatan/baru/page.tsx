import { KknKegiatanForm } from "@/components/admin/kkn-kegiatan-form"

export const metadata = { title: "Tambah Kegiatan KKN | Admin" }

export default function AdminKknKegiatanBaruPage() {
  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="mb-6 font-serif text-3xl text-foreground">Tambah Kegiatan KKN</h1>
      <KknKegiatanForm initial={null} />
    </div>
  )
}
