import { KknTimForm } from "@/components/admin/kkn-tim-form"

export const metadata = { title: "Tambah Anggota KKN | Admin" }

export default function AdminKknTimBaruPage() {
  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="mb-6 font-serif text-3xl text-foreground">Tambah Anggota Tim KKN</h1>
      <KknTimForm initial={null} />
    </div>
  )
}
