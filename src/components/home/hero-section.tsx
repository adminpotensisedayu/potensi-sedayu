"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import { ArrowRight, Store, School, Map, Camera } from "lucide-react"

const spring = { type: "spring", stiffness: 100, damping: 20 } as const

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.15 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 28 },
  show:  { opacity: 1, y: 0, transition: spring },
}

function PulseDot() {
  return (
    <span className="relative flex size-2">
      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-teal-400 opacity-75" />
      <span className="relative inline-flex size-2 rounded-full bg-teal-500" />
    </span>
  )
}

// ── Slot foto desa — ganti src setelah upload foto ke /public/ ──────────────
function FotoDesa({
  src,
  alt,
  label,
  delay,
  className = "",
}: {
  src: string
  alt: string
  label: string
  delay: number
  className?: string
}) {
  const [err, setErr] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, ...spring }}
      className={`group relative overflow-hidden rounded-2xl border border-border bg-muted shadow-[0_8px_32px_-8px_rgba(0,0,0,0.15)] ${className}`}
    >
      {err ? (
        /* Placeholder jika foto belum ada */
        <div className="flex h-full min-h-[180px] flex-col items-center justify-center gap-3 p-6 text-center">
          <div className="flex size-12 items-center justify-center rounded-2xl bg-muted-foreground/10">
            <Camera className="size-6 text-muted-foreground/40" />
          </div>
          <div>
            <p className="text-xs font-semibold text-muted-foreground">{label}</p>
            <p className="mt-0.5 text-[10px] text-muted-foreground/60">
              Upload foto ke /public/ lalu ganti src
            </p>
          </div>
        </div>
      ) : (
        <>
          <div className="relative aspect-[16/10]">
            <Image
              src={src}
              alt={alt}
              fill
              sizes="(max-width: 1024px) 100vw, 45vw"
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              onError={() => setErr(true)}
              priority
            />
            {/* Label overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 px-4 py-3">
              <p className="text-xs font-bold text-white drop-shadow-sm">{label}</p>
            </div>
          </div>
        </>
      )}
    </motion.div>
  )
}

export default function HeroSection() {
  return (
    <section className="relative flex min-h-[100dvh] items-center overflow-hidden">

      {/* ── Background ─────────────────────────────────────────────────── */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-background via-background to-muted/40" />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(to right, currentColor 1px, transparent 1px),
                            linear-gradient(to bottom, currentColor 1px, transparent 1px)`,
          backgroundSize: "72px 72px",
        }}
      />

      <div className="relative mx-auto w-full max-w-7xl px-6 py-24 lg:py-0">
        <div className="grid gap-16 lg:grid-cols-[1fr_1fr] lg:items-center lg:gap-16">

          {/* ── LEFT: Konten ─────────────────────────────────────────────── */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="space-y-7"
          >
            {/* Logo */}
            <motion.div variants={itemVariants}>
              <Image
                src="/logo.png"
                alt="Logo Potensi Sedayu"
                width={64}
                height={64}
                className="rounded-2xl shadow-md"
                priority
              />
            </motion.div>

            {/* Badge lokasi */}
            <motion.div variants={itemVariants}>
              <span className="inline-flex items-center gap-2.5 rounded-full border border-border bg-background/80 px-4 py-1.5 text-xs font-semibold text-muted-foreground backdrop-blur-sm">
                <PulseDot />
                Desa Sedayu — Kec. Jumantono, Karanganyar
              </span>
            </motion.div>

            {/* Headline */}
            <motion.div variants={itemVariants} className="space-y-4">
              <h1 className="font-serif text-5xl font-semibold leading-[1.08] tracking-tight text-foreground sm:text-6xl lg:text-[4.25rem]">
                Potensi Ekonomi
                <br />
                <span className="text-muted-foreground/50">Desa dalam</span>
                <br />
                Satu{" "}
                <span className="relative inline-block">
                  Platform
                  <motion.span
                    className="absolute -bottom-1 left-0 block h-[3px] w-full origin-left rounded-full bg-sector-umkm"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ delay: 0.9, ...spring }}
                  />
                </span>
              </h1>
              <p className="max-w-[48ch] text-base leading-relaxed text-muted-foreground">
                Direktori lengkap UMKM dan institusi pendidikan Desa Sedayu.
                Temukan, jelajahi, dan kenali potensi nyata warga desa.
              </p>
            </motion.div>

            {/* CTA buttons */}
            <motion.div
              variants={itemVariants}
              className="flex flex-wrap items-center gap-3"
            >
              <Link
                href="/umkm"
                className="group inline-flex items-center gap-2.5 rounded-xl bg-foreground px-5 py-3 text-sm font-bold text-background shadow-[0_4px_16px_-4px_rgba(0,0,0,0.2)] transition hover:-translate-y-[1px] hover:shadow-[0_8px_24px_-4px_rgba(0,0,0,0.2)] active:scale-[.98] active:translate-y-0"
              >
                <Store className="size-4" />
                Direktori UMKM
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
              <Link
                href="/sekolah"
                className="inline-flex items-center gap-2.5 rounded-xl border border-border bg-background px-5 py-3 text-sm font-bold text-foreground transition hover:bg-muted hover:-translate-y-[1px] active:scale-[.98] active:translate-y-0"
              >
                <School className="size-4" />
                Direktori Sekolah
              </Link>
              <Link
                href="/peta"
                className="inline-flex items-center gap-2.5 rounded-xl border border-border bg-background px-5 py-3 text-sm font-bold text-foreground transition hover:bg-muted hover:-translate-y-[1px] active:scale-[.98] active:translate-y-0"
              >
                <Map className="size-4" />
                Peta Desa
              </Link>
            </motion.div>
          </motion.div>

          {/* ── RIGHT: 2 Slot Foto Desa ───────────────────────────────────── */}
          <div className="hidden flex-col gap-4 lg:flex">

            {/*
              📸 CARA MENAMBAHKAN FOTO:
              1. Simpan foto ke folder /public/ di project
              2. Ganti src="/foto-gerbang.jpg" dengan nama file foto kamu
              3. Contoh: src="/gerbang-desa.jpg" atau src="/foto-desa-1.jpg"
              4. Lakukan hal yang sama untuk foto ke-2
            */}

            <FotoDesa
              src="/foto-gerbang.jpg"
              alt="Gerbang Masuk Desa Sedayu"
              label="📍 Gerbang Masuk Desa Sedayu"
              delay={0.4}
            />

            <FotoDesa
              src="/foto-umkm.jpg"
              alt="UMKM Unggulan Desa Sedayu"
              label="🛍️ UMKM Unggulan Desa Sedayu"
              delay={0.55}
              className="ml-8" // ← offset sedikit ke kanan untuk depth
            />

          </div>

        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="absolute bottom-10 left-1/2 hidden -translate-x-1/2 lg:block"
        >
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
            className="flex flex-col items-center gap-1.5"
          >
            <div className="h-8 w-px rounded-full bg-border" />
            <div className="h-4 w-px rounded-full bg-border/50" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}