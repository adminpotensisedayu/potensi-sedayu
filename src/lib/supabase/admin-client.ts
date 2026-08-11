import { createClient } from "@supabase/supabase-js"

/**
 * Supabase client dengan SERVICE ROLE KEY — bypass semua RLS.
 * ⚠️ HANYA digunakan di Server Actions / API routes (server-side only).
 * JANGAN import di komponen client-side!
 */
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || !key) {
    throw new Error(
      "NEXT_PUBLIC_SUPABASE_URL dan SUPABASE_SERVICE_ROLE_KEY wajib diisi di .env.local"
    )
  }

  return createClient(url, key, {
    auth: {
      autoRefreshToken: false,
      persistSession:   false,
    },
  })
}