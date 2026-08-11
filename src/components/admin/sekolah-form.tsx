"use client"

import { useState, type FormEvent } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { ImageUpload } from "@/components/admin/image-upload"
import { MapPicker } from "@/components/admin/map-picker"
import { Loader2, Save } from "lucide-react"

type SekolahRow = { [key: string]: any }

const JENJANG_OPT    = ["TK", "SD", "SMP", "SMA", "SMK", "SLB"]
const STATUS_OPT     = ["Negeri", "Swasta"]
const AKREDITASI_OPT = ["A", "B", "C", "Belum Terakreditasi"]

const selectCls =
  "h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm text-foreground shadow-sm " +
  "focus:outline-none focus:ring-2 focus:ring-ring"

export function SekolahForm({ initial }: { initial: SekolahRow | null }) {
  const router = useRouter()
  const isEdit = Boolean(initial)

  const [nama,          setNama]         = useState(initial?.nama           ?? "")
  const [npsn,          setNpsn]         = useState(initial?.npsn           ?? "")
  const [jenjang,       setJenjang]      = useState(initial?.jenjang        ?? "")
  const [status,        setStatus]       = useState(initial?.status         ?? "")
  const [akreditasi,    setAkreditasi]   = useState(initial?.akreditasi     ?? "")
  const [deskripsi,     setDeskripsi]    = useState(initial?.deskripsi      ?? "")
  const [alamat,        setAlamat]       = useState(initial?.alamat         ?? "")
  const [kepala,        setKepala]       = useState(initial?.kepala_sekolah ?? "")
  const [tahun,         setTahun]        = useState(
    initial?.tahun_berdiri != null ? String(initial.tahun_berdiri) : ""
  )
  const [kontak,        setKontak]       = useState(initial?.kontak   ?? "")
  const [website,       setWebsite]      = useState(initial?.website  ?? "")
  const [lat,           setLat]          = useState(
    initial?.latitude  != null ? String(initial.latitude)  : ""
  )
  const [lng,           setLng]          = useState(
    initial?.longitude != null ? String(initial.longitude) : ""
  )
  const [foto1,         setFoto1]        = useState<string | null>(initial?.foto_url   ?? null)
  const [foto2,         setFoto2]        = useState<string | null>(initial?.foto_url_2 ?? null)
  const [foto3,         setFoto3]        = useState<string | null>(initial?.foto_url_3 ?? null)
  const [unggulan,      setUnggulan]     = useState(Boolean(initial?.is_unggulan))
  const [aktif,         setAktif]        = useState(initial?.is_aktif ?? true)
  const [saving,        setSaving]       = useState(false)
  const [error,         setError]        = useState("")

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSaving(true)
    setError("")

    const toNum = (v: string) => {
      const n = Number(v.trim())
      return v.trim() && Number.isFinite(n) ? n : null
    }

    const payload = {
      nama:           nama.trim(),
      npsn:           npsn.trim()    || null,
      jenjang:        jenjang        || null,
      status:         status         || null,
      akreditasi:     akreditasi     || null,
      deskripsi:      deskripsi.trim()  || null,
      alamat:         alamat.trim()     || null,
      kepala_sekolah: kepala.trim()     || null,
      tahun_berdiri:  toNum(tahun),
      kontak:         kontak.trim()     || null,
      website:        website.trim()    || null,
      latitude:       toNum(lat),
      longitude:      toNum(lng),
      foto_url:       foto1,
      foto_url_2:     foto2,
      foto_url_3:     foto3,
      is_unggulan:    unggulan,
      is_aktif:       aktif,
    }

    const supabase = createClient()
    const res = isEdit
      ? await supabase.from("sekolah").update(payload).eq("id", initial!.id)
      : await supabase.from("sekolah").insert(payload)

    setSaving(false)
    if (res.error) { setError("Gagal menyimpan: " + res.error.message); return }
    router.push("/admin/sekolah")
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</p>
      )}

      <div className="grid gap-5 sm:grid-cols-2">
        {/* Nama */}
        <div className="sm:col-span-2">
          <label className="mb-1.5 block text-sm font-medium text-foreground">
            Nama Sekolah <span className="text-destructive">*</span>
          </label>
          <Input required value={nama} onChange={(e) => setNama(e.target.value)}
            placeholder="mis. SD Negeri 1 Sedayu" />
        </div>

        {/* NPSN */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-foreground">NPSN</label>
          <Input value={npsn} onChange={(e) => setNpsn(e.target.value)}
            placeholder="8 digit" maxLength={8} />
        </div>

        {/* Jenjang */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-foreground">
            Jenjang <span className="text-destructive">*</span>
          </label>
          <select required value={jenjang} onChange={(e) => setJenjang(e.target.value)} className={selectCls}>
            <option value="">- Pilih jenjang -</option>
            {JENJANG_OPT.map((j) => <option key={j} value={j}>{j}</option>)}
          </select>
        </div>

        {/* Status */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-foreground">Status</label>
          <select value={status} onChange={(e) => setStatus(e.target.value)} className={selectCls}>
            <option value="">- Pilih status -</option>
            {STATUS_OPT.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        {/* Akreditasi */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-foreground">Akreditasi</label>
          <select value={akreditasi} onChange={(e) => setAkreditasi(e.target.value)} className={selectCls}>
            <option value="">- Pilih akreditasi -</option>
            {AKREDITASI_OPT.map((a) => <option key={a} value={a}>{a}</option>)}
          </select>
        </div>

        {/* Kepala Sekolah */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-foreground">Kepala Sekolah</label>
          <Input value={kepala} onChange={(e) => setKepala(e.target.value)}
            placeholder="Nama kepala sekolah" />
        </div>

        {/* Tahun Berdiri */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-foreground">Tahun Berdiri</label>
          <Input type="number" value={tahun} onChange={(e) => setTahun(e.target.value)}
            placeholder="mis. 1975" min={1900} max={new Date().getFullYear()} />
        </div>

        {/* Deskripsi */}
        <div className="sm:col-span-2">
          <label className="mb-1.5 block text-sm font-medium text-foreground">Deskripsi</label>
          <Textarea value={deskripsi} onChange={(e) => setDeskripsi(e.target.value)}
            rows={4} placeholder="Ceritakan tentang sekolah ini secara singkat..." />
        </div>

        {/* Alamat */}
        <div className="sm:col-span-2">
          <label className="mb-1.5 block text-sm font-medium text-foreground">Alamat</label>
          <Input value={alamat} onChange={(e) => setAlamat(e.target.value)}
            placeholder="Jalan, Dukuh, RT/RW" />
        </div>

        {/* Kontak */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-foreground">Kontak</label>
          <Input value={kontak} onChange={(e) => setKontak(e.target.value)}
            placeholder="No. telepon atau WA" />
        </div>

        {/* Website */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-foreground">Website</label>
          <Input type="url" value={website} onChange={(e) => setWebsite(e.target.value)}
            placeholder="https://..." />
        </div>
      </div>

      {/* Map */}
      <div>
        <p className="mb-2 text-sm font-medium text-foreground">Lokasi (klik peta)</p>
        <MapPicker lat={lat} lng={lng} onChange={(la, ln) => { setLat(la); setLng(ln) }} />
      </div>

      {/* Foto */}
      <div>
        <p className="mb-2 text-sm font-medium text-foreground">Foto (maks. 3)</p>
        <div className="grid gap-4 sm:grid-cols-3">
          <ImageUpload bucket="foto-sekolah" value={foto1} onChange={setFoto1} label="Foto utama" />
          <ImageUpload bucket="foto-sekolah" value={foto2} onChange={setFoto2} label="Foto 2"     />
          <ImageUpload bucket="foto-sekolah" value={foto3} onChange={setFoto3} label="Foto 3"     />
        </div>
      </div>

      {/* Toggles */}
      <div className="flex flex-wrap gap-6">
        <label className="flex items-center gap-2 text-sm text-foreground">
          <input type="checkbox" checked={unggulan} onChange={(e) => setUnggulan(e.target.checked)} className="size-4" />
          Tandai sebagai Unggulan
        </label>
        <label className="flex items-center gap-2 text-sm text-foreground">
          <input type="checkbox" checked={aktif} onChange={(e) => setAktif(e.target.checked)} className="size-4" />
          Aktif (tampil di web)
        </label>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3 border-t border-border pt-5">
        <Button type="submit" disabled={saving} className="gap-2">
          {saving ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
          {saving ? "Menyimpan..." : isEdit ? "Simpan Perubahan" : "Tambah Sekolah"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.push("/admin/sekolah")}>
          Batal
        </Button>
      </div>
    </form>
  )
}