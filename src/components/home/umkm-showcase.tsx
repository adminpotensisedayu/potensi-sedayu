"use client"

import { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import { ArrowRight, ArrowLeft, Store, ChevronRight } from "lucide-react"

type UmkmItem = {
  id: string
  nama_usaha: string
  deskripsi?: string
  foto_url?: string
  kategori?: { nama?: string } | null
}

const spring = { type: "spring", stiffness: 120, damping: 22 } as const

export default function UmkmShowcase({ items }: { items: UmkmItem[] }) {
  if (items.length === 0) return null

  const [idx, setIdx]   = useState(0)
  const [dir, setDir]   = useState(1)
  const [paused, setPaused] = useState(false)

  const next = useCallback(() => {
    setDir(1); setIdx((i) => (i + 1) % items.length)
  }, [items.length])

  const prev = useCallback(() => {
    setDir(-1); setIdx((i) => (i - 1 + items.length) % items.length)
  }, [items.length])

  useEffect(() => {
    if (paused) return
    const id = setInterval(next, 4000)
    return () => clearInterval(id)
  }, [next, paused])

  const featured = items[idx]
  // side cards: next 2 items (wrapping)
  const side = [1, 2].map((offset) => items[(idx + offset) % items.length])

  const slideVariants = {
    enter: (d: number) => ({ x: d > 0 ? 60 : -60, opacity: 0, scale: 0.97 }),
    center: { x: 0, opacity: 1, scale: 1 },
    exit:  (d: number) => ({ x: d > 0 ? -60 : 60, opacity: 0, scale: 0.97 }),
  }

  return (
    <section className="py-20" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      <div className="mx-auto max-w-7xl px-6">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={spring}
          className="mb-10 flex items-center justify-between gap-4"
        >
          <div>
            <p className="mb-1.5 text-[10px] font-bold uppercase tracking-widest text-sector-umkm">UMKM Desa</p>
            <h2 className="font-serif text-3xl font-semibold text-foreground sm:text-4xl">Usaha Warga Lokal</h2>
          </div>
          <div className="flex items-center gap-3">
            {/* Prev / Next */}
            <button
              onClick={prev}
              className="flex size-9 items-center justify-center rounded-full border border-border bg-card text-muted-foreground transition hover:bg-muted hover:text-foreground active:scale-95"
            >
              <ArrowLeft className="size-4" />
            </button>
            <button
              onClick={next}
              className="flex size-9 items-center justify-center rounded-full border border-border bg-card text-muted-foreground transition hover:bg-muted hover:text-foreground active:scale-95"
            >
              <ArrowRight className="size-4" />
            </button>
            <Link
              href="/umkm"
              className="hidden items-center gap-1.5 text-sm font-semibold text-muted-foreground transition hover:text-foreground md:inline-flex"
            >
              Lihat semua <ChevronRight className="size-4" />
            </Link>
          </div>
        </motion.div>

        {/* Carousel layout */}
        <div className="grid gap-4 lg:grid-cols-[2fr_1fr]">

          {/* Featured — animated */}
          <div className="relative min-h-[360px] overflow-hidden rounded-2xl">
            <AnimatePresence initial={false} custom={dir} mode="wait">
              <motion.div
                key={featured.id}
                custom={dir}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.38, ease: [0.32, 0.72, 0, 1] }}
                className="absolute inset-0"
              >
                <Link
                  href={`/umkm/${featured.id}`}
                  className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card"
                >
                  {featured.foto_url ? (
                    <>
                      <div className="relative flex-1">
                        <Image
                          src={featured.foto_url} alt={featured.nama_usaha} fill
                          className="object-cover transition duration-500 group-hover:scale-[1.03]" priority
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />
                      </div>
                      <div className="absolute bottom-0 left-0 p-6">
                        {featured.kategori?.nama && (
                          <span className="mb-2 inline-block rounded-full bg-white/15 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-white backdrop-blur-sm">
                            {featured.kategori.nama}
                          </span>
                        )}
                        <h3 className="font-serif text-2xl font-semibold leading-snug text-white">{featured.nama_usaha}</h3>
                        {featured.deskripsi && (
                          <p className="mt-1.5 line-clamp-2 text-sm text-white/65">{featured.deskripsi}</p>
                        )}
                        <div className="mt-4 flex items-center gap-2 text-xs font-bold text-white/80">
                          Lihat Detail <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
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
                          <p className="mb-1 text-[10px] font-bold uppercase tracking-widest text-sector-umkm">{featured.kategori.nama}</p>
                        )}
                        <h3 className="font-serif text-2xl font-semibold text-foreground">{featured.nama_usaha}</h3>
                        {featured.deskripsi && (
                          <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">{featured.deskripsi}</p>
                        )}
                      </div>
                    </div>
                  )}
                </Link>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Side cards */}
          <div className="flex flex-col gap-3">
            {side.map((item, i) => (
              <motion.div
                key={`${item.id}-${i}`}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ ...spring, delay: i * 0.06 }}
                className="flex-1"
              >
                <Link
                  href={`/umkm/${item.id}`}
                  className="group flex h-full items-center gap-4 rounded-2xl border border-border bg-card px-4 py-4 transition hover:border-sector-umkm/20 hover:shadow-[0_8px_24px_-8px_rgba(0,0,0,0.08)] active:scale-[.99]"
                >
                  {item.foto_url ? (
                    <div className="relative size-[52px] shrink-0 overflow-hidden rounded-xl">
                      <Image src={item.foto_url} alt={item.nama_usaha} fill className="object-cover transition duration-300 group-hover:scale-105" />
                    </div>
                  ) : (
                    <div className="flex size-[52px] shrink-0 items-center justify-center rounded-xl bg-sector-umkm/8">
                      <Store className="size-5 text-sector-umkm" />
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    {item.kategori?.nama && (
                      <p className="mb-0.5 text-[9px] font-bold uppercase tracking-wider text-sector-umkm">{item.kategori.nama}</p>
                    )}
                    <h3 className="truncate text-sm font-bold text-foreground">{item.nama_usaha}</h3>
                    {item.deskripsi && <p className="mt-0.5 line-clamp-1 text-xs text-muted-foreground">{item.deskripsi}</p>}
                  </div>
                  <ArrowRight className="size-4 shrink-0 text-muted-foreground/30 transition group-hover:translate-x-0.5 group-hover:text-sector-umkm" />
                </Link>
              </motion.div>
            ))}

            {/* Dots indicator */}
            <div className="flex items-center justify-center gap-1.5 py-2">
              {items.map((_, i) => (
                <button
                  key={i}
                  onClick={() => { setDir(i > idx ? 1 : -1); setIdx(i) }}
                  className={`rounded-full transition-all ${
                    i === idx ? "w-5 h-1.5 bg-sector-umkm" : "size-1.5 bg-border hover:bg-muted-foreground"
                  }`}
                />
              ))}
            </div>

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
