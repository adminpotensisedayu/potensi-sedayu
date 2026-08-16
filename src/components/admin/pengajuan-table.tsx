"use client"

import { useState, useTransition } from "react"
import { toast } from "sonner"
import {
  approvePengajuan,
  tolakPengajuan,
  hapusPengajuan,
} from "@/app/admin/(panel)/pengajuan/actions"
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import {
  CheckCircle, XCircle, Loader2, MapPin, Phone, Mail,
  Clock, Tag, MessageSquare, ExternalLink, Store, User,
  ShieldCheck, ShieldX, Calendar, ChevronRight,
  Image as ImageIcon, Trash2,
} from "lucide-react"

// ── Types ──────────────────────────────────────────────────────
type Status = "menunggu" | "disetujui" | "ditolak"
type Filter = "semua" | Status

type Pengajuan = {
  id: string; created_at: string; nama_pemilik: string; nama_usaha: string
  whatsapp: string; email: string | null; kategori_nama: string
  sub_kategori_nama: string | null; deskripsi: string | null
  alamat: string | null; jam_operasional: string | null
  latitude: number | null; longitude: number | null
  foto_url: string | null; foto_url_2: string | null; foto_url_3: string | null
  memiliki_izin: string | null; catatan: string | null
  status: Status; alasan_tolak: string | null
  reviewed_at: string | null; reviewed_by: string | null
}

type Counts = { semua: number; menunggu: number; disetujui: number; ditolak: number }

// ── Helpers ────────────────────────────────────────────────────
const fmtTgl = (d: string) =>
  new Date(d).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })

const fmtTglLengkap = (d: string) =>
  new Date(d).toLocaleString("id-ID", {
    day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit",
  })

const initials = (name: string) =>
  name.split(" ").slice(0, 2).map((w) => w[0]).join("").toUpperCase()

// ── Status chip ────────────────────────────────────────────────
function StatusChip({ status, sm }: { status: string; sm?: boolean }) {
  const base = sm
    ? "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold"
    : "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold"

  if (status === "menunggu")
    return <span className={base + " bg-yellow-100 text-yellow-700 dark:bg-yellow-950/50 dark:text-yellow-400"}>
      <span className="size-1.5 rounded-full bg-yellow-500 animate-pulse" />
      Menunggu
    </span>
  if (status === "disetujui")
    return <span className={base + " bg-green-100 text-green-700 dark:bg-green-950/50 dark:text-green-400"}>
      <CheckCircle className="size-3" />Disetujui
    </span>
  return <span className={base + " bg-red-100 text-red-700 dark:bg-red-950/50 dark:text-red-400"}>
    <XCircle className="size-3" />Ditolak
  </span>
}

// ── Empty state ────────────────────────────────────────────────
function EmptyState({ label }: { label: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-border py-12 text-center">
      <div className="flex size-12 items-center justify-center rounded-full bg-muted">
        <Store className="size-5 text-muted-foreground/40" />
      </div>
      <p className="text-sm text-muted-foreground">{label || "Tidak ada data"}</p>
    </div>
  )
}

// ── Card row ───────────────────────────────────────────────────
function PengajuanCard({ p, onClick }: { p: Pengajuan; onClick: () => void }) {
  const accent =
    p.status === "menunggu" ? "border-l-yellow-400"
    : p.status === "disetujui" ? "border-l-green-400"
    : "border-l-red-400"

  return (
    <div
      onClick={onClick}
      className={"group flex cursor-pointer items-start gap-3 rounded-xl border border-l-4 border-border bg-card p-3.5 transition hover:bg-muted/30 " + accent}
    >
      <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-xs font-bold text-primary mt-0.5">
        {initials(p.nama_usaha)}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5">
          <p className="truncate text-sm font-semibold text-foreground">{p.nama_usaha}</p>
          {p.foto_url && <ImageIcon className="size-3 shrink-0 text-muted-foreground/40" />}
        </div>
        <div className="mt-0.5 flex flex-wrap gap-x-2 gap-y-0.5 text-xs text-muted-foreground">
          <span className="flex items-center gap-0.5"><User className="size-2.5" />{p.nama_pemilik}</span>
          <span className="hidden sm:flex items-center gap-0.5"><Tag className="size-2.5" />{p.kategori_nama}</span>
          <span className="flex items-center gap-0.5"><Calendar className="size-2.5" />{fmtTgl(p.created_at)}</span>
        </div>
        <div className="mt-1.5">
          <StatusChip status={p.status} sm />
        </div>
      </div>
      <ChevronRight className="size-4 shrink-0 self-center text-muted-foreground/40 transition group-hover:translate-x-0.5" />
    </div>
  )
}

