"use client"

import { useState, type FormEvent } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ImageUpload } from "@/components/admin/image-upload"
import { Loader2, Save } from "lucide-react"

type TimRow = { [key: string]: any }

export function KknTimForm({ initial }: { initial: TimRow | null }) {
  const router = useRouter()
  const isEdit = Boolean(initial)

  const [nama,         setNama]         = useState<string>(initial?.nama           ?? "")
  const [nim,          setNim]          = useState<string>(initial?.nim            ?? "")
  const [divisi,       setDivisi]       = useState<string>(initial?.divisi         ?? "")
  const [programStudi, setProgramStudi] = useState<string>(initial?.program_studi  ?? "")
  const [fakultas,     setFakultas]     = useState<string>(initial?.fakultas       ?? "")
  const [fotoUrl,      setFotoUrl]      = useState<string | null>(initial?.foto_url ?? null)
  const [saving,       setSaving]       = useState(false)
  const [error,        setError]        = useState("")

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSaving(true)
    setError("")

    const payload = {
      nama:          nama.trim(),
      nim:           nim.trim()          || null,
      divisi:        divisi.trim()       || null,
      program_studi: programStudi.trim() || null,
      fakultas:      fakultas.trim()     || null,
      foto_url:      fotoUrl,
    }

    const supabase = createClient()
    const res = isEdit
      ? await supabase.from("tim_kkn").update(payload).eq("id", initial!.id)
      : await supabase.from("tim_kkn").insert(payload)

    setSaving(false)
    if (res.error) { setError("Gagal menyimpan: " + res.error.message); return }
    router.push("/admin/kkn")
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</p>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className="mb-1.5 block text-sm font-medium text-foreground">
            Nama Lengkap <span className="text-destructive">*</span>
          </label>
          <Input required value={nama} onChange={(e) => setNama(e.target.value)} placeholder="mis. Budi Santoso" />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-foreground">NIM</label>
          <Input value={nim} onChange={(e) => setNim(e.target.value)} placeholder="mis. H0521001" />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-foreground">Divisi / Peran</label>
          <Input value={divisi} onChange={(e) => setDivisi(e.target.value)} placeholder="mis. Dokumentasi & Media" />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-foreground">Program Studi</label>
          <Input value={programStudi} onChange={(e) => setProgramStudi(e.target.value)} placeholder="mis. Teknik Informatika" />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-foreground">Fakultas</label>
          <Input value={fakultas} onChange={(e) => setFakultas(e.target.value)} placeholder="mis. FMIPA" />
        </div>
      </div>

      <ImageUpload bucket="foto-tim-kkn" value={fotoUrl} onChange={setFotoUrl} label="Foto Anggota (opsional)" />

      <div className="flex items-center gap-3 border-t border-border pt-5">
        <Button type="submit" disabled={saving} className="gap-2">
          {saving ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
          {saving ? "Menyimpan..." : isEdit ? "Simpan Perubahan" : "Tambah Anggota"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.push("/admin/kkn")}>
          Batal
        </Button>
      </div>
    </form>
  )
}
