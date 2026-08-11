import { notFound } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { SekolahForm } from "@/components/admin/sekolah-form"

export const dynamic = "force-dynamic"

export default async function AdminSekolahEditPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()
  const { data } = await supabase.from("sekolah").select("*").eq("id", id).maybeSingle()
  if (!data) notFound()

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="mb-6 font-serif text-3xl text-foreground">Edit Sekolah</h1>
      <SekolahForm initial={data as any} />
    </div>
  )
}