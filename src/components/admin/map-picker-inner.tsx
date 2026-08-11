"use client"

import { useState, useEffect, useRef } from "react"
import {
  MapContainer,
  TileLayer,
  Marker,
  useMapEvents,
  useMap,
} from "react-leaflet"
import L from "leaflet"
import "leaflet/dist/leaflet.css"
import { MapPin, Loader2, X } from "lucide-react"
import { toast } from "sonner"

// ── Fix default Leaflet icon ───────────────────────────────
// eslint-disable-next-line @typescript-eslint/no-explicit-any
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
})

// ── Types ──────────────────────────────────────────────────
export type PickerCoords = { lat: number; lng: number }

// ── Sub: handle klik pada peta ─────────────────────────────
function ClickHandler({
  onMapClick,
}: {
  onMapClick: (c: PickerCoords) => void
}) {
  useMapEvents({
    click(e) {
      onMapClick({ lat: e.latlng.lat, lng: e.latlng.lng })
    },
  })
  return null
}

// ── Sub: fly to marker when coords change ──────────────────
function FlyToMarker({ coords }: { coords: PickerCoords }) {
  const map = useMap()
  const prevRef = useRef<PickerCoords | null>(null)

  useEffect(() => {
    const prev = prevRef.current
    const isSame =
      prev &&
      Math.abs(prev.lat - coords.lat) < 0.000001 &&
      Math.abs(prev.lng - coords.lng) < 0.000001

    if (!isSame) {
      map.flyTo([coords.lat, coords.lng], Math.max(map.getZoom(), 17), {
        duration: 0.7,
      })
      prevRef.current = coords
    }
  }, [coords, map])

  return null
}

// ── MAIN COMPONENT ─────────────────────────────────────────
interface MapPickerInnerProps {
  value: PickerCoords | null
  onChange: (coords: PickerCoords | null) => void
}

