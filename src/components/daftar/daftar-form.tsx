"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"
import {
  Camera,
  X,
  Loader2,
  CheckCircle2,
  Upload,
  ChevronRight,
} from "lucide-react"
import { Button } from "@/components/ui/button"
// ✅ Reuse MapPicker dari admin — interface: lat/lng string
import { MapPicker } from "@/components/admin/map-picker"

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────
type Kategori = { id: string; nama: string }
type SubKategori = { id: string; nama: string }

// ─────────────────────────────────────────────
// Section Header
// ─────────────────────────────────────────────
function SeksiHeader({
  nomor,
  judul,
  deskripsi,
}: {
  nomor: number
  judul: string
  deskripsi: string
}) {
  return (
    <div className="mb-5 flex items-start gap-3">
      <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary text-[11px] font-bold text-primary-foreground">
        {nomor}
      </div>
      <div>
        <h2 className="font-semibold leading-tight text-foreground">{judul}</h2>
        <p className="mt-0.5 text-xs text-muted-foreground">{deskripsi}</p>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────
// Foto Upload Slot
// ─────────────────────────────────────────────
function FotoSlot({
  label,
  value,
  onChange,
  required = false,
}: {
  label: string
  value: string
  onChange: (url: string) => void
  required?: boolean
}) {
  const [uploading, setUploading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith("image/")) {
      toast.error("File harus berupa gambar (JPG, PNG, WEBP)")
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Ukuran foto maksimal 5 MB")
      return
    }

    setUploading(true)
    try {
      const supabase = createClient()
      const ext = file.name.split(".").pop() ?? "jpg"
      const path = `pengajuan/${Date.now()}_${Math.random()
        .toString(36)
        .slice(2)}.${ext}`

      const { error: uploadErr } = await supabase.storage
        .from("foto-pengajuan")
        .upload(path, file, { cacheControl: "3600", upsert: false })

      if (uploadErr) throw uploadErr

      const {
        data: { publicUrl },
      } = supabase.storage.from("foto-pengajuan").getPublicUrl(path)

      onChange(publicUrl)
      toast.success("Foto berhasil diupload ✓")
    } catch {
      toast.error("Gagal upload foto. Coba lagi.")
    } finally {
      setUploading(false)
      if (inputRef.current) inputRef.current.value = ""
    }
  }

  return (
    <div>
      <p className="mb-1.5 text-xs font-semibold text-muted-foreground">
        {label} {required && <span className="text-red-500">*</span>}
      </p>
      <div
        className={`relative flex h-36 cursor-pointer items-center justify-center rounded-xl border-2 border-dashed transition-all select-none ${
          value
            ? "border-green-300 bg-green-50"
            : "border-border bg-muted/30 hover:border-primary/40 hover:bg-muted/60"
        }`}
        onClick={() => !uploading && inputRef.current?.click()}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFile}
        />

        {uploading ? (
          <div className="flex flex-col items-center gap-2 text-muted-foreground">
            <Loader2 className="size-5 animate-spin" />
            <span className="text-[11px]">Mengupload...</span>
          </div>
        ) : value ? (
          <>
            <img
              src={value}
              alt="preview"
              className="h-full w-full rounded-xl object-cover"
            />
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                onChange("")
              }}
              className="absolute right-2 top-2 flex size-6 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/80"
            >
              <X className="size-3" />
            </button>
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 rounded bg-black/60 px-2 py-0.5 text-[10px] text-white">
              Klik untuk ganti
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center gap-2 text-muted-foreground">
            <Camera className="size-7 opacity-40" />
            <span className="text-[11px] font-medium">Klik untuk upload</span>
            <span className="text-[10px] opacity-60">JPG / PNG, maks 5 MB</span>
          </div>
        )}
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────
// CSS helpers
// ─────────────────────────────────────────────
const inputCls =
  "h-10 w-full rounded-xl border border-border bg-background px-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition-shadow"
const selectCls =
  "h-10 w-full rounded-xl border border-border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition-shadow disabled:cursor-not-allowed disabled:opacity-50"
const textareaCls =
  "w-full resize-none rounded-xl border border-border bg-background px-3 py-2.5 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition-shadow"

// ─────────────────────────────────────────────
// MAIN FORM
// ─────────────────────────────────────────────
interface DaftarFormProps {
  kategoriList: Kategori[]
}

