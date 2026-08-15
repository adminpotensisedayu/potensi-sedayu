"use client"

import { useState, useTransition } from "react"
import { toast } from "sonner"
import {
  approvePengajuan,
  tolakPengajuan,
} from "@/app/admin/(panel)/pengajuan/actions"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import {
  CheckCircle, XCircle, Loader2, MapPin, Phone, Mail,
  Clock, Tag, MessageSquare, ExternalLink, Store, User,
  ShieldCheck, ShieldX, Calendar, ChevronRight, Image as ImageIcon,
} from "lucide-react"

// ── Types ──
type Pengajuan = {
  id: string; created_at: string; nama_pemilik: string; nama_usaha: string
  whatsapp: string; email: string | null; kategori_nama: string
  sub_kategori_nama: string | null; deskripsi: string | null
  alamat: string | null; jam_operasional: string | null
  latitude: number | null; longitude: number | null
  foto_url: string | null; foto_url_2: string | null; foto_url_3: string | null
  memiliki_izin: string | null; catatan: string | null
  status: "menunggu" | "disetujui" | "ditolak"
  alasan_tolak: string | null; reviewed_at: string | null; reviewed_by: string | null
}
type Counts = { semua: number; menunggu: number; disetujui: number; ditolak: number }

// ── Helpers ──
function fmtTgl(d: string) {
  return new Date(d).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })
}
function fmtTglLengkap(d: string) {
  return new Date(d).toLocaleString("id-ID", {
    day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit",
  })
}
function initials(name: string) {
  return name.split(" ").slice(0, 2).map((w) => w[0]).join("").toUpperCase()
}

// ── Status chip ──
function StatusChip({ status, compact = false }: { status: string; compact?: boolean }) {
  if (status === "menunggu")
    return (
      <span className={"inline-flex items-center gap-1.5 rounded-full bg-yellow-100 font-semibold text-yellow-700 dark:bg-yellow-950/50 dark:text-yellow-400 " + (compact ? "px-2 py-0.5 text-[10px]" : "px-3 py-1 text-xs")}>
        <span className="size-1.5 shrink-0 rounded-full bg-yellow-500 animate-pulse" />
        {compact ? "Menunggu" : "Menunggu Review"}
      </span>
    )
  if (status === "disetujui")
    return (
      <span className={"inline-flex items-center gap-1.5 rounded-full bg-green-100 font-semibold text-green-700 dark:bg-green-950/50 dark:text-green-400 " + (compact ? "px-2 py-0.5 text-[10px]" : "px-3 py-1 text-xs")}>
        <CheckCircle className="size-3 shrink-0" />
        Disetujui
      </span>
    )
  return (
    <span className={"inline-flex items-center gap-1.5 rounded-full bg-red-100 font-semibold text-red-700 dark:bg-red-950/50 dark:text-red-400 " + (compact ? "px-2 py-0.5 text-[10px]" : "px-3 py-1 text-xs")}>
      <XCircle className="size-3 shrink-0" />
      Ditolak
    </span>
  )
}

// ── Empty state ──
function EmptyState({ label }: { label: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-border py-12 text-center">
      <div className="flex size-12 items-center justify-center rounded-full bg-muted">
        <Store className="size-5 text-muted-foreground/40" />
      </div>
      <div>
        <p className="text-sm font-medium text-muted-foreground">Tidak ada pengajuan</p>
        {label && <p className="text-xs text-muted-foreground/60">{label}</p>}
      </div>
    </div>
  )
}

