"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import {
  ArrowRight, Store, School, Map, Camera,
  MapPin, Sparkles, CheckCircle2, ChevronRight,
} from "lucide-react"

// ─── Typewriter ──────────────────────────────────────────────────────────────
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

  useEffect(() => {
    const id = setInterval(() => setCursor((v) => !v), 530)
    return () => clearInterval(id)
  }, [])

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

// ─── Animated counter ────────────────────────────────────────────────────────
function useCounter(target: number, duration = 1400, delay = 0) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    const timer = setTimeout(() => {
      const start = Date.now()
      const id = setInterval(() => {
        const elapsed  = Date.now() - start
        const progress = Math.min(elapsed / duration, 1)
        const eased    = 1 - Math.pow(2, -10 * progress)
        setCount(Math.round(eased * target))
        if (progress >= 1) clearInterval(id)
      }, 16)
      return () => clearInterval(id)
    }, delay)
    return () => clearTimeout(timer)
  }, [target, duration, delay])
  return count
}

// ─── Spring ──────────────────────────────────────────────────────────────────
const spring = { type: "spring", stiffness: 100, damping: 20 } as const
const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } },
}
const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  show:  { opacity: 1, y: 0, transition: spring },
}

// ─── Pulse dot ───────────────────────────────────────────────────────────────
function PulseDot() {
  return (
    <span className="relative flex size-2 shrink-0">
      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-teal-400 opacity-75" />
      <span className="relative inline-flex size-2 rounded-full bg-teal-500" />
    </span>
  )
}

// ─── Photo slot (reusable) ───────────────────────────────────────────────────
function FotoDesa({
  src, alt, label, delay = 0, className = "",
}: {
  src: string; alt: string; label: string; delay?: number; className?: string
}) {
  const [err, setErr] = useState(false)
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay, ...spring }}
      className={`group relative overflow-hidden rounded-2xl border border-border shadow-[0_12px_40px_-10px_rgba(0,0,0,0.15)] ${className}`}
    >
      {err ? (
        <div className="flex min-h-[160px] flex-col items-center justify-center gap-2 bg-muted p-5 text-center">
          <div className="flex size-10 items-center justify-center rounded-xl bg-muted-foreground/10">
            <Camera className="size-5 text-muted-foreground/30" />
          </div>
          <p className="text-[11px] font-semibold text-muted-foreground">{label}</p>
          <p className="text-[10px] text-muted-foreground/50">Upload foto ke /public/</p>
        </div>
      ) : (
        <div className="relative aspect-[16/10]">
          <Image
            src={src} alt={alt} fill
            sizes="(max-width: 1024px) 80vw, 45vw"
            className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
            onError={() => setErr(true)}
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 flex items-center gap-1.5 px-3 py-2.5">
            <MapPin className="size-3 shrink-0 text-white/80" />
            <p className="text-xs font-bold text-white drop-shadow">{label}</p>
          </div>
        </div>
      )}
    </motion.div>
  )
}

// ─── Floating badge ──────────────────────────────────────────────────────────
function FloatingVerifiedBadge() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ delay: 1.0, ...spring }}
      className="absolute -bottom-5 -left-4 z-10"
    >
      <motion.div
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
        className="flex items-center gap-2.5 rounded-2xl border border-border bg-background/95 px-4 py-3 shadow-[0_8px_24px_-4px_rgba(0,0,0,0.15)] backdrop-blur-sm"
      >
        <div className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-teal-500/10">
          <CheckCircle2 className="size-4 text-teal-600" />
        </div>
        <div>
          <p className="text-[11px] font-bold text-foreground">Terverifikasi Resmi</p>
          <p className="text-[10px] text-muted-foreground">Data aktif Desa Sedayu</p>
        </div>
      </motion.div>
    </motion.div>
  )
}

