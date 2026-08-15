"use client"

import { useState, useRef } from "react"
import dynamic from "next/dynamic"
import Image from "next/image"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import {
  User, Phone, Mail, Store, Tag, FileText, MapPin,
  Camera, CheckCircle2, AlertCircle, Clock,
  Loader2, Upload, X, ChevronDown, Info, Sparkles,
} from "lucide-react"

// ── Map picker dimuat client-side only ──
const MapPicker = dynamic(
  () => import("./map-picker").then((m) => m.MapPicker),
  {
    ssr: false,
    loading: () => (
      <div className="h-[340px] animate-pulse rounded-xl bg-muted flex items-center justify-center text-sm text-muted-foreground">
        Memuat peta...
      </div>
    ),
  }
)

// ── Types ──
type Kategori    = { id: string; nama: string }
type SubKategori = { id: string; nama: string; kategori_id: string }
type Props = {
  kategoriList:    Kategori[]
  subKategoriList: SubKategori[]
  waNumber?:       string
}

// ── Photo upload mini ──
function PhotoUpload({ value, onChange, label, index }: {
  value: string | null; onChange: (v: string | null) => void; label: string; index: number
}) {
  const inputRef   = useRef<HTMLInputElement>(null)
  const [loading, setLoading] = useState(false)
  const supabase = createClient()

  async function handleFile(file: File) {
    if (!file.type.startsWith("image/"))    { alert("Hanya file gambar."); return }
    if (file.size > 5 * 1024 * 1024)       { alert("Maks 5MB per foto."); return }
    setLoading(true)
    const ext  = file.name.split(".").pop()
    const path = "pengajuan-" + Date.now() + "-" + index + "." + ext
    const { error } = await supabase.storage.from("foto-pengajuan").upload(path, file, { upsert: true })
    if (error) { alert("Gagal upload: " + error.message); setLoading(false); return }
    const { data } = supabase.storage.from("foto-pengajuan").getPublicUrl(path)
    onChange(data.publicUrl)
    setLoading(false)
  }

  return (
    <div className="group relative">
      <input ref={inputRef} type="file" accept="image/*" className="hidden"
        onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])} />
      {value ? (
        <div className="relative aspect-[4/3] overflow-hidden rounded-xl border border-border bg-muted">
          <Image src={value} alt={label} fill className="object-cover" unoptimized />
          <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/0 opacity-0 transition group-hover:bg-black/40 group-hover:opacity-100">
            <button type="button" onClick={() => inputRef.current?.click()}
              className="flex size-8 items-center justify-center rounded-full bg-white/90 text-foreground transition hover:bg-white">
              <Upload className="size-3.5" />
            </button>
            <button type="button" onClick={() => onChange(null)}
              className="flex size-8 items-center justify-center rounded-full bg-white/90 text-destructive transition hover:bg-white">
              <X className="size-3.5" />
            </button>
          </div>
        </div>
      ) : (
        <button type="button" onClick={() => inputRef.current?.click()}
          className="flex aspect-[4/3] w-full flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border bg-muted/30 text-muted-foreground transition hover:border-primary/40 hover:bg-muted/60">
          {loading
            ? <Loader2 className="size-5 animate-spin text-primary" />
            : <><Camera className="size-5" /><span className="text-xs font-medium">{label}</span><span className="text-[10px] opacity-60">Maks 5MB</span></>}
        </button>
      )}
    </div>
  )
}

// ── Section wrapper ──
function Section({ icon: Icon, title, desc, color, children }: {
  icon: any; title: string; desc: string; color: string; children: React.ReactNode
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-6">
      <div className="mb-5 flex items-center gap-3">
        <div className={"flex size-9 items-center justify-center rounded-xl " + color}>
          <Icon className="size-4" />
        </div>
        <div>
          <h2 className="font-semibold text-foreground">{title}</h2>
          <p className="text-xs text-muted-foreground">{desc}</p>
        </div>
      </div>
      {children}
    </div>
  )
}

const inputCls    = "w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/25 transition"
const selectCls   = inputCls + " appearance-none cursor-pointer"

function Field({ label, required, hint, children }: {
  label: string; required?: boolean; hint?: string; children: React.ReactNode
}) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-foreground">
        {label} {required && <span className="text-destructive">*</span>}
      </label>
      {children}
      {hint && <p className="mt-1 text-[11px] text-muted-foreground">{hint}</p>}
    </div>
  )
}

