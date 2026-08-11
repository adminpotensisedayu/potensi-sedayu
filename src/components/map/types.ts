// Shared type — diimport oleh map-inner.tsx DAN peta-explorer.tsx
export type MapPoint = {
  id: string
  lat: number
  lng: number
  sector: "umkm" | "sekolah"
  label: string       // nama_usaha / nama sekolah
  desc?: string
  alamat?: string
  subLabel?: string   // badge popup: nama kategori / jenjang
  subKat?: string     // nilai filter
  href?: string
}