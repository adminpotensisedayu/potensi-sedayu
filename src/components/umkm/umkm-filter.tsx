"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Search, X } from "lucide-react"

type Kategori    = { id: string; nama: string }
type SubKategori = { id: string; nama: string }

export function UmkmFilter({
  kategoriList,
  currentKat,
  currentSub,
  currentQ,
}: {
  kategoriList: Kategori[]
  currentKat: string
  currentSub: string
  currentQ: string
}) {
  const router = useRouter()
  const [katId,      setKatId]      = useState(currentKat)
  const [subId,      setSubId]      = useState(currentSub)
  const [q,          setQ]          = useState(currentQ)
  const [subs,       setSubs]       = useState<SubKategori[]>([])
  const [loadingSub, setLoadingSub] = useState(false)
  const debounceRef = useRef<NodeJS.Timeout | null>(null)

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

  function navigate(kat: string, sub: string, search: string) {
    const p = new URLSearchParams()
    if (kat)    p.set("kat", kat)
    if (sub)    p.set("sub", sub)
    if (search) p.set("q", search)
    router.replace("/umkm" + (p.size ? "?" + p.toString() : ""), { scroll: false })
  }

  function handleKat(val: string) {
    setKatId(val); setSubId(""); navigate(val, "", q)
  }

  function handleSub(val: string) {
    setSubId(val); navigate(katId, val, q)
  }

  function handleSearch(val: string) {
    setQ(val)
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => navigate(katId, subId, val), 420)
  }

  function reset() {
    setKatId(""); setSubId(""); setQ(""); setSubs([])
    if (debounceRef.current) clearTimeout(debounceRef.current)
    navigate("", "", "")
  }

  const hasFilter = katId || subId || q

  const selectCls =
    "h-9 rounded-lg border border-border bg-card px-3 text-sm text-foreground " +
    "focus:outline-none focus:ring-2 focus:ring-ring transition disabled:opacity-50"

  return (
    <div className="space-y-3">
      {/* Search input */}
      <div className="relative max-w-sm">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          value={q}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="Cari nama usaha atau deskripsi..."
          className="h-9 w-full rounded-lg border border-border bg-card pl-9 pr-9 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition"
        />
        {q && (
          <button
            onClick={() => handleSearch("")}
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-0.5 text-muted-foreground hover:text-foreground"
          >
            <X className="size-4" />
          </button>
        )}
      </div>

      {/* Category filters */}
      <div className="flex flex-wrap items-center gap-3">
        <select value={katId} onChange={(e) => handleKat(e.target.value)} className={selectCls}>
          <option value="">Semua Kategori</option>
          {kategoriList.map((k) => (
            <option key={k.id} value={k.id}>{k.nama}</option>
          ))}
        </select>

        {katId && subs.length > 0 && (
          <select
            value={subId}
            onChange={(e) => handleSub(e.target.value)}
            disabled={loadingSub}
            className={selectCls}
          >
            <option value="">Semua Sub-Kategori</option>
            {subs.map((s) => (
              <option key={s.id} value={s.id}>{s.nama}</option>
            ))}
          </select>
        )}

        {hasFilter && (
          <button
            onClick={reset}
            className="flex items-center gap-1 rounded-lg border border-border px-3 py-1.5 text-xs text-muted-foreground transition hover:text-foreground hover:bg-muted"
          >
            <X className="size-3" />
            Reset filter
          </button>
        )}
      </div>
    </div>
  )
}
