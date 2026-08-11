"use client"

import { useEffect, useRef, useState } from "react"
import { motion, useInView } from "framer-motion"

// ── Isolated animated counter (SKILL: isolate perpetual/heavy components) ──
function AnimatedCount({ target }: { target: number }) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: "-60px" })

  useEffect(() => {
    if (!inView || target === 0) return
    let current = 0
    const totalSteps = 36
    const step = Math.ceil(target / totalSteps)
    const interval = setInterval(() => {
      current += step
      if (current >= target) {
        setCount(target)
        clearInterval(interval)
      } else {
        setCount(current)
      }
    }, 28)
    return () => clearInterval(interval)
  }, [inView, target])

  return <span ref={ref}>{count}</span>
}

type Props = {
  umkmCount: number
  sekolahCount: number
  kategoriCount: number
}

export default function StatsBar({ umkmCount, sekolahCount, kategoriCount }: Props) {
  const stats = [
    { label: "Unit UMKM Aktif",   value: umkmCount,    suffix: "+" },
    { label: "Kategori Usaha",    value: kategoriCount, suffix: undefined },
    { label: "Sekolah Terdaftar", value: sekolahCount,  suffix: undefined },
  ]

  return (
    <div className="border-y border-border bg-muted/20">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid grid-cols-3 divide-x divide-border">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{
                type: "spring",
                stiffness: 100,
                damping: 20,
                delay: i * 0.08,
              }}
              className="py-8 px-4 text-center sm:px-8"
            >
              {/* Number — font-mono per SKILL VISUAL_DENSITY 4 ──────── */}
              <p className="font-mono text-3xl font-bold tabular-nums text-foreground sm:text-4xl">
                <AnimatedCount target={stat.value} />
                {stat.suffix && (
                  <span className="text-muted-foreground">{stat.suffix}</span>
                )}
              </p>
              <p className="mt-1.5 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}