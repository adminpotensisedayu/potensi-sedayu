import Link from "next/link"
import Image from "next/image"

export function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer className="mt-24 border-t border-border bg-card">
      <div className="mx-auto grid max-w-6xl gap-8 px-6 py-12 sm:grid-cols-2 lg:grid-cols-4">

        {/* Brand */}
        <div className="sm:col-span-2 lg:col-span-1">
          <div className="mb-3 flex items-center gap-2">
            <Image src="/logo.png" alt="Logo Potensi Desa Sedayu" width={36} height={36} className="size-9 object-contain" />
            <span className="font-serif text-lg font-semibold text-foreground">Potensi Sedayu</span>
          </div>
          <p className="text-sm text-muted-foreground">
            Potensi desa, terhubung ke pasar yang lebih luas. Desa Sedayu, Kec. Jumantono, Kab. Karanganyar.
          </p>
        </div>

        {/* Jelajahi — updated: pertanian/peternakan dihapus, sekolah ditambah */}
        <div>
          <h4 className="mb-3 text-sm font-semibold text-foreground">Jelajahi</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link href="/umkm"    className="hover:text-foreground">UMKM</Link></li>
            <li><Link href="/sekolah" className="hover:text-foreground">Sekolah</Link></li>
            <li><Link href="/peta"    className="hover:text-foreground">Peta Sebaran</Link></li>
          </ul>
        </div>

        {/* Desa */}
        <div>
          <h4 className="mb-3 text-sm font-semibold text-foreground">Desa</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link href="/profil"      className="hover:text-foreground">Profil Desa</Link></li>
            <li><Link href="/tentang-kkn" className="hover:text-foreground">Tentang KKN</Link></li>
            <li><Link href="/kontak"      className="hover:text-foreground">Kontak</Link></li>
          </ul>
        </div>

        {/* CTA */}
        <div>
          <h4 className="mb-3 text-sm font-semibold text-foreground">Punya usaha?</h4>
          <p className="mb-3 text-sm text-muted-foreground">
            Daftarkan usaha atau potensimu biar tampil di web desa.
          </p>
          <Link href="/daftar" className="text-sm font-medium text-primary hover:underline">
            Daftarkan Usaha &rarr;
          </Link>
        </div>
      </div>

      <div className="border-t border-border">
        <div className="mx-auto max-w-6xl px-6 py-5 text-center text-xs text-muted-foreground">
          &copy; {year} Pemerintah Desa Sedayu - Dibuat oleh Tim KKN Literasi 123 UNS
        </div>
      </div>
    </footer>
  )
}