"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import { ArrowRight, Store, School, Map, Camera, MapPin } from "lucide-react"

// ─── Typewriter hook ────────────────────────────────────────────────────────
const PHRASES = [
  "UMKM Lokal yang Berkembang",
  "Pendidikan Berkualitas",
  "Komunitas Desa Aktif",
  "Potensi Nyata Warga Desa",
]

function useTypewriter(
  phrases: string[],
  typeSpeed = 55,
  deleteSpeed = 28,
  pauseMs = 2200
) {
  const [display, setDisplay]     = useState("")
  const [phraseIdx, setPhraseIdx] = useState(0)
  const [charIdx, setCharIdx]     = useState(0)
  const [deleting, setDeleting]   = useState(false)
  const [cursor, setCursor]       = useState(true)

  // Cursor blink
  useEffect(() => {
    const id = setInterval(() => setCursor((v) => !v), 530)
    return () => clearInterval(id)
  }, [])

  // Typewriter logic
  useEffect(() => {
    const word = phrases[phraseIdx]

    if (!deleting && charIdx < word.length) {
      const id = setTimeout(() => {
        setDisplay(word.slice(0, charIdx + 1))
        setCharIdx((c) => c + 1)
      }, typeSpeed)
      return () => clearTimeout(id)
    }

    if (!deleting && charIdx === word.length) {
      const id = setTimeout(() => setDeleting(true), pauseMs)
      return () => clearTimeout(id)
    }

    if (deleting && charIdx > 0) {
      const id = setTimeout(() => {
        setDisplay(word.slice(0, charIdx - 1))
        setCharIdx((c) => c - 1)
      }, deleteSpeed)
      return () => clearTimeout(id)
    }

    if (deleting && charIdx === 0) {
      setDeleting(false)
      setPhraseIdx((i) => (i + 1) % phrases.length)
    }
  }, [charIdx, deleting, phraseIdx, phrases, typeSpeed, deleteSpeed, pauseMs])

  return { display, cursor }
}

// ─── Spring config ──────────────────────────────────────────────────────────
const spring = { type: "spring", stiffness: 100, damping: 20 } as const

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.11, delayChildren: 0.1 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  show:  { opacity: 1, y: 0, transition: spring },
}

// ─── Pulse dot ──────────────────────────────────────────────────────────────
function PulseDot() {
  return (
    <span className="relative flex size-2 shrink-0">
      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-teal-400 opacity-75" />
      <span className="relative inline-flex size-2 rounded-full bg-teal-500" />
    </span>
  )
}

// ─── Photo slot ─────────────────────────────────────────────────────────────
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
      initial={{ opacity: 0, y: 24, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay, ...spring }}
      className={`group relative overflow-hidden rounded-2xl border border-border shadow-[0_16px_48px_-12px_rgba(0,0,0,0.18)] ${className}`}
    >
      {err ? (
        /* ── Placeholder sebelum foto diupload ── */
        <div className="flex min-h-[190px] flex-col items-center justify-center gap-3 bg-muted p-6 text-center">
          <div className="flex size-12 items-center justify-center rounded-2xl bg-muted-foreground/10">
            <Camera className="size-6 text-muted-foreground/30" />
          </div>
          <div>
            <p className="text-xs font-semibold text-muted-foreground">{label}</p>
            <p className="mt-0.5 text-[10px] text-muted-foreground/50">
              Simpan foto ke /public/ lalu ganti src
            </p>
          </div>
        </div>
      ) : (
        <div className="relative aspect-[16/10]">
          <Image
            src={src}
            alt={alt}
            fill
            sizes="(max-width: 1024px) 100vw, 45vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
            onError={() => setErr(true)}
            priority
          />
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
          {/* Label */}
          <div className="absolute bottom-0 left-0 right-0 flex items-center gap-1.5 px-4 py-3">
            <MapPin className="size-3 shrink-0 text-white/80" />
            <p className="text-xs font-bold text-white drop-shadow">{label}</p>
          </div>
        </div>
      )}
    </motion.div>
  )
}

