"use client"

import { useState, type FormEvent } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { ImageUpload } from "@/components/admin/image-upload"
import { Loader2, Save, CheckCircle2, Image as ImageIcon } from "lucide-react"

type ProfilRow = { [key: string]: any } | null
type KontakRow = { [key: string]: any } | null

function ProfilForm({ initial }: { initial: ProfilRow }) {
  const [luasWilayah,    setLuasWilayah]    = useState<string>(initial?.luas_wilayah     ?? "")
  const [jumlahPenduduk, setJumlahPenduduk] = useState<string>(
    initial?.jumlah_penduduk != null ? String(initial.jumlah_penduduk) : ""
  )
  const [sejarah,      setSejarah]      = useState<string>(initial?.sejarah       ?? "")
  const [visi,         setVisi]         = useState<string>(initial?.visi          ?? "")
  const [misi,         setMisi]         = useState<string>(initial?.misi          ?? "")
  const [batasWilayah, setBatasWilayah] = useState<string>(initial?.batas_wilayah ?? "")

  // ✅ 5 foto hero
  const [foto1, setFoto1] = useState<string | null>(initial?.foto_hero_1 ?? null)
  const [foto2, setFoto2] = useState<string | null>(initial?.foto_hero_2 ?? null)
  const [foto3, setFoto3] = useState<string | null>(initial?.foto_hero_3 ?? null)
  const [foto4, setFoto4] = useState<string | null>(initial?.foto_hero_4 ?? null)
  const [foto5, setFoto5] = useState<string | null>(initial?.foto_hero_5 ?? null)

  const [saving,  setSaving]  = useState(false)
  const [success, setSuccess] = useState(false)
  const [error,   setError]   = useState("")

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSaving(true); setError(""); setSuccess(false)

    const supabase = createClient()
    const { error: err } = await supabase.from("profil_desa").upsert({
      id:               1,
      luas_wilayah:     luasWilayah.trim()    || null,
      jumlah_penduduk:  jumlahPenduduk.trim() ? Number(jumlahPenduduk) : null,
      sejarah:          sejarah.trim()        || null,
      visi:             visi.trim()           || null,
      misi:             misi.trim()           || null,
      batas_wilayah:    batasWilayah.trim()   || null,
      foto_hero_1:      foto1,
      foto_hero_2:      foto2,
      foto_hero_3:      foto3,
      foto_hero_4:      foto4,
      foto_hero_5:      foto5,
    })

    setSaving(false)
    if (err) { setError("Gagal menyimpan: " + err.message); return }
    setSuccess(true)
    setTimeout(() => setSuccess(false), 3000)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error   && <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</p>}
      {success && (
        <p className="flex items-center gap-2 rounded-lg bg-green-50 px-3 py-2 text-sm text-green-700 dark:bg-green-950/30 dark:text-green-400">
          <CheckCircle2 className="size-4" /> Profil desa berhasil disimpan.
        </p>
      )}

      {/* ✅ 5 Foto Hero */}
      <div className="rounded-xl border border-border bg-secondary/30 p-4">
        <div className="mb-1 flex items-center gap-2">
          <ImageIcon className="size-4 text-primary" strokeWidth={1.5} />
          <p className="text-sm font-semibold text-foreground">Foto Hero Landing Page</p>
        </div>
        <p className="mb-4 text-xs text-muted-foreground">
          Maks 5 foto — tampil bergantian di hero section & halaman Profil Desa. Gunakan foto landscape berkualitas tinggi.
        </p>
        {/* Baris 1: 2 foto */}
        <div className="grid grid-cols-2 gap-3">
          <ImageUpload bucket="foto-hero" value={foto1} onChange={setFoto1} label="Foto 1" />
          <ImageUpload bucket="foto-hero" value={foto2} onChange={setFoto2} label="Foto 2" />
        </div>
        {/* Baris 2: 2 foto */}
        <div className="mt-3 grid grid-cols-2 gap-3">
          <ImageUpload bucket="foto-hero" value={foto3} onChange={setFoto3} label="Foto 3" />
          <ImageUpload bucket="foto-hero" value={foto4} onChange={setFoto4} label="Foto 4" />
        </div>
        {/* Baris 3: 1 foto (full width tapi dibatasi) */}
        <div className="mt-3 max-w-[calc(50%-6px)]">
          <ImageUpload bucket="foto-hero" value={foto5} onChange={setFoto5} label="Foto 5" />
        </div>
      </div>

      {/* Data Desa */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-foreground">Luas Wilayah</label>
          <Input value={luasWilayah} onChange={(e) => setLuasWilayah(e.target.value)} placeholder="mis. 427,5 Ha" />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-foreground">Jumlah Penduduk</label>
          <Input type="number" min={0} value={jumlahPenduduk} onChange={(e) => setJumlahPenduduk(e.target.value)} placeholder="mis. 3200" />
        </div>
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-foreground">Sejarah & Sekilas Desa</label>
        <Textarea rows={5} value={sejarah} onChange={(e) => setSejarah(e.target.value)} placeholder="Ceritakan sejarah Desa Sedayu..." />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-foreground">Visi</label>
          <Textarea rows={4} value={visi} onChange={(e) => setVisi(e.target.value)} placeholder="Visi desa..." />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-foreground">
            Misi <span className="ml-1 text-[11px] font-normal text-muted-foreground">(1 baris = 1 poin)</span>
          </label>
          <Textarea rows={4} value={misi} onChange={(e) => setMisi(e.target.value)} placeholder={"Misi 1\nMisi 2\n..."} />
        </div>
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-foreground">
          Batas Wilayah <span className="ml-1 text-[11px] font-normal text-muted-foreground">(1 baris = 1 batas)</span>
        </label>
        <Textarea rows={4} value={batasWilayah} onChange={(e) => setBatasWilayah(e.target.value)} placeholder={"Utara: ...\nSelatan: ...\nBarat: ...\nTimur: ..."} />
      </div>

      <div className="flex justify-end border-t border-border pt-4">
        <Button type="submit" disabled={saving} className="gap-2">
          {saving ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
          {saving ? "Menyimpan..." : "Simpan Profil Desa"}
        </Button>
      </div>
    </form>
  )
}

