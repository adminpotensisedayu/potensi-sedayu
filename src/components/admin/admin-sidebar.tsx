"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import {
  LayoutDashboard,
  Store,
  School,
  ClipboardList,
  Users,
  Settings,
  LogOut,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"

export interface AdminSidebarProps {
  email: string
}

const NAV_ITEMS = [
  { href: "/admin",            label: "Dashboard",      icon: LayoutDashboard, exact: true  },
  { href: "/admin/umkm",       label: "UMKM",           icon: Store,           exact: false },
  { href: "/admin/sekolah",    label: "Sekolah",        icon: School,          exact: false },
  { href: "/admin/pengajuan",  label: "Pengajuan UMKM", icon: ClipboardList,   exact: false },
  { href: "/admin/kkn",        label: "Tim KKN",        icon: Users,           exact: false },
  { href: "/admin/pengaturan", label: "Pengaturan",     icon: Settings,        exact: false },
]

export function AdminSidebar({ email }: AdminSidebarProps) {
  const pathname = usePathname()
  const router   = useRouter()
  const supabase = createClient()

  const [pendingCount, setPendingCount] = useState(0)

  useEffect(() => {
    supabase
      .from("pengajuan_umkm")
      .select("id", { count: "exact", head: true })
      .eq("status", "menunggu")
      .then(({ count }) => setPendingCount(count ?? 0))
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push("/admin/login")
    router.refresh()
  }

  return (
    <aside className="flex h-full w-60 flex-col border-r border-border bg-card">
      <div className="flex h-16 shrink-0 items-center gap-2.5 border-b border-border px-5">
        <Image src="/logo.png" alt="Logo Desa" width={28} height={28} className="rounded-md" />
        <span className="font-serif text-[15px] font-bold leading-tight text-foreground">
          Potensi Sedayu
        </span>
      </div>

      <nav className="flex-1 space-y-0.5 overflow-y-auto px-2.5 py-3">
        {NAV_ITEMS.map(({ href, label, icon: Icon, exact }) => {
          const active      = exact ? pathname === href : pathname.startsWith(href)
          const isPengajuan = href === "/admin/pengajuan"

          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                active
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <Icon className="size-4 shrink-0" />
              <span className="flex-1">{label}</span>
              {isPengajuan && pendingCount > 0 && (
                <Badge variant="destructive" className="h-5 min-w-[1.25rem] px-1.5 text-[10px]">
                  {pendingCount}
                </Badge>
              )}
            </Link>
          )
        })}
      </nav>

      <div className="shrink-0 border-t border-border p-3">
        <div className="mb-1.5 rounded-lg bg-muted/50 px-3 py-2">
          <p className="truncate text-[11px] text-muted-foreground">Login sebagai</p>
          <p className="truncate text-xs font-medium text-foreground">{email}</p>
        </div>
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-red-500 transition-colors hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/30"
        >
          <LogOut className="size-4" />
          Keluar
        </button>
      </div>
    </aside>
  )
}
