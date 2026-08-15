"use client"

import { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import { ArrowRight, ArrowLeft, School, MapPin, ChevronRight } from "lucide-react"

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

const spring = { type: "spring", stiffness: 120, damping: 22 } as const

export default function SekolahShowcase({ items }: { items: SekolahItem[] }) {
  if (items.length === 0) return null

  const [idx, setIdx]       = useState(0)
  const [dir, setDir]       = useState(1)
  const [paused, setPaused] = useState(false)

  const next = useCallback(() => {
    setDir(1); setIdx((i) => (i + 1) % items.length)
  }, [items.length])

  const prev = useCallback(() => {
    setDir(-1); setIdx((i) => (i - 1 + items.length) % items.length)
  }, [items.length])

  useEffect(() => {
    if (paused) return
    const id = setInterval(next, 4500)
    return () => clearInterval(id)
  }, [next, paused])

  const featured = items[idx]
  const side = [1, 2, 3].map((offset) => items[(idx + offset) % items.length])

  const slideVariants = {
    enter: (d: number) => ({ x: d > 0 ? 60 : -60, opacity: 0, scale: 0.97 }),
    center: { x: 0, opacity: 1, scale: 1 },
    exit:  (d: number) => ({ x: d > 0 ? -60 : 60, opacity: 0, scale: 0.97 }),
  }

  return (
    <section className="bg-muted/20 py-20" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
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
            <p className="mb-1.5 text-[10px] font-bold uppercase tracking-widest text-[#0D9488]">Pendidikan</p>
            <h2 className="font-serif text-3xl font-semibold text-foreground sm:text-4xl">Sekolah Desa Sedayu</h2>
          </div>
          <div className="flex items-center gap-3">
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
              href="/sekolah"
              className="hidden items-center gap-1.5 text-sm font-semibold text-muted-foreground transition hover:text-foreground md:inline-flex"
            >
              Lihat semua <ChevronRight className="size-4" />
            </Link>
          </div>
        </motion.div>

        {/* Carousel */}
        <div className="grid gap-4 lg:grid-cols-[3fr_2fr]">

          {/* Featured */}
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
                  href={`/sekolah/${featured.id}`}
                  className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card"
                >
                  <div className="h-1.5 w-full bg-[#0D9488]" />
                  {featured.foto_url ? (
                    <div className="relative flex-1">
                      <Image src={featured.foto_url} alt={featured.nama} fill className="object-cover transition duration-500 group-hover:scale-[1.03]" priority />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent" />
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
                        <h3 className="font-serif text-2xl font-semibold leading-snug text-white">{featured.nama}</h3>
                        {featured.alamat && (
                          <p className="mt-1.5 flex items-center gap-1.5 text-sm text-white/65">
                            <MapPin className="size-3.5 shrink-0" />{featured.alamat}
                          </p>
                        )}
                        <div className="mt-4 flex items-center gap-2 text-xs font-bold text-white/80">
                          Lihat Detail <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-1 flex-col justify-between p-7">
                      <div className="flex size-11 items-center justify-center rounded-xl bg-[#0D9488]/10">
                        <School className="size-5 text-[#0D9488]" />
                      </div>
                      <div>
                        {featured.jenjang && <p className="mb-1 text-[10px] font-bold uppercase tracking-widest text-[#0D9488]">{featured.jenjang}</p>}
                        <h3 className="font-serif text-2xl font-semibold text-foreground">{featured.nama}</h3>
                        {featured.alamat && (
                          <p className="mt-2 flex items-center gap-1.5 text-sm text-muted-foreground">
                            <MapPin className="size-3.5 shrink-0" />{featured.alamat}
                          </p>
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
            {side.slice(0, 3).map((s, i) => (
              <motion.div
                key={`${s.id}-${i}`}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ ...spring, delay: i * 0.06 }}
                className="flex-1"
              >
                <Link
                  href={`/sekolah/${s.id}`}
                  className="group flex h-full items-center gap-4 rounded-2xl border border-border bg-card px-4 py-4 transition hover:border-[#0D9488]/20 hover:shadow-[0_8px_24px_-8px_rgba(0,0,0,0.08)] active:scale-[.99]"
                >
                  {s.foto_url ? (
                    <div className="relative size-[52px] shrink-0 overflow-hidden rounded-xl">
                      <Image src={s.foto_url} alt={s.nama} fill className="object-cover transition duration-300 group-hover:scale-105" />
                    </div>
                  ) : (
                    <div className="flex size-[52px] shrink-0 items-center justify-center rounded-xl bg-[#0D9488]/8">
                      <School className="size-5 text-[#0D9488]" />
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    {s.jenjang && <p className="mb-0.5 text-[9px] font-bold uppercase tracking-wider text-[#0D9488]">{s.jenjang}{s.akreditasi ? ` · Akreditasi ${s.akreditasi}` : ""}</p>}
                    <h3 className="line-clamp-2 text-sm font-bold leading-snug text-foreground">{s.nama}</h3>
                    {s.alamat && <p className="mt-0.5 line-clamp-1 text-xs text-muted-foreground">{s.alamat}</p>}
                  </div>
                  <ArrowRight className="size-4 shrink-0 text-muted-foreground/30 transition group-hover:translate-x-0.5 group-hover:text-[#0D9488]" />
                </Link>
              </motion.div>
            ))}

            {/* Dots */}
            <div className="flex items-center justify-center gap-1.5 py-2">
              {items.map((_, i) => (
                <button
                  key={i}
                  onClick={() => { setDir(i > idx ? 1 : -1); setIdx(i) }}
                  className={`rounded-full transition-all ${
                    i === idx ? "w-5 h-1.5 bg-[#0D9488]" : "size-1.5 bg-border hover:bg-muted-foreground"
                  }`}
                />
              ))}
            </div>

            <Link href="/sekolah" className="flex items-center justify-center gap-2 rounded-2xl border border-dashed border-border py-4 text-sm font-semibold text-muted-foreground transition hover:text-foreground md:hidden">
              Lihat semua Sekolah <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