export default function MapPickerInner({
  value,
  onChange,
}: MapPickerInnerProps) {
  // Pusat Desa Sedayu, Jumantono, Karanganyar
  const DEFAULT_CENTER: [number, number] = [-7.6761, 110.9614]

  // ── Local string state untuk input manual ──────────────
  const [latStr, setLatStr] = useState(value?.lat.toFixed(6) ?? "")
  const [lngStr, setLngStr] = useState(value?.lng.toFixed(6) ?? "")
  const [loadingGeo, setLoadingGeo] = useState(false)

  // Ref untuk track apakah perubahan dari dalam atau luar
  const internalChangeRef = useRef(false)

  // Sync value prop → input string (saat parent ubah dari luar)
  useEffect(() => {
    if (internalChangeRef.current) {
      internalChangeRef.current = false
      return
    }
    if (value === null) {
      setLatStr("")
      setLngStr("")
    } else {
      setLatStr(value.lat.toFixed(6))
      setLngStr(value.lng.toFixed(6))
    }
  }, [value])

  // ── Helper: emit + tandai sebagai internal change ──────
  function emit(coords: PickerCoords | null) {
    internalChangeRef.current = true
    onChange(coords)
  }

  // ── Saat user klik peta ────────────────────────────────
  function handleMapClick(c: PickerCoords) {
    setLatStr(c.lat.toFixed(6))
    setLngStr(c.lng.toFixed(6))
    emit(c)
  }

  // ── Saat user ketik di input Latitude ─────────────────
  function handleLatInput(raw: string) {
    setLatStr(raw)
    const lat = parseFloat(raw)
    const lng = parseFloat(lngStr)
    if (
      !isNaN(lat) &&
      !isNaN(lng) &&
      lat >= -90 &&
      lat <= 90 &&
      lng >= -180 &&
      lng <= 180
    ) {
      emit({ lat, lng })
    }
  }

  // ── Saat user ketik di input Longitude ────────────────
  function handleLngInput(raw: string) {
    setLngStr(raw)
    const lat = parseFloat(latStr)
    const lng = parseFloat(raw)
    if (
      !isNaN(lat) &&
      !isNaN(lng) &&
      lat >= -90 &&
      lat <= 90 &&
      lng >= -180 &&
      lng <= 180
    ) {
      emit({ lat, lng })
    }
  }

  // ── Tombol "Gunakan Lokasi Saya" ───────────────────────
  function handleGetLocation() {
    if (!navigator.geolocation) {
      toast.error("Browser kamu tidak mendukung Geolocation")
      return
    }

    setLoadingGeo(true)
    toast.loading("Mendeteksi lokasi kamu...", { id: "geo" })

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const c: PickerCoords = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        }
        setLatStr(c.lat.toFixed(6))
        setLngStr(c.lng.toFixed(6))
        emit(c)
        setLoadingGeo(false)
        toast.success("Lokasi berhasil dideteksi ✓", { id: "geo" })
      },
      (err) => {
        setLoadingGeo(false)
        toast.dismiss("geo")
        if (err.code === err.PERMISSION_DENIED) {
          toast.error(
            "Izin lokasi ditolak. Aktifkan izin lokasi di browser kamu."
          )
        } else {
          toast.error("Gagal mendeteksi lokasi. Coba lagi.")
        }
      },
      { enableHighAccuracy: true, timeout: 12000, maximumAge: 0 }
    )
  }

  // ── Hapus pin ──────────────────────────────────────────
  function handleClear() {
    setLatStr("")
    setLngStr("")
    emit(null)
  }

  // ── Input class ────────────────────────────────────────
  const inputCls =
    "h-9 w-full rounded-lg border border-border bg-background px-2.5 text-sm " +
    "placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 " +
    "[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"

  return (
    <div className="space-y-2">

      {/* ── Row: Input lat + lng + tombol lokasi ── */}
      <div className="flex items-end gap-2">
        {/* Latitude */}
        <div className="flex-1 min-w-0">
          <label className="mb-1 block text-[11px] font-medium text-muted-foreground">
            Latitude
          </label>
          <input
            type="number"
            step="any"
            placeholder="-7.676100"
            value={latStr}
            onChange={(e) => handleLatInput(e.target.value)}
            className={inputCls}
          />
        </div>

        {/* Longitude */}
        <div className="flex-1 min-w-0">
          <label className="mb-1 block text-[11px] font-medium text-muted-foreground">
            Longitude
          </label>
          <input
            type="number"
            step="any"
            placeholder="110.961400"
            value={lngStr}
            onChange={(e) => handleLngInput(e.target.value)}
            className={inputCls}
          />
        </div>

        {/* Tombol Lokasi Saya */}
        <button
          type="button"
          onClick={handleGetLocation}
          disabled={loadingGeo}
          className="flex h-9 shrink-0 items-center gap-1.5 rounded-lg bg-primary px-3 text-xs font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-60"
        >
          {loadingGeo ? (
            <>
              <Loader2 className="size-3.5 animate-spin" />
              <span className="hidden sm:inline">Mencari...</span>
            </>
          ) : (
            <>
              <MapPin className="size-3.5" />
              <span className="hidden sm:inline">Lokasi Saya</span>
            </>
          )}
        </button>

        {/* Tombol Hapus Pin */}
        {value && (
          <button
            type="button"
            onClick={handleClear}
            title="Hapus pin"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border text-muted-foreground hover:bg-muted hover:text-red-500 transition-colors"
          >
            <X className="size-3.5" />
          </button>
        )}
      </div>

      {/* ── Peta Leaflet ── */}
      <div className="relative overflow-hidden rounded-xl border border-border">
        <MapContainer
          center={value ? [value.lat, value.lng] : DEFAULT_CENTER}
          zoom={15}
          style={{ height: "240px", width: "100%" }}
          className="z-0"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <ClickHandler onMapClick={handleMapClick} />
          {value && (
            <>
              <Marker position={[value.lat, value.lng]} />
              <FlyToMarker coords={value} />
            </>
          )}
        </MapContainer>

        {/* Overlay hint saat belum ada pin */}
        {!value && (
          <div className="pointer-events-none absolute inset-0 flex items-end justify-center pb-3">
            <div className="rounded-lg bg-black/60 px-3 py-1.5 text-xs text-white backdrop-blur-sm">
              🖱️ Klik peta untuk memasang pin lokasi
            </div>
          </div>
        )}
      </div>

      {/* Info koordinat aktif */}
      {value && (
        <p className="flex items-center gap-1 text-[11px] text-green-600">
          <MapPin className="size-3 shrink-0" />
          Pin aktif: {value.lat.toFixed(6)}, {value.lng.toFixed(6)}
        </p>
      )}
    </div>
  )
}