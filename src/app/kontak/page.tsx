import { createClient } from "@/lib/supabase/server"
import { Mail, Phone, MapPin, ExternalLink, Handshake } from "lucide-react"

export const revalidate = 3600

export const metadata = {
  title: "Kontak & Kemitraan - Desa Sedayu",
  description: "Hubungi Pemerintah Desa Sedayu untuk informasi, kerja sama, dan kemitraan.",
}

const MAPS_URL = "https://www.google.com/maps/search/?api=1&query=-7.67672,110.99979"

export default async function KontakPage() {
  const supabase = await createClient()
  const { data: k } = await supabase
    .from("kontak_desa")
    .select("*")
    .eq("id", 1)
    .maybeSingle()

  return (
    <div className="mx-auto max-w-5xl px-6 py-16">
      <header className="max-w-2xl">
        <p className="mb-2 text-sm font-medium text-primary">Kontak & Kemitraan</p>
        <h1 className="font-serif text-4xl text-foreground sm:text-5xl">Hubungi Desa Sedayu</h1>
        <p className="mt-3 text-muted-foreground">
          Untuk informasi, kerja sama, atau kemitraan potensi ekonomi desa, silakan hubungi kami
          melalui kanal berikut.
        </p>
      </header>

      <div className="mt-12 grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-border bg-card p-6">
          <Mail className="size-6 text-primary" strokeWidth={1.5} />
          <p className="mt-3 text-sm text-muted-foreground">Email</p>
          {k?.email ? (
            <a
              href={"mailto:" + k.email}
              className="font-medium text-foreground underline-offset-4 hover:underline break-words"
            >
              {k.email}
            </a>
          ) : (
            <p className="font-medium text-foreground">-</p>
          )}
        </div>
        <div className="rounded-2xl border border-border bg-card p-6">
          <Phone className="size-6 text-primary" strokeWidth={1.5} />
          <p className="mt-3 text-sm text-muted-foreground">Telepon</p>
          {k?.telepon ? (
            <a
              href={"tel:" + String(k.telepon).replace(/[^0-9+]/g, "")}
              className="font-medium text-foreground underline-offset-4 hover:underline"
            >
              {k.telepon}
            </a>
          ) : (
            <p className="font-medium text-foreground">-</p>
          )}
        </div>
        <div className="rounded-2xl border border-border bg-card p-6">
          <MapPin className="size-6 text-primary" strokeWidth={1.5} />
          <p className="mt-3 text-sm text-muted-foreground">Alamat</p>
          <p className="font-medium text-foreground">{k?.alamat ?? "-"}</p>
        </div>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <a
          href={MAPS_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-between rounded-2xl border border-border bg-card p-6 transition hover:bg-secondary/40"
        >
          <span className="flex items-center gap-3">
            <MapPin className="size-6 text-primary" strokeWidth={1.5} />
            <span className="font-medium text-foreground">Lihat lokasi kantor desa</span>
          </span>
          <ExternalLink className="size-4 text-muted-foreground" strokeWidth={2} />
        </a>

        <div className="rounded-2xl border border-border bg-primary p-6 text-primary-foreground">
          <div className="flex items-center gap-2">
            <Handshake className="size-6" strokeWidth={1.5} />
            <h2 className="font-serif text-xl">Tertarik Bermitra?</h2>
          </div>
          <p className="mt-2 text-sm opacity-90">
            Kami terbuka untuk kerja sama pemasaran, pelatihan, dan pengembangan UMKM, pertanian,
            serta peternakan Desa Sedayu.
          </p>
          {k?.email ? (
            <a
              href={"mailto:" + k.email}
              className="mt-4 inline-flex items-center gap-2 rounded-full bg-primary-foreground px-5 py-2.5 text-sm font-semibold text-primary transition hover:opacity-90"
            >
              <Mail className="size-4" strokeWidth={2} />
              Kirim Email
            </a>
          ) : null}
        </div>
      </div>
    </div>
  )
}
