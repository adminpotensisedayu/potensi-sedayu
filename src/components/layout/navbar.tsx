"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"

const navLinks = [
  { href: "/",        label: "Beranda" },
  { href: "/umkm",    label: "UMKM"    },
  { href: "/sekolah", label: "Sekolah" }, // ← baru
  { href: "/peta",    label: "Peta"    },
  { href: "/profil",  label: "Profil"  },
]

const spring = { type: "spring" as const, stiffness: 300, damping: 30 }

export function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener("scroll", onScroll)
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  useEffect(() => { setOpen(false) }, [pathname])

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href)

  return (
    <header
      className={
        "sticky top-0 z-50 border-b backdrop-blur transition " +
        (scrolled ? "border-border bg-background/85" : "border-transparent bg-background/60")
      }
    >
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/logo.png" alt="Logo Potensi Desa Sedayu" width={36} height={36} className="size-9 object-contain" priority />
          <span className="font-serif text-lg font-semibold text-foreground">Potensi Sedayu</span>
        </Link>

        {/* Desktop */}
        <div className="hidden items-center gap-1 md:flex">
          {navLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={
                "rounded-lg px-3 py-2 text-sm transition hover:bg-muted " +
                (isActive(l.href) ? "font-medium text-foreground" : "text-muted-foreground")
              }
            >
              {l.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <Button asChild size="sm" className="hidden sm:inline-flex">
            <Link href="/daftar">Daftarkan Usaha</Link>
          </Button>
          <ThemeToggle />
          <button
            className="inline-flex size-9 items-center justify-center rounded-lg text-foreground md:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label="Menu"
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={open ? "x" : "menu"}
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="block"
              >
                {open ? <X className="size-5" /> : <Menu className="size-5" />}
              </motion.span>
            </AnimatePresence>
          </button>
        </div>
      </nav>

      {/* Mobile menu — spring animation */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="mobile"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={spring}
            className="overflow-hidden border-t border-border bg-background md:hidden"
          >
            <div className="mx-auto flex max-w-6xl flex-col gap-1 px-6 py-3">
              {navLinks.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className="rounded-lg px-3 py-2 text-sm text-foreground hover:bg-muted"
                >
                  {l.label}
                </Link>
              ))}
              <Button asChild size="sm" className="mt-2 w-full">
                <Link href="/daftar">Daftarkan Usaha</Link>
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}