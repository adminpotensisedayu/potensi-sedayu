import { notFound } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { KknKegiatanForm } from "@/components/admin/kkn-kegiatan-form"

export const dynamic = "force-dynamic"
export const metadata = { title: "Edit Kegiatan KKN | Admin" }

export default async function AdminKknKegiatanEditPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()
  const { data } = await supabase.from("kegiatan_kkn").select("*").eq("id", id).maybeSingle()

  if (!data) notFound()

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="mb-6 font-serif text-3xl text-foreground">Edit Kegiatan KKN</h1>
      <KknKegiatanForm initial={data as any} />
    </div>
  )
}
