"use client"

import { MessageCircle, Navigation, Share2 } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { waLink, mapsDir } from "@/lib/utils"

type Props = {
  whatsapp?: string | null
  waPesan: string
  lat?: number | null
  lng?: number | null
  shareTitle: string
}

export function ContactButtons({ whatsapp, waPesan, lat, lng, shareTitle }: Props) {
  const adaKoordinat = typeof lat === "number" && typeof lng === "number"

  async function handleShare() {
    const url = typeof window !== "undefined" ? window.location.href : ""
    try {
      if (navigator.share) {
        await navigator.share({ title: shareTitle, url })
      } else {
        await navigator.clipboard.writeText(url)
        toast.success("Link disalin ke clipboard")
      }
    } catch {
      // dibatalkan pengguna, aman diabaikan
    }
  }

  return (
    <div className="flex flex-col gap-2">
      {whatsapp ? (
        <Button asChild className="w-full">
          <a href={waLink(whatsapp, waPesan)} target="_blank" rel="noopener noreferrer">
            <MessageCircle className="size-4" /> Hubungi via WhatsApp
          </a>
        </Button>
      ) : null}

      {adaKoordinat ? (
        <Button asChild variant="outline" className="w-full">
          <a href={mapsDir(lat as number, lng as number)} target="_blank" rel="noopener noreferrer">
            <Navigation className="size-4" /> Rute ke Lokasi
          </a>
        </Button>
      ) : null}

      <Button variant="ghost" className="w-full" onClick={handleShare}>
        <Share2 className="size-4" /> Bagikan
      </Button>
    </div>
  )
}
