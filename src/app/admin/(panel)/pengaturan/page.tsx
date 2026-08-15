import { createClient } from "@/lib/supabase/server"
import { PengaturanForm } from "@/components/admin/pengaturan-form"
import type { Metadata } from "next"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Pengaturan | Admin Potensi Sedayu",
}

export default async function AdminPengaturanPage() {
  const supabase = await createClient()

  const [profilRes, kontakRes] = await Promise.all([
    supabase.from("profil_desa").select("*").eq("id", 1).maybeSingle(),
    supabase.from("kontak_desa").select("*").eq("id", 1).maybeSingle(),
  ])

  return (
    <div className="mx-auto max-w-3xl">
      <header className="mb-8">
        <h1 className="font-serif text-3xl text-foreground">Pengaturan</h1>
        <p className="mt-1 text-muted-foreground">
          Kelola profil dan informasi kontak Desa Sedayu.
        </p>
      </header>

      <PengaturanForm
        profil={profilRes.data ?? null}
        kontak={kontakRes.data ?? null}
      />
    </div>
  )
}
