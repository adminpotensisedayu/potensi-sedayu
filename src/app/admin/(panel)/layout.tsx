import type { ReactNode } from "react"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { AdminSidebar } from "@/components/admin/admin-sidebar"

export default async function AdminPanelLayout({
  children,
}: {
  children: ReactNode
}) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/admin/login")
  }

  return (
    <div className="flex min-h-screen flex-col bg-background md:flex-row">
      <AdminSidebar email={user.email ?? "admin"} />
      <main className="flex-1 px-6 py-8 md:px-10">{children}</main>
    </div>
  )
}