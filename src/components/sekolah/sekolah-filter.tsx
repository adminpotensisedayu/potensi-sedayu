"use client"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { Search, X } from "lucide-react"

const JENJANG_LIST = ["TK", "SD", "SMP", "SMA", "SMK"]

export function SekolahFilter({
  currentJenjang,
  currentQ,
}: {
  currentJenjang: string
  currentQ: string
}) {
  const router = useRouter()
  const [q, setQ] = useState(currentQ)
  const debounceRef = useRef<NodeJS.Timeout | null>(null)

  function navigate(jenjang: string, search: string) {
    const p = new URLSearchParams()
    if (jenjang) p.set("jenjang", jenjang)
    if (search)  p.set("q", search)
    router.replace("/sekolah" + (p.size ? "?" + p.toString() : ""), { scroll: false })
  }

  function handleSearch(val: string) {
    setQ(val)
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => navigate(currentJenjang, val), 420)
  }

  function handleJenjang(j: string) {
    navigate(j, q)
  }

  function reset() {
    setQ("")
    if (debounceRef.current) clearTimeout(debounceRef.current)
    navigate("", "")
  }

  const tabCls = (active: boolean) =>
    "rounded-full px-4 py-1.5 text-sm font-medium transition " +
    (active
      ? "bg-[#0D9488] text-white"
      : "border border-border bg-card text-muted-foreground hover:text-foreground")

  const hasFilter = currentJenjang || q

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          value={q}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="Cari nama sekolah atau alamat..."
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

      {/* Jenjang tabs */}
      <div className="flex flex-wrap items-center gap-2">
        <button onClick={() => handleJenjang("")} className={tabCls(!currentJenjang)}>
          Semua
        </button>
        {JENJANG_LIST.map((j) => (
          <button key={j} onClick={() => handleJenjang(j)} className={tabCls(currentJenjang === j)}>
            {j}
          </button>
        ))}
        {hasFilter && (
          <button
            onClick={reset}
            className="flex items-center gap-1 rounded-full border border-border px-3 py-1.5 text-xs text-muted-foreground transition hover:text-foreground hover:bg-muted"
          >
            <X className="size-3" />
            Reset
          </button>
        )}
      </div>
    </div>
  )
}