export function DaftarForm({ kategoriList }: DaftarFormProps) {
  const router = useRouter()
  const supabase = createClient()

  // ── Form fields ──────────────────────────────────────────
  const [form, setForm] = useState({
    nama_pemilik:    "",
    whatsapp:        "",
    email:           "",
    nama_usaha:      "",
    deskripsi:       "",
    alamat:          "",
    jam_operasional: "",
    memiliki_izin:   "Belum ada izin",
    catatan:         "",
  })

  // ── Kategori cascade ─────────────────────────────────────
  const [selectedKategori,    setSelectedKategori]    = useState<Kategori | null>(null)
  const [subKategoriList,     setSubKategoriList]      = useState<SubKategori[]>([])
  const [selectedSub,         setSelectedSub]          = useState<SubKategori | null>(null)
  const [loadingSub,          setLoadingSub]           = useState(false)

  useEffect(() => {
    if (!selectedKategori) {
      setSubKategoriList([])
      setSelectedSub(null)
      return
    }
    setLoadingSub(true)
    setSelectedSub(null)
    supabase
      .from("sub_kategori")
      .select("id, nama")
      .eq("kategori_id", selectedKategori.id)
      .order("urutan")
      .then(({ data }) => {
        setSubKategoriList(data ?? [])
        setLoadingSub(false)
      })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedKategori?.id])

  // ── Lokasi — pakai string sesuai interface MapPicker ─────
  const [lat, setLat] = useState("")
  const [lng, setLng] = useState("")

  // ── Foto ──────────────────────────────────────────────────
  const [foto1, setFoto1] = useState("")
  const [foto2, setFoto2] = useState("")
  const [foto3, setFoto3] = useState("")

  // ── Submit state ──────────────────────────────────────────
  const [submitting, setSubmitting] = useState(false)
  const [submitted,  setSubmitted]  = useState(false)

  // ── Input helper ──────────────────────────────────────────
  function set(key: keyof typeof form) {
    return (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >
    ) => setForm((prev) => ({ ...prev, [key]: e.target.value }))
  }

  // ── Validasi ──────────────────────────────────────────────
  function validate(): string | null {
    if (!form.nama_pemilik.trim()) return "Nama pemilik wajib diisi"
    if (!form.whatsapp.trim())     return "Nomor WhatsApp wajib diisi"
    if (form.whatsapp.replace(/\D/g, "").length < 9)
      return "Nomor WhatsApp tidak valid (min 9 digit)"
    if (!form.nama_usaha.trim())   return "Nama usaha wajib diisi"
    if (!selectedKategori)         return "Kategori wajib dipilih"
    if (!selectedSub)              return "Sub-Kategori wajib dipilih"
    if (!form.deskripsi.trim())    return "Deskripsi usaha wajib diisi"
    if (!form.alamat.trim())       return "Alamat usaha wajib diisi"
    if (!foto1)                    return "Minimal 1 foto usaha wajib diupload"
    return null
  }

  // ── Submit ────────────────────────────────────────────────
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    const errMsg = validate()
    if (errMsg) {
      toast.error(errMsg)
      return
    }

    setSubmitting(true)
    try {
      // Normalisasi WhatsApp → 62xxxxxxxxxx
      const waDigits = form.whatsapp.replace(/\D/g, "")
      const waFormatted = waDigits.startsWith("0")
        ? "62" + waDigits.slice(1)
        : waDigits.startsWith("62")
        ? waDigits
        : "62" + waDigits

      // Parse lat/lng dari string ke number (null jika kosong)
      const latNum = lat.trim() ? parseFloat(lat) : null
      const lngNum = lng.trim() ? parseFloat(lng) : null

      const { error } = await supabase.from("pengajuan_umkm").insert({
        nama_pemilik:      form.nama_pemilik.trim(),
        whatsapp:          waFormatted,
        email:             form.email.trim() || null,
        nama_usaha:        form.nama_usaha.trim(),
        kategori_nama:     selectedKategori!.nama,
        sub_kategori_nama: selectedSub!.nama,
        deskripsi:         form.deskripsi.trim(),
        alamat:            form.alamat.trim(),
        jam_operasional:   form.jam_operasional.trim() || null,
        latitude:          latNum,
        longitude:         lngNum,
        foto_url:          foto1 || null,
        foto_url_2:        foto2 || null,
        foto_url_3:        foto3 || null,
        memiliki_izin:     form.memiliki_izin,
        catatan:           form.catatan.trim() || null,
        status:            "menunggu",
      })

      if (error) throw error

      setSubmitted(true)
      window.scrollTo({ top: 0, behavior: "smooth" })
    } catch {
      toast.error("Gagal mengirim pengajuan. Coba lagi beberapa saat.")
    } finally {
      setSubmitting(false)
    }
  }

  // ── Success screen ────────────────────────────────────────
  if (submitted) {
    return (
      <div className="flex flex-col items-center py-16 text-center">
        <div className="mb-5 flex size-20 items-center justify-center rounded-full bg-green-100">
          <CheckCircle2 className="size-10 text-green-600" />
        </div>
        <h2 className="mb-2 font-serif text-2xl font-bold text-foreground">
          Pengajuan Terkirim! 🎉
        </h2>
        <p className="mb-1 max-w-sm text-muted-foreground">
          Terima kasih, <strong>{form.nama_pemilik}</strong>!
        </p>
        <p className="mb-1 max-w-sm text-muted-foreground">
          Pengajuan UMKM <strong>{form.nama_usaha}</strong> telah kami terima
          dan akan direview dalam <strong>1–3 hari kerja</strong>.
        </p>
        <p className="mb-8 text-sm text-muted-foreground">
          Info lebih lanjut via WhatsApp{" "}
          <strong>{form.whatsapp}</strong>.
        </p>
        <div className="flex gap-3">
          <Button onClick={() => router.push("/umkm")} variant="outline">
            Lihat UMKM Lain
          </Button>
          <Button onClick={() => router.push("/")}>Ke Beranda</Button>
        </div>
      </div>
    )
  }

  // ── Form ──────────────────────────────────────────────────
  return (
    <form onSubmit={handleSubmit} className="space-y-6">

      {/* ══════════════════════════════════════════
          SEKSI 1: Data Pemilik
      ══════════════════════════════════════════ */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <SeksiHeader
          nomor={1}
          judul="Data Pemilik"
          deskripsi="Informasi pribadi pemilik usaha"
        />
        <div className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-foreground">
              Nama Lengkap Pemilik <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              className={inputCls}
              placeholder="mis. Budi Santoso"
              value={form.nama_pemilik}
              onChange={set("nama_pemilik")}
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-foreground">
              Nomor WhatsApp Aktif <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              className={inputCls}
              placeholder="08xxxxxxxxxx"
              value={form.whatsapp}
              onChange={set("whatsapp")}
            />
            <p className="mt-1 text-[11px] text-muted-foreground">
              Akan dihubungi untuk konfirmasi pendaftaran
            </p>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-foreground">
              Email{" "}
              <span className="text-[11px] font-normal text-muted-foreground">
                (opsional)
              </span>
            </label>
            <input
              type="email"
              className={inputCls}
              placeholder="email@contoh.com"
              value={form.email}
              onChange={set("email")}
            />
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════
          SEKSI 2: Data Usaha
      ══════════════════════════════════════════ */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <SeksiHeader
          nomor={2}
          judul="Data Usaha"
          deskripsi="Informasi lengkap tentang usaha yang didaftarkan"
        />
        <div className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-foreground">
              Nama Usaha / Produk <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              className={inputCls}
              placeholder="mis. Warung Makan Bu Sari"
              value={form.nama_usaha}
              onChange={set("nama_usaha")}
            />
          </div>

          {/* Kategori */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-foreground">
              Kategori Usaha <span className="text-red-500">*</span>
            </label>
            <select
              className={selectCls}
              value={selectedKategori?.id ?? ""}
              onChange={(e) => {
                const kat =
                  kategoriList.find((k) => k.id === e.target.value) ?? null
                setSelectedKategori(kat)
              }}
            >
              <option value="">— Pilih kategori —</option>
              {kategoriList.map((k) => (
                <option key={k.id} value={k.id}>
                  {k.nama}
                </option>
              ))}
            </select>
          </div>

          {/* Sub-Kategori — cascade dari DB */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-foreground">
              Sub-Kategori <span className="text-red-500">*</span>
            </label>
            <select
              className={selectCls}
              value={selectedSub?.id ?? ""}
              disabled={!selectedKategori || loadingSub}
              onChange={(e) => {
                const sub =
                  subKategoriList.find((s) => s.id === e.target.value) ?? null
                setSelectedSub(sub)
              }}
            >
              <option value="">
                {!selectedKategori
                  ? "— Pilih kategori dulu —"
                  : loadingSub
                  ? "Memuat sub-kategori..."
                  : "— Pilih sub-kategori —"}
              </option>
              {subKategoriList.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.nama}
                </option>
              ))}
            </select>
            {selectedKategori && !loadingSub && subKategoriList.length === 0 && (
              <p className="mt-1 text-[11px] text-red-500">
                Sub-kategori untuk kategori ini belum tersedia.
              </p>
            )}
          </div>

          {/* Deskripsi */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-foreground">
              Deskripsi Usaha <span className="text-red-500">*</span>
            </label>
            <textarea
              rows={4}
              className={textareaCls}
              placeholder="Ceritakan usaha Anda: produk/jasa yang ditawarkan, keunggulan, dll."
              value={form.deskripsi}
              onChange={set("deskripsi")}
            />
          </div>

          {/* Jam operasional */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-foreground">
              Jam Operasional{" "}
              <span className="text-[11px] font-normal text-muted-foreground">
                (opsional)
              </span>
            </label>
            <input
              type="text"
              className={inputCls}
              placeholder="mis. Senin–Sabtu 08:00–17:00 atau 24 jam"
              value={form.jam_operasional}
              onChange={set("jam_operasional")}
            />
          </div>

          {/* Izin usaha */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-foreground">
              Status Izin Usaha <span className="text-red-500">*</span>
            </label>
            <select
              className={selectCls}
              value={form.memiliki_izin}
              onChange={set("memiliki_izin")}
            >
              <option>Belum ada izin</option>
              <option>Ya, sudah ada izin (NIB / SIUP / dll)</option>
              <option>Sedang dalam proses pengurusan</option>
            </select>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════
          SEKSI 3: Lokasi
      ══════════════════════════════════════════ */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <SeksiHeader
          nomor={3}
          judul="Lokasi Usaha"
          deskripsi="Alamat lengkap dan koordinat lokasi usaha di peta"
        />
        <div className="space-y-4">
          {/* Alamat */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-foreground">
              Alamat Lengkap <span className="text-red-500">*</span>
            </label>
            <textarea
              rows={2}
              className={textareaCls}
              placeholder="mis. Dukuh Sedayu RT 02/05, Jumantono, Karanganyar"
              value={form.alamat}
              onChange={set("alamat")}
            />
          </div>

          {/* MapPicker — reuse dari admin, sudah ada input + GPS button */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-foreground">
              Koordinat & Lokasi di Peta{" "}
              <span className="text-[11px] font-normal text-muted-foreground">
                (opsional — bisa dilengkapi admin setelah disetujui)
              </span>
            </label>
            <MapPicker
              lat={lat}
              lng={lng}
              onChange={(newLat, newLng) => {
                setLat(newLat)
                setLng(newLng)
              }}
            />
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════
          SEKSI 4: Foto Usaha
      ══════════════════════════════════════════ */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <SeksiHeader
          nomor={4}
          judul="Foto Usaha"
          deskripsi="Upload foto produk atau tempat usaha (JPG/PNG, maks 5 MB per foto)"
        />
        <div className="grid grid-cols-3 gap-3">
          <FotoSlot label="Foto Utama" value={foto1} onChange={setFoto1} required />
          <FotoSlot label="Foto 2"     value={foto2} onChange={setFoto2} />
          <FotoSlot label="Foto 3"     value={foto3} onChange={setFoto3} />
        </div>
        <p className="mt-2 text-[11px] text-muted-foreground">
          * Foto utama wajib. Foto 2 dan 3 opsional.
        </p>
      </div>

      {/* ══════════════════════════════════════════
          SEKSI 5: Catatan
      ══════════════════════════════════════════ */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <SeksiHeader
          nomor={5}
          judul="Catatan Tambahan"
          deskripsi="Informasi lain yang ingin disampaikan (opsional)"
        />
        <textarea
          rows={3}
          className={textareaCls}
          placeholder="Opsional. Sampaikan hal lain yang perlu diketahui tim kami..."
          value={form.catatan}
          onChange={set("catatan")}
        />
      </div>

      {/* ══════════════════════════════════════════
          SUBMIT
      ══════════════════════════════════════════ */}
      <div className="rounded-2xl border border-primary/20 bg-primary/5 p-6">
        <p className="mb-4 text-sm text-muted-foreground">
          Dengan mengirim formulir ini, Anda menyetujui data usaha akan
          ditampilkan di website Potensi Desa Sedayu setelah melalui proses
          review oleh tim kami.
        </p>
        <Button
          type="submit"
          disabled={submitting}
          className="h-12 w-full text-base font-bold"
        >
          {submitting ? (
            <>
              <Loader2 className="mr-2 size-4 animate-spin" />
              Mengirim Pengajuan...
            </>
          ) : (
            <>
              <Upload className="mr-2 size-4" />
              Kirim Pengajuan UMKM
              <ChevronRight className="ml-2 size-4" />
            </>
          )}
        </Button>
      </div>
    </form>
  )
}