"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import { ArrowRight, School, MapPin } from "lucide-react"

type SekolahItem = {
  id: string
  nama: string
  jenjang?: string
  akreditasi?: string
  foto_url?: string
  alamat?: string
}

const JENJANG_COLOR: Record<string, string> = {
  TK:  "bg-pink-50   text-pink-700   dark:bg-pink-950/40  dark:text-pink-300",
  SD:  "bg-sky-50    text-sky-700    dark:bg-sky-950/40   dark:text-sky-300",
  SMP: "bg-violet-50 text-violet-700 dark:bg-violet-950/40 dark:text-violet-300",
  SMA: "bg-orange-50 text-orange-700 dark:bg-orange-950/40 dark:text-orange-300",
  SMK: "bg-amber-50  text-amber-700  dark:bg-amber-950/40 dark:text-amber-300",
  SLB: "bg-teal-50   text-teal-700   dark:bg-teal-950/40  dark:text-teal-300",
}

const spring = { type: "spring", stiffness: 100, damping: 20 } as const

export default function SekolahShowcase({ items }: { items: SekolahItem[] }) {
  if (items.length === 0) return null

  const [featured, ...rest] = items

  return (
    <section className="bg-muted/20 py-20">
      <div className="mx-auto max-w-7xl px-6">

        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={spring}
          className="mb-10 flex items-end justify-between gap-4"
        >
          <div>
            <p className="mb-1.5 text-[10px] font-bold uppercase tracking-widest text-[#0D9488]">
              Pendidikan
            </p>
            <h2 className="font-serif text-3xl font-semibold text-foreground sm:text-4xl">
              Sekolah Desa Sedayu
            </h2>
          </div>
          <Link
            href="/sekolah"
            className="hidden items-center gap-1.5 text-sm font-semibold text-muted-foreground transition hover:text-foreground md:inline-flex"
          >
            Lihat semua
            <ArrowRight className="size-4" />
          </Link>
        </motion.div>

        {/* Asymmetric [3fr_2fr] — different ratio from UMKM section ───── */}
        <div className="grid gap-4 lg:grid-cols-[3fr_2fr]">

          {/* Featured sekolah — teal accent treatment ─────────────────── */}
          {featured && (
            <motion.div
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={spring}
            >
              <Link
                href={`/sekolah/${featured.id}`}
                className="group relative flex h-full min-h-[360px] flex-col overflow-hidden rounded-2xl border border-border bg-card transition hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.10)] active:scale-[.99]"
              >
                {/* Teal accent top bar */}
                <div className="h-1.5 w-full bg-[#0D9488]" />

                {featured.foto_url ? (
                  <div className="relative flex-1">
                    <Image
                      src={featured.foto_url}
                      alt={featured.nama}
                      fill
                      className="object-cover transition duration-500 group-hover:scale-[1.03]"
                      priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent" />

                    {/* Badges */}
                    <div className="absolute left-4 top-4 flex gap-2">
                      {featured.jenjang && (
                        <span className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${JENJANG_COLOR[featured.jenjang] ?? "bg-white/20 text-white"}`}>
                          {featured.jenjang}
                        </span>
                      )}
                      {featured.akreditasi && (
                        <span className="rounded-full bg-white/15 px-2.5 py-1 text-[11px] font-bold text-white backdrop-blur-sm">
                          Akreditasi {featured.akreditasi}
                        </span>
                      )}
                    </div>

                    <div className="absolute bottom-0 left-0 p-6">
                      <h3 className="font-serif text-2xl font-semibold leading-snug text-white">
                        {featured.nama}
                      </h3>
                      {featured.alamat && (
                        <p className="mt-1.5 flex items-center gap-1.5 text-sm text-white/65">
                          <MapPin className="size-3.5 shrink-0" />
                          {featured.alamat}
                        </p>
                      )}
                      <div className="mt-4 flex items-center gap-2 text-xs font-bold text-white/80">
                        Lihat Detail
                        <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-1 flex-col justify-between p-7">
                    <div className="flex size-11 items-center justify-center rounded-xl bg-[#0D9488]/10">
                      <School className="size-5 text-[#0D9488]" />
                    </div>
                    <div>
                      {featured.jenjang && (
                        <p className="mb-1 text-[10px] font-bold uppercase tracking-widest text-[#0D9488]">
                          {featured.jenjang}
                        </p>
                      )}
                      <h3 className="font-serif text-2xl font-semibold text-foreground">
                        {featured.nama}
                      </h3>
                      {featured.alamat && (
                        <p className="mt-2 flex items-center gap-1.5 text-sm text-muted-foreground">
                          <MapPin className="size-3.5 shrink-0" />
                          {featured.alamat}
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </Link>
            </motion.div>
          )}

          {/* Right column: stacked smaller sekolah cards ──────────────── */}
          <div className="flex flex-col gap-3">
            {rest.slice(0, 4).map((s, i) => (
              <motion.div
                key={s.id}
                initial={{ opacity: 0, x: 24 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ ...spring, delay: i * 0.07 }}
                className="flex-1"
              >
                <Link
                  href={`/sekolah/${s.id}`}
                  className="group flex h-full items-center gap-4 rounded-2xl border border-border bg-card px-4 py-4 transition hover:shadow-[0_8px_24px_-8px_rgba(0,0,0,0.08)] hover:border-[#0D9488]/20 active:scale-[.99]"
                >
                  {/* Thumbnail or icon */}
                  {s.foto_url ? (
                    <div className="relative size-[52px] shrink-0 overflow-hidden rounded-xl">
                      <Image
                        src={s.foto_url}
                        alt={s.nama}
                        fill
                        className="object-cover transition duration-300 group-hover:scale-105"
                      />
                    </div>
                  ) : (
                    <div className="flex size-[52px] shrink-0 items-center justify-center rounded-xl bg-[#0D9488]/8">
                      <School className="size-5 text-[#0D9488]" />
                    </div>
                  )}

                  <div className="min-w-0 flex-1">
                    {s.jenjang && (
                      <p className="mb-0.5 text-[9px] font-bold uppercase tracking-wider text-[#0D9488]">
                        {s.jenjang}
                        {s.akreditasi && ` · Akreditasi ${s.akreditasi}`}
                      </p>
                    )}
                    <h3 className="line-clamp-2 text-sm font-bold leading-snug text-foreground">
                      {s.nama}
                    </h3>
                    {s.alamat && (
                      <p className="mt-0.5 line-clamp-1 text-xs text-muted-foreground">
                        {s.alamat}
                      </p>
                    )}
                  </div>

                  <ArrowRight className="size-4 shrink-0 text-muted-foreground/30 transition group-hover:translate-x-0.5 group-hover:text-[#0D9488]" />
                </Link>
              </motion.div>
            ))}

            {/* Mobile view-all */}
            <Link
              href="/sekolah"
              className="flex items-center justify-center gap-2 rounded-2xl border border-dashed border-border py-4 text-sm font-semibold text-muted-foreground transition hover:text-foreground md:hidden"
            >
              Lihat semua Sekolah <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}