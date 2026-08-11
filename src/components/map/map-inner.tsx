"use client"

import { useEffect, useRef } from "react"
import L from "leaflet"
import "leaflet/dist/leaflet.css"
import "./leaflet-theme.css"
import { MapContainer, TileLayer, Marker, Popup, useMap, Polygon } from "react-leaflet"
import MarkerClusterGroup from "react-leaflet-cluster"
import type { MapPoint } from "./types"

// ─── Ikon custom ──────────────────────────────────────────────────────────
const makeIcon = (color: string) =>
  L.divIcon({
    className: "",
    html: `<div style="
      width:28px;height:28px;border-radius:50% 50% 50% 0;
      background:${color};border:2px solid white;
      transform:rotate(-45deg);box-shadow:0 2px 6px rgba(0,0,0,.35)
    "></div>`,
    iconSize: [28, 28],
    iconAnchor: [14, 28],
    popupAnchor: [0, -30],
  })

const ICON_UMKM    = makeIcon("#F97316")
const ICON_SEKOLAH = makeIcon("#0D9488")

// ─── Batas Desa Sedayu — center: -7.6761, 110.9614 | luas ±6.55 km² ─────
const DESA_SEDAYU_BOUNDARY: [number, number][] = [
  [-7.654, 110.951],
  [-7.657, 110.962],
  [-7.663, 110.974],
  [-7.672, 110.980],
  [-7.682, 110.978],
  [-7.693, 110.969],
  [-7.699, 110.957],
  [-7.696, 110.945],
  [-7.687, 110.939],
  [-7.676, 110.938],
  [-7.665, 110.942],
  [-7.657, 110.947],
]

// ─── Auto-recenter ────────────────────────────────────────────────────────
function Recenter({ points }: { points: MapPoint[] }) {
  const map  = useMap()
  const prev = useRef(0)
  useEffect(() => {
    if (points.length === prev.current) return
    prev.current = points.length
    if (points.length === 0) { map.setView([-7.6761, 110.9614], 14); return }
    const bounds = L.latLngBounds(points.map((p) => [p.lat, p.lng]))
    map.fitBounds(bounds, { padding: [40, 40], maxZoom: 16 })
  }, [points, map])
  return null
}

// ─── Props & export ───────────────────────────────────────────────────────
export interface MapInnerProps {
  points: MapPoint[]
  darkMode?: boolean
}

export default function MapInner({ points, darkMode = false }: MapInnerProps) {
  const tileUrl = darkMode
    ? "{{https://{s}}}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
    : "{{https://{s}}}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"

  return (
    <MapContainer
      center={[-7.6761, 110.9614]}
      zoom={14}
      className="h-full w-full"
      zoomControl={false}
    >
      <TileLayer
        url={tileUrl}
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>'
      />

      {/* Batas Desa */}
      <Polygon
        positions={DESA_SEDAYU_BOUNDARY}
        pathOptions={{
          color: "#10B981", weight: 2.5, opacity: 0.9,
          fillColor: "#10B981", fillOpacity: 0.07,
          dashArray: "8 6",
        }}
      >
        <Popup>
          <div className="text-sm font-medium">🏡 Desa Sedayu</div>
          <div className="text-xs text-gray-500">Jumantono, Karanganyar</div>
        </Popup>
      </Polygon>

      {/* Markers + Cluster */}
      <MarkerClusterGroup
        chunkedLoading
        iconCreateFunction={(cluster: { getChildCount: () => number }) =>
          L.divIcon({
            html: `<div style="
              background:#F97316;color:white;font-weight:700;font-size:13px;
              width:36px;height:36px;border-radius:50%;
              display:flex;align-items:center;justify-content:center;
              border:2px solid white;box-shadow:0 2px 8px rgba(0,0,0,.3)
            ">${cluster.getChildCount()}</div>`,
            className: "",
            iconSize: [36, 36],
          })
        }
      >
        {points.map((p) => (
          <Marker
            key={p.id}
            position={[p.lat, p.lng]}
            icon={p.sector === "umkm" ? ICON_UMKM : ICON_SEKOLAH}
          >
            <Popup minWidth={200}>
              <div className="space-y-1 p-1">
                <span
                  className="inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold text-white"
                  style={{ background: p.sector === "umkm" ? "#F97316" : "#0D9488" }}
                >
                  {p.sector === "umkm" ? "UMKM" : "Sekolah"}
                </span>
                <div className="font-semibold text-gray-900 text-sm leading-snug">{p.label}</div>
                {p.subLabel && <div className="text-xs text-gray-500">{p.subLabel}</div>}
                {p.subKat   && <div className="text-xs text-gray-400">{p.subKat}</div>}
                {p.alamat   && (
                  <div className="text-xs text-gray-500 flex gap-1">
                    <span>📍</span><span>{p.alamat}</span>
                  </div>
                )}
                {p.href && (
                  <a
                    href={p.href}
                    className="mt-1 block text-center rounded bg-emerald-600 text-white text-xs py-1 px-2 hover:bg-emerald-700"
                  >
                    Lihat Detail →
                  </a>
                )}
              </div>
            </Popup>
          </Marker>
        ))}
      </MarkerClusterGroup>

      <Recenter points={points} />
    </MapContainer>
  )
}