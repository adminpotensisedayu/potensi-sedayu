import { SekolahForm } from "@/components/admin/sekolah-form"

export default function AdminSekolahBaruPage() {
  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="mb-6 font-serif text-3xl text-foreground">Tambah Sekolah</h1>
      <SekolahForm initial={null} />
    </div>
  )
}