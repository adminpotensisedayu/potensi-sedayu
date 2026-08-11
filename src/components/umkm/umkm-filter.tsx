"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { X } from "lucide-react"

type Kategori    = { id: string; nama: string }
type SubKategori = { id: string; nama: string }

export function UmkmFilter({
  kategoriList,
  currentKat,
  currentSub,
}: {
  kategoriList: Kategori[]
  currentKat: string
  currentSub: string
}) {
  const router = useRouter()
  const [katId,      setKatId]      = useState(currentKat)
  const [subId,      setSubId]      = useState(currentSub)
  const [subs,       setSubs]       = useState<SubKategori[]>([])
  const [loadingSub, setLoadingSub] = useState(false)

  useEffect(() => {
    if (!katId) { setSubs([]); return }
    setLoadingSub(true)
    createClient()
      .from("sub_kategori")
      .select("id, nama")
      .eq("kategori_id", katId)
      .order("urutan")
      .then(({ data }) => { setSubs(data ?? []); setLoadingSub(false) })
  }, [katId])

  function navigate(kat: string, sub: string) {
    const p = new URLSearchParams()
    if (kat) p.set("kat", kat)
    if (sub) p.set("sub", sub)
    router.replace("/umkm" + (p.size ? "?" + p.toString() : ""), { scroll: false })
  }

  function handleKat(val: string) {
    setKatId(val); setSubId(""); navigate(val, "")
  }

  function handleSub(val: string) {
    setSubId(val); navigate(katId, val)
  }

  function reset() {
    setKatId(""); setSubId(""); setSubs([]); navigate("", "")
  }

  const cls =
    "h-9 rounded-lg border border-border bg-card px-3 text-sm text-foreground " +
    "focus:outline-none focus:ring-2 focus:ring-ring transition disabled:opacity-50"

  return (
    <div className="flex flex-wrap items-center gap-3">
      {/* Level 1 — Kategori */}
      <select value={katId} onChange={(e) => handleKat(e.target.value)} className={cls}>
        <option value="">Semua Kategori</option>
        {kategoriList.map((k) => (
          <option key={k.id} value={k.id}>{k.nama}</option>
        ))}
      </select>

      {/* Level 2 — Sub-Kategori (muncul setelah kategori dipilih) */}
      {(katId && subs.length > 0) && (
        <select
          value={subId}
          onChange={(e) => handleSub(e.target.value)}
          disabled={loadingSub}
          className={cls}
        >
          <option value="">Semua Sub-Kategori</option>
          {subs.map((s) => (
            <option key={s.id} value={s.id}>{s.nama}</option>
          ))}
        </select>
      )}

      {/* Reset */}
      {(katId || subId) && (
        <button
          onClick={reset}
          className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition"
        >
          <X className="size-3" />
          Reset
        </button>
      )}
    </div>
  )
}