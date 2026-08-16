"use client"

import { useState } from "react"
import { Menu } from "lucide-react"
import Image from "next/image"
import { AdminSidebar } from "@/components/admin/admin-sidebar"

export function AdminShell({
  email,
  children,
}: {
  email: string
  children: React.ReactNode
}) {
  const [open, setOpen] = useState(false)

  return (
    <div className="flex min-h-screen bg-background">

      {/* ── Overlay backdrop (mobile) ── */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* ── Sidebar ── */}
      <AdminSidebar
        email={email}
        isOpen={open}
        onClose={() => setOpen(false)}
      />

      {/* ── Konten utama ── */}
      <div className="flex min-w-0 flex-1 flex-col">

        {/* Mobile top bar */}
        <header className="flex h-14 shrink-0 items-center gap-3 border-b border-border bg-card px-4 lg:hidden">
          <button
            onClick={() => setOpen(true)}
            aria-label="Buka menu"
            className="flex size-9 items-center justify-center rounded-lg text-muted-foreground transition hover:bg-muted"
          >
            <Menu className="size-5" />
          </button>
          <div className="flex items-center gap-2">
            <Image
              src="/logo.png"
              alt="Logo"
              width={24}
              height={24}
              className="rounded-md"
            />
            <span className="font-serif text-sm font-bold text-foreground">
              Potensi Sedayu
            </span>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 px-4 py-6 sm:px-6 sm:py-8 lg:px-10">
          {children}
        </main>
      </div>
    </div>
  )
}