// ── Card row — RESPONSIVE ──
function PengajuanRow({ p, onClick }: { p: Pengajuan; onClick: () => void }) {
  const borderColor =
    p.status === "menunggu" ? "border-l-yellow-400"
    : p.status === "disetujui" ? "border-l-green-400"
    : "border-l-red-400"

  return (
    <div
      onClick={onClick}
      className={"group flex cursor-pointer items-start gap-3 rounded-xl border border-border border-l-4 bg-card p-3 sm:p-4 transition hover:shadow-sm hover:bg-muted/30 " + borderColor}
    >
      {/* Avatar */}
      <div className="flex size-9 sm:size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-xs sm:text-sm font-bold text-primary mt-0.5">
        {initials(p.nama_usaha)}
      </div>

      {/* Info */}
      <div className="min-w-0 flex-1">
        {/* Row 1: nama + foto icon */}
        <div className="flex items-center gap-1.5">
          <p className="truncate text-sm font-semibold text-foreground sm:text-base">{p.nama_usaha}</p>
          {p.foto_url && <ImageIcon className="size-3 shrink-0 text-muted-foreground/50" />}
        </div>
        {/* Row 2: pemilik + kategori */}
        <div className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-muted-foreground">
          <span className="flex items-center gap-0.5">
            <User className="size-2.5" />{p.nama_pemilik}
          </span>
          <span className="hidden sm:flex items-center gap-0.5">
            <Tag className="size-2.5" />{p.kategori_nama}
            {p.sub_kategori_nama && " · " + p.sub_kategori_nama}
          </span>
          <span className="flex items-center gap-0.5">
            <Calendar className="size-2.5" />{fmtTgl(p.created_at)}
          </span>
        </div>
        {/* Row 3: status chip — mobile only (below) */}
        <div className="mt-1.5 sm:hidden">
          <StatusChip status={p.status} compact />
        </div>
      </div>

      {/* Status + arrow — desktop only */}
      <div className="hidden sm:flex shrink-0 items-center gap-2">
        <StatusChip status={p.status} />
        <ChevronRight className="size-4 text-muted-foreground/40 transition group-hover:translate-x-0.5 group-hover:text-muted-foreground" />
      </div>
      {/* Arrow — mobile only */}
      <ChevronRight className="sm:hidden size-4 shrink-0 self-center text-muted-foreground/40" />
    </div>
  )
}

// ── List ──
function DataList({ data, emptyLabel, onSelect }: {
  data: Pengajuan[]; emptyLabel: string; onSelect: (p: Pengajuan) => void
}) {
  if (data.length === 0) return <EmptyState label={emptyLabel} />
  return (
    <div className="space-y-2">
      {data.map((p) => <PengajuanRow key={p.id} p={p} onClick={() => onSelect(p)} />)}
    </div>
  )
}

