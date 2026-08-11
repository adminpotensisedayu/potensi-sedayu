"use client"

import { useState, useTransition } from "react"
import { toast } from "sonner"
import {
  approvePengajuan,
  tolakPengajuan,
} from "@/app/admin/(panel)/pengajuan/actions"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import {
  Eye,
  CheckCircle,
  XCircle,
  Loader2,
  MapPin,
  Phone,
  Mail,
  Clock,
  Tag,
  MessageSquare,
  Image as ImageIcon,
  ExternalLink,
} from "lucide-react"

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────
type Pengajuan = {
  id: string
  created_at: string
  nama_pemilik: string
  nama_usaha: string
  whatsapp: string
  email: string | null
  kategori_nama: string
  sub_kategori_nama: string | null
  deskripsi: string | null
  alamat: string | null
  jam_operasional: string | null
  latitude: number | null
  longitude: number | null
  foto_url: string | null
  foto_url_2: string | null
  foto_url_3: string | null
  memiliki_izin: string | null
  catatan: string | null
  status: "menunggu" | "disetujui" | "ditolak"
  alasan_tolak: string | null
  reviewed_at: string | null
  reviewed_by: string | null
}

type Counts = {
  semua: number
  menunggu: number
  disetujui: number
  ditolak: number
}

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────
function fmtTgl(d: string) {
  return new Date(d).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })
}

