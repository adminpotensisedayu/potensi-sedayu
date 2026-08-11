import { notFound } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { UmkmForm } from "@/components/admin/umkm-form"

export const dynamic = "force-dynamic"

export default async function AdminUmkmEditPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()
  const [umkmRes, kategoriRes] = await Promise.all([
    supabase.from("umkm").select("*").eq("id", id).maybeSingle(),
    supabase.from("kategori").select("id, nama").order("nama"),
  ])

  if (!umkmRes.data) notFound()

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="mb-6 font-serif text-3xl text-foreground">Edit UMKM</h1>
      <UmkmForm kategori={(kategoriRes.data ?? []) as any} initial={umkmRes.data as any} />
    </div>
  )
}
