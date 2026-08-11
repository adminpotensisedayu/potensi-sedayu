import Link from "next/link"
import { Clock, MapPin, Tag } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Gallery } from "@/components/shared/gallery"
import { ContactButtons } from "@/components/shared/contact-buttons"

type DetailPelakuProps = {
  sektorLabel: string
  sektorHref: string
  title: string
  kategori?: string | null
  kategoriColorClass?: string
  unggulan?: boolean | null
  deskripsi?: string | null
  alamat?: string | null
  jam?: string | null
  extra?: { label: string; value: string } | null
  fotos: (string | null)[]
  whatsapp?: string | null
  waPesan: string
  lat?: number | null
  lng?: number | null
}

export function DetailPelaku(props: DetailPelakuProps) {
  const {
    sektorLabel,
    sektorHref,
    title,
    kategori,
    kategoriColorClass = "text-primary",
    unggulan,
    deskripsi,
    alamat,
    jam,
    extra,
    fotos,
    whatsapp,
    waPesan,
    lat,
    lng,
  } = props

  return (
    <article className="mx-auto max-w-5xl px-6 py-12">
      <nav className="mb-6 text-sm text-muted-foreground">
        <Link href="/" className="hover:text-foreground">Beranda</Link>
        <span className="mx-2">/</span>
        <Link href={sektorHref} className="hover:text-foreground">{sektorLabel}</Link>
        <span className="mx-2">/</span>
        <span className="text-foreground">{title}</span>
      </nav>

      <header className="mb-6">
        {kategori ? (
          <p className={"mb-1 text-sm font-medium " + kategoriColorClass}>{kategori}</p>
        ) : null}
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="font-serif text-3xl text-foreground md:text-4xl">{title}</h1>
          {unggulan ? <Badge>Unggulan</Badge> : null}
        </div>
      </header>

      <div className="grid gap-8 lg:grid-cols-[1.6fr_1fr]">
        <div className="space-y-6">
          <Gallery fotos={fotos} alt={title} />
          {deskripsi ? (
            <p className="leading-relaxed text-foreground/90">{deskripsi}</p>
          ) : null}
        </div>

        <aside className="space-y-5 lg:sticky lg:top-24 lg:self-start">
          <div className="space-y-3 rounded-2xl border border-border bg-card p-5">
            {extra ? (
              <div className="flex items-start gap-3 text-sm">
                <Tag className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                <span>
                  <span className="text-muted-foreground">{extra.label}: </span>
                  {extra.value}
                </span>
              </div>
            ) : null}

            {jam ? (
              <div className="flex items-start gap-3 text-sm">
                <Clock className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                <span>{jam}</span>
              </div>
            ) : null}

            {alamat ? (
              <div className="flex items-start gap-3 text-sm">
                <MapPin className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                <span>{alamat}</span>
              </div>
            ) : null}
          </div>

          <ContactButtons
            whatsapp={whatsapp}
            waPesan={waPesan}
            lat={lat}
            lng={lng}
            shareTitle={title}
          />
        </aside>
      </div>
    </article>
  )
}
