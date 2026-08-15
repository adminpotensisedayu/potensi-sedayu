"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { MapPin, ArrowRight, Store, School } from "lucide-react"

const spring = { type: "spring", stiffness: 100, damping: 20 } as const

export default function PetaCta() {
  return (
    /* Pakai warna fixed dark agar konsisten di light maupun dark mode */
    <section className="relative overflow-hidden bg-[#0f1a10] py-24">
      {/* Dot grid */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(255,255,255,0.07) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />
      {/* Teal glow */}
      <div className="pointer-events-none absolute -bottom-32 -right-32 size-96 rounded-full bg-[#0D9488]/15 blur-3xl" />
      <div className="pointer-events-none absolute -top-24 left-1/3 size-64 rounded-full bg-emerald-500/8 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-6">
        <div className="grid gap-12 lg:grid-cols-[1fr_auto] lg:items-center">

          {/* Left */}
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={spring}
            className="space-y-6"
          >
            <div className="flex items-center gap-2.5">
              <div className="flex size-6 items-center justify-center rounded-md bg-[#0D9488]/25">
                <MapPin className="size-3.5 text-[#0D9488]" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-white/50">
                Peta Interaktif Desa
              </span>
            </div>

            <h2 className="font-serif text-4xl font-semibold leading-tight text-white sm:text-5xl">
              Temukan Potensi
              <br />
              <span className="text-white/35">di Peta Desa</span>
            </h2>

            <p className="max-w-[46ch] text-sm leading-relaxed text-white/55">
              Semua UMKM dan sekolah terpetakan lengkap dengan lokasi GPS.
              Filter per kategori, klik marker, langsung ke detail.
            </p>

            {/* Mini legend */}
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2 text-xs text-white/50">
                <div className="flex size-6 items-center justify-center rounded-lg bg-amber-500/20">
                  <Store className="size-3.5 text-amber-400" />
                </div>
                Marker UMKM
              </div>
              <div className="flex items-center gap-2 text-xs text-white/50">
                <div className="flex size-6 items-center justify-center rounded-lg bg-[#0D9488]/20">
                  <School className="size-3.5 text-[#0D9488]" />
                </div>
                Marker Sekolah
              </div>
            </div>
          </motion.div>

          {/* Right: CTA */}
          <motion.div
            initial={{ opacity: 0, scale: 0.88 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ ...spring, delay: 0.15 }}
          >
            <Link
              href="/peta"
              className="group inline-flex items-center gap-3 rounded-2xl bg-white px-8 py-5 text-base font-bold text-gray-900 shadow-[0_0_0_1px_rgba(255,255,255,0.1)] transition hover:-translate-y-1 hover:shadow-[0_20px_40px_-12px_rgba(255,255,255,0.25)] active:scale-[.98] active:translate-y-0"
            >
              <MapPin className="size-5 text-[#0D9488]" />
              Buka Peta
              <ArrowRight className="size-5 transition-transform group-hover:translate-x-1" />
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
