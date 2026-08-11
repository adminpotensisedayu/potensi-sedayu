"use client"

import dynamic from "next/dynamic"
import { useState, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { SlidersHorizontal, X, Store, School, RotateCcw } from "lucide-react"
import type { MapInnerProps } from "./map-inner"

// MapPoint dari shared types — re-export supaya peta/page.tsx tidak perlu ubah
export type { MapPoint } from "./types"
import type { MapPoint } from "./types"

// ─── Dynamic import — .then(m => m.default) supaya TypeScript happy ───────
const MapInner = dynamic<MapInnerProps>(
  () => import("./map-inner").then((m) => ({ default: m.default })),
  {
    ssr: false,
    loading: () => <div className="h-full w-full animate-pulse bg-muted/60" />,
  }
)

// ─── Main explorer ────────────────────────────────────────────────────────
export function PetaExplorer({ points }: { points: MapPoint[] }) {
  const [showUmkm,    setShowUmkm]    = useState(true)
  const [showSekolah, setShowSekolah] = useState(true)
  const [selKat,      setSelKat]      = useState("")
  const [selJenjang,  setSelJenjang]  = useState("")
  const [sheetOpen,   setSheetOpen]   = useState(false)

  const kategoris = useMemo(() => {
    const s = new Set<string>()
    points.filter((p) => p.sector === "umkm" && p.subKat).forEach((p) => s.add(p.subKat!))
    return [...s].sort()
  }, [points])

  const jenjangs = useMemo(() => {
    const s = new Set<string>()
    points.filter((p) => p.sector === "sekolah" && p.subKat).forEach((p) => s.add(p.subKat!))
    return [...s].sort()
  }, [points])

  const filtered = useMemo(
    () =>
      points.filter((p) => {
        if (p.sector === "umkm") {
          if (!showUmkm) return false
          if (selKat && p.subKat !== selKat) return false
        } else {
          if (!showSekolah) return false
          if (selJenjang && p.subKat !== selJenjang) return false
        }
        return true
      }),
    [points, showUmkm, showSekolah, selKat, selJenjang]
  )

  const umkmCount    = filtered.filter((p) => p.sector === "umkm").length
  const sekolahCount = filtered.filter((p) => p.sector === "sekolah").length
  const hasFilter    = !showUmkm || !showSekolah || !!selKat || !!selJenjang

  const resetAll = () => {
    setShowUmkm(true); setShowSekolah(true)
    setSelKat("");     setSelJenjang("")
  }

  const FilterForm = (
    <div className="flex flex-col gap-5">
      {/* Toggle UMKM / Sekolah */}
      <div>
        <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
          Tampilkan
        </p>
        <div className="space-y-1.5">
          <button
            onClick={() => { setShowUmkm((v) => !v); setSelKat("") }}
            className={`flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-semibold transition-all ${
              showUmkm
                ? "bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300"
                : "bg-muted text-muted-foreground opacity-60 line-through"
            }`}
          >
            <Store className="size-4 shrink-0" />
            <span className="flex-1 text-left">UMKM</span>
            <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-bold text-amber-800 dark:bg-amber-900/60 dark:text-amber-200">
              {points.filter((p) => p.sector === "umkm").length}
            </span>
          </button>
          <button
            onClick={() => { setShowSekolah((v) => !v); setSelJenjang("") }}
            className={`flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-semibold transition-all ${
              showSekolah
                ? "bg-teal-50 text-teal-700 dark:bg-teal-950/60 dark:text-teal-300"
                : "bg-muted text-muted-foreground opacity-60 line-through"
            }`}
          >
            <School className="size-4 shrink-0" />
            <span className="flex-1 text-left">Sekolah</span>
            <span className="rounded-full bg-teal-100 px-2 py-0.5 text-[11px] font-bold text-teal-800 dark:bg-teal-900/60 dark:text-teal-200">
              {points.filter((p) => p.sector === "sekolah").length}
            </span>
          </button>
        </div>
      </div>

      {/* Kategori UMKM */}
      {showUmkm && kategoris.length > 0 && (
        <div>
          <p className="mb-1.5 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
            Kategori UMKM
          </p>
          <select
            value={selKat}
            onChange={(e) => setSelKat(e.target.value)}
            className="h-9 w-full rounded-xl border border-border bg-background px-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-amber-500/40"
          >
            <option value="">Semua kategori</option>
            {kategoris.map((k) => <option key={k} value={k}>{k}</option>)}
          </select>
        </div>
      )}

      {/* Jenjang Sekolah */}
      {showSekolah && jenjangs.length > 0 && (
        <div>
          <p className="mb-1.5 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
            Jenjang Sekolah
          </p>
          <select
            value={selJenjang}
            onChange={(e) => setSelJenjang(e.target.value)}
            className="h-9 w-full rounded-xl border border-border bg-background px-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-teal-500/40"
          >
            <option value="">Semua jenjang</option>
            {jenjangs.map((j) => <option key={j} value={j}>{j}</option>)}
          </select>
        </div>
      )}

      {/* Legenda */}
      <div>
        <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
          Legenda
        </p>
        <div className="space-y-1.5">
          {[
            { icon: "🛍️", label: "Pin oranye = UMKM" },
            { icon: "🏫", label: "Pin hijau = Sekolah" },
            { icon: "🏡", label: "Garis hijau = batas desa" },
          ].map(({ icon, label }) => (
            <div key={label} className="flex items-center gap-2 text-xs text-muted-foreground">
              <span className="text-base">{icon}</span> {label}
            </div>
          ))}
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span
              className="inline-flex size-5 items-center justify-center rounded-full text-[9px] font-bold text-white"
              style={{ background: "linear-gradient(135deg,#D97706,#0D9488)" }}
            >N</span>
            Cluster = beberapa titik
          </div>
        </div>
      </div>

      {/* Reset */}
      {hasFilter && (
        <button
          onClick={resetAll}
          className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground transition hover:text-foreground"
        >
          <RotateCcw className="size-3" /> Reset semua filter
        </button>
      )}
    </div>
  )

  return (
    <div className="relative h-full w-full">
      <MapInner points={filtered} />

      {/* Stats pill */}
      <div className="pointer-events-none absolute left-1/2 top-4 z-[700] -translate-x-1/2">
        <motion.div
          initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex items-center gap-3 rounded-full border border-border bg-background/90 px-5 py-2.5 shadow-lg backdrop-blur-sm"
        >
          <span className="flex items-center gap-1.5 text-sm font-semibold text-foreground">
            <span className="inline-block size-2.5 rounded-full bg-amber-500" />
            {umkmCount} UMKM
          </span>
          <span className="h-4 w-px bg-border" />
          <span className="flex items-center gap-1.5 text-sm font-semibold text-foreground">
            <span className="inline-block size-2.5 rounded-full bg-teal-600" />
            {sekolahCount} Sekolah
          </span>
          {hasFilter && (
            <>
              <span className="h-4 w-px bg-border" />
              <button
                onClick={resetAll}
                className="pointer-events-auto flex items-center gap-1 text-[11px] font-medium text-muted-foreground transition hover:text-foreground"
              >
                <RotateCcw className="size-3" /> Reset
              </button>
            </>
          )}
        </motion.div>
      </div>

      {/* Desktop filter panel */}
      <motion.div
        initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
        transition={{ type: "spring", stiffness: 100, damping: 20, delay: 0.4 }}
        className="absolute left-4 top-[72px] z-[700] hidden w-64 overflow-auto rounded-2xl border border-border bg-background/95 p-5 shadow-2xl backdrop-blur-sm md:block"
      >
        <h2 className="mb-4 font-serif text-base font-bold text-foreground">Filter Peta</h2>
        {FilterForm}
      </motion.div>

      {/* Mobile FAB */}
      <motion.button
        initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.6 }}
        onClick={() => setSheetOpen(true)}
        className="absolute bottom-24 right-4 z-[700] flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-bold text-primary-foreground shadow-xl transition hover:bg-primary/90 active:scale-95 md:hidden"
      >
        <SlidersHorizontal className="size-4" />
        Filter
        {hasFilter && (
          <span className="flex size-5 items-center justify-center rounded-full bg-white/25 text-[10px]">✓</span>
        )}
      </motion.button>

      {/* Mobile bottom sheet */}
      <AnimatePresence>
        {sheetOpen && (
          <>
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 z-[800] bg-black/50 backdrop-blur-[2px] md:hidden"
              onClick={() => setSheetOpen(false)}
            />
            <motion.div
              key="sheet"
              initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="absolute bottom-0 left-0 right-0 z-[900] max-h-[85dvh] overflow-y-auto rounded-t-3xl border-t border-border bg-background px-6 pb-10 pt-4 md:hidden"
            >
              <div className="mx-auto mb-5 h-1 w-10 rounded-full bg-muted" />
              <div className="mb-5 flex items-center justify-between">
                <h3 className="font-serif text-lg font-bold text-foreground">Filter Peta</h3>
                <button
                  onClick={() => setSheetOpen(false)}
                  className="rounded-full p-1.5 text-muted-foreground transition hover:bg-muted hover:text-foreground"
                >
                  <X className="size-5" />
                </button>
              </div>
              {FilterForm}
              <button
                onClick={() => setSheetOpen(false)}
                className="mt-6 w-full rounded-xl bg-primary py-3 text-sm font-bold text-primary-foreground transition hover:bg-primary/90 active:scale-[.98]"
              >
                Tampilkan {filtered.length} titik
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}