"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Trash2, Loader2 } from "lucide-react"

export function DeleteButton({
  table,
  id,
  label = "Hapus data ini?",
}: {
  table: string
  id: string | number
  label?: string
}) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function handleDelete() {
    if (!window.confirm(label)) return
    setLoading(true)
    const supabase = createClient()
    const { error } = await supabase.from(table).delete().eq("id", id)
    setLoading(false)
    if (error) {
      window.alert("Gagal menghapus: " + error.message)
      return
    }
    router.refresh()
  }

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={loading}
      className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-sm font-medium text-destructive transition hover:bg-destructive/10 disabled:opacity-50"
    >
      {loading ? <Loader2 className="size-4 animate-spin" /> : <Trash2 className="size-4" />}
      Hapus
    </button>
  )
}
