"use client"

import { useState, useCallback, useEffect, useRef } from "react"
import {
  MapContainer, TileLayer, Marker, Popup, Circle,
  useMap, ZoomControl,
} from "react-leaflet"
import L from "leaflet"
import "leaflet/dist/leaflet.css"
import { Layers, LocateFixed, X, Map } from "lucide-react"

export type MapPoint = {
  id: string
  lat: number
  lng: number
  sector: "umkm" | "sekolah"
  label: string
  alamat?: string
  subLabel?: string
  subKat?: string
  href: string
  foto?: string
}

// ─── Tile URLs (plain strings — NO double curly braces) ───────
type TileMode = "street" | "satellite"

const TILE_STREET_URL      = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
const TILE_STREET_ATTR     = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
const TILE_SAT_URL         = "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
const TILE_SAT_ATTR        = "Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community"

// ─── Custom marker icons ──────────────────────────────────────
function makePin(fillColor: string) {
  return L.divIcon({
    className: "",
    html: `<svg width="26" height="36" viewBox="0 0 26 36" xmlns="http://www.w3.org/2000/svg">
      <path d="M13 0C5.82 0 0 5.82 0 13c0 9.75 13 23 13 23S26 22.75 26 13C26 5.82 20.18 0 13 0z" fill="${fillColor}"/>
      <circle cx="13" cy="13" r="5.5" fill="white" opacity="0.9"/>
    </svg>`,
    iconSize:    [26, 36],
    iconAnchor:  [13, 36],
    popupAnchor: [0, -38],
  })
}

function makeUserDot() {
  return L.divIcon({
    className: "",
    html: `<div style="position:relative;width:22px;height:22px;display:flex;align-items:center;justify-content:center;">
      <div style="position:absolute;width:36px;height:36px;border-radius:50%;background:rgba(59,130,246,0.18);top:50%;left:50%;transform:translate(-50%,-50%);animation:userpulse 2s ease-out infinite;"></div>
      <div style="width:14px;height:14px;border-radius:50%;background:#3b82f6;border:3px solid white;box-shadow:0 2px 8px rgba(59,130,246,0.45);"></div>
    </div>
    <style>@keyframes userpulse{0%{transform:translate(-50%,-50%) scale(.7);opacity:1}100%{transform:translate(-50%,-50%) scale(2.2);opacity:0}}</style>`,
    iconSize:    [22, 22],
    iconAnchor:  [11, 11],
    popupAnchor: [0, -14],
  })
}

const PIN_UMKM    = makePin("#f59e0b")
const PIN_SEKOLAH = makePin("#14b8a6")
const PIN_USER    = makeUserDot()

