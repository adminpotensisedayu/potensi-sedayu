import { createClient } from "@/lib/supabase/server"
import { UmkmForm } from "@/components/admin/umkm-form"

export const dynamic = "force-dynamic"

export default async function AdminUmkmBaruPage() {
  const supabase = await createClient()
  const { data: kategori } = await supabase
    .from("kategori")
    .select("id, nama")
    .order("urutan")

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="mb-6 font-serif text-3xl text-foreground">Tambah UMKM</h1>
      <UmkmForm kategori={(kategori ?? []) as any} initial={null} />
    </div>
  )
}