// ─── MAIN ────────────────────────────────────────────────────────────────────
export default function HeroSection() {
  const { display, cursor } = useTypewriter(PHRASES)
  const umkmCount     = useCounter(42, 1400, 800)
  const sekolahCount  = useCounter(7,  1200, 900)
  const kategoriCount = useCounter(9,  1300, 1000)

  return (
    <section className="relative flex min-h-[100dvh] flex-col overflow-hidden">

      {/* ── Backgrounds ───────────────────────────────────────────── */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-background via-background to-muted/50" />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(to right, currentColor 1px, transparent 1px),
            linear-gradient(to bottom, currentColor 1px, transparent 1px)
          `,
          backgroundSize: "64px 64px",
        }}
      />
      <div className="pointer-events-none absolute -right-32 -top-32 size-[600px] rounded-full bg-teal-500/8 blur-[120px]" />
      <div className="pointer-events-none absolute -bottom-24 -left-24 size-[480px] rounded-full bg-amber-500/7 blur-[100px]" />
      <div className="pointer-events-none absolute bottom-1/3 right-1/3 size-[280px] rounded-full bg-emerald-500/5 blur-[70px]" />

      {/* ── Main content ──────────────────────────────────────────── */}
      <div className="relative mx-auto flex w-full max-w-7xl flex-1 flex-col justify-center px-6 py-16 lg:py-20">
        <div className="grid gap-14 lg:grid-cols-[1.2fr_0.8fr] lg:items-center lg:gap-14">

          {/* ══ LEFT ══════════════════════════════════════════════ */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="space-y-7"
          >
            {/* Logo pill */}
            <motion.div variants={itemVariants}>
              <div className="inline-flex items-center gap-3 rounded-2xl border border-border bg-background/90 p-2.5 pr-5 shadow-sm backdrop-blur-sm">
                <Image src="/logo.png" alt="Potensi Sedayu" width={42} height={42} className="rounded-xl" priority />
                <div>
                  <p className="text-sm font-bold text-foreground leading-tight">Potensi Sedayu</p>
                  <p className="text-[10px] text-muted-foreground">Platform Digital Desa</p>
                </div>
              </div>
            </motion.div>

            {/* Location badge */}
            <motion.div variants={itemVariants}>
              <span className="inline-flex items-center gap-2 rounded-full border border-border bg-background/80 px-4 py-1.5 text-xs font-semibold text-muted-foreground backdrop-blur-sm">
                <PulseDot />
                Desa Sedayu — Kec. Jumantono, Karanganyar
              </span>
            </motion.div>

            {/* Headline + typewriter */}
            <motion.div variants={itemVariants} className="space-y-3">
              <h1 className="font-serif text-4xl font-semibold leading-[1.07] tracking-tight text-foreground sm:text-5xl lg:text-[3.9rem] xl:text-[4.4rem]">
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

              {/* Typewriter */}
              <div className="flex h-8 items-center">
                <p className="text-sm text-muted-foreground sm:text-base">
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

            {/* Description */}
            <motion.p
              variants={itemVariants}
              className="max-w-[46ch] text-sm leading-relaxed text-muted-foreground"
            >
              Direktori lengkap UMKM dan institusi pendidikan Desa Sedayu.
              Temukan, jelajahi, dan kenali potensi nyata warga desa.
            </motion.p>

            {/* ✅ FOTO MOBILE — horizontal scroll, hanya di mobile */}
            <motion.div variants={itemVariants} className="lg:hidden">
              <div className="-mx-6 flex gap-3 overflow-x-auto px-6 pb-1">
                <div className="w-[78vw] shrink-0 sm:w-[60vw]">
                  <FotoDesa
                    src="/foto-gerbang.jpg"
                    alt="Gerbang Desa Sedayu"
                    label="Gerbang Masuk Desa Sedayu"
                    delay={0.4}
                  />
                </div>
                <div className="w-[78vw] shrink-0 sm:w-[60vw]">
                  <FotoDesa
                    src="/foto-umkm.jpg"
                    alt="UMKM Desa Sedayu"
                    label="UMKM Unggulan Desa"
                    delay={0.5}
                  />
                </div>
              </div>
            </motion.div>

            {/* Secondary CTAs */}
            <motion.div variants={itemVariants} className="flex flex-wrap items-center gap-2.5">
              <Link href="/umkm" className="inline-flex items-center gap-2 rounded-xl border border-border bg-background/80 px-4 py-2.5 text-sm font-semibold text-foreground backdrop-blur-sm transition hover:bg-muted hover:-translate-y-[1px] active:scale-[.98]">
                <Store className="size-3.5" /> Direktori UMKM
              </Link>
              <Link href="/sekolah" className="inline-flex items-center gap-2 rounded-xl border border-border bg-background/80 px-4 py-2.5 text-sm font-semibold text-foreground backdrop-blur-sm transition hover:bg-muted hover:-translate-y-[1px] active:scale-[.98]">
                <School className="size-3.5" /> Direktori Sekolah
              </Link>
              <Link href="/peta" className="inline-flex items-center gap-2 rounded-xl border border-border bg-background/80 px-4 py-2.5 text-sm font-semibold text-foreground backdrop-blur-sm transition hover:bg-muted hover:-translate-y-[1px] active:scale-[.98]">
                <Map className="size-3.5" /> Peta Desa
              </Link>
            </motion.div>

            {/* ★ DAFTARKAN USAHA — PRIMARY CTA ★ */}
            <motion.div variants={itemVariants} className="space-y-3">
              <Link
                href="/daftar"
                className="group relative flex w-full items-center justify-between overflow-hidden rounded-2xl bg-gradient-to-r from-teal-600 via-emerald-500 to-teal-600 px-5 py-4 shadow-[0_8px_32px_-8px_rgba(13,148,136,0.5)] transition hover:-translate-y-[2px] hover:shadow-[0_14px_40px_-8px_rgba(13,148,136,0.6)] active:scale-[.99] active:translate-y-0 sm:max-w-sm"
              >
                {/* Shimmer */}
                <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                <div className="flex items-center gap-3.5">
                  <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-white/15">
                    <Sparkles className="size-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-extrabold text-white leading-tight tracking-tight">
                      Daftarkan Usaha Anda
                    </p>
                    <p className="mt-0.5 text-[11px] text-white/75 font-medium">
                      Gratis · Mudah · Langsung Tayang
                    </p>
                  </div>
                </div>
                <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-white/15 transition-transform group-hover:translate-x-1">
                  <ArrowRight className="size-4 text-white" />
                </div>
              </Link>

              {/* Trust indicators */}
              <div className="flex flex-wrap items-center gap-4 pl-1">
                {["✓ Gratis selamanya", "✓ Tanpa daftar akun", "✓ Review cepat"].map((t) => (
                  <span key={t} className="text-xs text-muted-foreground">{t}</span>
                ))}
              </div>
            </motion.div>

          </motion.div>

          {/* ══ RIGHT — Desktop only ═══════════════════════════════ */}
          <div className="relative hidden flex-col gap-4 lg:flex">
            <FotoDesa
              src="/foto-gerbang.jpg"
              alt="Gerbang Masuk Desa Sedayu"
              label="Gerbang Masuk Desa Sedayu"
              delay={0.5}
            />
            <div className="relative pb-5">
              <FotoDesa
                src="/foto-umkm.jpg"
                alt="UMKM Unggulan Desa Sedayu"
                label="UMKM Unggulan Desa Sedayu"
                delay={0.65}
                className="ml-10"
              />
              <FloatingVerifiedBadge />
            </div>
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

      {/* ── Stats strip ───────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, ...spring }}
        className="relative border-t border-border bg-background/80 backdrop-blur-md"
      >
        <div className="mx-auto max-w-7xl px-6 py-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-6">
              {[
                { icon: Store,  label: "UMKM Aktif",       value: umkmCount,     suffix: "+", color: "text-amber-500", bg: "bg-amber-50 dark:bg-amber-950/40" },
                { icon: School, label: "Institusi Sekolah", value: sekolahCount,  suffix: "",  color: "text-teal-600",  bg: "bg-teal-50 dark:bg-teal-950/40"   },
                { icon: Map,    label: "Kategori Usaha",    value: kategoriCount, suffix: "",  color: "text-blue-500",  bg: "bg-blue-50 dark:bg-blue-950/40"   },
              ].map(({ icon: Icon, label, value, suffix, color, bg }) => (
                <div key={label} className="flex items-center gap-2.5">
                  <div className={`flex size-8 shrink-0 items-center justify-center rounded-xl ${bg}`}>
                    <Icon className={`size-3.5 ${color}`} />
                  </div>
                  <div>
                    <p className="tabular-nums text-sm font-bold text-foreground leading-none">{value}{suffix}</p>
                    <p className="mt-0.5 text-[10px] text-muted-foreground">{label}</p>
                  </div>
                </div>
              ))}
            </div>

            <Link
              href="/daftar"
              className="inline-flex items-center gap-2 rounded-xl border border-teal-200 bg-teal-50 px-4 py-2.5 text-xs font-bold text-teal-700 transition hover:bg-teal-100 dark:border-teal-800 dark:bg-teal-950/40 dark:text-teal-300"
            >
              <Sparkles className="size-3.5" />
              Daftarkan Usaha
              <ChevronRight className="size-3.5" />
            </Link>
          </div>
        </div>
      </motion.div>

    </section>
  )
}