"use client"

import { useState, type ChangeEvent } from "react"
import { createClient } from "@/lib/supabase/client"
import { ImagePlus, Loader2, X } from "lucide-react"

export function ImageUpload({
  bucket,
  value,
  onChange,
  label = "Foto",
}: {
  bucket: string
  value: string | null
  onChange: (url: string | null) => void
  label?: string
}) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState("")

  async function handleFile(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    setError("")
    try {
      const supabase = createClient()
      const ext = file.name.split(".").pop() ?? "jpg"
      const path = Date.now() + "-" + Math.random().toString(36).slice(2, 8) + "." + ext
      const { error: upErr } = await supabase.storage
        .from(bucket)
        .upload(path, file, { cacheControl: "3600", upsert: false })
      if (upErr) throw upErr
      const { data } = supabase.storage.from(bucket).getPublicUrl(path)
      onChange(data.publicUrl)
    } catch {
      setError("Gagal mengunggah. Coba lagi.")
    } finally {
      setUploading(false)
      e.target.value = ""
    }
  }

  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-foreground">{label}</label>
      {value ? (
        <div className="relative overflow-hidden rounded-xl border border-border">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={value} alt={label} className="h-40 w-full object-cover" />
          <button
            type="button"
            onClick={() => onChange(null)}
            className="absolute right-2 top-2 flex size-7 items-center justify-center rounded-full bg-background/90 text-destructive shadow"
          >
            <X className="size-4" strokeWidth={2} />
          </button>
        </div>
      ) : (
        <label className="flex h-40 cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border bg-secondary/40 text-muted-foreground transition hover:bg-secondary">
          {uploading ? (
            <Loader2 className="size-6 animate-spin" strokeWidth={1.5} />
          ) : (
            <ImagePlus className="size-6" strokeWidth={1.5} />
          )}
          <span className="text-sm">{uploading ? "Mengunggah..." : "Pilih gambar"}</span>
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFile}
            disabled={uploading}
          />
        </label>
      )}
      {error ? <p className="mt-1 text-sm text-destructive">{error}</p> : null}
    </div>
  )
}
