import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { Store, School, Users, MapPin, Settings, ArrowRight } from "lucide-react"

export const dynamic = "force-dynamic"

async function hitung(
  supabase: Awaited<ReturnType<typeof createClient>>,
  table: string,
) {
  const { count } = await supabase.from(table).select("*", { count: "exact", head: true })
  return count ?? 0
}

export default async function AdminDashboardPage() {
  const supabase = await createClient()

  // ✅ hanya query tabel yang masih ada
  const [umkm, sekolah, kegiatan] = await Promise.all([
    hitung(supabase, "umkm"),
    hitung(supabase, "sekolah"),
    hitung(supabase, "kegiatan_kkn"),
  ])

  const stats = [
    { label: "UMKM",        value: umkm,     icon: Store,  href: "/admin/umkm"    },
    { label: "Sekolah",     value: sekolah,  icon: School, href: "/admin/sekolah" },
    { label: "Kegiatan KKN",value: kegiatan, icon: Users,  href: "/admin/kkn"     },
  ]

  const pintasan = [
    { label: "Kelola UMKM",    desc: "Tambah, ubah, hapus data UMKM.",    icon: Store,    href: "/admin/umkm"        },
    { label: "Kelola Sekolah", desc: "Data sekolah di Desa Sedayu.",      icon: School,   href: "/admin/sekolah"     },
    { label: "Kelola Tim KKN", desc: "Anggota dan kegiatan.",             icon: Users,    href: "/admin/kkn"         },
    { label: "Pengaturan",     desc: "Profil desa, kontak, link form.",   icon: Settings, href: "/admin/pengaturan"  },
    { label: "Lihat Peta",     desc: "Sebaran titik di peta.",            icon: MapPin,   href: "/peta"              },
  ]

  return (
    <div className="mx-auto max-w-5xl">
      <header className="mb-8">
        <h1 className="font-serif text-3xl text-foreground">Dashboard Admin</h1>
        <p className="mt-1 text-muted-foreground">Ringkasan data potensi Desa Sedayu.</p>
      </header>

      <section className="grid gap-4 sm:grid-cols-3">
        {stats.map((s) => {
          const Icon = s.icon
          return (
            <Link key={s.label} href={s.href} className="rounded-2xl border border-border bg-card p-5 transition hover:shadow-sm">
              <Icon className="size-6 text-primary" strokeWidth={1.5} />
              <p className="mt-3 font-serif text-3xl text-foreground">{s.value}</p>
              <p className="text-sm text-muted-foreground">{s.label}</p>
            </Link>
          )
        })}
      </section>

      <section className="mt-10">
        <h2 className="mb-4 font-serif text-xl text-foreground">Pintasan</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {pintasan.map((p) => {
            const Icon = p.icon
            return (
              <Link key={p.label} href={p.href} className="group flex items-start gap-3 rounded-2xl border border-border bg-card p-5 transition hover:shadow-sm">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <Icon className="size-5 text-primary" strokeWidth={1.5} />
                </span>
                <span className="flex-1">
                  <span className="flex items-center gap-1 font-medium text-foreground">
                    {p.label}
                    <ArrowRight className="size-4 opacity-0 transition group-hover:opacity-100" strokeWidth={2} />
                  </span>
                  <span className="mt-0.5 block text-sm text-muted-foreground">{p.desc}</span>
                </span>
              </Link>
            )
          })}
        </div>
      </section>
    </div>
  )
}