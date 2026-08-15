"use client"

import { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import {
  ArrowRight, Store, School, Map,
  MapPin, Sparkles, CheckCircle2, ChevronRight,
} from "lucide-react"

// ─── Typewriter ───────────────────────────────────────────────
const PHRASES = [
  "UMKM Lokal yang Berkembang",
  "Pendidikan Berkualitas",
  "Komunitas Desa Aktif",
  "Potensi Nyata Warga Desa",
]

function useTypewriter(phrases: string[], typeSpeed = 55, deleteSpeed = 28, pauseMs = 2200) {
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
      const id = setTimeout(() => { setDisplay(word.slice(0, charIdx + 1)); setCharIdx((c) => c + 1) }, typeSpeed)
      return () => clearTimeout(id)
    }
    if (!deleting && charIdx === word.length) {
      const id = setTimeout(() => setDeleting(true), pauseMs)
      return () => clearTimeout(id)
    }
    if (deleting && charIdx > 0) {
      const id = setTimeout(() => { setDisplay(word.slice(0, charIdx - 1)); setCharIdx((c) => c - 1) }, deleteSpeed)
      return () => clearTimeout(id)
    }
    if (deleting && charIdx === 0) {
      setDeleting(false)
      setPhraseIdx((i) => (i + 1) % phrases.length)
    }
  }, [charIdx, deleting, phraseIdx, phrases, typeSpeed, deleteSpeed, pauseMs])

  return { display, cursor }
}

// ─── Counter ──────────────────────────────────────────────────
function useCounter(target: number, duration = 1400, delay = 0) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    if (target === 0) return
    const timer = setTimeout(() => {
      const start = Date.now()
      const id = setInterval(() => {
        const elapsed  = Date.now() - start
        const progress = Math.min(elapsed / duration, 1)
        setCount(Math.round((1 - Math.pow(2, -10 * progress)) * target))
        if (progress >= 1) clearInterval(id)
      }, 16)
      return () => clearInterval(id)
    }, delay)
    return () => clearTimeout(timer)
  }, [target, duration, delay])
  return count
}

const spring = { type: "spring", stiffness: 100, damping: 20 } as const
const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } },
}
const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  show:  { opacity: 1, y: 0, transition: spring },
}

function PulseDot() {
  return (
    <span className="relative flex size-2 shrink-0">
      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-teal-400 opacity-75" />
      <span className="relative inline-flex size-2 rounded-full bg-teal-500" />
    </span>
  )
}

// ─── SLOT layout untuk desktop gallery ───────────────────────
// 3 posisi foto tampil bersamaan di kanan, masing-masing float mandiri
const SLOTS = [
  {
    // Foto utama — besar, kiri bawah
    style: { top: "28%", left: "0%", width: "76%", zIndex: 10 },
    rotate: -3,
    floatDuration: 4.8,
    floatDelay: 0,
    shadow: "shadow-[0_20px_60px_-15px_rgba(0,0,0,0.25)]",
  },
  {
    // Foto accent — kanan atas
    style: { top: "0%", right: "0%", width: "55%", zIndex: 20 },
    rotate: 6,
    floatDuration: 5.5,
    floatDelay: 0.9,
    shadow: "shadow-[0_12px_40px_-10px_rgba(0,0,0,0.2)]",
  },
  {
    // Foto accent — kanan bawah
    style: { bottom: "2%", right: "3%", width: "48%", zIndex: 15 },
    rotate: -5,
    floatDuration: 4.2,
    floatDelay: 1.7,
    shadow: "shadow-[0_12px_40px_-10px_rgba(0,0,0,0.18)]",
  },
] as const

// Fallback photos (dari folder /public) kalau DB masih kosong
const FALLBACKS = ["/foto-gerbang.jpg", "/foto-umkm.jpg", "/foto-gerbang.jpg"]

