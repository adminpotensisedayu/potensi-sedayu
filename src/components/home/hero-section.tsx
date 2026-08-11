"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { ArrowRight, Store, School, Map, TrendingUp } from "lucide-react"

// ── Spring config from SKILL ─────────────────────────────────────────────────
const spring = { type: "spring", stiffness: 100, damping: 20 } as const

// ── Stagger container (parent + children in same client tree — SKILL rule) ──
const containerVariants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.1, delayChildren: 0.15 },
  },
}
const itemVariants = {
  hidden: { opacity: 0, y: 28 },
  show:  { opacity: 1, y: 0, transition: spring },
}

// ── Isolated floating card — perpetual motion (SKILL: isolate CPU-heavy) ────
function FloatingBadge() {
  return (
    <motion.div
      animate={{ y: [0, -8, 0] }}
      transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
      className="absolute -right-6 -top-6 z-10 flex items-center gap-2.5 rounded-2xl border border-border bg-card px-4 py-3 shadow-[0_8px_24px_-8px_rgba(0,0,0,0.12)]"
    >
      <div className="flex size-8 items-center justify-center rounded-xl bg-[#0D9488]/10">
        <Map className="size-4 text-[#0D9488]" />
      </div>
      <div>
        <p className="text-[11px] font-bold text-foreground">Peta Interaktif</p>
        <p className="text-[10px] text-muted-foreground">Temukan lokasinya</p>
      </div>
    </motion.div>
  )
}

// ── Isolated pulse dot (perpetual micro-animation) ───────────────────────────
function PulseDot() {
  return (
    <span className="relative flex size-2">
      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-teal-400 opacity-75" />
      <span className="relative inline-flex size-2 rounded-full bg-teal-500" />
    </span>
  )
}

export default function HeroSection() {
  return (
    <section className="relative flex min-h-[100dvh] items-center overflow-hidden">
      {/* ── Background: subtle gradient ─────────────────────────────────── */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-background via-background to-muted/40" />

      {/* ── Background: grid texture (fixed pseudo — SKILL DOM Cost rule) ─ */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage: `linear-gradient(to right, currentColor 1px, transparent 1px),
                            linear-gradient(to bottom, currentColor 1px, transparent 1px)`,
          backgroundSize: "72px 72px",
        }}
      />

      <div className="relative mx-auto w-full max-w-7xl px-6 py-28 lg:py-0">
        {/* ── Asymmetric grid: 3fr left, 2fr right (DESIGN_VARIANCE 8) ─── */}
        <div className="grid gap-16 lg:grid-cols-[3fr_2fr] lg:items-center lg:gap-20">

          {/* LEFT: Content ──────────────────────────────────────────────── */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="space-y-8"
          >
            {/* Pre-headline badge */}
            <motion.div variants={itemVariants}>
              <span className="inline-flex items-center gap-2.5 rounded-full border border-border bg-background/80 px-4 py-1.5 text-xs font-semibold text-muted-foreground backdrop-blur-sm">
                <PulseDot />
                Desa Sedayu — Kec. Jumantono, Karanganyar
              </span>
            </motion.div>

            {/* Headline — ANTI-CENTER BIAS, left-aligned ──────────────── */}
            <motion.div variants={itemVariants} className="space-y-4">
              <h1 className="font-serif text-5xl font-semibold leading-[1.08] tracking-tight text-foreground sm:text-6xl lg:text-[4.5rem]">
                Potensi Ekonomi
                <br />
                <span className="text-muted-foreground/50">Desa dalam</span>
                <br />
                Satu{" "}
                <span className="relative inline-block">
                  Platform
                  {/* Animated underline — transform only (SKILL perf rule) */}
                  <motion.span
                    className="absolute -bottom-1 left-0 block h-[3px] w-full origin-left rounded-full bg-sector-umkm"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ delay: 0.9, ...spring }}
                  />
                </span>
              </h1>

              <p className="max-w-[52ch] text-base leading-relaxed text-muted-foreground">
                Direktori lengkap UMKM dan institusi pendidikan Desa Sedayu.
                Temukan, jelajahi, dan kenali potensi nyata warga desa.
              </p>
            </motion.div>

            {/* CTA buttons — tactile feedback (SKILL Rule 5) ─────────── */}
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

          {/* RIGHT: Visual panel — slides in from right ────────────────── */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.35, ...spring }}
            className="relative hidden lg:block"
          >
            <FloatingBadge />

            {/* Main card */}
            <div className="rounded-2xl border border-border bg-card p-5 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.07)]">
              <div className="mb-4 flex items-center justify-between">
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                  Sektor Aktif
                </p>
                <TrendingUp className="size-4 text-muted-foreground/40" />
              </div>

              <div className="space-y-2">
                {/* UMKM row */}
                <Link
                  href="/umkm"
                  className="group flex items-center gap-3.5 rounded-xl border border-transparent bg-blue-50/60 px-4 py-3.5 transition hover:border-blue-200/60 dark:bg-blue-950/20"
                >
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-blue-100 dark:bg-blue-900/40">
                    <Store className="size-4 text-sector-umkm" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-foreground">UMKM</p>
                    <p className="text-[11px] text-muted-foreground">
                      Usaha Mikro, Kecil & Menengah
                    </p>
                  </div>
                  <ArrowRight className="size-4 shrink-0 text-muted-foreground/30 transition group-hover:translate-x-0.5 group-hover:text-sector-umkm" />
                </Link>

                {/* Sekolah row */}
                <Link
                  href="/sekolah"
                  className="group flex items-center gap-3.5 rounded-xl border border-transparent bg-teal-50/60 px-4 py-3.5 transition hover:border-teal-200/60 dark:bg-teal-950/20"
                >
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-teal-100 dark:bg-teal-900/40">
                    <School className="size-4 text-[#0D9488]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-foreground">Sekolah</p>
                    <p className="text-[11px] text-muted-foreground">
                      Institusi Pendidikan Desa
                    </p>
                  </div>
                  <ArrowRight className="size-4 shrink-0 text-muted-foreground/30 transition group-hover:translate-x-0.5 group-hover:text-[#0D9488]" />
                </Link>
              </div>

              {/* Divider + footer */}
              <div className="mt-4 border-t border-border pt-4">
                <Link
                  href="/peta"
                  className="group flex items-center gap-2 text-xs font-semibold text-muted-foreground transition hover:text-foreground"
                >
                  <Map className="size-3.5" />
                  Jelajahi peta interaktif
                  <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </div>
            </div>
          </motion.div>
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