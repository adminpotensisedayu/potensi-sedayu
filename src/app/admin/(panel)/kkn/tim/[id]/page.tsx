import { notFound } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { KknTimForm } from "@/components/admin/kkn-tim-form"

export const dynamic = "force-dynamic"
export const metadata = { title: "Edit Anggota KKN | Admin" }

export default async function AdminKknTimEditPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()
  const { data } = await supabase.from("tim_kkn").select("*").eq("id", id).maybeSingle()

  if (!data) notFound()

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="mb-6 font-serif text-3xl text-foreground">Edit Anggota KKN</h1>
      <KknTimForm initial={data as any} />
    </div>
  )
}
