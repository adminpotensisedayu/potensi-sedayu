import { createClient } from "@/lib/supabase/server"
import { DaftarForm } from "@/components/daftar/daftar-form"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Daftar UMKM | Potensi Desa Sedayu",
  description:
    "Daftarkan UMKM Anda ke website Potensi Desa Sedayu. Isi formulir online, tim kami review dalam 1–3 hari kerja.",
}

export default async function DaftarPage() {
  const supabase = await createClient()

  const { data: kategoriList } = await supabase
    .from("kategori")
    .select("id, nama")
    .order("urutan")

  return (
    <main className="min-h-screen bg-background">
      {/* ── Hero ── */}
      <div className="border-b border-border bg-gradient-to-b from-primary/5 to-background">
        <div className="mx-auto max-w-2xl px-4 py-12 text-center">
          <span className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
            📋 Pendaftaran UMKM
          </span>
          <h1 className="font-serif text-3xl font-bold text-foreground">
            Daftarkan Usaha Anda
          </h1>
          <p className="mt-3 text-muted-foreground">
            Isi formulir di bawah untuk mendaftarkan UMKM ke website{" "}
            <strong>Potensi Desa Sedayu</strong>. <br />
            Tim kami akan mereview{" "}
            <strong></strong> dan menghubungi via WhatsApp.
          </p>
        </div>
      </div>

      {/* ── Form ── */}
      <div className="mx-auto max-w-2xl px-4 pb-16 pt-10">
        <DaftarForm kategoriList={kategoriList ?? []} />
      </div>
    </main>
  )
}