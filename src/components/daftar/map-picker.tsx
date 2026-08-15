"use client"

import { useRef, useState, useEffect } from "react"
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet"
import type { Map as LeafletMap, Marker as LeafletMarker } from "leaflet"
import L from "leaflet"
import "leaflet/dist/leaflet.css"
import { Navigation, Loader2, MapPin, RotateCcw } from "lucide-react"

const ICON = L.icon({
  iconUrl:       "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl:     "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize:  [25, 41],
  iconAnchor:[12, 41],
})

const DESA_CENTER: [number, number] = [-7.67672, 110.99979]
const TILE_URL = "https" + "://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"

function ClickHandler({ onPos }: { onPos: (lat: number, lng: number) => void }) {
  useMapEvents({ click: (e) => onPos(e.latlng.lat, e.latlng.lng) })
  return null
}

type Props = {
  lat: string
  lng: string
  onChange: (lat: string, lng: string) => void
}

export function MapPicker({ lat, lng, onChange }: Props) {
  const mapRef = useRef<LeafletMap | null>(null)
  const [geoLoading, setGeoLoading] = useState(false)
  const [inputLat, setInputLat] = useState(lat)
  const [inputLng, setInputLng] = useState(lng)

  useEffect(() => setInputLat(lat), [lat])
  useEffect(() => setInputLng(lng), [lng])

  const parsedLat = parseFloat(inputLat)
  const parsedLng = parseFloat(inputLng)
  const hasPos    = !isNaN(parsedLat) && !isNaN(parsedLng) && inputLat !== "" && inputLng !== ""
  const position: [number, number] | null = hasPos ? [parsedLat, parsedLng] : null

  function applyPos(la: string, lo: string, fly = true) {
    const pLat = parseFloat(la)
    const pLng = parseFloat(lo)
    setInputLat(la)
    setInputLng(lo)
    if (!isNaN(pLat) && !isNaN(pLng) && la !== "" && lo !== "") {
      onChange(pLat.toFixed(7), pLng.toFixed(7))
      if (fly) mapRef.current?.flyTo([pLat, pLng], 17, { animate: true, duration: 1 })
    } else {
      onChange(la, lo)
    }
  }

  function handleGeolocate() {
    if (!navigator.geolocation) { alert("Browser tidak mendukung geolokasi."); return }
    setGeoLoading(true)
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        applyPos(coords.latitude.toFixed(7), coords.longitude.toFixed(7))
        setGeoLoading(false)
      },
      () => { setGeoLoading(false); alert("Tidak dapat mengakses lokasi. Izinkan akses di browser.") },
      { timeout: 10000, enableHighAccuracy: true }
    )
  }

  function handleMapPos(newLat: number, newLng: number) {
    const la = newLat.toFixed(7)
    const lo = newLng.toFixed(7)
    setInputLat(la)
    setInputLng(lo)
    onChange(la, lo)
  }

  function handleReset() {
    setInputLat("")
    setInputLng("")
    onChange("", "")
  }

  const inputCls =
    "w-full rounded-xl border border-border bg-background px-3 py-2.5 font-mono text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/25 transition"

  return (
    <div className="space-y-3">

      {/* ── CARA 1: Input Manual + CARA 2: GPS ── */}
      <div className="grid grid-cols-[1fr_1fr_auto] items-end gap-2">
        <div>
          <label className="mb-1 block text-xs font-semibold text-muted-foreground">
            Latitude
          </label>
          <input
            type="number"
            step="any"
            value={inputLat}
            onChange={(e) => applyPos(e.target.value, inputLng, false)}
            onBlur={() => {
              const p = parseFloat(inputLat)
              if (!isNaN(p) && parseFloat(inputLng)) {
                mapRef.current?.flyTo([p, parseFloat(inputLng)], 17, { animate: true, duration: 1 })
              }
            }}
            placeholder="-7.6767200"
            className={inputCls}
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-semibold text-muted-foreground">
            Longitude
          </label>
          <input
            type="number"
            step="any"
            value={inputLng}
            onChange={(e) => applyPos(inputLat, e.target.value, false)}
            onBlur={() => {
              const p = parseFloat(inputLng)
              if (!isNaN(p) && parseFloat(inputLat)) {
                mapRef.current?.flyTo([parseFloat(inputLat), p], 17, { animate: true, duration: 1 })
              }
            }}
            placeholder="110.9997900"
            className={inputCls}
          />
        </div>
        <button
          type="button"
          onClick={handleGeolocate}
          disabled={geoLoading}
          title="Gunakan Lokasi Saya"
          className="flex h-[42px] shrink-0 items-center gap-1.5 rounded-xl border border-border bg-background px-3 text-xs font-semibold text-foreground transition hover:bg-muted disabled:opacity-60"
        >
          {geoLoading
            ? <Loader2 className="size-4 animate-spin" />
            : <Navigation className="size-4 text-blue-500" />}
          <span className="hidden sm:inline">{geoLoading ? "Mendeteksi..." : "Lokasi Saya"}</span>
        </button>
      </div>

      {/* ── CARA 3: Map Picker ── */}
      <div className="overflow-hidden rounded-xl border border-border shadow-sm">
        <div className="flex items-center gap-2 border-b border-border bg-muted/40 px-3 py-2">
          <MapPin className="size-3.5 shrink-0 text-primary" />
          <p className="text-xs text-muted-foreground">
            Klik peta atau seret marker untuk pindah posisi
          </p>
          {hasPos && (
            <button
              type="button"
              onClick={handleReset}
              className="ml-auto flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] font-semibold text-muted-foreground transition hover:bg-destructive/10 hover:text-destructive"
            >
              <RotateCcw className="size-3" /> Reset
            </button>
          )}
        </div>
        <div style={{ height: 280 }}>
          <MapContainer
            center={position ?? DESA_CENTER}
            zoom={position ? 17 : 14}
            style={{ height: "100%", width: "100%" }}
            ref={(m) => { if (m) mapRef.current = m }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url={TILE_URL}
            />
            <ClickHandler onPos={handleMapPos} />
            {position && (
              <Marker
                position={position}
                icon={ICON}
                draggable
                eventHandlers={{
                  dragend(e) {
                    const m = e.target as LeafletMarker
                    const p = m.getLatLng()
                    handleMapPos(p.lat, p.lng)
                  },
                }}
              />
            )}
          </MapContainer>
        </div>
      </div>

      {!hasPos && (
        <p className="text-center text-[11px] text-muted-foreground">
          📍 Belum ada lokasi — isi koordinat di atas, klik peta, atau gunakan GPS
        </p>
      )}
    </div>
  )
}