// ── Info row ───────────────────────────────────────────────────
function InfoRow({ icon: Icon, label, children }: { icon: any; label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-lg bg-muted">
        <Icon className="size-3.5 text-muted-foreground" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">{label}</p>
        <div className="mt-0.5 break-words text-sm text-foreground">{children}</div>
      </div>
    </div>
  )
}

// ── Detail Dialog ──────────────────────────────────────────────
function DetailDialog({ p, open, onClose, onApproved, onRejected, onDeleted }: {
  p: Pengajuan; open: boolean; onClose: () => void
  onApproved: (id: string) => void
  onRejected: (id: string) => void
  onDeleted:  (id: string) => void
}) {
  const [isPending, startTransition] = useTransition()
  const [showTolak, setShowTolak]   = useState(false)
  const [alasan, setAlasan]         = useState("")
  const [showHapus, setShowHapus]   = useState(false)

  const fotoList = [p.foto_url, p.foto_url_2, p.foto_url_3].filter(Boolean) as string[]
  const waUrl   = "https://wa.me/" + p.whatsapp.replace(/\D/g, "")
  const mapsUrl = p.latitude && p.longitude
    ? "https://www.google.com/maps?q=" + p.latitude + "," + p.longitude
    : null

  const isIzin =
    p.memiliki_izin === "__YES__" || p.memiliki_izin === "true" || (p.memiliki_izin as any) === true

  function handleApprove() {
    startTransition(async () => {
      const res = await approvePengajuan(p.id)
      if ("error" in res) toast.error(res.error)
      else { toast.success(p.nama_usaha + " disetujui!"); onApproved(p.id); onClose() }
    })
  }

  function handleTolak() {
    if (!alasan.trim()) { toast.error("Alasan wajib diisi"); return }
    startTransition(async () => {
      const res = await tolakPengajuan(p.id, alasan)
      if ("error" in res) toast.error(res.error)
      else {
        toast.success("Pengajuan ditolak")
        onRejected(p.id); setShowTolak(false); setAlasan(""); onClose()
      }
    })
  }

  function handleHapus() {
    startTransition(async () => {
      const res = await hapusPengajuan(p.id)
      if ("error" in res) toast.error(res.error)
      else {
        toast.success("Historis dihapus")
        onDeleted(p.id); setShowHapus(false); onClose()
      }
    })
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="flex h-[100dvh] flex-col gap-0 overflow-hidden p-0 sm:h-auto sm:max-h-[90vh] sm:max-w-2xl sm:rounded-2xl">

        {/* Header */}
        <DialogHeader className="shrink-0 border-b border-border px-4 py-3 sm:px-6 sm:py-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-sm font-bold text-primary">
                {initials(p.nama_usaha)}
              </div>
              <div className="min-w-0">
                <DialogTitle className="truncate font-serif text-base leading-tight sm:text-lg">
                  {p.nama_usaha}
                </DialogTitle>
                <p className="text-xs text-muted-foreground">{p.nama_pemilik} · {fmtTgl(p.created_at)}</p>
              </div>
            </div>
            <StatusChip status={p.status} sm />
          </div>
        </DialogHeader>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto">

          {/* Foto */}
          {fotoList.length > 0 && (
            <div className={"grid gap-0.5 " + (fotoList.length === 1 ? "grid-cols-1" : fotoList.length === 2 ? "grid-cols-2" : "grid-cols-3")}>
              {fotoList.map((url, i) => (
                <a key={i} href={url} target="_blank" rel="noreferrer"
                  className="group relative block overflow-hidden bg-muted">
                  <img src={url} alt={"Foto " + (i + 1)}
                    className={"w-full object-cover transition group-hover:scale-105 " + (fotoList.length === 1 ? "h-44 sm:h-56" : "h-28 sm:h-36")} />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition group-hover:bg-black/20">
                    <ExternalLink className="size-4 text-white opacity-0 drop-shadow transition group-hover:opacity-100" />
                  </div>
                </a>
              ))}
            </div>
          )}

          <div className="space-y-5 p-4 sm:p-6">
            {/* Pemilik */}
            <div>
              <p className="mb-3 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">Informasi Pemilik</p>
              <div className="space-y-3">
                <InfoRow icon={User} label="Nama Pemilik">{p.nama_pemilik}</InfoRow>
                <InfoRow icon={Phone} label="WhatsApp">
                  <a href={waUrl} target="_blank" rel="noreferrer"
                    className="inline-flex items-center gap-1 font-medium text-green-600 hover:underline">
                    {p.whatsapp} <ExternalLink className="size-3" />
                  </a>
                </InfoRow>
                {p.email && (
                  <InfoRow icon={Mail} label="Email">
                    <a href={"mailto:" + p.email} className="break-all text-primary hover:underline">{p.email}</a>
                  </InfoRow>
                )}
              </div>
            </div>

            <hr className="border-border" />

            {/* Usaha */}
            <div>
              <p className="mb-3 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">Informasi Usaha</p>
              <div className="space-y-3">
                <InfoRow icon={Tag} label="Kategori">
                  <span>{p.kategori_nama}</span>
                  {p.sub_kategori_nama && (
                    <span className="ml-1.5 rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">{p.sub_kategori_nama}</span>
                  )}
                </InfoRow>
                {p.jam_operasional && <InfoRow icon={Clock} label="Jam Operasional">{p.jam_operasional}</InfoRow>}
                {p.alamat && <InfoRow icon={MapPin} label="Alamat">{p.alamat}</InfoRow>}
                {mapsUrl && (
                  <InfoRow icon={MapPin} label="Koordinat">
                    <a href={mapsUrl} target="_blank" rel="noreferrer"
                      className="inline-flex items-center gap-1 text-primary hover:underline">
                      {p.latitude?.toFixed(5)}, {p.longitude?.toFixed(5)}
                      <ExternalLink className="size-3" />
                    </a>
                  </InfoRow>
                )}
                <InfoRow icon={ShieldCheck} label="Izin Usaha">
                  {isIzin
                    ? <span className="font-medium text-green-600">✓ Memiliki izin</span>
                    : <span className="text-muted-foreground">Belum ada izin</span>}
                </InfoRow>
              </div>
            </div>

            {p.deskripsi && (
              <>
                <hr className="border-border" />
                <div>
                  <p className="mb-2 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">Deskripsi</p>
                  <p className="rounded-xl bg-muted/50 p-3 text-sm leading-relaxed">{p.deskripsi}</p>
                </div>
              </>
            )}

            {p.catatan && (
              <>
                <hr className="border-border" />
                <div>
                  <p className="mb-2 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                    <MessageSquare className="size-3" />Catatan
                  </p>
                  <p className="rounded-xl border border-border bg-muted/30 p-3 text-sm italic leading-relaxed text-muted-foreground">"{p.catatan}"</p>
                </div>
              </>
            )}

            {/* Sudah diproses */}
            {p.status !== "menunggu" && (
              <>
                <hr className="border-border" />
                <div className={"rounded-xl p-4 " + (p.status === "disetujui"
                  ? "bg-green-50 dark:bg-green-950/30"
                  : "bg-red-50 dark:bg-red-950/30")}>
                  <div className="flex items-center gap-2 mb-1.5">
                    {p.status === "disetujui"
                      ? <CheckCircle className="size-4 text-green-600" />
                      : <XCircle className="size-4 text-red-600" />}
                    <p className={"text-sm font-semibold " + (p.status === "disetujui"
                      ? "text-green-700 dark:text-green-400"
                      : "text-red-700 dark:text-red-400")}>
                      {p.status === "disetujui" ? "Pengajuan Disetujui" : "Pengajuan Ditolak"}
                    </p>
                  </div>
                  {p.reviewed_at && <p className="text-xs text-muted-foreground">{fmtTglLengkap(p.reviewed_at)}</p>}
                  {p.alasan_tolak && <p className="mt-2 text-sm text-red-700 dark:text-red-400">Alasan: {p.alasan_tolak}</p>}

                  {/* ── Hapus historis ── */}
                  <div className="mt-4 border-t border-current/10 pt-3">
                    {!showHapus ? (
                      <button
                        onClick={() => setShowHapus(true)}
                        className="flex items-center gap-1.5 text-xs text-muted-foreground transition hover:text-red-500"
                      >
                        <Trash2 className="size-3" />
                        Hapus historis pengajuan ini
                      </button>
                    ) : (
                      <div className="rounded-lg border border-red-200 bg-red-50 p-3 dark:border-red-900 dark:bg-red-950/50">
                        <p className="mb-2.5 text-xs font-semibold text-red-700 dark:text-red-400">
                          Yakin hapus historis ini? Tidak bisa dibatalkan.
                        </p>
                        <div className="flex gap-2">
                          <button
                            disabled={isPending}
                            onClick={handleHapus}
                            className="flex items-center gap-1.5 rounded-lg bg-red-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-red-700 disabled:opacity-60"
                          >
                            {isPending
                              ? <Loader2 className="size-3 animate-spin" />
                              : <><Trash2 className="size-3" />Ya, Hapus</>}
                          </button>
                          <button
                            onClick={() => setShowHapus(false)}
                            className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-foreground transition hover:bg-muted"
                          >
                            Batal
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}

            {/* Form tolak */}
            {showTolak && p.status === "menunggu" && (
              <div className="rounded-xl border border-red-200 bg-red-50 p-4 space-y-3 dark:border-red-900 dark:bg-red-950/30">
                <p className="flex items-center gap-2 text-sm font-semibold text-red-700 dark:text-red-400">
                  <ShieldX className="size-4" />Alasan Penolakan
                </p>
                <Textarea
                  placeholder="mis. Lokasi di luar wilayah, foto tidak jelas, info tidak lengkap..."
                  rows={3}
                  value={alasan}
                  onChange={(e) => setAlasan(e.target.value)}
                  className="bg-background"
                />
                <div className="flex gap-2">
                  <button
                    disabled={isPending}
                    onClick={handleTolak}
                    className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-red-600 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700 disabled:opacity-60"
                  >
                    {isPending ? <Loader2 className="size-4 animate-spin" /> : <><XCircle className="size-4" />Konfirmasi Tolak</>}
                  </button>
                  <button
                    onClick={() => { setShowTolak(false); setAlasan("") }}
                    className="rounded-xl border border-border px-4 py-2.5 text-sm font-medium text-foreground transition hover:bg-muted"
                  >
                    Batal
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Sticky footer — hanya saat menunggu & bukan mode tolak */}
        {p.status === "menunggu" && !showTolak && (
          <div className="shrink-0 border-t border-border bg-background/95 p-3 backdrop-blur-sm sm:p-4">
            <div className="flex gap-2 sm:gap-3">
              <button
                disabled={isPending}
                onClick={() => setShowTolak(true)}
                className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-red-200 bg-red-50 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-100 disabled:opacity-50 dark:border-red-900 dark:bg-red-950/30 dark:text-red-400"
              >
                <XCircle className="size-4" />Tolak
              </button>
              <button
                disabled={isPending}
                onClick={handleApprove}
                className="flex flex-[2] items-center justify-center gap-1.5 rounded-xl bg-green-600 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-green-700 disabled:opacity-60"
              >
                {isPending
                  ? <Loader2 className="size-4 animate-spin" />
                  : <><CheckCircle className="size-4" />Setujui &amp; Masukkan ke UMKM</>}
              </button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

// ── Filter tabs ────────────────────────────────────────────────
const FILTERS: { key: Filter; label: string }[] = [
  { key: "menunggu",  label: "Menunggu"  },
  { key: "disetujui", label: "Disetujui" },
  { key: "ditolak",   label: "Ditolak"   },
  { key: "semua",     label: "Semua"     },
]

function FilterTabs({
  active, counts, onChange,
}: {
  active: Filter
  counts: Counts
  onChange: (f: Filter) => void
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {FILTERS.map(({ key, label }) => {
        const count = counts[key]
        const isActive = active === key
        return (
          <button
            key={key}
            onClick={() => onChange(key)}
            className={
              "flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-sm font-medium transition " +
              (isActive
                ? "border-primary bg-primary text-primary-foreground shadow-sm"
                : "border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground")
            }
          >
            {label}
            <span className={
              "rounded-full px-1.5 py-0.5 text-[10px] font-bold " +
              (isActive ? "bg-white/20 text-inherit" : "bg-muted text-muted-foreground")
            }>
              {count}
            </span>
            {key === "menunggu" && count > 0 && !isActive && (
              <span className="size-1.5 rounded-full bg-yellow-500 animate-pulse" />
            )}
          </button>
        )
      })}
    </div>
  )
}

// ── MAIN EXPORT ────────────────────────────────────────────────
export function PengajuanTable({
  data: initialData,
  counts: initialCounts,
}: {
  data: Pengajuan[]
  counts: Counts
}) {
  const [data, setData]       = useState<Pengajuan[]>(initialData)
  const [filter, setFilter]   = useState<Filter>("menunggu")
  const [selected, setSelected] = useState<Pengajuan | null>(null)

  // Hitung counts dari data lokal (bukan initialCounts)
  const counts: Counts = {
    semua:     data.length,
    menunggu:  data.filter((p) => p.status === "menunggu").length,
    disetujui: data.filter((p) => p.status === "disetujui").length,
    ditolak:   data.filter((p) => p.status === "ditolak").length,
  }

  const filtered = filter === "semua" ? data : data.filter((p) => p.status === filter)

  const emptyLabels: Record<Filter, string> = {
    menunggu:  "Tidak ada pengajuan yang menunggu review",
    disetujui: "Belum ada pengajuan yang disetujui",
    ditolak:   "Belum ada pengajuan yang ditolak",
    semua:     "Belum ada pengajuan sama sekali",
  }

  function markApproved(id: string) {
    setData((prev) => prev.map((p) => p.id === id ? { ...p, status: "disetujui" as const } : p))
  }
  function markRejected(id: string) {
    setData((prev) => prev.map((p) => p.id === id ? { ...p, status: "ditolak" as const } : p))
  }
  function markDeleted(id: string) {
    setData((prev) => prev.filter((p) => p.id !== id))
  }

  return (
    <>
      {/* Filter pills — di atas, wrap di mobile */}
      <FilterTabs active={filter} counts={counts} onChange={setFilter} />

      {/* List */}
      <div className="mt-4 space-y-2">
        {filtered.length === 0
          ? <EmptyState label={emptyLabels[filter]} />
          : filtered.map((p) => (
              <PengajuanCard key={p.id} p={p} onClick={() => setSelected(p)} />
            ))
        }
      </div>

      {selected && (
        <DetailDialog
          p={selected}
          open={!!selected}
          onClose={() => setSelected(null)}
          onApproved={markApproved}
          onRejected={markRejected}
          onDeleted={markDeleted}
        />
      )}
    </>
  )
}