function KontakForm({ initial }: { initial: KontakRow }) {
  const [email,   setEmail]   = useState<string>(initial?.email   ?? "")
  const [telepon, setTelepon] = useState<string>(initial?.telepon != null ? String(initial.telepon) : "")
  const [alamat,  setAlamat]  = useState<string>(initial?.alamat  ?? "")
  const [saving,  setSaving]  = useState(false)
  const [success, setSuccess] = useState(false)
  const [error,   setError]   = useState("")

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSaving(true); setError(""); setSuccess(false)
    const supabase = createClient()
    const { error: err } = await supabase.from("kontak_desa").upsert({
      id: 1, email: email.trim() || null, telepon: telepon.trim() || null, alamat: alamat.trim() || null,
    })
    setSaving(false)
    if (err) { setError("Gagal menyimpan: " + err.message); return }
    setSuccess(true); setTimeout(() => setSuccess(false), 3000)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error   && <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</p>}
      {success && (
        <p className="flex items-center gap-2 rounded-lg bg-green-50 px-3 py-2 text-sm text-green-700 dark:bg-green-950/30 dark:text-green-400">
          <CheckCircle2 className="size-4" /> Kontak desa berhasil disimpan.
        </p>
      )}
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-foreground">Email</label>
          <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="desasedayu@example.com" />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-foreground">Telepon</label>
          <Input value={telepon} onChange={(e) => setTelepon(e.target.value)} placeholder="mis. 0271-xxxxxxx" />
        </div>
      </div>
      <div>
        <label className="mb-1.5 block text-sm font-medium text-foreground">Alamat Kantor Desa</label>
        <Textarea rows={3} value={alamat} onChange={(e) => setAlamat(e.target.value)} placeholder="Jalan, Dukuh, Kecamatan, Kabupaten" />
      </div>
      <div className="flex justify-end border-t border-border pt-4">
        <Button type="submit" disabled={saving} className="gap-2">
          {saving ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
          {saving ? "Menyimpan..." : "Simpan Kontak Desa"}
        </Button>
      </div>
    </form>
  )
}

export function PengaturanForm({ profil, kontak }: { profil: ProfilRow; kontak: KontakRow }) {
  return (
    <div className="space-y-10">
      <section className="rounded-2xl border border-border bg-card p-6">
        <h2 className="mb-5 font-serif text-xl text-foreground">Profil Desa</h2>
        <ProfilForm initial={profil} />
      </section>
      <section className="rounded-2xl border border-border bg-card p-6">
        <h2 className="mb-5 font-serif text-xl text-foreground">Kontak Desa</h2>
        <KontakForm initial={kontak} />
      </section>
    </div>
  )
}