// ─── Popup HTML builder ────────────────────────────────────────
function buildPopup(p: MapPoint): string {
  const clr   = p.sector === "umkm" ? "#f59e0b" : "#14b8a6"
  const badge = p.sector === "umkm" ? "UMKM" : "Sekolah"
  const alamat = p.alamat ? (p.alamat.length > 85 ? p.alamat.slice(0, 85) + "\u2026" : p.alamat) : ""

  const fotoHtml = p.foto
    ? `<div style="height:110px;border-radius:8px;overflow:hidden;margin-bottom:10px;background:#e5e7eb;">
        <img src="${p.foto}" style="width:100%;height:100%;object-fit:cover;" loading="lazy" />
       </div>`
    : ""

  return `
    <div style="width:205px;font-family:system-ui,-apple-system,sans-serif;line-height:1.4;">
      ${fotoHtml}
      <div style="display:flex;align-items:center;gap:6px;margin-bottom:5px;">
        <span style="padding:2px 8px;border-radius:999px;font-size:10px;font-weight:700;
          background:${clr}18;color:${clr};border:1px solid ${clr}33;flex-shrink:0;">${badge}</span>
        ${p.subLabel ? `<span style="font-size:11px;color:#888;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${p.subLabel}</span>` : ""}
      </div>
      <p style="font-weight:700;font-size:13.5px;margin:0 0 3px;color:#111;overflow:hidden;
        text-overflow:ellipsis;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;">${p.label}</p>
      ${alamat ? `<p style="font-size:11.5px;color:#777;margin:0 0 10px;">\uD83D\uDCCD ${alamat}</p>` : `<div style="margin-bottom:10px;"></div>`}
      <a href="${p.href}"
        style="display:block;text-align:center;padding:8px 12px;background:${clr};color:white;
          border-radius:8px;font-size:12.5px;font-weight:700;text-decoration:none;"
        onmouseover="this.style.opacity='.85'"
        onmouseout="this.style.opacity='1'"
      >Lihat Detail &rarr;</a>
    </div>
  `
}

// ─── Map controller (exposes L.Map instance via ref) ──────────
function MapController({ mapRef }: { mapRef: React.MutableRefObject<L.Map | null> }) {
  const map = useMap()
  useEffect(() => { mapRef.current = map }, [map, mapRef])
  return null
}

// ─── Markers ──────────────────────────────────────────────────
function MarkersLayer({ points, filter }: { points: MapPoint[]; filter: "all" | "umkm" | "sekolah" }) {
  const shown = filter === "all" ? points : points.filter((p) => p.sector === filter)
  return (
    <>
      {shown.map((p) => (
        <Marker
          key={p.sector + "-" + p.id}
          position={[p.lat, p.lng]}
          icon={p.sector === "umkm" ? PIN_UMKM : PIN_SEKOLAH}
        >
          <Popup minWidth={205} maxWidth={220}>
            <div dangerouslySetInnerHTML={{ __html: buildPopup(p) }} />
          </Popup>
        </Marker>
      ))}
    </>
  )
}

// ─── MAIN ─────────────────────────────────────────────────────
const DESA_CENTER: [number, number] = [-7.67672, 110.99979]

export default function PetaExplorer({ points }: { points: MapPoint[] }) {
  const [tileMode, setTileMode] = useState<TileMode>("street")
  const [filter,   setFilter]   = useState<"all" | "umkm" | "sekolah">("all")
  const [userPos,  setUserPos]  = useState<[number, number] | null>(null)
  const [geoState, setGeoState] = useState<"idle" | "loading" | "active">("idle")
  const [legend,   setLegend]   = useState(true)
  const mapRef = useRef<L.Map | null>(null)

  const umkmCount    = points.filter((p) => p.sector === "umkm").length
  const sekolahCount = points.filter((p) => p.sector === "sekolah").length

  const handleGeolocate = useCallback(() => {
    if (!navigator.geolocation || geoState === "loading") return
    setGeoState("loading")
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        const pos: [number, number] = [coords.latitude, coords.longitude]
        setUserPos(pos)
        setGeoState("active")
        mapRef.current?.flyTo(pos, 17, { duration: 1.8 })
      },
      () => {
        setGeoState("idle")
        alert("Tidak dapat mengakses lokasi. Pastikan izin lokasi diaktifkan di browser.")
      },
      { timeout: 10000, enableHighAccuracy: true }
    )
  }, [geoState])

  const tileUrl  = tileMode === "street" ? TILE_STREET_URL  : TILE_SAT_URL
  const tileAttr = tileMode === "street" ? TILE_STREET_ATTR : TILE_SAT_ATTR

  return (
    <div className="relative h-full w-full overflow-hidden">

      {/* Filter bar — top center */}
      <div className="absolute left-1/2 top-4 z-[1000] -translate-x-1/2">
        <div className="flex items-center gap-1 rounded-2xl border border-border bg-background/96 p-1 shadow-xl backdrop-blur-md">
          {(
            [
              { id: "all"     as const, label: "Semua",    n: umkmCount + sekolahCount },
              { id: "umkm"    as const, label: "UMKM",     n: umkmCount                },
              { id: "sekolah" as const, label: "Sekolah",  n: sekolahCount             },
            ]
          ).map(({ id, label, n }) => (
            <button
              key={id}
              onClick={() => setFilter(id)}
              className={`flex items-center gap-1.5 rounded-xl px-3.5 py-1.5 text-xs font-bold transition-all ${
                filter === id
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:bg-muted"
              }`}
            >
              {label}
              <span className="text-[10px] opacity-60">({n})</span>
            </button>
          ))}
        </div>
      </div>

      {/* Right controls */}
      <div className="absolute right-4 top-4 z-[1000] flex flex-col gap-2">
        <button
          onClick={() => setTileMode((m) => m === "street" ? "satellite" : "street")}
          title={tileMode === "street" ? "Tampilan Satelit" : "Tampilan Peta Jalan"}
          className={`flex size-10 items-center justify-center rounded-xl border border-border shadow-lg backdrop-blur-sm transition hover:scale-105 active:scale-95 ${
            tileMode === "satellite"
              ? "bg-primary text-primary-foreground"
              : "bg-background/96 text-muted-foreground hover:bg-muted"
          }`}
        >
          <Layers className="size-4" />
        </button>

        <button
          onClick={handleGeolocate}
          title="Lokasi Saya"
          className={`flex size-10 items-center justify-center rounded-xl border border-border shadow-lg backdrop-blur-sm transition hover:scale-105 active:scale-95 ${
            geoState === "active"
              ? "bg-blue-500 text-white border-blue-500"
              : "bg-background/96 hover:bg-muted"
          }`}
        >
          {geoState === "loading" ? (
            <div className="size-4 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
          ) : (
            <LocateFixed className={`size-4 ${geoState === "active" ? "text-white" : "text-blue-500"}`} />
          )}
        </button>
      </div>

      {/* Satellite label */}
      {tileMode === "satellite" && (
        <div className="absolute left-4 top-4 z-[1000]">
          <span className="flex items-center gap-1.5 rounded-xl border border-white/20 bg-black/50 px-3 py-1.5 text-xs font-bold text-white backdrop-blur-sm">
            <Map className="size-3.5" />
            Satelit
          </span>
        </div>
      )}

      {/* Map */}
      <MapContainer
        center={DESA_CENTER}
        zoom={15}
        style={{ height: "100%", width: "100%", zIndex: 0 }}
        zoomControl={false}
        scrollWheelZoom
      >
        <MapController mapRef={mapRef} />
        <TileLayer url={tileUrl} attribution={tileAttr} maxZoom={20} />
        <ZoomControl position="bottomright" />
        <MarkersLayer points={points} filter={filter} />

        {userPos && (
          <>
            <Marker position={userPos} icon={PIN_USER}>
              <Popup>
                <div style={{ fontFamily: "system-ui", fontSize: "13px", fontWeight: 700, color: "#3b82f6" }}>
                  Lokasi Anda
                </div>
              </Popup>
            </Marker>
            <Circle
              center={userPos}
              radius={300}
              pathOptions={{
                color: "#3b82f6", weight: 1.5,
                fillColor: "#3b82f6", fillOpacity: 0.07,
                dashArray: "5",
              }}
            />
          </>
        )}
      </MapContainer>

      {/* Legend */}
      {legend && (
        <div className="absolute bottom-12 left-4 z-[1000]">
          <div className="flex items-center gap-3 rounded-2xl border border-border bg-background/96 px-4 py-2.5 shadow-xl backdrop-blur-md">
            <div className="flex items-center gap-1.5">
              <span className="size-3 rounded-full bg-amber-400 ring-1 ring-white" />
              <span className="text-[11px] font-medium text-muted-foreground">UMKM</span>
            </div>
            <div className="h-3 w-px bg-border" />
            <div className="flex items-center gap-1.5">
              <span className="size-3 rounded-full bg-teal-400 ring-1 ring-white" />
              <span className="text-[11px] font-medium text-muted-foreground">Sekolah</span>
            </div>
            {userPos && (
              <>
                <div className="h-3 w-px bg-border" />
                <div className="flex items-center gap-1.5">
                  <span className="size-3 rounded-full bg-blue-500 ring-1 ring-white" />
                  <span className="text-[11px] font-medium text-muted-foreground">Anda</span>
                </div>
              </>
            )}
            <button
              onClick={() => setLegend(false)}
              className="ml-1 rounded p-0.5 text-muted-foreground/50 transition hover:text-muted-foreground"
            >
              <X className="size-3" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