// ── Info row ──
function InfoRow({ icon: Icon, label, children }: {
  icon: any; label: string; children: React.ReactNode
}) {
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

// ── Detail Dialog — FULL RESPONSIVE ──
function DetailDialog({ p, open, onClose, onApproved, onRejected }: {
  p: Pengajuan; open: boolean; onClose: () => void
  onApproved: (id: string) => void; onRejected: (id: string) => void
}) {
  const [isPending, startTransition] = useTransition()
  const [showTolak, setShowTolak] = useState(false)
  const [alasan, setAlasan] = useState("")

  const fotoList = [p.foto_url, p.foto_url_2, p.foto_url_3].filter(Boolean) as string[]
  const waNum  = p.whatsapp.replace(/\D/g, "")
  const waUrl  = "https://wa.me/" + waNum
  const mapsUrl = p.latitude && p.longitude
    ? "https://www.google.com/maps?q=" + p.latitude + "," + p.longitude
    : null

  function handleApprove() {
    startTransition(async () => {
      const result = await approvePengajuan(p.id)
      if ("error" in result) { toast.error(result.error) }
      else { toast.success(p.nama_usaha + " berhasil disetujui!"); onApproved(p.id); onClose() }
    })
  }

  function handleTolak() {
    if (!alasan.trim()) { toast.error("Alasan penolakan wajib diisi"); return }
    startTransition(async () => {
      const result = await tolakPengajuan(p.id, alasan)
      if ("error" in result) { toast.error(result.error) }
      else {
        toast.success("Pengajuan ditolak")
        onRejected(p.id); setShowTolak(false); setAlasan(""); onClose()
      }
    })
  }

  const isMemilikiIzin =
    p.memiliki_izin === "__YES__" ||
    p.memiliki_izin === "true" ||
    (p.memiliki_izin as any) === true

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      {/* Full screen on mobile, modal on sm+ */}
      <DialogContent className="flex h-[100dvh] flex-col gap-0 overflow-hidden p-0 sm:h-auto sm:max-h-[90vh] sm:max-w-2xl sm:rounded-2xl">

        {/* Header */}
        <DialogHeader className="shrink-0 border-b border-border px-4 py-3 sm:px-6 sm:py-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-sm font-bold text-primary sm:size-10">
                {initials(p.nama_usaha)}
              </div>
              <div className="min-w-0">
                <DialogTitle className="truncate font-serif text-base leading-tight sm:text-lg">
                  {p.nama_usaha}
                </DialogTitle>
                <p className="truncate text-xs text-muted-foreground">
                  {p.nama_pemilik} · {fmtTgl(p.created_at)}
                </p>
              </div>
            </div>
            <StatusChip status={p.status} compact />
          </div>
        </DialogHeader>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto">

          {/* Foto gallery */}
          {fotoList.length > 0 && (
            <div className={"grid gap-0.5 " + (fotoList.length === 1 ? "grid-cols-1" : fotoList.length === 2 ? "grid-cols-2" : "grid-cols-3")}>
              {fotoList.map((url, i) => (
                <a key={i} href={url} target="_blank" rel="noreferrer"
                  className="group relative block overflow-hidden bg-muted">
                  <img src={url} alt={"Foto " + (i + 1)}
                    className={"w-full object-cover transition group-hover:scale-105 " + (fotoList.length === 1 ? "h-40 sm:h-52" : "h-28 sm:h-36")} />
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
              <p className="mb-3 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                Informasi Pemilik
              </p>
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
                    <a href={"mailto:" + p.email} className="break-all text-primary hover:underline">
                      {p.email}
                    </a>
                  </InfoRow>
                )}
              </div>
            </div>

            <hr className="border-border" />

            {/* Usaha */}
            <div>
              <p className="mb-3 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                Informasi Usaha
              </p>
              <div className="space-y-3">
                <InfoRow icon={Tag} label="Kategori">
                  <span>{p.kategori_nama}</span>
                  {p.sub_kategori_nama && (
                    <span className="ml-1.5 rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                      {p.sub_kategori_nama}
                    </span>
                  )}
                </InfoRow>
                {p.jam_operasional && (
                  <InfoRow icon={Clock} label="Jam Operasional">{p.jam_operasional}</InfoRow>
                )}
                {p.alamat && (
                  <InfoRow icon={MapPin} label="Alamat">{p.alamat}</InfoRow>
                )}
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
                  {isMemilikiIzin
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
                    <MessageSquare className="size-3" /> Catatan
                  </p>
                  <p className="rounded-xl border border-border bg-muted/30 p-3 text-sm italic leading-relaxed text-muted-foreground">
                    "{p.catatan}"
                  </p>
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
                  {p.reviewed_at && (
                    <p className="text-xs text-muted-foreground">{fmtTglLengkap(p.reviewed_at)}</p>
                  )}
                  {p.alasan_tolak && (
                    <p className="mt-2 text-sm text-red-700 dark:text-red-400">
                      Alasan: {p.alasan_tolak}
                    </p>
                  )}
                </div>
              </>
            )}

            {/* Form tolak */}
            {showTolak && p.status === "menunggu" && (
              <div className="rounded-xl border border-red-200 bg-red-50 p-4 space-y-3 dark:border-red-900 dark:bg-red-950/30">
                <p className="flex items-center gap-2 text-sm font-semibold text-red-700 dark:text-red-400">
                  <ShieldX className="size-4" /> Alasan Penolakan
                </p>
                <Textarea
                  placeholder="mis. Lokasi di luar wilayah, foto tidak jelas, info tidak lengkap..."
                  rows={3}
                  value={alasan}
                  onChange={(e) => setAlasan(e.target.value)}
                  className="bg-background border-red-200 dark:border-red-800"
                />
                <div className="flex gap-2">
                  <Button variant="destructive" disabled={isPending} onClick={handleTolak} className="flex-1">
                    {isPending
                      ? <Loader2 className="size-4 animate-spin" />
                      : <><XCircle className="mr-1.5 size-4" />Konfirmasi Tolak</>}
                  </Button>
                  <Button variant="outline" onClick={() => { setShowTolak(false); setAlasan("") }}>
                    Batal
                  </Button>
                </div>
              </div>
            )}

            {/* Extra bottom padding biar konten tidak ketutup sticky footer */}
            {p.status === "menunggu" && !showTolak && <div className="h-4" />}
          </div>
        </div>

        {/* Sticky action footer */}
        {p.status === "menunggu" && !showTolak && (
          <div className="shrink-0 border-t border-border bg-background/95 p-3 backdrop-blur-sm sm:p-4">
            <div className="flex gap-2 sm:gap-3">
              <button
                disabled={isPending}
                onClick={() => setShowTolak(true)}
                className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-red-200 bg-red-50 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-100 disabled:opacity-50 dark:border-red-900 dark:bg-red-950/30 dark:text-red-400"
              >
                <XCircle className="size-4" />
                <span>Tolak</span>
              </button>
              <button
                disabled={isPending}
                onClick={handleApprove}
                className="flex flex-[2] items-center justify-center gap-1.5 rounded-xl bg-green-600 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-green-700 disabled:opacity-60"
              >
                {isPending
                  ? <Loader2 className="size-4 animate-spin" />
                  : <><CheckCircle className="size-4" /><span>Setujui &amp; Masukkan ke UMKM</span></>}
              </button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

// ── MAIN EXPORT ──
export function PengajuanTable({
  data: initialData,
  counts: initialCounts,
}: {
  data: Pengajuan[]
  counts: Counts
}) {
  const [data, setData] = useState<Pengajuan[]>(initialData)
  const [selected, setSelected] = useState<Pengajuan | null>(null)

  function markApproved(id: string) {
    setData((prev) => prev.map((p) => p.id === id ? { ...p, status: "disetujui" as const } : p))
  }
  function markRejected(id: string) {
    setData((prev) => prev.map((p) => p.id === id ? { ...p, status: "ditolak" as const } : p))
  }

  const menunggu  = data.filter((p) => p.status === "menunggu")
  const disetujui = data.filter((p) => p.status === "disetujui")
  const ditolak   = data.filter((p) => p.status === "ditolak")

  return (
    <>
      <Tabs defaultValue="menunggu">
        {/* Tabs — scrollable on mobile */}
        <div className="mb-4 overflow-x-auto">
          <TabsList className="h-auto w-max min-w-full gap-1 rounded-xl bg-muted/60 p-1 sm:w-full">
            <TabsTrigger value="menunggu" className="flex-1 rounded-lg px-3 py-2 text-xs sm:text-sm">
              Menunggu
              {menunggu.length > 0 && (
                <span className="ml-1.5 rounded-full bg-yellow-500 px-1.5 py-0.5 text-[10px] font-bold text-white">
                  {menunggu.length}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="disetujui" className="flex-1 rounded-lg px-3 py-2 text-xs sm:text-sm">
              Disetujui
              <span className="ml-1 text-xs text-muted-foreground">({disetujui.length})</span>
            </TabsTrigger>
            <TabsTrigger value="ditolak" className="flex-1 rounded-lg px-3 py-2 text-xs sm:text-sm">
              Ditolak
              <span className="ml-1 text-xs text-muted-foreground">({ditolak.length})</span>
            </TabsTrigger>
            <TabsTrigger value="semua" className="flex-1 rounded-lg px-3 py-2 text-xs sm:text-sm">
              Semua
              <span className="ml-1 text-xs text-muted-foreground">({data.length})</span>
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="menunggu">
          <DataList data={menunggu}  emptyLabel="yang menunggu review" onSelect={setSelected} />
        </TabsContent>
        <TabsContent value="disetujui">
          <DataList data={disetujui} emptyLabel="yang disetujui" onSelect={setSelected} />
        </TabsContent>
        <TabsContent value="ditolak">
          <DataList data={ditolak}   emptyLabel="yang ditolak" onSelect={setSelected} />
        </TabsContent>
        <TabsContent value="semua">
          <DataList data={data}      emptyLabel="" onSelect={setSelected} />
        </TabsContent>
      </Tabs>

      {selected && (
        <DetailDialog
          p={selected}
          open={!!selected}
          onClose={() => setSelected(null)}
          onApproved={markApproved}
          onRejected={markRejected}
        />
      )}
    </>
  )
}
