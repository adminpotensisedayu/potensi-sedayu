import { createClient } from "@/lib/supabase/server"
import { PengajuanForm } from "@/components/daftar/pengajuan-form"
import { Sparkles, CheckCircle, Clock, Phone } from "lucide-react"

export const metadata = {
  title: "Daftarkan Usaha — Potensi Sedayu",
  description: "Daftarkan UMKM Anda ke direktori resmi Desa Sedayu. Gratis dan langsung tayang setelah diverifikasi.",
}

export default async function DaftarPage() {
  const supabase = await createClient()

  const [
    { data: kategoriList },
    { data: subKategoriList },
    { data: kontak },
  ] = await Promise.all([
    supabase.from("kategori").select("id, nama").order("urutan"),
    supabase.from("sub_kategori").select("id, nama, kategori_id").order("urutan"),
    supabase.from("kontak_desa").select("telepon").eq("id", 1).single(),
  ])

  return (
    <div className="min-h-screen bg-background">

      {/* ── Hero ── */}
      <div className="relative overflow-hidden border-b border-border bg-gradient-to-br from-background via-background to-teal-50/30 dark:to-teal-950/10">
        <div className="pointer-events-none absolute -right-20 -top-20 size-72 rounded-full bg-teal-500/8 blur-[80px]" />
        <div className="pointer-events-none absolute -left-10 bottom-0 size-48 rounded-full bg-amber-500/6 blur-[60px]" />
        <div className="relative mx-auto max-w-4xl px-6 py-12 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-teal-200/60 bg-teal-50/80 px-4 py-1.5 text-xs font-semibold text-teal-700 dark:border-teal-800/60 dark:bg-teal-950/40 dark:text-teal-400">
            <Sparkles className="size-3.5" />
            Pendaftaran Gratis · Tanpa Biaya Apapun
          </div>
          <h1 className="font-serif text-3xl text-foreground sm:text-4xl lg:text-5xl">
            Daftarkan Usaha Anda
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
            Masukkan usaha Anda ke direktori resmi Desa Sedayu. Jangkau lebih banyak pelanggan
            dan bantu warga menemukan usaha lokal berkualitas.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            {([
              [CheckCircle, "Gratis selamanya"],
              [Clock,       "Review 1–3 hari kerja"],
              [Phone,       "Notif via WhatsApp"],
            ] as const).map(([Icon, text]) => (
              <div key={text} className="flex items-center gap-1.5 rounded-full border border-border bg-background/80 px-3 py-1.5 text-xs font-medium text-muted-foreground shadow-sm backdrop-blur-sm">
                <Icon className="size-3.5 text-teal-500" strokeWidth={1.5} />
                {text}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Form ── */}
      <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
        <PengajuanForm
          kategoriList={(kategoriList    ?? []) as any[]}
          subKategoriList={(subKategoriList ?? []) as any[]}
          waNumber={kontak?.telepon ?? ""}
        />
      </div>
    </div>
  )
}
