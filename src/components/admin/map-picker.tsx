"use client"

import dynamic from "next/dynamic"

// Tipe koordinat (sama dengan di map-picker-inner.tsx)
type PickerCoords = { lat: number; lng: number }

type InnerProps = {
  value: PickerCoords | null
  onChange: (coords: PickerCoords | null) => void
}

const PickerMap = dynamic<InnerProps>(
  () => import("@/components/admin/map-picker-inner"),
  {
    ssr: false,
    loading: () => (
      <div className="h-64 w-full animate-pulse rounded-xl bg-secondary" />
    ),
  }
)

// Interface publik tetap sama → umkm-form & sekolah-form tidak perlu diubah
export function MapPicker({
  lat,
  lng,
  onChange,
}: {
  lat: string
  lng: string
  onChange: (lat: string, lng: string) => void
}) {
  const latNum = lat.trim() === "" ? null : Number(lat)
  const lngNum = lng.trim() === "" ? null : Number(lng)

  // Bridge: outer string → inner object
  const innerValue: PickerCoords | null =
    latNum !== null &&
    lngNum !== null &&
    Number.isFinite(latNum) &&
    Number.isFinite(lngNum)
      ? { lat: latNum, lng: lngNum }
      : null

  // Bridge: inner object → outer string
  function handleInnerChange(coords: PickerCoords | null) {
    if (coords) {
      onChange(coords.lat.toFixed(6), coords.lng.toFixed(6))
    } else {
      onChange("", "")
    }
  }

  // ✅ Hanya render PickerMap — tidak ada UI tambahan di sini
  // Semua UI (input lat/lng, tombol GPS, peta) sudah ada di map-picker-inner.tsx
  return (
    <PickerMap
      value={innerValue}
      onChange={handleInnerChange}
    />
  )
}