// ─── Main component ─────────────────────────────────────────────────────────
export default function HeroSection() {
  const { display, cursor } = useTypewriter(PHRASES)

  return (
    <section className="relative flex min-h-[100dvh] flex-col overflow-hidden">

      {/* ── Backgrounds ─────────────────────────────────────────── */}
      {/* Base gradient */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-background via-background to-muted/50" />

      {/* Grid texture */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage: `
            linear-gradient(to right, currentColor 1px, transparent 1px),
            linear-gradient(to bottom, currentColor 1px, transparent 1px)
          `,
          backgroundSize: "64px 64px",
        }}
      />

      {/* Decorative blurred orbs */}
      <div className="pointer-events-none absolute -right-40 -top-40 size-[520px] rounded-full bg-teal-500/7 blur-[110px]" />
      <div className="pointer-events-none absolute -bottom-24 -left-24 size-[420px] rounded-full bg-amber-500/6 blur-[90px]" />

      {/* ── Main grid ───────────────────────────────────────────── */}
      <div className="relative mx-auto flex w-full max-w-7xl flex-1 flex-col justify-center px-6 py-24 lg:py-20">
        <div className="grid gap-14 lg:grid-cols-[1.15fr_0.85fr] lg:items-center lg:gap-16">

          {/* ══ LEFT — Text content ═══════════════════════════════ */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="space-y-7"
          >

            {/* Logo + nama platform */}
            <motion.div variants={itemVariants}>
              <div className="inline-flex items-center gap-3 rounded-2xl border border-border bg-background/80 p-2.5 pr-4 shadow-sm backdrop-blur-sm">
                <Image
                  src="/logo.png"
                  alt="Logo Potensi Sedayu"
                  width={40}
                  height={40}
                  className="rounded-xl"
                  priority
                />
                <div>
                  <p className="text-sm font-bold text-foreground leading-tight">
                    Potensi Sedayu
                  </p>
                  <p className="text-[10px] text-muted-foreground">
                    Platform Digital Desa
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Badge lokasi */}
            <motion.div variants={itemVariants}>
              <span className="inline-flex items-center gap-2 rounded-full border border-border bg-background/80 px-4 py-1.5 text-xs font-semibold text-muted-foreground backdrop-blur-sm">
                <PulseDot />
                Desa Sedayu — Kec. Jumantono, Karanganyar
              </span>
            </motion.div>

            {/* Headline besar */}
            <motion.div variants={itemVariants} className="space-y-2">
              <h1 className="font-serif text-5xl font-semibold leading-[1.07] tracking-tight text-foreground sm:text-6xl lg:text-[4rem] xl:text-[4.4rem]">
                Potensi Ekonomi
                <br />
                <span className="text-muted-foreground/40">Desa dalam</span>
                <br />
                Satu{" "}
                <span className="relative inline-block">
                  Platform
                  <motion.span
                    className="absolute -bottom-1 left-0 block h-[3px] w-full origin-left rounded-full bg-sector-umkm"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ delay: 1.1, ...spring }}
                  />
                </span>
              </h1>

              {/* ── Typewriter ── */}
              <div className="flex h-8 items-center">
                <p className="text-base text-muted-foreground">
                  Temukan{" "}
                  <span className="font-semibold text-foreground">
                    {display}
                    <span
                      className="ml-[2px] inline-block h-[1.1em] w-[2px] translate-y-[2px] rounded-sm bg-teal-500 align-middle"
                      style={{ opacity: cursor ? 1 : 0, transition: "opacity 0.1s" }}
                    />
                  </span>
                </p>
              </div>
            </motion.div>

            {/* Deskripsi */}
            <motion.p
              variants={itemVariants}
              className="max-w-[46ch] text-sm leading-relaxed text-muted-foreground"
            >
              Direktori lengkap UMKM dan institusi pendidikan Desa Sedayu.
              Temukan, jelajahi, dan kenali potensi nyata warga desa.
            </motion.p>

            {/* CTA buttons */}
            <motion.div
              variants={itemVariants}
              className="flex flex-wrap items-center gap-3"
            >
              <Link
                href="/umkm"
                className="group inline-flex items-center gap-2.5 rounded-xl bg-foreground px-5 py-3 text-sm font-bold text-background shadow-[0_4px_20px_-4px_rgba(0,0,0,0.25)] transition hover:-translate-y-[2px] hover:shadow-[0_10px_30px_-6px_rgba(0,0,0,0.22)] active:scale-[.98] active:translate-y-0"
              >
                <Store className="size-4" />
                Direktori UMKM
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
              <Link
                href="/sekolah"
                className="inline-flex items-center gap-2.5 rounded-xl border border-border bg-background/80 px-5 py-3 text-sm font-bold text-foreground backdrop-blur-sm transition hover:bg-muted hover:-translate-y-[1px] active:scale-[.98]"
              >
                <School className="size-4" />
                Direktori Sekolah
              </Link>
              <Link
                href="/peta"
                className="inline-flex items-center gap-2.5 rounded-xl border border-border bg-background/80 px-5 py-3 text-sm font-bold text-foreground backdrop-blur-sm transition hover:bg-muted hover:-translate-y-[1px] active:scale-[.98]"
              >
                <Map className="size-4" />
                Peta Desa
              </Link>
            </motion.div>

          </motion.div>

          {/* ══ RIGHT — 2 Slot Foto ═══════════════════════════════ */}
          <div className="hidden flex-col gap-4 lg:flex">
            {/*
              📸 GANTI FOTO:
              1. Simpan foto ke folder /public/
              2. Ganti src="/foto-gerbang.jpg" → nama file kamu
              3. Contoh: src="/gerbang-desa.jpg"
            */}
            <FotoDesa
              src="/foto-gerbang.jpg"
              alt="Gerbang Masuk Desa Sedayu"
              label="Gerbang Masuk Desa Sedayu"
              delay={0.5}
            />
            <FotoDesa
              src="/foto-umkm.jpg"
              alt="UMKM Unggulan Desa Sedayu"
              label="UMKM Unggulan Desa Sedayu"
              delay={0.65}
              className="ml-10" // offset ke kanan untuk depth effect
            />
          </div>

        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 lg:block"
        >
          <motion.div
            animate={{ y: [0, 7, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="flex flex-col items-center gap-1.5"
          >
            <div className="h-8 w-px rounded-full bg-border" />
            <div className="h-3 w-px rounded-full bg-border/40" />
          </motion.div>
        </motion.div>
      </div>

      {/* ── Stats strip ─────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9, ...spring }}
        className="relative border-t border-border bg-background/70 backdrop-blur-md"
      >
        <div className="mx-auto max-w-7xl px-6 py-5">
          <div className="flex flex-wrap items-center gap-6 sm:gap-10">

            {/* Stat items */}
            {[
              { icon: Store,  label: "UMKM Aktif",       value: "42+", color: "text-amber-500",  bg: "bg-amber-50  dark:bg-amber-950/40"  },
              { icon: School, label: "Institusi Sekolah", value: "7",   color: "text-teal-600",   bg: "bg-teal-50   dark:bg-teal-950/40"   },
              { icon: Map,    label: "Kategori Usaha",    value: "9",   color: "text-blue-500",   bg: "bg-blue-50   dark:bg-blue-950/40"   },
            ].map(({ icon: Icon, label, value, color, bg }) => (
              <div key={label} className="flex items-center gap-3">
                <div className={`flex size-9 shrink-0 items-center justify-center rounded-xl ${bg}`}>
                  <Icon className={`size-4 ${color}`} />
                </div>
                <div>
                  <p className="text-sm font-bold text-foreground leading-none">{value}</p>
                  <p className="mt-0.5 text-[11px] text-muted-foreground">{label}</p>
                </div>
              </div>
            ))}

            {/* Daftar CTA */}
            <div className="ml-auto hidden sm:block">
              <Link
                href="/daftar"
                className="inline-flex items-center gap-2 rounded-xl border border-border bg-background px-4 py-2.5 text-xs font-bold text-foreground transition hover:bg-muted hover:-translate-y-[1px] active:scale-[.98]"
              >
                Daftarkan Usaha Kamu
                <ArrowRight className="size-3" />
              </Link>
            </div>

          </div>
        </div>
      </motion.div>

    </section>
  )
}