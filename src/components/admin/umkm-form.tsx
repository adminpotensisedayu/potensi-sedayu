"use client"
import { useState, useEffect, useRef, type FormEvent } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { ImageUpload } from "@/components/admin/image-upload"
import { MapPicker } from "@/components/admin/map-picker"
import { Loader2, Save, Clock } from "lucide-react"

type Kategori    = { id: string; nama: string }
type SubKategori = { id: string; nama: string }
type UmkmRow     = { [key: string]: any }

/** Parse "08:00 - 20:00" or "08.00 - 20.00" → { start, end } */
function parseJam(jam: string): { start: string; end: string } {
  if (!jam) return { start: "08:00", end: "17:00" }
  const normalized = jam.replace(/\./g, ":")
  const parts = normalized.split(/\s*[-–]\s*/)
  const fmt = (t: string) => (t ?? "").trim().substring(0, 5)
  return { start: fmt(parts[0]) || "08:00", end: fmt(parts[1]) || "17:00" }
}

export function UmkmForm({
  kategori,
  initial,
}: {
  kategori: Kategori[]
  initial: UmkmRow | null
}) {
  const router  = useRouter()
  const isEdit  = Boolean(initial)
  const isMount = useRef(true)

  const parsed = parseJam(initial?.jam_operasional ?? "")

  // — Field states —
  const [nama,       setNama]      = useState<string>(initial?.nama_usaha       ?? "")
  const [kategoriId, setKategoriId]= useState<string>(initial?.kategori_id      ? String(initial.kategori_id) : "")
  const [subKatId,   setSubKatId]  = useState<string>(initial?.sub_kategori_id  ? String(initial.sub_kategori_id) : "")
  const [deskripsi,  setDeskripsi] = useState<string>(initial?.deskripsi        ?? "")
  const [alamat,     setAlamat]    = useState<string>(initial?.alamat            ?? "")
  const [whatsapp,   setWhatsapp]  = useState<string>(initial?.whatsapp          ?? "")
  const [jamStart,   setJamStart]  = useState<string>(parsed.start)
  const [jamEnd,     setJamEnd]    = useState<string>(parsed.end)
  const [lat,        setLat]       = useState<string>(initial?.latitude  != null ? String(initial.latitude)  : "")
  const [lng,        setLng]       = useState<string>(initial?.longitude != null ? String(initial.longitude) : "")
  const [foto1,      setFoto1]     = useState<string | null>(initial?.foto_url   ?? null)
  const [foto2,      setFoto2]     = useState<string | null>(initial?.foto_url_2 ?? null)
  const [foto3,      setFoto3]     = useState<string | null>(initial?.foto_url_3 ?? null)
  const [unggulan,   setUnggulan]  = useState<boolean>(Boolean(initial?.is_unggulan))
  const [aktif,      setAktif]     = useState<boolean>(initial?.is_aktif ?? true)

  // — Sub-kategori cascade —
  const [subKategoris,  setSubKategoris]  = useState<SubKategori[]>([])
  const [loadingSubKat, setLoadingSubKat] = useState(false)

  useEffect(() => {
    if (!isMount.current) setSubKatId("")
    isMount.current = false
    if (!kategoriId) { setSubKategoris([]); return }
    setLoadingSubKat(true)
    const supabase = createClient()
    supabase
      .from("sub_kategori")
      .select("id, nama")
      .eq("kategori_id", kategoriId)
      .order("urutan")
      .then(({ data }) => {
        setSubKategoris(data ?? [])
        setLoadingSubKat(false)
      })
  }, [kategoriId]) // eslint-disable-line react-hooks/exhaustive-deps

  // — Submit —
  const [saving, setSaving] = useState(false)
  const [error,  setError]  = useState("")

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSaving(true)
    setError("")

    const latNum = lat.trim() === "" ? null : Number(lat)
    const lngNum = lng.trim() === "" ? null : Number(lng)
    const jamStr = jamStart && jamEnd ? `${jamStart} - ${jamEnd}` : null

    const payload = {
      nama_usaha:      nama.trim(),
      kategori_id:     kategoriId   || null,
      sub_kategori_id: subKatId     || null,
      deskripsi:       deskripsi.trim()  || null,
      alamat:          alamat.trim()     || null,
      whatsapp:        whatsapp.trim()   || null,
      jam_operasional: jamStr,
      latitude:        latNum != null && Number.isFinite(latNum) ? latNum : null,
      longitude:       lngNum != null && Number.isFinite(lngNum) ? lngNum : null,
      foto_url:        foto1,
      foto_url_2:      foto2,
      foto_url_3:      foto3,
      is_unggulan:     unggulan,
      is_aktif:        aktif,
    }

    const supabase = createClient()
    const res = isEdit
      ? await supabase.from("umkm").update(payload).eq("id", initial!.id)
      : await supabase.from("umkm").insert(payload)

    setSaving(false)
    if (res.error) { setError("Gagal menyimpan: " + res.error.message); return }
    router.push("/admin/umkm")
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error ? (
        <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</p>
      ) : null}

      <div className="grid gap-5 sm:grid-cols-2">
        {/* Nama Usaha */}
        <div className="sm:col-span-2">
          <label className="mb-1.5 block text-sm font-medium text-foreground">
            Nama Usaha <span className="text-destructive">*</span>
          </label>
          <Input
            required
            value={nama}
            onChange={(e) => setNama(e.target.value)}
            placeholder="mis. Warung Bu Sri"
          />
        </div>

        {/* Kategori */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-foreground">Kategori</label>
          <select
            value={kategoriId}
            onChange={(e) => setKategoriId(e.target.value)}
            className="h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm text-foreground shadow-sm focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="">- Pilih kategori -</option>
            {kategori.map((k) => (
              <option key={k.id} value={k.id}>{k.nama}</option>
            ))}
          </select>
        </div>

        {/* Sub-Kategori */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-foreground">
            Sub-Kategori
            {loadingSubKat && <span className="ml-2 text-xs text-muted-foreground">memuat...</span>}
          </label>
          <select
            value={subKatId}
            onChange={(e) => setSubKatId(e.target.value)}
            disabled={!kategoriId || loadingSubKat}
            className="h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm text-foreground shadow-sm focus:outline-none focus:ring-2 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value="">
              {!kategoriId ? "- Pilih kategori dulu -" : "- Pilih sub-kategori -"}
            </option>
            {subKategoris.map((s) => (
              <option key={s.id} value={s.id}>{s.nama}</option>
            ))}
          </select>
        </div>

        {/* WhatsApp */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-foreground">No. WhatsApp</label>
          <Input
            value={whatsapp}
            onChange={(e) => setWhatsapp(e.target.value)}
            placeholder="08xxxxxxxxxx"
          />
        </div>

        {/* Jam Operasional — Time Picker */}
        <div>
          <label className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-foreground">
            <Clock className="size-3.5 text-muted-foreground" />
            Jam Operasional
          </label>
          <div className="flex items-center gap-2">
            <input
              type="time"
              value={jamStart}
              onChange={(e) => setJamStart(e.target.value)}
              className="h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm text-foreground shadow-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
            <span className="shrink-0 text-sm text-muted-foreground">s/d</span>
            <input
              type="time"
              value={jamEnd}
              onChange={(e) => setJamEnd(e.target.value)}
              className="h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm text-foreground shadow-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
        </div>

        {/* Deskripsi */}
        <div className="sm:col-span-2">
          <label className="mb-1.5 block text-sm font-medium text-foreground">Deskripsi</label>
          <Textarea
            value={deskripsi}
            onChange={(e) => setDeskripsi(e.target.value)}
            rows={4}
            placeholder="Ceritakan usaha ini secara singkat..."
          />
        </div>

        {/* Alamat */}
        <div className="sm:col-span-2">
          <label className="mb-1.5 block text-sm font-medium text-foreground">Alamat</label>
          <Input
            value={alamat}
            onChange={(e) => setAlamat(e.target.value)}
            placeholder="Dukuh / RT / RW"
          />
        </div>
      </div>

      {/* Map Picker */}
      <div>
        <p className="mb-2 text-sm font-medium text-foreground">Lokasi (klik peta)</p>
        <MapPicker
          lat={lat}
          lng={lng}
          onChange={(la, ln) => { setLat(la); setLng(ln) }}
        />
      </div>

      {/* Foto */}
      <div>
        <p className="mb-2 text-sm font-medium text-foreground">Foto (maks. 3)</p>
        <div className="grid gap-4 sm:grid-cols-3">
          <ImageUpload bucket="foto-umkm" value={foto1} onChange={setFoto1} label="Foto utama" />
          <ImageUpload bucket="foto-umkm" value={foto2} onChange={setFoto2} label="Foto 2"     />
          <ImageUpload bucket="foto-umkm" value={foto3} onChange={setFoto3} label="Foto 3"     />
        </div>
      </div>

      {/* Toggle */}
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
          {saving ? "Menyimpan..." : isEdit ? "Simpan Perubahan" : "Tambah UMKM"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.push("/admin/umkm")}>
          Batal
        </Button>
      </div>
    </form>
  )
}