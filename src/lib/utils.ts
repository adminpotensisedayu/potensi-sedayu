import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// WhatsApp deep link (normalisasi 08.. -> 62..)
export function waLink(nomor: string, pesan: string) {
  let n = nomor.replace(/[^0-9]/g, "")
  if (n.startsWith("0")) n = "62" + n.slice(1)
  return "https://wa.me/" + n + "?text=" + encodeURIComponent(pesan)
}

// Tombol "Rute" ke Google Maps
export function mapsDir(lat: number, lng: number) {
  return "https://www.google.com/maps/dir/?api=1&destination=" + lat + "," + lng
}

// Template pesan WhatsApp per sektor
export const waPesan = {
  umkm: (nama: string) => "Halo, saya lihat usaha " + nama + " di web Desa Sedayu. Boleh info lebih lanjut?",
  tani: (k: string) => "Halo, saya tertarik komoditas " + k + ". Boleh info harga & ketersediaan?",
  ternak: (nm: string) => "Halo, saya ingin menjajaki kemitraan dengan " + nm + ". Boleh info lebih lanjut?",
}
