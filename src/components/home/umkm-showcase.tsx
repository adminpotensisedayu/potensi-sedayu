"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import { ArrowRight, Store } from "lucide-react"

type UmkmItem = {
  id: string
  nama_usaha: string
  deskripsi?: string
  foto_url?: string
  kategori?: { nama?: string } | null
}

const spring = { type: "spring", stiffness: 100, damping: 20 } as const

export default function UmkmShowcase({ items }: { items: UmkmItem[] }) {
  if (items.length === 0) return null

  const [featured, ...rest] = items

  return (
    <section className="py-20">
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
            <p className="mb-1.5 text-[10px] font-bold uppercase tracking-widest text-sector-umkm">
              UMKM Desa
            </p>
            <h2 className="font-serif text-3xl font-semibold text-foreground sm:text-4xl">
              Usaha Warga Lokal
            </h2>
          </div>
          <Link
            href="/umkm"
            className="hidden items-center gap-1.5 text-sm font-semibold text-muted-foreground transition hover:text-foreground md:inline-flex"
          >
            Lihat semua
            <ArrowRight className="size-4" />
          </Link>
        </motion.div>

        {/* Asymmetric grid [2fr_1fr] — NO equal 3-col (SKILL Rule) ──── */}
        <div className="grid gap-4 lg:grid-cols-[2fr_1fr]">

          {/* Featured card (large) */}
          {featured && (
            <motion.div
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={spring}
            >
              <Link
                href={`/umkm/${featured.id}`}
                className="group relative flex h-full min-h-[360px] flex-col overflow-hidden rounded-2xl border border-border bg-card transition hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.10)] active:scale-[.99]"
              >
                {featured.foto_url ? (
                  <>
                    <div className="relative flex-1">
                      <Image
                        src={featured.foto_url}
                        alt={featured.nama_usaha}
                        fill
                        className="object-cover transition duration-500 group-hover:scale-[1.03]"
                        priority
                      />
                      {/* Gradient overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent" />
                    </div>
                    <div className="absolute bottom-0 left-0 p-6">
                      {featured.kategori?.nama && (
                        <span className="mb-2 inline-block rounded-full bg-white/15 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-white backdrop-blur-sm">
                          {featured.kategori.nama}
                        </span>
                      )}
                      <h3 className="font-serif text-2xl font-semibold leading-snug text-white">
                        {featured.nama_usaha}
                      </h3>
                      {featured.deskripsi && (
                        <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-white/65">
                          {featured.deskripsi}
                        </p>
                      )}
                      <div className="mt-4 flex items-center gap-2 text-xs font-bold text-white/80">
                        Lihat Detail
                        <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-1 flex-col justify-between p-7">
                    <div className="flex size-11 items-center justify-center rounded-xl bg-sector-umkm/10">
                      <Store className="size-5 text-sector-umkm" />
                    </div>
                    <div>
                      {featured.kategori?.nama && (
                        <p className="mb-1 text-[10px] font-bold uppercase tracking-widest text-sector-umkm">
                          {featured.kategori.nama}
                        </p>
                      )}
                      <h3 className="font-serif text-2xl font-semibold text-foreground">
                        {featured.nama_usaha}
                      </h3>
                      {featured.deskripsi && (
                        <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
                          {featured.deskripsi}
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </Link>
            </motion.div>
          )}

          {/* Right column: stacked cards with stagger ──────────────────── */}
          <div className="flex flex-col gap-3">
            {rest.slice(0, 3).map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: 28 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ ...spring, delay: i * 0.08 }}
                className="flex-1"
              >
                <Link
                  href={`/umkm/${item.id}`}
                  className="group flex h-full items-center gap-4 rounded-2xl border border-border bg-card px-4 py-4 transition hover:shadow-[0_8px_24px_-8px_rgba(0,0,0,0.08)] hover:border-sector-umkm/20 active:scale-[.99]"
                >
                  {item.foto_url ? (
                    <div className="relative size-[52px] shrink-0 overflow-hidden rounded-xl">
                      <Image
                        src={item.foto_url}
                        alt={item.nama_usaha}
                        fill
                        className="object-cover transition duration-300 group-hover:scale-105"
                      />
                    </div>
                  ) : (
                    <div className="flex size-[52px] shrink-0 items-center justify-center rounded-xl bg-sector-umkm/8">
                      <Store className="size-5 text-sector-umkm" />
                    </div>
                  )}

                  <div className="min-w-0 flex-1">
                    {item.kategori?.nama && (
                      <p className="mb-0.5 text-[9px] font-bold uppercase tracking-wider text-sector-umkm">
                        {item.kategori.nama}
                      </p>
                    )}
                    <h3 className="truncate text-sm font-bold text-foreground">
                      {item.nama_usaha}
                    </h3>
                    {item.deskripsi && (
                      <p className="mt-0.5 line-clamp-1 text-xs text-muted-foreground">
                        {item.deskripsi}
                      </p>
                    )}
                  </div>

                  <ArrowRight className="size-4 shrink-0 text-muted-foreground/30 transition group-hover:translate-x-0.5 group-hover:text-sector-umkm" />
                </Link>
              </motion.div>
            ))}

            {/* Mobile view-all */}
            <Link
              href="/umkm"
              className="flex items-center justify-center gap-2 rounded-2xl border border-dashed border-border py-4 text-sm font-semibold text-muted-foreground transition hover:text-foreground md:hidden"
            >
              Lihat semua UMKM <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}