// ─── Desktop Rotating Gallery ────────────────────────────────
function RotatingGallery({ photos }: { photos: string[] }) {
  const [offset, setOffset] = useState(0)
  const n = photos.length

  // Auto-rotate setiap 3.5 detik
  const advance = useCallback(() => setOffset((o) => o + 1), [])
  useEffect(() => {
    if (n <= 1) return
    const id = setInterval(advance, 3500)
    return () => clearInterval(id)
  }, [advance, n])

  // Tiap slot ambil foto dari pool secara melingkar
  const slotPhotos = SLOTS.map((_, i) => photos[(offset + i) % n])
  const activeIdx  = offset % n

  return (
    <div className="relative h-[490px]">
      {SLOTS.map((slot, slotIdx) => {
        const photo = slotPhotos[slotIdx]
        return (
          <motion.div
            key={slotIdx}
            className={`absolute overflow-visible ${slot.shadow}`}
            style={{ ...slot.style, rotate: slot.rotate }}
            animate={{ y: [0, -11, 0] }}
            transition={{
              duration: slot.floatDuration,
              repeat: Infinity,
              ease: "easeInOut",
              delay: slot.floatDelay,
            }}
          >
            {/* Foto fade-in/out saat berganti */}
            <AnimatePresence mode="wait">
              <motion.div
                key={`${slotIdx}-${photo}`}
                initial={{ opacity: 0, scale: 0.93 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.97 }}
                transition={{ duration: 0.55, ease: "easeInOut" }}
                className="overflow-hidden rounded-2xl border border-border bg-muted"
              >
                <div className="relative aspect-[4/3]">
                  <Image
                    src={photo}
                    alt="Foto Desa Sedayu"
                    fill
                    className="object-cover"
                    unoptimized={photo.startsWith("http")}
                    sizes="(max-width: 1280px) 40vw, 360px"
                  />
                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent" />
                </div>
              </motion.div>
            </AnimatePresence>
          </motion.div>
        )
      })}

      {/* Verified badge */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1.0, ...spring }}
        className="absolute -bottom-3 left-[5%] z-30"
      >
        <motion.div
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
          className="flex items-center gap-2.5 rounded-2xl border border-border bg-background/95 px-4 py-3 shadow-[0_8px_24px_-4px_rgba(0,0,0,0.12)] backdrop-blur-sm"
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

      {/* Dots indicator */}
      {n > 1 && (
        <div className="absolute -bottom-9 left-1/2 flex -translate-x-1/2 items-center gap-1.5">
          {photos.map((_, i) => (
            <button
              key={i}
              onClick={() => setOffset(i)}
              className={`rounded-full transition-all duration-300 ${
                i === activeIdx
                  ? "h-1.5 w-5 bg-primary"
                  : "size-1.5 bg-border hover:bg-muted-foreground"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  )
}

// ─── Mobile Carousel ──────────────────────────────────────────
function MobileCarousel({ photos }: { photos: string[] }) {
  const [idx, setIdx] = useState(0)
  const n = photos.length

  useEffect(() => {
    if (n <= 1) return
    const id = setInterval(() => setIdx((i) => (i + 1) % n), 3200)
    return () => clearInterval(id)
  }, [n])

  return (
    <div className="space-y-2">
      <div className="relative overflow-hidden rounded-2xl border border-border">
        <AnimatePresence mode="wait">
          <motion.div
            key={photos[idx]}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="relative aspect-[16/9]"
          >
            <Image
              src={photos[idx]}
              alt="Foto Desa Sedayu"
              fill
              className="object-cover"
              unoptimized={photos[idx].startsWith("http")}
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
            <div className="absolute bottom-2 left-3 flex items-center gap-1.5">
              <MapPin className="size-3 text-white/80" />
              <p className="text-xs font-bold text-white drop-shadow">Desa Sedayu</p>
            </div>
            {/* Counter */}
            <div className="absolute right-2 top-2 rounded-full bg-black/40 px-2 py-0.5 text-[10px] font-bold text-white backdrop-blur-sm">
              {idx + 1}/{n}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Dots */}
      {n > 1 && (
        <div className="flex items-center justify-center gap-1.5">
          {photos.map((_, i) => (
            <button
              key={i}
              onClick={() => setIdx(i)}
              className={`rounded-full transition-all duration-300 ${
                i === idx ? "h-1.5 w-5 bg-primary" : "size-1.5 bg-border"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  )
}

// ─── MAIN ─────────────────────────────────────────────────────
type Props = {
  umkmCount:    number
  sekolahCount: number
  kategoriCount: number
  heroPhotos: (string | null)[]  // up to 5, from DB
}

export default function HeroSection({ umkmCount, sekolahCount, kategoriCount, heroPhotos }: Props) {
  const { display, cursor } = useTypewriter(PHRASES)
  const animUmkm     = useCounter(umkmCount,     1400, 800)
  const animSekolah  = useCounter(sekolahCount,  1200, 900)
  const animKategori = useCounter(kategoriCount, 1300, 1000)

  // Filter foto valid dari DB, fallback ke /public kalau masih kosong
  const validPhotos = heroPhotos.filter(Boolean) as string[]
  const displayPhotos = validPhotos.length > 0 ? validPhotos : FALLBACKS

  return (
    <section className="relative flex min-h-[100dvh] flex-col overflow-hidden">

      {/* Backgrounds */}
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

      {/* Main content */}
      <div className="relative mx-auto flex w-full max-w-7xl flex-1 flex-col justify-center px-6 py-16 lg:py-20">
        <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-center lg:gap-16">

          {/* ══ LEFT ══ */}
          <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-7">

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

            {/* Headline */}
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

            <motion.p variants={itemVariants} className="max-w-[46ch] text-sm leading-relaxed text-muted-foreground">
              Direktori lengkap UMKM dan institusi pendidikan Desa Sedayu.
              Temukan, jelajahi, dan kenali potensi nyata warga desa.
            </motion.p>

            {/* ✅ Mobile: carousel auto-slide */}
            <motion.div variants={itemVariants} className="lg:hidden">
              <MobileCarousel photos={displayPhotos} />
            </motion.div>

            {/* Nav CTAs */}
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

            {/* Primary CTA */}
            <motion.div variants={itemVariants} className="space-y-3">
              <Link
                href="/daftar"
                className="group relative flex w-full items-center justify-between overflow-hidden rounded-2xl bg-gradient-to-r from-teal-600 via-emerald-500 to-teal-600 px-5 py-4 shadow-[0_8px_32px_-8px_rgba(13,148,136,0.5)] transition hover:-translate-y-[2px] hover:shadow-[0_14px_40px_-8px_rgba(13,148,136,0.6)] active:scale-[.99] active:translate-y-0 sm:max-w-sm"
              >
                <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                <div className="flex items-center gap-3.5">
                  <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-white/15">
                    <Sparkles className="size-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-extrabold text-white leading-tight tracking-tight">Daftarkan Usaha Anda</p>
                    <p className="mt-0.5 text-[11px] text-white/75 font-medium">Gratis · Mudah · Langsung Tayang</p>
                  </div>
                </div>
                <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-white/15 transition-transform group-hover:translate-x-1">
                  <ArrowRight className="size-4 text-white" />
                </div>
              </Link>
              <div className="flex flex-wrap items-center gap-4 pl-1">
                {["✓ Gratis selamanya", "✓ Tanpa daftar akun", "✓ Review cepat"].map((t) => (
                  <span key={t} className="text-xs text-muted-foreground">{t}</span>
                ))}
              </div>
            </motion.div>
          </motion.div>

          {/* ══ RIGHT — Desktop: floating rotating gallery ══ */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, ...spring }}
            className="relative hidden pb-10 lg:block"
          >
            <RotatingGallery photos={displayPhotos} />
          </motion.div>

        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }}
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

      {/* Stats strip */}
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
                { icon: Store,  label: "UMKM Aktif",       value: animUmkm,     suffix: "+", color: "text-amber-500", bg: "bg-amber-50 dark:bg-amber-950/40" },
                { icon: School, label: "Institusi Sekolah", value: animSekolah,  suffix: "",  color: "text-teal-600",  bg: "bg-teal-50 dark:bg-teal-950/40"   },
                { icon: Map,    label: "Kategori Usaha",    value: animKategori, suffix: "",  color: "text-blue-500",  bg: "bg-blue-50 dark:bg-blue-950/40"   },
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