// ════════════════════════════════════════════════
// MAIN COMPONENT
// ════════════════════════════════════════════════
export function PengajuanForm({ kategoriList, subKategoriList, waNumber = "" }: Props) {
  const [namaPemilik,  setNamaPemilik]  = useState("")
  const [namaUsaha,    setNamaUsaha]    = useState("")
  const [whatsapp,     setWhatsapp]     = useState("")
  const [email,        setEmail]        = useState("")
  const [kategoriId,   setKategoriId]   = useState("")
  const [subKatId,     setSubKatId]     = useState("")
  const [deskripsi,    setDeskripsi]    = useState("")
  const [alamat,       setAlamat]       = useState("")
  const [jamOps,       setJamOps]       = useState("")
  const [latitude,     setLatitude]     = useState("")
  const [longitude,    setLongitude]    = useState("")
  const [foto1,        setFoto1]        = useState<string | null>(null)
  const [foto2,        setFoto2]        = useState<string | null>(null)
  const [foto3,        setFoto3]        = useState<string | null>(null)
  const [memilikiIzin, setMemilikiIzin] = useState(false)
  const [catatan,      setCatatan]      = useState("")

  const [submitting, setSubmitting] = useState(false)
  const [success,    setSuccess]    = useState(false)
  const [error,      setError]      = useState("")

  const selectedKat   = kategoriList.find((k) => k.id === kategoriId)
  const filteredSubKat = kategoriId
    ? subKategoriList.filter((s) => s.kategori_id === kategoriId)
    : []

  function handleKategoriChange(val: string) {
    setKategoriId(val)
    setSubKatId("")
  }

  function resetForm() {
    setNamaPemilik(""); setNamaUsaha(""); setWhatsapp(""); setEmail("")
    setKategoriId(""); setSubKatId(""); setDeskripsi(""); setAlamat("")
    setJamOps(""); setLatitude(""); setLongitude("")
    setFoto1(null); setFoto2(null); setFoto3(null)
    setMemilikiIzin(false); setCatatan(""); setError("")
  }

  const waLink = (() => {
    const clean = waNumber.replace(/[\s\-().+]/g, "")
    if (clean.startsWith("0")) return "62" + clean.slice(1)
    return clean
  })()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    if (!namaPemilik.trim())  { setError("Nama pemilik wajib diisi.");        return }
    if (!namaUsaha.trim())    { setError("Nama usaha wajib diisi.");           return }
    if (!whatsapp.trim())     { setError("Nomor WhatsApp wajib diisi.");       return }
    if (!kategoriId)          { setError("Kategori usaha wajib dipilih.");     return }
    if (!foto1)               { setError("Minimal 1 foto usaha harus diupload."); return }

    setSubmitting(true)
    const supabase = createClient()
    const { error: err } = await supabase.from("pengajuan_umkm").insert({
      nama_pemilik:      namaPemilik.trim(),
      nama_usaha:        namaUsaha.trim(),
      whatsapp:          whatsapp.trim(),
      email:             email.trim()      || null,
      kategori_nama:     selectedKat?.nama ?? "",
      sub_kategori_nama: subKategoriList.find((s) => s.id === subKatId)?.nama ?? null,
      deskripsi:         deskripsi.trim()  || null,
      alamat:            alamat.trim()     || null,
      jam_operasional:   jamOps.trim()     || null,
      latitude:          latitude  ? parseFloat(latitude)  : null,
      longitude:         longitude ? parseFloat(longitude) : null,
      foto_url:          foto1,
      foto_url_2:        foto2,
      foto_url_3:        foto3,
      memiliki_izin:     memilikiIzin,
      catatan:           catatan.trim()    || null,
      status:            "menunggu",
    })
    setSubmitting(false)
    if (err) { setError("Gagal mengirim: " + err.message); return }
    setSuccess(true)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  // ── SUCCESS ──
  if (success) {
    return (
      <div className="flex flex-col items-center py-16 text-center">
        <div className="relative mb-6">
          <div className="flex size-24 items-center justify-center rounded-full bg-green-100 dark:bg-green-950/40">
            <CheckCircle2 className="size-12 text-green-500" />
          </div>
          <div className="absolute -right-1 -top-1 flex size-8 items-center justify-center rounded-full bg-amber-400">
            <Sparkles className="size-4 text-white" />
          </div>
        </div>
        <h2 className="mb-2 font-serif text-2xl text-foreground">Pengajuan Berhasil!</h2>
        <p className="mb-1 text-muted-foreground">
          Terima kasih, <strong className="text-foreground">{namaPemilik}</strong>!
        </p>
        <p className="mb-8 max-w-sm text-sm text-muted-foreground">
          Pengajuan <strong className="text-foreground">{namaUsaha}</strong> sedang kami tinjau.
          Kami akan menghubungi Anda di WhatsApp{" "}
          <strong className="text-foreground">{whatsapp}</strong> dalam 1–3 hari kerja.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <button onClick={() => { setSuccess(false); resetForm() }}
            className="rounded-xl border border-border bg-background px-5 py-2.5 text-sm font-semibold text-foreground transition hover:bg-muted">
            Daftarkan Usaha Lain
          </button>
          <Link href="/umkm"
            className="rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition hover:opacity-90">
            Lihat Direktori UMKM →
          </Link>
        </div>
      </div>
    )
  }

  // ── FORM ──
  return (
    <form onSubmit={handleSubmit} className="space-y-6">

      {error && (
        <div className="flex items-start gap-3 rounded-xl border border-destructive/20 bg-destructive/8 px-4 py-3 text-sm text-destructive">
          <AlertCircle className="mt-0.5 size-4 shrink-0" />{error}
        </div>
      )}

      {/* ── 1. Pemilik ── */}
      <Section icon={User} title="Informasi Pemilik" desc="Data diri pemilik usaha"
        color="bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Nama Lengkap" required>
            <input type="text" value={namaPemilik} onChange={(e) => setNamaPemilik(e.target.value)}
              placeholder="Nama lengkap Anda" className={inputCls} />
          </Field>
          <Field label="Nomor WhatsApp" required hint="Contoh: 08123456789">
            <input type="tel" value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)}
              placeholder="08xx-xxxx-xxxx" className={inputCls} />
          </Field>
          <div className="sm:col-span-2">
            <Field label="Email" hint="Opsional">
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                placeholder="email@contoh.com" className={inputCls} />
            </Field>
          </div>
        </div>
      </Section>

      {/* ── 2. Usaha ── */}
      <Section icon={Store} title="Informasi Usaha" desc="Detail usaha yang ingin didaftarkan"
        color="bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400">
        <div className="space-y-4">
          <Field label="Nama Usaha" required>
            <input type="text" value={namaUsaha} onChange={(e) => setNamaUsaha(e.target.value)}
              placeholder="Nama usaha / toko Anda" className={inputCls} />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Kategori" required>
              <div className="relative">
                <select value={kategoriId} onChange={(e) => handleKategoriChange(e.target.value)} className={selectCls}>
                  <option value="">— Pilih Kategori —</option>
                  {kategoriList.map((k) => <option key={k.id} value={k.id}>{k.nama}</option>)}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              </div>
            </Field>
            <Field label="Sub Kategori" hint="Opsional">
              <div className="relative">
                <select value={subKatId} onChange={(e) => setSubKatId(e.target.value)}
                  disabled={filteredSubKat.length === 0}
                  className={selectCls + (filteredSubKat.length === 0 ? " opacity-50" : "")}>
                  <option value="">— Pilih Sub Kategori —</option>
                  {filteredSubKat.map((s) => <option key={s.id} value={s.id}>{s.nama}</option>)}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              </div>
            </Field>
          </div>
          <Field label="Deskripsi Usaha">
            <textarea rows={4} value={deskripsi} onChange={(e) => setDeskripsi(e.target.value)}
              placeholder="Ceritakan produk/layanan, keunikan, atau keunggulan usaha Anda..."
              className={inputCls + " resize-none"} />
            <div className="mt-1 flex justify-end">
              <span className={"text-[10px] " + (deskripsi.length > 450 ? "text-amber-500" : "text-muted-foreground")}>
                {deskripsi.length}/500
              </span>
            </div>
          </Field>
          <Field label="Jam Operasional" hint="Contoh: Senin–Sabtu, 08.00–17.00 WIB">
            <div className="relative">
              <Clock className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <input type="text" value={jamOps} onChange={(e) => setJamOps(e.target.value)}
                placeholder="Senin–Sabtu, 08.00–17.00 WIB" className={inputCls + " pl-10"} />
            </div>
          </Field>
        </div>
      </Section>

      {/* ── 3. Lokasi ── */}
      <Section icon={MapPin} title="Lokasi Usaha"
        desc="Isi koordinat manual · gunakan GPS · atau klik langsung di peta"
        color="bg-green-50 text-green-600 dark:bg-green-950/40 dark:text-green-400">
        <div className="space-y-4">
          <Field label="Alamat Lengkap" hint="RT/RW, Dukuh, Kelurahan — semakin detail semakin baik">
            <textarea rows={2} value={alamat} onChange={(e) => setAlamat(e.target.value)}
              placeholder="Contoh: RT 02/RW 01, Dukuh Sedayu, Kec. Jumantono"
              className={inputCls + " resize-none"} />
          </Field>
          <div>
            <label className="mb-2 block text-sm font-medium text-foreground">
              Koordinat{" "}
              <span className="ml-1 text-xs font-normal text-muted-foreground">
                (opsional — untuk pin di peta desa)
              </span>
            </label>
            <MapPicker
              lat={latitude}
              lng={longitude}
              onChange={(la, lo) => { setLatitude(la); setLongitude(lo) }}
            />
          </div>
        </div>
      </Section>

      {/* ── 4. Foto ── */}
      <Section icon={Camera} title="Foto Usaha"
        desc="Minimal 1 foto wajib · Maks 3 foto · JPG / PNG / WEBP"
        color="bg-purple-50 text-purple-600 dark:bg-purple-950/40 dark:text-purple-400">
        <div className="grid grid-cols-3 gap-3">
          <PhotoUpload value={foto1} onChange={setFoto1} label="Foto 1 *" index={1} />
          <PhotoUpload value={foto2} onChange={setFoto2} label="Foto 2"   index={2} />
          <PhotoUpload value={foto3} onChange={setFoto3} label="Foto 3"   index={3} />
        </div>
        <p className="mt-3 text-xs text-muted-foreground">
          💡 Tips: gunakan foto tampak depan, produk unggulan, atau suasana toko.
        </p>
      </Section>

      {/* ── 5. Kelengkapan ── */}
      <Section icon={FileText} title="Kelengkapan &amp; Catatan"
        desc="Informasi tambahan untuk proses verifikasi"
        color="bg-orange-50 text-orange-600 dark:bg-orange-950/40 dark:text-orange-400">
        <div className="space-y-4">
          <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-border bg-background/50 p-4 transition hover:bg-muted/40">
            <input type="checkbox" checked={memilikiIzin} onChange={(e) => setMemilikiIzin(e.target.checked)}
              className="mt-0.5 size-4 accent-primary" />
            <div>
              <p className="text-sm font-medium text-foreground">Memiliki izin usaha (NIB / SIUP / SKU)</p>
              <p className="text-xs text-muted-foreground">Centang jika usaha Anda sudah memiliki dokumen perizinan resmi</p>
            </div>
          </label>
          <Field label="Catatan Tambahan" hint="Pesan untuk tim peninjau (opsional)">
            <textarea rows={3} value={catatan} onChange={(e) => setCatatan(e.target.value)}
              placeholder="Ada hal khusus yang ingin disampaikan ke tim kami?"
              className={inputCls + " resize-none"} />
          </Field>
        </div>
      </Section>

      {/* ── Submit ── */}
      <div className="space-y-4 rounded-2xl border border-border bg-card p-6">
        <div className="flex items-start gap-3 rounded-xl bg-muted/40 p-3">
          <Info className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
          <p className="text-xs leading-relaxed text-muted-foreground">
            Dengan mengirim formulir ini, Anda menyatakan bahwa informasi yang diberikan adalah
            benar dan akurat. Data Anda hanya digunakan untuk keperluan direktori Desa Sedayu.
          </p>
        </div>
        <button type="submit" disabled={submitting}
          className="group relative flex w-full items-center justify-center gap-3 overflow-hidden rounded-xl bg-gradient-to-r from-teal-600 to-emerald-500 px-6 py-4 text-sm font-bold text-white shadow-[0_8px_24px_-8px_rgba(13,148,136,0.5)] transition hover:-translate-y-[1px] disabled:cursor-wait disabled:opacity-80">
          <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
          {submitting
            ? <><Loader2 className="size-4 animate-spin" />Mengirim Pengajuan...</>
            : <><Sparkles className="size-4" />Kirim Pengajuan Sekarang</>}
        </button>
        {waLink && (
          <p className="text-center text-xs text-muted-foreground">
            Butuh bantuan?{" "}
            <a href={"https://wa.me/" + waLink} target="_blank" rel="noopener noreferrer"
              className="font-medium text-primary hover:underline">
              Hubungi kami via WhatsApp
            </a>
          </p>
        )}
      </div>
    </form>
  )
}
