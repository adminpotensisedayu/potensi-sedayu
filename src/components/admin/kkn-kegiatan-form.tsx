"use client"

import { useState, type FormEvent } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Loader2, Save } from "lucide-react"

type KegiatanRow = { [key: string]: any }

export function KknKegiatanForm({ initial }: { initial: KegiatanRow | null }) {
  const router = useRouter()
  const isEdit = Boolean(initial)

  const [judul,     setJudul]     = useState<string>(initial?.judul ?? "")
  const [tanggal,   setTanggal]   = useState<string>(
    initial?.tanggal ? String(initial.tanggal).slice(0, 10) : ""
  )
  const [deskripsi, setDeskripsi] = useState<string>(initial?.deskripsi ?? "")
  const [saving,    setSaving]    = useState(false)
  const [error,     setError]     = useState("")

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSaving(true)
    setError("")

    const payload = {
      judul:     judul.trim(),
      tanggal:   tanggal || null,
      deskripsi: deskripsi.trim() || null,
    }

    const supabase = createClient()
    const res = isEdit
      ? await supabase.from("kegiatan_kkn").update(payload).eq("id", initial!.id)
      : await supabase.from("kegiatan_kkn").insert(payload)

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

      <div className="space-y-4">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-foreground">
            Judul Kegiatan <span className="text-destructive">*</span>
          </label>
          <Input
            required
            value={judul}
            onChange={(e) => setJudul(e.target.value)}
            placeholder="mis. Sosialisasi Digital Marketing UMKM"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-foreground">
            Tanggal <span className="text-[11px] font-normal text-muted-foreground">(opsional)</span>
          </label>
          <input
            type="date"
            value={tanggal}
            onChange={(e) => setTanggal(e.target.value)}
            className="h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm text-foreground shadow-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-foreground">
            Deskripsi <span className="text-[11px] font-normal text-muted-foreground">(opsional)</span>
          </label>
          <Textarea
            rows={4}
            value={deskripsi}
            onChange={(e) => setDeskripsi(e.target.value)}
            placeholder="Ceritakan kegiatan ini secara singkat..."
          />
        </div>
      </div>

      <div className="flex items-center gap-3 border-t border-border pt-5">
        <Button type="submit" disabled={saving} className="gap-2">
          {saving ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
          {saving ? "Menyimpan..." : isEdit ? "Simpan Perubahan" : "Tambah Kegiatan"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.push("/admin/kkn")}>
          Batal
        </Button>
      </div>
    </form>
  )
}