function fmtTglLengkap(d: string) {
  return new Date(d).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

function StatusBadge({ status }: { status: string }) {
  if (status === "menunggu")
    return (
      <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100 dark:bg-yellow-950 dark:text-yellow-400">
        ⏳ Menunggu
      </Badge>
    )
  if (status === "disetujui")
    return (
      <Badge className="bg-green-100 text-green-700 hover:bg-green-100 dark:bg-green-950 dark:text-green-400">
        ✅ Disetujui
      </Badge>
    )
  return (
    <Badge className="bg-red-100 text-red-700 hover:bg-red-100 dark:bg-red-950 dark:text-red-400">
      ❌ Ditolak
    </Badge>
  )
}

// ─────────────────────────────────────────────
// Empty state
// ─────────────────────────────────────────────
function EmptyState({ label }: { label: string }) {
  return (
    <div className="flex h-40 flex-col items-center justify-center rounded-xl border border-dashed border-border text-muted-foreground">
      <ClipboardEmpty className="mb-2 size-8 opacity-30" />
      <p className="text-sm">Tidak ada pengajuan {label}</p>
    </div>
  )
}

function ClipboardEmpty({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      className={className}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
      />
    </svg>
  )
}

// ─────────────────────────────────────────────
// Table row
// ─────────────────────────────────────────────
function PengajuanRow({
  p,
  onClick,
}: {
  p: Pengajuan
  onClick: () => void
}) {
  return (
    <tr
      className="cursor-pointer border-b border-border transition-colors hover:bg-muted/40"
      onClick={onClick}
    >
      <td className="px-4 py-3">
        <div className="font-medium text-foreground">{p.nama_usaha}</div>
        <div className="text-xs text-muted-foreground">{p.nama_pemilik}</div>
      </td>
      <td className="px-4 py-3">
        <div className="text-sm">{p.kategori_nama}</div>
        {p.sub_kategori_nama && (
          <div className="text-xs text-muted-foreground">{p.sub_kategori_nama}</div>
        )}
      </td>
      <td className="px-4 py-3">
        <a
          href={`https://wa.me/${p.whatsapp}`}
          target="_blank"
          rel="noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="flex items-center gap-1 text-sm text-green-600 hover:underline"
        >
          <Phone className="size-3" />
          {p.whatsapp}
        </a>
      </td>
      <td className="px-4 py-3 text-xs text-muted-foreground whitespace-nowrap">
        {fmtTgl(p.created_at)}
      </td>
      <td className="px-4 py-3">
        <StatusBadge status={p.status} />
      </td>
      <td className="px-4 py-3">
        <Button size="sm" variant="ghost" className="gap-1.5" onClick={onClick}>
          <Eye className="size-3.5" />
          Detail
        </Button>
      </td>
    </tr>
  )
}

// ─────────────────────────────────────────────
// Inner table
// ─────────────────────────────────────────────
function DataTable({
  data,
  emptyLabel,
  onSelect,
}: {
  data: Pengajuan[]
  emptyLabel: string
  onSelect: (p: Pengajuan) => void
}) {
  if (data.length === 0) return <EmptyState label={emptyLabel} />

  return (
    <div className="overflow-hidden rounded-xl border border-border">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border bg-muted/50">
            <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">
              Usaha / Pemilik
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">
              Kategori
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">
              WhatsApp
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">
              Tanggal
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">
              Status
            </th>
            <th className="px-4 py-3" />
          </tr>
        </thead>
        <tbody>
          {data.map((p) => (
            <PengajuanRow key={p.id} p={p} onClick={() => onSelect(p)} />
          ))}
        </tbody>
      </table>
    </div>
  )
}

// ─────────────────────────────────────────────
// Detail Dialog
// ─────────────────────────────────────────────
function DetailDialog({
  p,
  open,
  onClose,
  onApproved,
  onRejected,
}: {
  p: Pengajuan
  open: boolean
  onClose: () => void
  onApproved: (id: string) => void
  onRejected: (id: string) => void
}) {
  const [isPending, startTransition] = useTransition()
  const [showTolak, setShowTolak] = useState(false)
  const [alasan, setAlasan] = useState("")

  function handleApprove() {
    startTransition(async () => {
      const result = await approvePengajuan(p.id)
      if ("error" in result) {
        toast.error(result.error)
      } else {
        toast.success(`✅ ${p.nama_usaha} berhasil disetujui dan masuk ke daftar UMKM!`)
        onApproved(p.id)
        onClose()
      }
    })
  }

  function handleTolak() {
    if (!alasan.trim()) {
      toast.error("Alasan penolakan wajib diisi")
      return
    }
    startTransition(async () => {
      const result = await tolakPengajuan(p.id, alasan)
      if ("error" in result) {
        toast.error(result.error)
      } else {
        toast.success("Pengajuan telah ditolak")
        onRejected(p.id)
        setShowTolak(false)
        setAlasan("")
        onClose()
      }
    })
  }

  const fotoList = [p.foto_url, p.foto_url_2, p.foto_url_3].filter(Boolean) as string[]

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-start justify-between gap-2">
            <span className="font-serif text-xl">{p.nama_usaha}</span>
            <StatusBadge status={p.status} />
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-5 py-2">
          {/* ── Foto ── */}
          {fotoList.length > 0 && (
            <div>
              <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase text-muted-foreground">
                <ImageIcon className="size-3.5" /> Foto
              </p>
              <div className="grid grid-cols-3 gap-2">
                {fotoList.map((url, i) => (
                  <a key={i} href={url} target="_blank" rel="noreferrer">
                    <img
                      src={url}
                      alt={`Foto ${i + 1}`}
                      className="h-28 w-full rounded-lg object-cover ring-1 ring-border hover:ring-primary transition-all"
                    />
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* ── Grid info ── */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            {/* Pemilik */}
            <div>
              <p className="text-xs font-semibold uppercase text-muted-foreground mb-1">
                Pemilik
              </p>
              <p className="font-medium">{p.nama_pemilik}</p>
              <a
                href={`https://wa.me/${p.whatsapp}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1 text-green-600 hover:underline text-xs mt-0.5"
              >
                <Phone className="size-3" /> {p.whatsapp}
              </a>
              {p.email && (
                <p className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
                  <Mail className="size-3" /> {p.email}
                </p>
              )}
            </div>

            {/* Kategori */}
            <div>
              <p className="text-xs font-semibold uppercase text-muted-foreground mb-1">
                Kategori
              </p>
              <p className="font-medium">{p.kategori_nama}</p>
              {p.sub_kategori_nama && (
                <p className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
                  <Tag className="size-3" /> {p.sub_kategori_nama}
                </p>
              )}
            </div>

            {/* Alamat */}
            <div>
              <p className="text-xs font-semibold uppercase text-muted-foreground mb-1">
                Alamat
              </p>
              <p className="text-sm">{p.alamat ?? "—"}</p>
            </div>

            {/* Jam operasional */}
            <div>
              <p className="text-xs font-semibold uppercase text-muted-foreground mb-1">
                Jam Operasional
              </p>
              <p className="flex items-center gap-1 text-sm">
                <Clock className="size-3 text-muted-foreground" />
                {p.jam_operasional ?? "—"}
              </p>
            </div>

            {/* Koordinat */}
            <div>
              <p className="text-xs font-semibold uppercase text-muted-foreground mb-1">
                Koordinat
              </p>
              {p.latitude && p.longitude ? (
                <a
                  href={`https://www.google.com/maps?q=${p.latitude},${p.longitude}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1 text-primary hover:underline text-xs"
                >
                  <MapPin className="size-3" />
                  {p.latitude.toFixed(5)}, {p.longitude.toFixed(5)}
                  <ExternalLink className="size-2.5" />
                </a>
              ) : (
                <p className="text-xs text-muted-foreground">Belum diisi</p>
              )}
            </div>

            {/* Izin */}
            <div>
              <p className="text-xs font-semibold uppercase text-muted-foreground mb-1">
                Status Izin
              </p>
              <p className="text-sm">{p.memiliki_izin ?? "—"}</p>
            </div>
          </div>

          {/* Deskripsi */}
          {p.deskripsi && (
            <div>
              <p className="mb-1 text-xs font-semibold uppercase text-muted-foreground">
                Deskripsi
              </p>
              <p className="rounded-lg bg-muted/50 p-3 text-sm leading-relaxed">
                {p.deskripsi}
              </p>
            </div>
          )}

          {/* Catatan */}
          {p.catatan && (
            <div>
              <p className="mb-1 flex items-center gap-1.5 text-xs font-semibold uppercase text-muted-foreground">
                <MessageSquare className="size-3.5" /> Catatan
              </p>
              <p className="rounded-lg bg-muted/50 p-3 text-sm leading-relaxed">
                {p.catatan}
              </p>
            </div>
          )}

          {/* Review info (jika sudah diproses) */}
          {p.status !== "menunggu" && (
            <div
              className={`rounded-xl p-4 text-sm ${
                p.status === "disetujui"
                  ? "bg-green-50 text-green-800 dark:bg-green-950/30 dark:text-green-300"
                  : "bg-red-50 text-red-800 dark:bg-red-950/30 dark:text-red-300"
              }`}
            >
              <p className="font-semibold mb-1">
                {p.status === "disetujui" ? "✅ Disetujui" : "❌ Ditolak"}
                {p.reviewed_at && ` — ${fmtTglLengkap(p.reviewed_at)}`}
              </p>
              {p.alasan_tolak && (
                <p className="text-sm opacity-90">Alasan: {p.alasan_tolak}</p>
              )}
            </div>
          )}

          {/* ── Tombol tolak dengan alasan ── */}
          {showTolak && p.status === "menunggu" && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-4 space-y-3 dark:border-red-900 dark:bg-red-950/30">
              <p className="text-sm font-semibold text-red-700 dark:text-red-400">
                Masukkan alasan penolakan:
              </p>
              <Textarea
                placeholder="mis. Lokasi di luar wilayah desa, foto tidak jelas, informasi tidak lengkap..."
                rows={3}
                value={alasan}
                onChange={(e) => setAlasan(e.target.value)}
                className="bg-background"
              />
              <div className="flex gap-2">
                <Button
                  variant="destructive"
                  disabled={isPending}
                  onClick={handleTolak}
                  className="flex-1"
                >
                  {isPending ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    <>
                      <XCircle className="mr-1.5 size-4" /> Konfirmasi Tolak
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowTolak(false)
                    setAlasan("")
                  }}
                >
                  Batal
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Footer actions */}
        {p.status === "menunggu" && (
          <DialogFooter className="gap-2 pt-2">
            <Button
              variant="outline"
              className="text-red-500 border-red-200 hover:bg-red-50"
              disabled={isPending || showTolak}
              onClick={() => setShowTolak(true)}
            >
              <XCircle className="mr-1.5 size-4" />
              Tolak
            </Button>
            <Button
              disabled={isPending || showTolak}
              onClick={handleApprove}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              {isPending ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <>
                  <CheckCircle className="mr-1.5 size-4" />
                  Setujui & Masukkan ke UMKM
                </>
              )}
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  )
}

// ─────────────────────────────────────────────
// MAIN EXPORT
// ─────────────────────────────────────────────
export function PengajuanTable({
  data: initialData,
  counts: initialCounts,
}: {
  data: Pengajuan[]
  counts: Counts
}) {
  const [data, setData] = useState<Pengajuan[]>(initialData)
  const [selected, setSelected] = useState<Pengajuan | null>(null)

  // Update lokal saat approve/tolak (optimistic update)
  function markApproved(id: string) {
    setData((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, status: "disetujui" as const } : p
      )
    )
  }

  function markRejected(id: string) {
    setData((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, status: "ditolak" as const } : p
      )
    )
  }

  const menunggu  = data.filter((p) => p.status === "menunggu")
  const disetujui = data.filter((p) => p.status === "disetujui")
  const ditolak   = data.filter((p) => p.status === "ditolak")

  return (
    <>
      <Tabs defaultValue="menunggu">
        <TabsList className="mb-4">
          <TabsTrigger value="menunggu">
            Menunggu{" "}
            {menunggu.length > 0 && (
              <span className="ml-1.5 rounded-full bg-yellow-500 px-1.5 py-0.5 text-[10px] font-bold text-white">
                {menunggu.length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="disetujui">
            Disetujui{" "}
            <span className="ml-1 text-muted-foreground">({disetujui.length})</span>
          </TabsTrigger>
          <TabsTrigger value="ditolak">
            Ditolak{" "}
            <span className="ml-1 text-muted-foreground">({ditolak.length})</span>
          </TabsTrigger>
          <TabsTrigger value="semua">
            Semua{" "}
            <span className="ml-1 text-muted-foreground">({data.length})</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="menunggu">
          <DataTable
            data={menunggu}
            emptyLabel="yang menunggu"
            onSelect={setSelected}
          />
        </TabsContent>
        <TabsContent value="disetujui">
          <DataTable
            data={disetujui}
            emptyLabel="yang disetujui"
            onSelect={setSelected}
          />
        </TabsContent>
        <TabsContent value="ditolak">
          <DataTable
            data={ditolak}
            emptyLabel="yang ditolak"
            onSelect={setSelected}
          />
        </TabsContent>
        <TabsContent value="semua">
          <DataTable
            data={data}
            emptyLabel=""
            onSelect={setSelected}
          />
        </TabsContent>
      </Tabs>

      {/* Detail Dialog */}
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